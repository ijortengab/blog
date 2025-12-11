---
tags:
  - openvpn
---

# Konfigurasi OpenVPN Server - Part 3 Skenario LAN & IP Static

## Skenario Basic

Skenario Basic yang dibahas pada [tulisan sebelumnya](/blog/2021/06-20-konfigurasi-openvpn-server-part-1-skenario-basic.md), menggunakan variable sbb:

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

## Skenario LAN & IP Static

Assign IP pada **Skenario Basic** adalah DHCP, lalu IP client dibuat persistent menggunakan directive `ifconfig-pool-persist`.

Salah satu host didalam jaringan VPN adalah web server sehingga host tersebut perlu di-assign IP Static agar dapat diakses oleh host lainnya dengan IP yang tidak berubah.

Meski bisa assign IP Static dengan directive `ifconfig-pool-persist` tapi lebih fleksibel menggunakan directive `client-config-dir` karena tidak perlu mematikan daemon tiap kali menambah IP Static.

Directive `client-to-client` diperlukan agar host didalam jaringan VPN bisa komunikasi satu sama lain.

## Server Config

Kita perlu mengedit file konfigurasi, yakni:

 - `/etc/openvpn/server/server.conf`

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
client-config-dir ccd
client-to-client
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
push "redirect-gateway def1 bypass-dhcp" |   | push "redirect-gateway def1 bypass-dhcp"
ifconfig-pool-persist ipp.txt            |   | ifconfig-pool-persist ipp.txt
push "dhcp-option DNS 1.1.1.1"           |   | push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 1.0.0.1"           |   | push "dhcp-option DNS 1.0.0.1"
keepalive 10 120                         |   | keepalive 10 120
cipher AES-256-CBC                       |   | cipher AES-256-CBC
user nobody                              |   | user nobody
group nogroup                            |   | group nogroup
persist-key                              |   | persist-key
persist-tun                              |   | persist-tun
verb 3                                   |   | verb 3
crl-verify crl.pem                       |   | crl-verify crl.pem
                                         | * | client-config-dir ccd
                                         | * | client-to-client
```

Argument `ccd` artinya direktori bernama `ccd` yang berlokasi sama dengan file config tersebut (path relative).

Kita perlu membuat direktori `ccd`:

```
mkdir -p /etc/openvpn/server/ccd
```

Restart VPN dengan perintah:

```
systemctl restart openvpn-server@server.service
```

Server VPN saat ini sudah bisa memberi IP static kepada client dan antara client juga sudah bisa komunikasi.

## Client Config di Server

Misalnya client memiliki file config bernama `mylaptop.ovpn` dan terdapat sertifikat dengan `cn` bernilai `mylaptop`.

Buat file sesuai nama `cn` didalam direktori `ccd`, lalu beri perintah untuk memberi IP static.

```
touch /etc/openvpn/server/ccd/mylaptop
vi /etc/openvpn/server/ccd/mylaptop
```

Isi dari file `mylaptop` adalah sbb:

```
ifconfig-push 10.8.0.101 255.255.255.0
```

Saat koneksi VPN terjadi, client dengan nilai `cn` sertifikat bernilai `mylaptop` akan mendapat IP `10.8.0.101`.
