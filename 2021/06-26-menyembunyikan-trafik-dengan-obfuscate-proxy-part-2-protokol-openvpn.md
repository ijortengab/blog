# Menyembunyikan trafik dengan Obfuscate Proxy - Part 2 Protokol OpenVPN

---
tags:
  - obfuscate-proxy
  - openvpn
---

## Pendahuluan

Secara umum, Obfuscate Proxy bisa menyamarkan seluruh trafik.

Tulisan kali ini akan membahas cara menyamarkan (`obfuscate`) trafik dari protokol OpenVPN.

## Server & Client Configuration

Konfigurasi dibawah ini diperlukan di server dan di client.

Server dan Client pada contoh tulisan ini menggunakan Ubuntu 20.04.

Jika client adalah Windows, maka gunakan **WSL 2** dan pasang Ubuntu 20.04 didalamnya.

Blog terkait:

 > [Berkenalan dengan Windows Subsytem of Linux (WSL)](/blog/2021/03-06-berkenalan-dengan-windows-subsytem-of-linux-wsl.md)

Install `obfs4proxy`.

```
apt-get install obfs4proxy
```

Buat user.

```
adduser \
  --system \
  --home "/var/lib/obfs4proxy-openvpn/" \
  --shell "/usr/sbin/nologin" \
  --group \
  --gecos "obfs4proxy for openvpn" \
  obfs4-openvpn
```

## Server Command

Variable yang kita gunakan sebagai contoh adalah sesuai dengan **Skenario Basic**.

 - OpenVPN daemon port: `443`
 - `obfs4proxy` daemon port: `4433`
 - IP Public: `200.200.20.20`

Blog terkait:

 > [Konfigurasi OpenVPN Server - Part 1 Skenario Basic](/blog/2021/06-20-konfigurasi-openvpn-server-part-1-skenario-basic.md)

Jalankan program `obfs4proxy` di sisi server.

```
sudo -u obfs4-openvpn \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-openvpn/" \
    TOR_PT_SERVER_TRANSPORTS="obfs4" \
    TOR_PT_SERVER_BINDADDR="obfs4-0.0.0.0:4433" \
    TOR_PT_ORPORT="200.200.20.20:443" \
obfs4proxy -enableLogging -logLevel DEBUG
```

Output (contoh):

```
VERSION 1
SMETHOD obfs4 [::]:4433 ARGS:cert=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh,iat-mode=0
SMETHODS DONE
```

Keterangan:

 - Program berjalan secara foreground. Tekan `CTRL+c` sebanyak dua kali untuk menutup program. Eksekusi program membuat terminal tidak bisa digunakan lagi.
 - Bind Address, yakni `0.0.0.0:4433`. Berarti `obfs4proxy` mendengar port `4433` dari semua interface `0.0.0.0`.
 - Forwarded Address, yakni `200.200.20.20:443`. Berarti trafik akan diteruskan ke port OpenVPN daemon, yakni `443` interface `200.200.20.20`.

OpenVPN daemon hanya mendengar port 443 dari interface `200.200.20.20`. Oleh karena itu, value yang benar untuk Forwarded Address adalah `200.200.20.20:443`. Sementara value localhost yakni `127.0.0.1:443` akan menghasilkan error.

Catat dua variable penting dari output (contoh):

 - cert: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh`
 - iat-mode: `0`

Informasi diatas juga terdapat pada file `/var/lib/obfs4proxy-openvpn/obfs4_bridgeline.txt`.

## Server Daemon

Agar program berjalan secara background, kita bisa menggunakan `screen` atau `systemctl`.

Buat file eksekusi bernama `obfs4proxy-openvpn-server.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-openvpn-server.sh
chmod a+x obfs4proxy-openvpn-server.sh
vi        obfs4proxy-openvpn-server.sh
```

Isi file:

```
#!/bin/bash
sudo -u obfs4-openvpn \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-openvpn/" \
    TOR_PT_SERVER_TRANSPORTS="obfs4" \
    TOR_PT_SERVER_BINDADDR="obfs4-0.0.0.0:4433" \
    TOR_PT_ORPORT="200.200.20.20:443" \
obfs4proxy -enableLogging -logLevel DEBUG
```

**visudo**

```
visudo
```

Tambahkan baris berikut:

```
ALL ALL = NOPASSWD: /usr/local/bin/obfs4proxy-openvpn-server.sh
```

Sehingga command menjadi:

```
sudo obfs4proxy-openvpn-server.sh
```

Eksekusi command diatas oleh user reguler tidak membutuhkan akses root.

**screen**

Gunakan option `-d -m` untuk auto detach screen.

Kemudian eksekusi screen untuk menciptakan daemon.

```
screen -d -m sudo obfs4proxy-openvpn-server.sh
```

**systemctl**

Buat file service:

```
cd /etc/systemd/system/
touch     obfs4proxy-openvpn-server.service
chmod 644 obfs4proxy-openvpn-server.service
vi        obfs4proxy-openvpn-server.service
```

Isi file:

```
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/obfs4proxy-openvpn-server.sh

