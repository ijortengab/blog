# Konfigurasi OpenVPN Server - Part 4 Skenario Split Pool IP Static & DHCP

---
tags:
  - openvpn
---

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

## Skenario Split Pool IP Static & DHCP

Total IP Client pada **Skenario Basic** adalah 253 host dan seluruhnya adalah DHCP.

Kita akan menggunakan segmen yang terpisah untuk DHCP dan IP Static.

Kita tetapkan CIDR menjadi `10.8.0.0/23` sehingga terdapat dua segmen.

Segmen yang pertama, yakni `10.8.0.0/24`, akan kita jadikan DHCP.

Segmen yang kedua, yakni `10.8.1.0/24`, akan kita jadikan range untuk IP Static.

Variable yang akan kita gunakan jadinya sebagai berikut:

 - CIDR: `10.8.0.0/23`
 - IP Network: `10.8.0.0`
 - Subnet Mask: `255.255.254.0`
 - IP Server: `10.8.0.1`
 - IP Broadcast `10.8.1.255`
 - IP Client: `10.8.0.2` ~ `10.8.1.254` (Total 509 host)

Jumlah client yang didapat adalah `509` client dengan rincian:

 - Range IP: `10.8.0.2` ~ `10.8.0.255` (jumlah client adalah 254 host) adalah DHCP.
 - Range IP: `10.8.1.0` ~ `10.8.1.254` (jumlah client adalah 255 host) adalah IP Static.

## Server Config

Kita perlu mengedit dua file konfigurasi, yakni:

 - `/etc/openvpn/server/server.conf`
 - `/etc/systemd/system/openvpn-iptables.service`

Pada file `/etc/openvpn/server/server.conf`, kita ubah directive `server` dan tambahkan directive `ifconfig-pool`.

Seperti yang dijelaskan pada [Skenario LAN & IP Static](/blog/2021/06-22-konfigurasi-openvpn-server-part-3-skenario-lan-ip-static.md), kita akan menggunakan directive `client-config-dir` dan `client-to-client`.

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
server 10.8.0.0 255.255.254.0 nopool
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
ifconfig-pool 10.8.0.2 10.8.0.255
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
server 10.8.0.0 255.255.255.0            | * | server 10.8.0.0 255.255.254.0 nopool
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
                                         | * | ifconfig-pool 10.8.0.2 10.8.0.255
                                         | * | client-config-dir ccd
                                         | * | client-to-client
```

Argument `ccd` artinya direktori bernama `ccd` yang berlokasi sama dengan file config tersebut (path relative).

Kita perlu membuat direktori `ccd`:

```
mkdir -p /etc/openvpn/server/ccd
```

Pada file `/etc/systemd/system/openvpn-iptables.service`, kita ganti informasi CIDR:

Sebelumnya:

```
[Unit]
Before=network.target
[Service]
Type=oneshot
ExecStart=/sbin/iptables -t nat -A POSTROUTING -s 10.8.0.0/24 ! -d 10.8.0.0/24 -j SNAT --to 200.200.20.20
ExecStart=/sbin/iptables -I INPUT -p tcp --dport 443 -j ACCEPT
ExecStart=/sbin/iptables -I FORWARD -s 10.8.0.0/24 -j ACCEPT
ExecStart=/sbin/iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
ExecStop=/sbin/iptables -t nat -D POSTROUTING -s 10.8.0.0/24 ! -d 10.8.0.0/24 -j SNAT --to 200.200.20.20
ExecStop=/sbin/iptables -D INPUT -p tcp --dport 443 -j ACCEPT
ExecStop=/sbin/iptables -D FORWARD -s 10.8.0.0/24 -j ACCEPT
ExecStop=/sbin/iptables -D FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
```

Edit dengan command `sed`:

```
cd /etc/systemd/system/
sed -i 's|10.8.0.0/24|10.8.0.0/23|g' openvpn-iptables.service
```

Sesudah:

```
[Unit]
Before=network.target
[Service]
Type=oneshot
ExecStart=/sbin/iptables -t nat -A POSTROUTING -s 10.8.0.0/23 ! -d 10.8.0.0/23 -j SNAT --to 200.200.20.20
ExecStart=/sbin/iptables -I INPUT -p tcp --dport 443 -j ACCEPT
ExecStart=/sbin/iptables -I FORWARD -s 10.8.0.0/23 -j ACCEPT
ExecStart=/sbin/iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
ExecStop=/sbin/iptables -t nat -D POSTROUTING -s 10.8.0.0/23 ! -d 10.8.0.0/23 -j SNAT --to 200.200.20.20
ExecStop=/sbin/iptables -D INPUT -p tcp --dport 443 -j ACCEPT
ExecStop=/sbin/iptables -D FORWARD -s 10.8.0.0/23 -j ACCEPT
ExecStop=/sbin/iptables -D FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
```

Restart VPN server services dan firewall services:

```
systemctl daemon-reload
systemctl restart openvpn-server@server.service
systemctl restart openvpn-iptables.service
```

Server VPN saat ini sudah bisa memberi IP static kepada client dan antara client juga sudah bisa komunikasi.

Sementara client yang tidak diberi IP static, maka akan DHCP pada range sesuai argument pada directive `ifconfig-pool` yakni antara `10.8.0.2` dan `10.8.0.255`.

## Client Config di Server

Misalnya client memiliki file config bernama `mylaptop2.ovpn` dan terdapat sertifikat dengan `cn` bernilai `mylaptop2`.

Buat file sesuai nama `cn` didalam direktori `ccd`, lalu beri perintah untuk memberi IP static.

```
touch /etc/openvpn/server/ccd/mylaptop2
vi /etc/openvpn/server/ccd/mylaptop2
```

Isi dari file `mylaptop2` adalah sbb:

```
ifconfig-push 10.8.1.101 255.255.254.0
```

Saat koneksi VPN terjadi, client dengan nilai `cn` sertifikat bernilai `mylaptop2` akan mendapat IP `10.8.1.101`.

## Reference

[One static IP and the rest Dynamic/Define DHCP pool](https://forums.openvpn.net/viewtopic.php?f=22&t=29962)
