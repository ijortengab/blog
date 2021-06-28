---
title: Konfigurasi OpenVPN Server - Part 2 Skenario Flexible Route Traffic
---

## Skenario Basic

Skenario Basic yang dibahas pada [tulisan sebelumnya](/blog/2021/06/20/konfigurasi-openvpn-server-part-1-skenario-basic/), menggunakan variable sbb:

 - IP Publik: `200.200.20.20`
 - Protokol: `TCP`
 - Port: `443`
 - DNS Resolver: Cloudflare (`1.1.1.1` dan `1.0.0.1`)

Variable yang digunakan oleh script instalasi adalah sebagai berikut:

 - CIDR: `10.8.0.0/24`
 - IP Network: `10.8.0.0`
 - Subnet Mask: `255.255.255.0`
 - IP Server: `10.8.0.1`
 - IP Broadcast `10.8.0.255`
 - IP Client: `10.8.0.2` ~ `10.8.0.254` (Total 253 host)

File konfigurasi yang tercipta yakni:

 - `/etc/openvpn/server/server.conf`
 - `/etc/openvpn/server/client-common.txt`
 - `/etc/systemd/system/openvpn-iptables.service`

Service yang tercipta yakni:

 - `systemctl status openvpn-server@server.service`
 - `systemctl status openvpn-iptables.service`

## Skenario Flexible Route Traffic

Trafik yang tercipta pada **Skenario Basic** adalah semua trafik client akan menuju server VPN.

Kita akan mengubah konfigurasi agar trafik sepenuhnya berada pada control client.

Client memiliki dua opsi, mengarahkan trafik seluruhnya ke server atau tidak.

## Server Config

Kita perlu mengedit dua file konfigurasi, yakni:

 - `/etc/openvpn/server/server.conf`
 - `/etc/openvpn/server/client-common.txt`

Pada file `/etc/openvpn/server/server.conf`, kita hapus atau disable directive `push redirect-gateway` dan `push dhcp-option`.

Sebelumnya:

```
local 200.200.20.20
port 443
proto tcp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
auth SHA512
tls-crypt tc.key
topology subnet
server 10.8.0.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp"
ifconfig-pool-persist ipp.txt
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 1.0.0.1"
keepalive 10 120
cipher AES-256-CBC
user nobody
group nogroup
persist-key
persist-tun
verb 3
crl-verify crl.pem
```

Sesudah edit:

```
local 200.200.20.20
port 443
proto tcp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
auth SHA512
tls-crypt tc.key
topology subnet
server 10.8.0.0 255.255.255.0
#
ifconfig-pool-persist ipp.txt
#
#
keepalive 10 120
cipher AES-256-CBC
user nobody
group nogroup
persist-key
persist-tun
verb 3
crl-verify crl.pem
```

Perbedaan sebelum dan sesudah edit:

(Tanda bintang `*` artinya baris yang berbeda)

```
local 200.200.20.20                      |   | local 200.200.20.20
port 443                                 |   | port 443
proto tcp                                |   | proto tcp
dev tun                                  |   | dev tun
ca ca.crt                                |   | ca ca.crt
cert server.crt                          |   | cert server.crt
key server.key                           |   | key server.key
dh dh.pem                                |   | dh dh.pem
auth SHA512                              |   | auth SHA512
tls-crypt tc.key                         |   | tls-crypt tc.key
topology subnet                          |   | topology subnet
server 10.8.0.0 255.255.255.0            |   | server 10.8.0.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp" | * | #
ifconfig-pool-persist ipp.txt            |   | ifconfig-pool-persist ipp.txt
push "dhcp-option DNS 1.1.1.1"           | * | #
push "dhcp-option DNS 1.0.0.1"           | * | #
keepalive 10 120                         |   | keepalive 10 120
cipher AES-256-CBC                       |   | cipher AES-256-CBC
user nobody                              |   | user nobody
group nogroup                            |   | group nogroup
persist-key                              |   | persist-key
persist-tun                              |   | persist-tun
verb 3                                   |   | verb 3
crl-verify crl.pem                       |   | crl-verify crl.pem
```

Pada file `/etc/openvpn/server/client-common.txt`, kita hapus atau disable directive `block-outside-dns`.

Sebelumnya:

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
ignore-unknown-option block-outside-dns
block-outside-dns
verb 3
```

Sesudah edit:

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
#
#
verb 3
```

Perbedaan sebelum dan sesudah edit:

(Tanda bintang `*` artinya baris yang berbeda)

```
client                                  |   | client
dev tun                                 |   | dev tun
proto tcp                               |   | proto tcp
remote 200.200.20.20 443                |   | remote 200.200.20.20 443
resolv-retry infinite                   |   | resolv-retry infinite
nobind                                  |   | nobind
persist-key                             |   | persist-key
persist-tun                             |   | persist-tun
remote-cert-tls server                  |   | remote-cert-tls server
auth SHA512                             |   | auth SHA512
cipher AES-256-CBC                      |   | cipher AES-256-CBC
ignore-unknown-option block-outside-dns | * | #
block-outside-dns                       | * | #
verb 3                                  |   | verb 3
```

Restart VPN dengan perintah:

```
systemctl restart openvpn-server@server.service
```

Server VPN saat ini sudah tidak lagi mewajibkan client untuk mengarahkan traffic melalui server.

## Client Config

File Config OpenVPN untuk client umumnya berekstensi `.ovpn` perlu dibuat versi lainnya.

Duplikat client config, tambahkan directive dibawah ini agar trafik seluruhnya menuju server.

```
redirect-gateway def1 bypass-dhcp
dhcp-option DNS 1.1.1.1
dhcp-option DNS 1.0.0.1
ignore-unknown-option block-outside-dns
block-outside-dns
```

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

Contoh trafik seluruhnya melalui server, file client config bernama `mylaptop-isolated.ovpn` dengan isi file sebagai berikut:

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
redirect-gateway def1 bypass-dhcp
dhcp-option DNS 1.1.1.1
dhcp-option DNS 1.0.0.1
ignore-unknown-option block-outside-dns
block-outside-dns
```

Perbedaan file `mylaptop.ovpn` (kiri) dan `mylaptop-isolated.ovpn` (kanan):

(Tanda bintang `*` artinya baris yang berbeda)

```
client                                |   | client
dev tun                               |   | dev tun
proto tcp                             |   | proto tcp
remote 200.200.20.20 443              |   | remote 200.200.20.20 443
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
                                      | * | redirect-gateway def1 bypass-dhcp
                                      | * | dhcp-option DNS 1.1.1.1
                                      | * | dhcp-option DNS 1.0.0.1
                                      | * | ignore-unknown-option block-outside-dns
                                      | * | block-outside-dns
```