[Install]
WantedBy=default.target
```

Enable:

```
sudo systemctl daemon-reload
sudo systemctl enable --now obfs4proxy-openvpn-server.service
```

Verifikasi:

```
systemctl status obfs4proxy-openvpn-server.service
```

## Client Command

Jalankan program `obfs4proxy` di sisi client.

```
sudo -u obfs4-openvpn \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-openvpn/" \
    TOR_PT_CLIENT_TRANSPORTS="obfs4" \
obfs4proxy -enableLogging -logLevel DEBUG
```

Output (contoh):

```
VERSION 1
CMETHOD obfs4 socks5 127.0.0.1:34567
CMETHODS DONE
```

Keterangan:

 - Program berjalan secara foreground. Tekan `CTRL+c` sebanyak dua kali untuk menutup program. Eksekusi program membuat terminal tidak bisa digunakan lagi.
 - Local port yang tercipta nilainya berubah-ubah setiap kali command dieksekusi.

Catat variable penting:

 - port: 34567

## Client Daemon

Agar program berjalan secara background, kita bisa menggunakan `screen` atau `systemctl`.

Buat file eksekusi bernama `obfs4proxy-openvpn-client.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-openvpn-client.sh
chmod a+x obfs4proxy-openvpn-client.sh
vi        obfs4proxy-openvpn-client.sh
```

Isi file:

```
#!/bin/bash
sudo -u obfs4-openvpn \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-openvpn/" \
    TOR_PT_CLIENT_TRANSPORTS="obfs4" \
obfs4proxy -enableLogging -logLevel DEBUG
```

**visudo**

```
visudo
```

Tambahkan baris berikut:

```
ALL ALL = NOPASSWD: /usr/local/bin/obfs4proxy-openvpn-client.sh
```

Sehingga command menjadi:

```
sudo obfs4proxy-openvpn-client.sh
```

Eksekusi command diatas oleh user reguler tidak membutuhkan akses root.

**screen**

Gunakan option `-d -m` untuk auto detach screen.

Kemudian eksekusi screen untuk menciptakan daemon.

```
screen -d -m sudo obfs4proxy-openvpn-client.sh
```

**systemctl**

Buat file service:

```
cd /etc/systemd/system/
touch     obfs4proxy-openvpn-client.service
chmod 644 obfs4proxy-openvpn-client.service
vi        obfs4proxy-openvpn-client.service
```

Isi file:

```
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/obfs4proxy-openvpn-client.sh

[Install]
WantedBy=default.target
```

Enable:

```
sudo systemctl daemon-reload
sudo systemctl enable --now obfs4proxy-openvpn-client.service
```

Verifikasi:

```
systemctl status obfs4proxy-openvpn-client.service
```

## Tips Screen

Command untuk reattach screen:

```
screen -r
```

Untuk kembali deattach screen:

 - Tekan `CTRL+a`
 - Langsung tekan `d`.

Blog terkait:

 > [Screen sebagai solusi remote connection](/blog/2017/01-24-screen-solusi-remote-connection.md)

## OpenVPN Command

Eksekusi `openvpn` umumnya disertai dengan file config berekstension `.ovpn`.

Kita perlu mengubah beberapa directive dan menambah directive.

Contoh client config trafik normal, file client config bernama `mylaptop.ovpn` dengan isi file sebagai berikut:

```
client
dev tun
proto tcp
remote 200.200.20.20 443
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
```

Contoh trafik menggunakan obfuscate proxy, file client config bernama `mylaptop-proxy.ovpn` dengan isi file sebagai berikut:

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
socks-proxy 127.0.0.1 34567 mylaptop-proxy-authfile.txt
```

