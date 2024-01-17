---
title: Membuat Service OpenVPN Client yang Membutuhkan Obfuscate Proxy
tags:
  - obfuscate-proxy
  - openvpn
---

## Pertanyaan

Bagaimanakah membuat service/daemon OpenVPN dengan mode `client` yang membutuhkan Obfuscate Proxy?

Blog terkait:

 > [Menyembunyikan trafik dengan Obfuscate Proxy - Part 2 Protokol OpenVPN][link]

[link]: /blog/2021/06/26/menyembunyikan-trafik-dengan-obfuscate-proxy-part-2-protokol-openvpn/

## Requirement

Pada tulisan [sebelumnya][link] telah dibuat sebuah service dan sebuah command yakni:

Service:

```
systemctl status obfs4proxy-openvpn-client.service
```

Command:

```
obfs4proxy-openvpn-autoadjust-config.sh
```

Kita buat variasi dari command diatas yakni:

```
obfs4proxy-openvpn-autoadjust-config-waiting.sh
```

Command ini disesuaikan dengan kebutuhan system daemon nantinya.

```
cd /usr/local/bin/
touch     obfs4proxy-openvpn-autoadjust-config-waiting.sh
chmod a+x obfs4proxy-openvpn-autoadjust-config-waiting.sh
vi        obfs4proxy-openvpn-autoadjust-config-waiting.sh
```

Isi file:

```
#!/bin/bash
fileconfig="$1"
if [ -z "$fileconfig" ];then
    echo "Argument not complete." >&2
    exit 1
elif [ ! -f "$fileconfig" ];then
    echo "File config not found." >&2
    exit 2
fi
socks_proxy=$(grep -E '^socks-proxy\s+127\.0\.0\.1' "$fileconfig")
if [ -z "$socks_proxy" ];then
    echo "Directive 'socks_proxy 127.0.0.1' not found." >&2
    exit 3
fi
port=$(sudo obfs4proxy-openvpn-getport.sh | head -1)
timeout=10
until [[ ! -z "$port" ]]; do
    echo "Waiting for Local Socks Proxy: ($timeout)." >&2
    sleep 1;
    ((timeout -= 1))
    if [[ $timeout == 0 ]];then
        echo "Waiting for Local Socks Proxy: Timeout." >&2
        break
    else
        port=$(sudo obfs4proxy-openvpn-getport.sh | head -1)
    fi
done
if [ -z $port ];then
    echo "Local Socks Proxy not found." >&2
    exit 4
fi
socks_proxy_port=$(echo "$socks_proxy" | sed 's/socks-proxy\s\(.*\)\s\(.*\)\s\(.*\)/\2/g')
if [[ ! "$port" == "$socks_proxy_port" ]];then
    sed -i -E 's|^socks-proxy(\s+)127\.0\.0\.1(\s+)(.*)(\s+)(.*)|socks-proxy\1127.0.0.1\2'"$port"'\4\5|' "$fileconfig"
    echo "Config updated." >&2
fi
```

Perbedaan antara:

 - `obfs4proxy-openvpn-autoadjust-config.sh`
 - `obfs4proxy-openvpn-autoadjust-config-waiting.sh`

```
cd /usr/local/bin/
diff -y obfs4proxy-openvpn-autoadjust-config.sh \
        obfs4proxy-openvpn-autoadjust-config-waiting.sh | grep '[|<>]'$'\t'
```

Output:

```
if [ -z $port ];then                                          | timeout=10
    screen -d -m sudo obfs4proxy-openvpn-client.sh            | until [[ ! -z "$port" ]]; do
    sleep 1                                                   |     echo "Waiting for Local Socks Proxy: ($timeout)." >&2
    port=$(sudo obfs4proxy-openvpn-getport.sh | head -1)      |     sleep 1;
fi                                                            |     ((timeout -= 1))
                                                              >     if [[ $timeout == 0 ]];then
                                                              >         echo "Waiting for Local Socks Proxy: Timeout." >&2
                                                              >         break
                                                              >     else
                                                              >         port=$(sudo obfs4proxy-openvpn-getport.sh | head -1)
                                                              >     fi
                                                              > done
```

## Service menggunakan systemctl

Misalnya konfigurasi openVPN client dengan path `/usr/local/share/openvpn/mypc-proxy.ovpn`.

Isi file `mypc-proxy.ovpn`:

```
client
dev tun
proto tcp
remote 200.200.20.20 4433
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
auth SHA512
cipher AES-256-CBC
verb 3
<ca>
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
-----END PRIVATE KEY-----
</key>
<tls-crypt>
-----BEGIN OpenVPN Static key V1-----
-----END OpenVPN Static key V1-----
</tls-crypt>
socks-proxy-retry
socks-proxy 127.0.0.1 34567 /usr/local/share/openvpn/mypc-proxy-authfile.txt
```

Kita buat file service:

```
cd /etc/systemd/system
touch openvpn-connect-proxy.service
vi    openvpn-connect-proxy.service
```

Isi file `openvpn-connect-proxy.service`:

```
[Unit]
After=network-online.target
Wants=network-online.target
Requires=obfs4proxy-openvpn-client.service

[Service]
Type=notify
ExecStartPre=/usr/local/bin/obfs4proxy-openvpn-autoadjust-config-waiting.sh /usr/local/share/openvpn/mypc-proxy.ovpn
ExecStart=/usr/sbin/openvpn --config /usr/local/share/openvpn/mypc-proxy.ovpn

[Install]
WantedBy=default.target
```

Keterangan:

 - `Requires` digunakan karena service kita bergantung kepada `obfs4proxy-openvpn-client.service`
 - `ExecStartPre` digunakan untuk mengeksekusi `obfs4proxy-openvpn-autoadjust-config-waiting.sh`.
 - `ExecStart` digunakan untuk mengeksekusi `openvpn`.

Command `obfs4proxy-openvpn-autoadjust-config-waiting.sh` berfungsi untuk
menunggu selama 10 detik, memastikan bahwa service `obfs4proxy-openvpn-client.service`
berhasil menghidupkan local port socks proxy. Setelah memastikan port exists, barulah service
openvpn client dijalankan.

Enable dan jalankan systemctl tersebut:

```
systemctl enable --now openvpn-connect-proxy.service
```

## Penutup

Cek pada syslog:

```
tail -f /var/log/syslog
systemctl start openvpn-connect-proxy.service
systemctl stop obfs4proxy-openvpn-client.service
```

Terdapat log bahwa

 - Service `obfs4proxy-openvpn-client.service` berhasil dijalankan diawal sebelum service `openvpn-connect-proxy.service`.
 - Command `obfs4proxy-openvpn-autoadjust-config-waiting.sh` berhasil dijalankan dengan output: `Config updated.`
 - Mematikan service `obfs4proxy-openvpn-client.service` mengakibatkan service `openvpn-connect-proxy.service` juga mati.
