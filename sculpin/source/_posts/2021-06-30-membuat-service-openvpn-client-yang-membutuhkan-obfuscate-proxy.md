---
title: Membuat Service OpenVPN Client yang Membutuhkan Obfuscate Proxy
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
After=network.service
Requires=obfs4proxy-openvpn-client.service

[Service]
Type=notify
ExecStartPre=/usr/local/bin/obfs4proxy-openvpn-autoadjust-config.sh /usr/local/share/openvpn/mypc-proxy.ovpn
ExecStart=/usr/sbin/openvpn --config /usr/local/share/openvpn/mypc-proxy.ovpn

[Install]
WantedBy=default.target
```

Keterangan:

 - `Requires` digunakan karena service kita bergantung kepada `obfs4proxy-openvpn-client.service`
 - `ExecStartPre` digunakan untuk menyesuaikan informasi local port Obfuscate Proxy di dalam file konfigurasi OpenVPN.

Enable dan jalankan systemctl tersebut:

```
systemctl enable --now openvpn-connect-proxy.service
```

## Verifikasi

Cek pada syslog:

```
tail -f /var/log/syslog -n 1
```

Terdapat log bahwa

 - service `obfs4proxy-openvpn-client.service` berhasil dijalankan diawal sebagai requirement.
 - command `obfs4proxy-openvpn-autoadjust-config.sh` berhasil dijalankan dengan output: `Config updated.`

```
Jun 30 06:53:09 myserver systemd[1]: Started obfs4proxy-openvpn-client.service.
Jun 30 06:53:09 myserver systemd[1]: Starting openvpn-connect-proxy.service...
Jun 30 06:53:09 myserver obfs4proxy-openvpn-client.sh[108431]: VERSION 1
Jun 30 06:53:09 myserver obfs4proxy-openvpn-client.sh[108431]: CMETHOD obfs4 socks5 127.0.0.1:45597
Jun 30 06:53:09 myserver obfs4proxy-openvpn-client.sh[108431]: CMETHODS DONE
Jun 30 06:53:09 myserver obfs4proxy-openvpn-autoadjust-config.sh[108429]: Config updated.
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 OpenVPN 2.4.7 x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO] [LZ4] [EPOLL] [PKCS11] [MH/PKTINFO] [AEAD] built on Apr 27 2021
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 library versions: OpenSSL 1.1.1f  31 Mar 2020, LZO 2.10
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Outgoing Control Channel Encryption: Cipher 'AES-256-CTR' initialized with 256 bit key
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Outgoing Control Channel Encryption: Using 256 bit message hash 'SHA256' for HMAC authentication
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Incoming Control Channel Encryption: Cipher 'AES-256-CTR' initialized with 256 bit key
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Incoming Control Channel Encryption: Using 256 bit message hash 'SHA256' for HMAC authentication
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 TCP/UDP: Preserving recently used remote address: [AF_INET]127.0.0.1:45597
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Socket Buffers: R=[131072->131072] S=[16384->16384]
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Attempting to establish TCP connection with [AF_INET]127.0.0.1:45597 [nonblock]
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 TCP connection established with [AF_INET]127.0.0.1:45597
Jun 30 06:53:09 myserver systemd[1]: Started openvpn-connect-proxy.service.
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 TCP_CLIENT link local: (not bound)
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 TCP_CLIENT link remote: [AF_INET]127.0.0.1:45597
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 TLS: Initial packet from [AF_INET]127.0.0.1:45597, sid=7c24927d 298e46a4
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 VERIFY OK: depth=1, CN=ChangeMe
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 VERIFY KU OK
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Validating certificate extended key usage
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 ++ Certificate has EKU (str) TLS Web Server Authentication, expects TLS Web Server Authentication
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 VERIFY EKU OK
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 VERIFY OK: depth=0, CN=server
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 Control Channel: TLSv1.3, cipher TLSv1.3 TLS_AES_256_GCM_SHA384, 2048 bit RSA
Jun 30 06:53:09 myserver openvpn[108517]: Wed Jun 30 06:53:09 2021 [server] Peer Connection Initiated with [AF_INET]127.0.0.1:45597
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 SENT CONTROL [server]: 'PUSH_REQUEST' (status=1)
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 PUSH: Received control message: 'PUSH_REPLY,route-gateway 10.8.0.1,topology subnet,ping 10,ping-restart 120,ifconfig 10.8.0.4 255.255.255.0,peer-id 0,cipher AES-256-GCM'
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 OPTIONS IMPORT: timers and/or timeouts modified
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 OPTIONS IMPORT: --ifconfig/up options modified
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 OPTIONS IMPORT: route-related options modified
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 OPTIONS IMPORT: peer-id set
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 OPTIONS IMPORT: adjusting link_mtu to 1626
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 OPTIONS IMPORT: data channel crypto options modified
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 Data Channel: using negotiated cipher 'AES-256-GCM'
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 Outgoing Data Channel: Cipher 'AES-256-GCM' initialized with 256 bit key
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 Incoming Data Channel: Cipher 'AES-256-GCM' initialized with 256 bit key
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 TUN/TAP device tun0 opened
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 TUN/TAP TX queue length set to 100
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 /sbin/ip link set dev tun0 up mtu 1500
Jun 30 06:53:10 myserver NetworkManager[822]: <info>  [1625010790.7219] manager: (tun0): new Tun device (/org/freedesktop/NetworkManager/Devices/11)
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 /sbin/ip addr add dev tun0 10.8.0.4/24 broadcast 10.8.0.255
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 WARNING: this configuration may cache passwords in memory -- use the auth-nocache option to prevent this
Jun 30 06:53:10 myserver openvpn[108517]: Wed Jun 30 06:53:10 2021 Initialization Sequence Completed
```

## Test Requirement

Mematikan service `obfs4proxy-openvpn-client.service` mengakibatkan service `openvpn-connect-proxy.service` juga mati.

```
systemctl stop obfs4proxy-openvpn-client.service
```

Log pada `syslog`:

```
Jun 30 07:00:45 myserver openvpn[108517]: Wed Jun 30 07:00:45 2021 Connection reset, restarting [0]
Jun 30 07:00:45 myserver openvpn[108517]: Wed Jun 30 07:00:45 2021 SIGUSR1[soft,connection-reset] received, process restarting
Jun 30 07:00:45 myserver openvpn[108517]: Wed Jun 30 07:00:45 2021 Assertion failed at misc.c:639 (es)
Jun 30 07:00:45 myserver openvpn[108517]: Wed Jun 30 07:00:45 2021 Exiting due to fatal error
Jun 30 07:00:45 myserver systemd[1]: Stopping obfs4proxy-openvpn-client.service...
Jun 30 07:00:45 myserver systemd[1]: Stopping openvpn-connect-proxy.service...
Jun 30 07:00:45 myserver systemd[1]: obfs4proxy-openvpn-client.service: Succeeded.
Jun 30 07:00:45 myserver systemd[1]: Stopped obfs4proxy-openvpn-client.service.
Jun 30 07:00:45 myserver NetworkManager[822]: <info>  [1625011245.0987] device (tun0): state change: activated -> unmanaged (reason 'unmanaged', sys-iface-state: 'removed')
Jun 30 07:00:45 myserver systemd[1]: openvpn-connect-proxy.service: Main process exited, code=exited, status=1/FAILURE
Jun 30 07:00:45 myserver systemd[1]: openvpn-connect-proxy.service: Failed with result 'exit-code'.
Jun 30 07:00:45 myserver systemd[1]: Stopped openvpn-connect-proxy.service.
```