Perbedaan file `mylaptop.ovpn` (kiri) dan `mylaptop-proxy.ovpn` (kanan):

(Tanda bintang `*` artinya baris yang berbeda)

```
client                                |   | client
dev tun                               |   | dev tun
proto tcp                             |   | proto tcp
remote 200.200.20.20 443              | * | remote 200.200.20.20 4433
resolv-retry infinite                 |   | resolv-retry infinite
nobind                                |   | nobind
persist-key                           |   | persist-key
persist-tun                           |   | persist-tun
remote-cert-tls server                |   | remote-cert-tls server
auth SHA512                           |   | auth SHA512
cipher AES-256-CBC                    |   | cipher AES-256-CBC
verb 3                                |   | verb 3
<ca>                                  |   | <ca>
-----BEGIN CERTIFICATE-----           |   | -----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----             |   | -----END CERTIFICATE-----
</ca>                                 |   | </ca>
<cert>                                |   | <cert>
-----BEGIN CERTIFICATE-----           |   | -----BEGIN CERTIFICATE-----
-----END CERTIFICATE-----             |   | -----END CERTIFICATE-----
</cert>                               |   | </cert>
<key>                                 |   | <key>
-----BEGIN PRIVATE KEY-----           |   | -----BEGIN PRIVATE KEY-----
-----END PRIVATE KEY-----             |   | -----END PRIVATE KEY-----
</key>                                |   | </key>
<tls-crypt>                           |   | <tls-crypt>
-----BEGIN OpenVPN Static key V1----- |   | -----BEGIN OpenVPN Static key V1-----
-----END OpenVPN Static key V1-----   |   | -----END OpenVPN Static key V1-----
</tls-crypt>                          |   | </tls-crypt>
                                      | * | socks-proxy-retry
                                      | * | socks-proxy 127.0.0.1 34567 mylaptop-proxy-authfile.txt
```

Kita buat file `mylaptop-proxy-authfile.txt` yang berisi informasi `cert` dan `iat-mode`.

Isi file:

```
cert=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh;iat-mode=
0
```

Catatan:

 - Pemisah antara `cert` dan `iat-mode` adalah titik koma `;` dan bukan koma `,`.
 - Value `iat-mode` didahului karakter line break `LF`/`CRLF`.
 - Port OpenVPN diganti menjadi port obfuscate proxy di sisi server yakni `4433`.

## Tips Client Variable

Command untuk mendapatkan variable port di client adalah:

```
output=$(netstat -tapn | grep obfs4proxy) && \
cat /var/lib/obfs4proxy-openvpn/obfs4proxy.log | \
grep -o registered\ listener\:\ 127\.0\.0\.1\:.*$ | \
sed 's/.*\:\([[:digit:]]*\)$/\1/g' | \
while IFS= read -r line; do \
    [[ $(echo "$output" | grep -o "$line") ]] && \
    echo "$line"; \
done
```

Catatan:

 - Standard Output (stdout) kemungkinan multi line jika program berjalan lebih dari satu kali.

Buat file eksekusi bernama `obfs4proxy-openvpn-getport.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-openvpn-getport.sh
chmod a+x obfs4proxy-openvpn-getport.sh
vi        obfs4proxy-openvpn-getport.sh
```

Isi file:

```
#!/bin/bash
output=$(netstat -tapn | grep obfs4proxy) && \
cat /var/lib/obfs4proxy-openvpn/obfs4proxy.log | \
grep -o registered\ listener\:\ 127\.0\.0\.1\:.*$ | \
sed 's/.*\:\([[:digit:]]*\)$/\1/g' | \
while IFS= read -r line; do \
    [[ $(echo "$output" | grep -o "$line") ]] && \
    echo "$line"; \
done
```

**visudo**

```
visudo
```

Tambahkan baris berikut:

```
ALL ALL = NOPASSWD: /usr/local/bin/obfs4proxy-openvpn-getport.sh
```

