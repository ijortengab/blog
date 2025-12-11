---
tags:
  - openvpn
---

# Konfigurasi OpenVPN Server - Part 1 Skenario Basic

## Skenario Basic

Kita membeli VPS di Digital Ocean dan mendapat nomor IP Publik sbb (contoh):

```
200.200.20.20
```

Terdapat cara cepat install OpenVPN Server, yakni download dan eksekusi script sbb:

```
wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
```

Blog terkait:

 > [Install OpenVPN Server GPL (Gak Pake Lama)](/blog/2017/01-23-install-openvpn-server-gpl.md)

Pada saat instalasi, kita ambil contoh opsi sebagai berikut:

 - IP Publik: `200.200.20.20`
 - Protokol: `TCP`
 - Port: `443`
 - DNS Resolver: Cloudflare (`1.1.1.1` dan `1.0.0.1`)

Cara cepat diatas memiliki skenario sebagai berikut:

 - CIDR: `10.8.0.0/24`
 - IP Network: `10.8.0.0`
 - Subnet Mask: `255.255.255.0`
 - IP Server: `10.8.0.1`
 - IP Broadcast `10.8.0.255`
 - IP Client: `10.8.0.2` ~ `10.8.0.254` (Total 253 host)

Skenario diatas kita namakan **Skenario Basic**.

## File Konfigurasi

Instalasi jika berhasil maka akan menciptakan tiga file konfigurasi yakni:

 - `/etc/openvpn/server/server.conf`
 - `/etc/openvpn/server/client-common.txt`
 - `/etc/systemd/system/openvpn-iptables.service`

Isi dari file `/etc/openvpn/server/server.conf` sesuai opsi variable diatas saat instalasi:

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

Isi dari file  `/etc/openvpn/server/client-common.txt`:

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

Isi dari file `/etc/systemd/system/openvpn-iptables.service` sesuai opsi variable diatas saat instalasi:

```
[Unit]
Before=network.target
[Service]
Type=oneshot
ExecStart=/usr/sbin/iptables -t nat -A POSTROUTING -s 10.8.0.0/24 ! -d 10.8.0.0/24 -j SNAT --to 200.200.20.20
ExecStart=/usr/sbin/iptables -I INPUT -p tcp --dport 443 -j ACCEPT
ExecStart=/usr/sbin/iptables -I FORWARD -s 10.8.0.0/24 -j ACCEPT
ExecStart=/usr/sbin/iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
ExecStop=/usr/sbin/iptables -t nat -D POSTROUTING -s 10.8.0.0/24 ! -d 10.8.0.0/24 -j SNAT --to 200.200.20.20
ExecStop=/usr/sbin/iptables -D INPUT -p tcp --dport 443 -j ACCEPT
ExecStop=/usr/sbin/iptables -D FORWARD -s 10.8.0.0/24 -j ACCEPT
ExecStop=/usr/sbin/iptables -D FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
```

## Service

Instalasi OpenVPN menggunakan menggunakan `apt-get install openvpn` akan menciptakan template service.

File template `/lib/systemd/system/openvpn-server@.service` dengan content sbb:

```
[Unit]
Description=OpenVPN service for %I
After=network-online.target
Wants=network-online.target
Documentation=man:openvpn(8)
Documentation=https://community.openvpn.net/openvpn/wiki/Openvpn24ManPage
Documentation=https://community.openvpn.net/openvpn/wiki/HOWTO

[Service]
Type=notify
PrivateTmp=true
WorkingDirectory=/etc/openvpn/server
ExecStart=/usr/sbin/openvpn --status %t/openvpn-server/status-%i.log --status-version 2 --suppress-timestamps --config %i.conf
CapabilityBoundingSet=CAP_IPC_LOCK CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW CAP_SETGID CAP_SETUID CAP_SYS_CHROOT CAP_DAC_OVERRIDE CAP_AUDIT_WRITE
LimitNPROC=10
DeviceAllow=/dev/null rw
DeviceAllow=/dev/net/tun rw
ProtectSystem=true
ProtectHome=true
KillMode=process
RestartSec=5s
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Kita menggunakan file configurasi dari path `/etc/openvpn/server/server.conf`, maka command untuk control service adalah sbb:

 - Cek status: `systemctl status openvpn-server@server.service`
 - Start: `systemctl start openvpn-server@server.service`
 - Restart: `systemctl restart openvpn-server@server.service`
 - Stop: `systemctl stop openvpn-server@server.service`
 - Enable: `systemctl enable --now openvpn-server@server.service`
 - Disable: `systemctl disable --now openvpn-server@server.service`

## Firewall

Instalasi script diatas pada environment `Ubuntu 20.04` akan juga menciptakan service untuk firewall.

File konfigurasi service firewall yakni `/etc/systemd/system/openvpn-iptables.service`.

Berdasarkan nama file, maka command untuk control service firewall adalah sbb:

 - Cek status: `systemctl status openvpn-iptables.service`
 - Start: `systemctl start openvpn-iptables.service`
 - Restart: `systemctl restart openvpn-iptables.service`
 - Stop: `systemctl stop openvpn-iptables.service`
 - Enable: `systemctl enable --now openvpn-iptables.service`
 - Disable: `systemctl disable --now openvpn-iptables.service`
