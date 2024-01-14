---
title: Konfigurasi OpenVPN Server - Part 5 Skenario Multiple Daemons TCP & UDP
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

## Skenario Multiple Daemons TCP & UDP

**Skenario Basic** menggunakan port `443` dan protokol `tcp`. Firewall di level lokal (Management Hotspot) maupun di level ISP (Penyedia Internet) umumnya tidak memblokir port `443` dan protokol `tcp` karena kedua variable tersebut digunakan untuk mengakses website dengan protokol `https`.

Kita akan membuat daemon yang berbeda yang akan meng-handle service untuk protokol `udp` dan port yang dipilih adalah port standard OpenVPN yakni `1194`. Bagaimanapun protokol `udp` lebih cepat daripada `tcp` dan umumnya firewall ISP tidak memblokir berdasarkan port dan protokol.

Variable tambahan yang akan kita gunakan jadinya sebagai berikut:

 - IP Network: `10.8.8.0`
 - Subnet Mask: `255.255.255.0`
 - IP Server: `10.8.8.1`
 - IP Broadcast `10.8.8.255`
 - IP Client: `10.8.8.2` ~ `10.8.8.254` (Total 253 host)
 - CIDR: `10.8.8.0/24`

Jumlah client yang didapat adalah `506` client dengan rincian:

 - Range IP: `10.8.0.2` ~ `10.8.0.254` (jumlah client adalah 253 host) adalah TCP 443.
 - Range IP: `10.8.8.2` ~ `10.8.8.254` (jumlah client adalah 253 host) adalah UDP 1194.

## Server Config

Duplikat file `server.conf` dan beri nama `server-udp.conf`.

```
cd /etc/openvpn/server/
cp server.conf server-udp.conf
```

Khusus protokol `udp` terdapat tambahan directive `explicit-exit-notify` sesuai informasi pada installer `openvpn-install.sh`.

Isi dari file `server-udp.conf` adalah:

```
local 200.200.20.20
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
auth SHA512
tls-crypt tc.key
topology subnet
server 10.8.8.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp"
ifconfig-pool-persist ipp-udp.txt
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
explicit-exit-notify
```

Perbedaan file `server.conf` (kiri) dan `server-udp.conf` (kanan):

(Tanda bintang `*` artinya baris yang berbeda)

```
local 200.200.20.20                      |   | local 200.200.20.20
port 443                                 | * | port 1194
proto tcp                                | * | proto udp
dev tun                                  |   | dev tun
ca ca.crt                                |   | ca ca.crt
cert server.crt                          |   | cert server.crt
key server.key                           |   | key server.key
dh dh.pem                                |   | dh dh.pem
auth SHA512                              |   | auth SHA512
tls-crypt tc.key                         |   | tls-crypt tc.key
topology subnet                          |   | topology subnet
server 10.8.0.0 255.255.255.0            | * | server 10.8.8.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp" |   | push "redirect-gateway def1 bypass-dhcp"
ifconfig-pool-persist ipp.txt            | * | ifconfig-pool-persist ipp-udp.txt
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
                                         | * | explicit-exit-notify
```

Isi dari file `openvpn-iptables.service` adalah:

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

Duplikat file `openvpn-iptables.service` dan beri nama `openvpn-iptables-udp.service`.

```
cd /etc/systemd/system/
cp openvpn-iptables.service openvpn-iptables-udp.service
```

Edit dengan command `sed`:

```
cd /etc/systemd/system/
sed -i 's|--dport 443|--dport 1194|g' openvpn-iptables-udp.service
sed -i 's|-p tcp|-p udp|g'            openvpn-iptables-udp.service
sed -i 's|10.8.0.0/24|10.8.8.0/24|g'  openvpn-iptables-udp.service
```

Tambah directive `After` agar eksekusi `iptables` pada unit file ini (`openvpn-iptables-udp.service`) tidak bentrok dengan unit dari file awal (`openvpn-iptables.service`).

```
After=openvpn-iptables.service
```

Sehingga isi dari file `openvpn-iptables-udp.service` adalah:

```
[Unit]
Before=network.target
After=openvpn-iptables.service
[Service]
Type=oneshot
ExecStart=/sbin/iptables -t nat -A POSTROUTING -s 10.8.8.0/24 ! -d 10.8.8.0/24 -j SNAT --to 200.200.20.20
ExecStart=/sbin/iptables -I INPUT -p udp --dport 1194 -j ACCEPT
ExecStart=/sbin/iptables -I FORWARD -s 10.8.8.0/24 -j ACCEPT
ExecStart=/sbin/iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
ExecStop=/sbin/iptables -t nat -D POSTROUTING -s 10.8.8.0/24 ! -d 10.8.8.0/24 -j SNAT --to 200.200.20.20
ExecStop=/sbin/iptables -D INPUT -p udp --dport 1194 -j ACCEPT
ExecStop=/sbin/iptables -D FORWARD -s 10.8.8.0/24 -j ACCEPT
ExecStop=/sbin/iptables -D FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
```

Aktifkan daemon dengan `systemctl`.

```
systemctl enable --now openvpn-server@server-udp.service
systemctl enable --now openvpn-iptables-udp.service
```

Server VPN saat ini terdapat dua daemon yang mendengar port 443 dan 1194.

```
netstat -apn | grep openvpn
```

Output:

```
tcp        0      0 200.200.20.20:443      0.0.0.0:*               LISTEN      21037/openvpn
udp        0      0 200.200.20.20:1194     0.0.0.0:*                           659/openvpn
```

## Client Config

File Config OpenVPN untuk client umumnya berekstensi `.ovpn` perlu dibuat versi lainnya.

Duplikat client config, edit variable pada directive `proto` dan `port`.

Contoh client config pada **Skenario Basic**, file client config bernama `mylaptop.ovpn` dengan isi file sebagai berikut:

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

Contoh client config untuk akses protokol UDP dan port 1194, file client config bernama `mylaptop-udp.ovpn` dengan isi file sebagai berikut:

```
client
dev tun
proto udp
remote 200.200.20.20 1194
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

Perbedaan file `mylaptop.ovpn` (kiri) dan `mylaptop-udp.ovpn` (kanan):

(Tanda bintang `*` artinya baris yang berbeda)

```
client                                |   | client
dev tun                               |   | dev tun
proto tcp                             | * | proto udp
remote 200.200.20.20 443              | * | remote 200.200.20.20 1194
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
```

## Troubleshoot

Jika terdapat error pada log dengan command `systemctl status openvpn-iptables-udp.service` sebagai berikut:

> iptables[530]: Another app is currently holding the xtables lock. Perhaps you want to use the -w option?

Itu artinya directive `After` belum ditambahkan pada file konfigurasi `/etc/systemd/system/openvpn-iptables-udp.service` sehingga kedua unit yang menggunakan command `iptables` berjalan bersamaan.

## Tips

Saat menggunakan `ssh` client, gunakan option ProxyJump sebagai solusi `client-to-client` beda network IP.

Contoh:

Pada kasus dua daemon diatas terdapat network IP yang berbeda, yakni:

 - `10.8.0.0/24`
 - `10.8.8.0/24`

Agar client yang berada pada network pertama dapat melakukan `ssh` ke network kedua, maka diperlukan ProxyJump ke IP server VPN dari network yang sama.

Command ssh dari client IP `10.8.0.5` ke `10.8.8.5`:

```
ssh 10.8.8.5 -J 10.8.0.1
```

Command  ssh dari client IP `10.8.8.5` ke `10.8.0.5`:

```
ssh 10.8.0.5 -J 10.8.8.1
```

Berikut ini command alias untuk memudahkan:

```
alias vpnstatus="systemctl status openvpn-server@server.service"
alias vpnstart="systemctl start openvpn-server@server.service"
alias vpnstop="systemctl stop openvpn-server@server.service"
alias vpnrestart="systemctl restart openvpn-server@server.service"
alias vpnlog="if [ -e /run/openvpn-server/status-server.log ];then cat /run/openvpn-server/status-server.log | grep ^CLIENT_LIST; else echo Log Not Found; fi"
```

Versi udp:

```
alias vpnstatusudp="systemctl status openvpn-server@server-udp.service"
alias vpnstartudp="systemctl start openvpn-server@server-udp.service"
alias vpnstopudp="systemctl stop openvpn-server@server-udp.service"
alias vpnrestartudp="systemctl restart openvpn-server@server-udp.service"
alias vpnlogudp="if [ -e /run/openvpn-server/status-server-udp.log ];then cat /run/openvpn-server/status-server-udp.log | grep ^CLIENT_LIST; else echo Log Not Found; fi"
```

## Reference

https://openvpn.net/vpn-server-resources/advanced-option-settings-on-the-command-line/