Sehingga command menjadi:

```
sudo obfs4proxy-openvpn-getport.sh
```

Eksekusi command diatas oleh user reguler tidak membutuhkan akses root.

## Tips Server Variables

Kita akan menjadikan client bisa mendapatkan informasi `cert` dan `iat-mode` menggunakan http request dengan web server `nginx`.

Variable yang kita gunakan sebagai contoh adalah:

 - username: `ijortengab`
 - password: `luarbiasa`
 - hostname: `ijortengab.id`
 - port: `4434`
 - HTTPS self signed certificate

Set HTTP Authenticate:

```
htpasswd -m /etc/nginx/snippets/htpasswd ijortengab
```

Tambah virtual host yang mendengar port `4434`.

```
cd /etc/nginx/sites-available
touch obfs4proxy-openvpn
cd /etc/nginx/sites-enabled
ln -s ../sites-available/obfs4proxy-openvpn obfs4proxy-openvpn
vi obfs4proxy-openvpn
```

Isi dari file `obfs4proxy-openvpn`:

```
server {
	listen 4434 ssl;
	listen [::]:4434 ssl;
	root /var/lib/obfs4proxy-openvpn;
	server_name _;
	index obfs4_bridgeline.txt;
	location / {
		try_files $uri $uri/ =404;
	}
    include snippets/snakeoil.conf;
    auth_basic "";
    auth_basic_user_file snippets/htpasswd;
}
```

Jika `nginx` berjalan dengan user `www-data`, maka tambahkan akses:

```
gpasswd -a www-data obfs4-openvpn
chmod g+r /var/lib/obfs4proxy-openvpn/obfs4_bridgeline.txt
```

Reload nginx.

```
nginx -s reload
```

Verifikasi dengan `curl` di sisi server:

```
curl -m 3 -k https://localhost:4434/ --user ijortengab:luarbiasa
```

Verifikasi dengan hostname di sisi client:

```
curl -m 3 -k https://ijortengab.id:4434/ --user ijortengab:luarbiasa
```

**Download dan Save sebagai Cache**

Dari link tersebut, maka download file `/var/lib/obfs4proxy-openvpn/obfs4_bridgeline.txt` dari server yang berisi informasi `cert` dan `iat-mode` kemudian simpan di client sebagai `cache`.

```
if [ ! -d ~/.cache ];then mkdir -p ~/.cache; chmod 0700 ~/.cache; fi
cache=~/.cache/obfs4proxy-openvpn-ijortengab.id.4434.txt
curl -m 3 -sS -o "$cache" -k https://ijortengab.id:4434/ --user ijortengab:luarbiasa
```

## Tips OpenVPN Authfile Builder

Buat file eksekusi bernama `obfs4proxy-openvpn-authfile-builder.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-openvpn-authfile-builder.sh
chmod a+x obfs4proxy-openvpn-authfile-builder.sh
vi        obfs4proxy-openvpn-authfile-builder.sh
```

Isi file:

```
#!/bin/bash
filecache="$1"
fileauth="$2"
if [[ -z "$filecache" || -z "$fileauth" ]];then
    echo "Argument not complete." >&2
    exit 1
elif [ ! -f "$filecache" ];then
    echo "File cache not found." >&2
    exit 2
fi
output=$( < "$filecache")
cert=$(echo "$output" | grep -o 'cert=.*\s' | sed 's/cert=\(.*\)\s/\1/g')
iat_mode=$(echo "$output" | grep -o 'iat-mode=.*' | sed 's/iat-mode=\(.\)/\1/g')
if [ -z $cert ];then
    echo "Information of cert not found." >&2
    exit 3
fi
if [ -z $iat_mode ];then
    echo "Information of iat-mode not found." >&2
    exit 4
fi
full_path=$(realpath --no-symlinks "$fileauth")
dirname=$(dirname "$full_path")
basename=$(basename -- "$full_path")
extension="${basename##*.}"
if [[ "$extension" == "$basename" ]];then
    extension=
fi
filename="${basename%.*}"
if [ -f "$fileauth" ];then
    i=1
    newdirname="$dirname"
    newfullpath="${newdirname}/${filename} (${i})"
    [ -z "$extension" ] || newfullpath="$newfullpath"."$extension"
    if [[ -e "$newfullpath" || -L "$newfullpath" ]] ; then
        let i++
        newfullpath="${newdirname}/${filename} (${i})"
        [ -z "$extension" ] || newfullpath="$newfullpath"."$extension"
        while [[ -e "$newfullpath" || -L "$newfullpath" ]] ; do
            let i++
            newfullpath="${newdirname}/${filename} (${i})"
            [ -z "$extension" ] || newfullpath="$newfullpath"."$extension"
        done
    fi
    mv "$full_path" "$newfullpath" && echo File existing was backup as "$newfullpath" >&2
fi
echo "cert=${cert};iat-mode=" > "$full_path"
echo "${iat_mode}" >> "$full_path"
echo File created: "$full_path"
```

Cara penggunaan:

 - Argument pertama adalah file cache di client hasil download file `/var/lib/obfs4proxy-openvpn/obfs4_bridgeline.txt` di server.
 - Argument kedua adalah nama file authfile sebagai file output.

Contoh:

```
obfs4proxy-openvpn-authfile-builder.sh \
    ~/.cache/obfs4proxy-openvpn-ijortengab.id.4434.txt \
    ~/.config/mylaptop-proxy-authfile.txt
```

Output:

```
File existing was backup as /home/ijortengab/.config/mylaptop-proxy-authfile (1).txt
File created: /home/ijortengab/.config/mylaptop-proxy-authfile.txt
```

## Tips OpenVPN Auto Adjust Config

Eksekusi program `obfs4proxy` di sisi client menciptakan local port yang nilainya berubah-ubah sehingga informasi port pada file client config `.ovpn` perlu menyesuaikan dengan nilai port terkini.

Kita bisa menjadikannya otomatis terupdate dengan memanfaatkan dua command berikut:

 - `screen -d -m sudo obfs4proxy-openvpn-client.sh`
 - `sudo obfs4proxy-openvpn-getport.sh`

Buat file eksekusi bernama `obfs4proxy-openvpn-autoadjust-config.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-openvpn-autoadjust-config.sh
chmod a+x obfs4proxy-openvpn-autoadjust-config.sh
vi        obfs4proxy-openvpn-autoadjust-config.sh
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
if [ -z $port ];then
    screen -d -m sudo obfs4proxy-openvpn-client.sh
    sleep 1
    port=$(sudo obfs4proxy-openvpn-getport.sh | head -1)
fi
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

Cara penggunaan:

 - Argument pertama adalah file config yang terdapat informasi socks-proxy.
 - Hanya socks proxy mengarah ke localhost `127.0.0.1` yang dapat digunakan.

Contoh:

```
obfs4proxy-openvpn-autoadjust-config.sh ~/.config/mylaptop-proxy.ovpn
```

Output:

```
Config updated.
```

## Kesimpulan

Beberapa command yang direkomendasikan.

Command di server:

 - `screen -d -m sudo obfs4proxy-openvpn-server.sh`
 - `systemctl status obfs4proxy-openvpn-server.service`

Command umum di client:

 - `screen -d -m sudo obfs4proxy-openvpn-client.sh`
 - `systemctl status obfs4proxy-openvpn-client.service`
 - `sudo obfs4proxy-openvpn-getport.sh`

Command khusus di client (contoh):

 - `curl -m 3 -k https://ijortengab.id:4434/ --user ijortengab:luarbiasa`
 - `obfs4proxy-openvpn-authfile-builder.sh $cache $authfile`
 - `obfs4proxy-openvpn-autoadjust-config.sh $config && openvpn --config $config`

Akses openvpn kini bisa dengan cara normal maupun dengan cara menyamar `obfuscate`.

Akses normal:

```
openvpn --config $config
```

Akses dengan penyamaran

```
obfs4proxy-openvpn-autoadjust-config.sh $config && \
openvpn --config $config
```

## Reference

https://hamy.io/post/000d/how-to-hide-obfuscate-any-traffic-using-obfs4/

https://hamy.io/post/000f/obfs4proxy-openvpn-obfuscating-openvpn-traffic-using-obfs4proxy/

https://github.com/HRomie/obfs4proxy-openvpn-linux
