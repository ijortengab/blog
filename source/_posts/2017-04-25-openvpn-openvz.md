---
title: Setup OpenVPN Server di VPS OpenVZ
---

## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Pendahuluan

VPS menggunakan sistem Operasi Ubuntu 16.04 LTS, IP yang didapat (contoh) 222.222.222.222. 

VPS dibeli menggunakan ISP RumahWeb yang menggunakan virtualisasi berbasis OpenVZ. 

Terdapat kendala untuk instalasi OpenVPN menggunakan VPS berbasis OpenVZ.

## Gerak Cepat

Sesuai dengan [tulisan sebelumnya], tentang instalasi OpenVPN Server gak pake lama, kita download script dan execute script tersebut.

[tulisan sebelumnya]: /blog/2017/01/23/install-openvpn-server-gpl/

```
sudo su
mkdir ~/ovpn
cd ~/ovpn
wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
```

## Kendala pertama

Muncul warning sebagai berikut:

```no-highlight
The TUN device is not available
You need to enable TUN before running this script
```

Secara default, VPS belum terdapat device (virtual) `tun`. Oleh karena itu kita perlu meminta kepada teknisi untuk melakukan enable `tun`.

Hubungi teknisi (teknis@rumahweb.com) untuk melakukan instalasi `tun`. Biasanya antara permintaan dan realisasi memerlukan waktu sekitar 2 jam.

Execute kembali script.

```
bash openvpn-install.sh
```

## Kendala kedua

Selesai instalasi akan menghasilkan file config untuk client berlokasi di `/root/client.ovpn`.

Harusnya daemon otomatis berjalan dan VPN siap digunakan. Nyatanya:

```
ps ax | grep openvpn
```

Tidak terlihat service OpenVPN.

Cek melalui command dan terdapat warning error:

```
systemctl status openvpn@server.service
```

Kasus terjadi pada Ubuntu 16.04. Googling dan didapat solusi pada forum [askubuntu]. Solusinya adalah hapus (atau comment) pada directive `LimitNProce` pada file `/lib/systemd/system/openvpn@.service`.

[askubuntu]: http://askubuntu.com/questions/747023/systemd-fails-to-start-openvpn-in-lxd-managed-16-04-container

Contoh hasil akhir file adalah sebagai berikut:

```no-highlight
CapabilityBoundingSet=CAP_IPC_LOCK CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW CAP_SETGID CAP_SETUID CAP_SYS_CHROOT CAP_DAC_READ_SEARCH CAP_AUDIT_WRITE
#LimitNPROC=10
DeviceAllow=/dev/null rw
```

Save dan restart service, hasilnya sukses.

```
root@server:~# systemctl restart openvpn@server.service
Warning: openvpn@server.service changed on disk. Run 'systemctl daemon-reload' to reload units.
Job for openvpn@server.service failed because the control process exited with error code. See "systemctl status openvpn@server.service" and "journalctl -xe" for details.
root@server:~# systemctl daemon-reload
root@server:~# systemctl restart openvpn@server.service
root@server:~# ps ax | grep openvpn
12521 ?        Ss     0:00 /usr/sbin/openvpn --daemon ovpn-server --status /run/openvpn/server.status 10 --cd /etc/openvpn --script-security 2 --config /etc/openvpn/server.conf --writepid /run/openvpn/server.pid
12534 pts/0    S+     0:00 grep --color=auto openvpn
root@server:~#
```

## Kendala ketiga

Client tidak bisa internet.

Setelah menjalankan VPN disisi server dan client telah connect ke server ternyata client tidak bisa internet sama sekali.

Konfigurasi client adalah seluruh koneksi diarahkan ke VPN menggunakan directive `redirect-gateway`.

Sumber permasalahan ini adalah tidak adanya `NAT` pada VPS. Hal ini diketahui setelah menggunakan `tcpdump` untuk [menganalisis aliran packet data][1].

[1]: /blog/2017/04/15/tcpdump/

```no-highlight
root@server:~# iptables -t nat -S
iptables v1.6.0: can't initialize iptables table 'nat': Table does not exist (do you need to insmod?)
Perhaps iptables or your kernel needs to be upgraded.
root@server:~#
```

Googling dengan query "openvz nat vpn" didapat [link pertama] yang bermanfaat. Solusi untuk kasus seperti ini sama seperti `tun`, kita perlu meminta kepada teknisi untuk melakukan enable `NAT`.

[link pertama]: https://openvpn.net/index.php/access-server/docs/admin-guides/186-how-to-run-access-server-on-a-vps-container.html

> Prepare your VPS host so that the following requirements are met:

> 1. Make the iptables state and nat modules accessible to containers.

> Edit /etc/vz/vz.conf and add "ipt_state iptable_nat" to the end of the list of IPTABLES modules.

> *NOTE: This needs to be done on the host node, not the individual VPS container.

Sumber: https://openvpn.net/index.php/access-server/docs/admin-guides/186-how-to-run-access-server-on-a-vps-container.html

Hubungi teknisi (teknis@rumahweb.com) untuk melakukan instalasi module `NAT`. Biasanya antara permintaan dan realisasi memerlukan waktu sekitar 2 jam. Didalam body email, cantumkan pula agar jika dibutuhkan restart server, maka lakukan saja langsung tanpa perlu konfirmasi ijin lagi.

Setelah server direstart oleh teknisi, maka mari kita cek iptables.

```
root@server:~# iptables -t nat -S
-P PREROUTING ACCEPT
-P POSTROUTING ACCEPT
-P OUTPUT ACCEPT
-A POSTROUTING -s 10.8.0.0/24 -j SNAT --to-source 222.222.222.222
root@server:~#
```

Secara otomatis rules baru `iptables` telah terbuat secara permanent. Client pun bisa menggunakan internet melalui VPN Server.

## Reference

<http://askubuntu.com/questions/747023/systemd-fails-to-start-openvpn-in-lxd-managed-16-04-container>

<http://serverfault.com/questions/307059/openvpn-server-running-on-openvz-how-to-write-iptables-rule-without-masquerade>

<https://openvpn.net/index.php/access-server/docs/admin-guides/186-how-to-run-access-server-on-a-vps-container.html>

<http://serverfault.com/q/307059/>

## Lampiran Debug

Terlampir output debug dari `tcpdump`.

- Output tcpdump interface tun0 (sebelum ada NAT)
- Output tcpdump interface venet0 (sebelum ada NAT)
- Output tcpdump interface tun0 (setelah ada NAT)
- Output tcpdump interface venet0 (setelah ada NAT)

### Skenario

IP VPS adalah 222.222.222.222. Client VPN dengan IP Private 10.8.0.2 mencoba mengakses website menggunakan firefox ke host 111.111.111.111 port 80.

Pada detik ke-0, tun0 (IP 10.8.0.2 port 53906) membuat koneksi ke IP `111.111.111.111` port 80.

Beberapa micro detik (0.000017 detik) kemudian, venet0 mendapat forward-an dari tun0, membuat koneksi ke IP `111.111.111.111` port 80. Namun IP yang ter-set pada venet0 sama dengan tun0 yakni IP Private 10.8.0.2. 

Padahal, jika melihat debug pada wget, `venet0` harusnya ter-set sebagai IP Publik, `222.222.222.222` sehingga dapat terjadi percakapan dengan sesama IP Publik `111.111.111.111`.

Bagaimanakah caranya agar IP yang ter-set di `venet0` saat akan konek ke internet bukan IP Private bawaan `tun0` melainkan IP Publik?

Pengaturan antar device interface membutuhkan konfigurasi firewall menggunakan iptables. 

Googling dengan query "iptables rules openvz openvpn" didapat [link pertama yang bermanfaat][3], yakni membutuhkan NAT dan tambahkan rules sebagai berikut:

[3]: http://serverfault.com/q/307059/

```
iptables -t nat -A POSTROUTING  -s 10.8.0.0/24 -o venet0 -j SNAT --to-source 222.222.222.222
```

### Output tcpdump interface tun0 (sebelum ada NAT)

```no-highlight
root@server:~# tcpdump -i tun0  host 111.111.111.111 -vvv -n
tcpdump: listening on tun0, link-type RAW (Raw IP), capture size 262144 bytes
16:22:44.503621 IP (tos 0x0, ttl 128, id 1782, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53906 > 111.111.111.111.80: Flags [S], cksum 0x4e42 (correct), seq 4194984675, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:22:47.505057 IP (tos 0x0, ttl 128, id 1783, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53906 > 111.111.111.111.80: Flags [S], cksum 0x4e42 (correct), seq 4194984675, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:22:53.503941 IP (tos 0x0, ttl 128, id 1784, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53906 > 111.111.111.111.80: Flags [S], cksum 0x624b (correct), seq 4194984675, win 8192, options [mss 1352,nop,nop,sackOK], length 0
16:23:05.504636 IP (tos 0x0, ttl 128, id 1787, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53911 > 111.111.111.111.80: Flags [S], cksum 0xb989 (correct), seq 2737131132, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:05.758322 IP (tos 0x0, ttl 128, id 1788, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53912 > 111.111.111.111.80: Flags [S], cksum 0x277c (correct), seq 3185100245, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:08.504518 IP (tos 0x0, ttl 128, id 1792, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53911 > 111.111.111.111.80: Flags [S], cksum 0xb989 (correct), seq 2737131132, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:08.758402 IP (tos 0x0, ttl 128, id 1793, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53912 > 111.111.111.111.80: Flags [S], cksum 0x277c (correct), seq 3185100245, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:14.504737 IP (tos 0x0, ttl 128, id 1796, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53911 > 111.111.111.111.80: Flags [S], cksum 0xcd92 (correct), seq 2737131132, win 8192, options [mss 1352,nop,nop,sackOK], length 0
16:23:14.753158 IP (tos 0x0, ttl 128, id 1797, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53912 > 111.111.111.111.80: Flags [S], cksum 0x3b85 (correct), seq 3185100245, win 8192, options [mss 1352,nop,nop,sackOK], length 0
16:23:26.757523 IP (tos 0x0, ttl 128, id 1801, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53917 > 111.111.111.111.80: Flags [S], cksum 0x08db (correct), seq 2924016641, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:29.757961 IP (tos 0x0, ttl 128, id 1804, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53917 > 111.111.111.111.80: Flags [S], cksum 0x08db (correct), seq 2924016641, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:35.759905 IP (tos 0x0, ttl 128, id 1808, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53917 > 111.111.111.111.80: Flags [S], cksum 0x1ce4 (correct), seq 2924016641, win 8192, options [mss 1352,nop,nop,sackOK], length 0
```

### Output tcpdump interface venet0 (sebelum ada NAT)

```no-highlight
root@server:~# tcpdump host 111.111.111.111 -vvv -n
tcpdump: listening on venet0, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
16:22:44.503638 IP (tos 0x0, ttl 127, id 1782, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53906 > 111.111.111.111.80: Flags [S], cksum 0x4e42 (correct), seq 4194984675, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:22:47.505069 IP (tos 0x0, ttl 127, id 1783, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53906 > 111.111.111.111.80: Flags [S], cksum 0x4e42 (correct), seq 4194984675, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:22:53.503952 IP (tos 0x0, ttl 127, id 1784, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53906 > 111.111.111.111.80: Flags [S], cksum 0x624b (correct), seq 4194984675, win 8192, options [mss 1352,nop,nop,sackOK], length 0
16:23:05.504651 IP (tos 0x0, ttl 127, id 1787, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53911 > 111.111.111.111.80: Flags [S], cksum 0xb989 (correct), seq 2737131132, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:05.758338 IP (tos 0x0, ttl 127, id 1788, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53912 > 111.111.111.111.80: Flags [S], cksum 0x277c (correct), seq 3185100245, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:08.504534 IP (tos 0x0, ttl 127, id 1792, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53911 > 111.111.111.111.80: Flags [S], cksum 0xb989 (correct), seq 2737131132, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:08.758413 IP (tos 0x0, ttl 127, id 1793, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53912 > 111.111.111.111.80: Flags [S], cksum 0x277c (correct), seq 3185100245, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:14.504749 IP (tos 0x0, ttl 127, id 1796, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53911 > 111.111.111.111.80: Flags [S], cksum 0xcd92 (correct), seq 2737131132, win 8192, options [mss 1352,nop,nop,sackOK], length 0
16:23:14.753169 IP (tos 0x0, ttl 127, id 1797, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53912 > 111.111.111.111.80: Flags [S], cksum 0x3b85 (correct), seq 3185100245, win 8192, options [mss 1352,nop,nop,sackOK], length 0
16:23:26.757545 IP (tos 0x0, ttl 127, id 1801, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53917 > 111.111.111.111.80: Flags [S], cksum 0x08db (correct), seq 2924016641, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:29.757977 IP (tos 0x0, ttl 127, id 1804, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.53917 > 111.111.111.111.80: Flags [S], cksum 0x08db (correct), seq 2924016641, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
16:23:35.759916 IP (tos 0x0, ttl 127, id 1808, offset 0, flags [DF], proto TCP (6), length 48)
    10.8.0.2.53917 > 111.111.111.111.80: Flags [S], cksum 0x1ce4 (correct), seq 2924016641, win 8192, options [mss 1352,nop,nop,sackOK], length 0
```

### Output tcpdump interface tun0 (setelah ada NAT)

```no-highlight
root@server:~# tcpdump host 111.111.111.111 -vvv -n -i tun0
tcpdump: listening on tun0, link-type RAW (Raw IP), capture size 262144 bytes
23:15:26.684585 IP (tos 0x0, ttl 128, id 3403, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [S], cksum 0x3dd7 (correct), seq 2407710383, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
23:15:26.703729 IP (tos 0x0, ttl 57, id 0, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [S.], cksum 0xaa35 (correct), seq 4155132261, ack 2407710384, win 29200, options [mss 1460,nop,nop,sackOK,nop,wscale 6], length 0
23:15:26.754760 IP (tos 0x0, ttl 128, id 3405, offset 0, flags [DF], proto TCP (6), length 40)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x1c65 (correct), seq 1, ack 1, win 16562, length 0
23:15:26.754887 IP (tos 0x0, ttl 128, id 3406, offset 0, flags [DF], proto TCP (6), length 473)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [P.], cksum 0x94b5 (correct), seq 1:434, ack 1, win 16562, length 433: HTTP, length: 433
        GET / HTTP/1.1
        Host: 111.111.111.111
        User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        DNT: 1
        Connection: keep-alive
        Upgrade-Insecure-Requests: 1
        If-Modified-Since: Wed, 16 Nov 2016 04:45:46 GMT
        If-None-Match: "582be47a-264"
        Cache-Control: max-age=0

23:15:26.773121 IP (tos 0x0, ttl 57, id 12597, offset 0, flags [DF], proto TCP (6), length 40)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [.], cksum 0x598d (correct), seq 1, ack 434, win 473, length 0
23:15:26.773656 IP (tos 0x0, ttl 57, id 12598, offset 0, flags [DF], proto TCP (6), length 229)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [P.], cksum 0x6b70 (correct), seq 1:190, ack 434, win 473, length 189: HTTP, length: 189
        HTTP/1.1 304 Not Modified
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Last-Modified: Wed, 16 Nov 2016 04:45:46 GMT
        Connection: keep-alive
        ETag: "582be47a-264"

23:15:26.909710 IP (tos 0x0, ttl 128, id 3409, offset 0, flags [DF], proto TCP (6), length 287)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [P.], cksum 0x338b (correct), seq 434:681, ack 190, win 16514, length 247: HTTP, length: 247
        GET /favicon.ico HTTP/1.1
        Host: 111.111.111.111
        User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
        Accept: */*
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        DNT: 1
        Connection: keep-alive

23:15:26.924572 IP (tos 0x0, ttl 128, id 3410, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.61882 > 111.111.111.111.80: Flags [S], cksum 0x0021 (correct), seq 3927024085, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
23:15:26.928296 IP (tos 0x0, ttl 57, id 12599, offset 0, flags [DF], proto TCP (6), length 387)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [P.], cksum 0x1745 (correct), seq 190:537, ack 681, win 490, length 347: HTTP, length: 347
        HTTP/1.1 404 Not Found
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Content-Encoding: gzip

        8d
23:15:26.941988 IP (tos 0x0, ttl 57, id 0, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 10.8.0.2.61882: Flags [S.], cksum 0xe52e (correct), seq 807966776, ack 3927024086, win 29200, options [mss 1460,nop,nop,sackOK,nop,wscale 6], length 0
23:15:26.979682 IP (tos 0x0, ttl 128, id 3411, offset 0, flags [DF], proto TCP (6), length 347)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [P.], cksum 0x2b97 (correct), seq 681:988, ack 537, win 16428, length 307: HTTP, length: 307
        GET /favicon.ico HTTP/1.1
        Host: 111.111.111.111
        User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        DNT: 1
        Connection: keep-alive

23:15:26.979861 IP (tos 0x0, ttl 128, id 3412, offset 0, flags [DF], proto TCP (6), length 40)
    10.8.0.2.61882 > 111.111.111.111.80: Flags [.], cksum 0x575e (correct), seq 1, ack 1, win 16562, length 0
23:15:26.998289 IP (tos 0x0, ttl 57, id 12600, offset 0, flags [DF], proto TCP (6), length 387)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [P.], cksum 0x14a6 (correct), seq 537:884, ack 988, win 507, length 347: HTTP, length: 347
        HTTP/1.1 404 Not Found
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Content-Encoding: gzip

        8d
23:15:27.269731 IP (tos 0x0, ttl 128, id 3414, offset 0, flags [DF], proto TCP (6), length 40)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x15f4 (correct), seq 988, ack 884, win 16341, length 0
23:15:27.276945 IP (tos 0x0, ttl 57, id 12601, offset 0, flags [DF], proto TCP (6), length 387)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [P.], cksum 0x14a6 (correct), seq 537:884, ack 988, win 507, length 347: HTTP, length: 347
        HTTP/1.1 404 Not Found
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Content-Encoding: gzip

        8d
23:15:27.324668 IP (tos 0x0, ttl 128, id 3415, offset 0, flags [DF], proto TCP (6), length 52)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x582f (correct), seq 988, ack 884, win 16341, options [nop,nop,sack 1 {537:884}], length 0
23:15:31.989885 IP (tos 0x0, ttl 128, id 3437, offset 0, flags [DF], proto TCP (6), length 40)
    10.8.0.2.61882 > 111.111.111.111.80: Flags [F.], cksum 0x575d (correct), seq 1, ack 1, win 16562, length 0
23:15:32.007348 IP (tos 0x0, ttl 57, id 57522, offset 0, flags [DF], proto TCP (6), length 40)
    111.111.111.111.80 > 10.8.0.2.61882: Flags [F.], cksum 0x9645 (correct), seq 1, ack 2, win 457, length 0
23:15:32.104726 IP (tos 0x0, ttl 128, id 3438, offset 0, flags [DF], proto TCP (6), length 40)
    10.8.0.2.61882 > 111.111.111.111.80: Flags [.], cksum 0x575c (correct), seq 2, ack 2, win 16562, length 0
23:15:37.039682 IP (tos 0x0, ttl 128, id 3449, offset 0, flags [DF], proto TCP (6), length 41)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x15f4 (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:15:37.057767 IP (tos 0x0, ttl 57, id 12602, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [.], cksum 0x799b (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
23:15:47.114860 IP (tos 0x0, ttl 128, id 3468, offset 0, flags [DF], proto TCP (6), length 41)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x15f4 (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:15:47.132962 IP (tos 0x0, ttl 57, id 12603, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [.], cksum 0x799b (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
23:15:57.189906 IP (tos 0x0, ttl 128, id 3492, offset 0, flags [DF], proto TCP (6), length 41)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x15f4 (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:15:57.208344 IP (tos 0x0, ttl 57, id 12604, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [.], cksum 0x799b (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
23:16:07.236483 IP (tos 0x0, ttl 128, id 3535, offset 0, flags [DF], proto TCP (6), length 41)
    10.8.0.2.61881 > 111.111.111.111.80: Flags [.], cksum 0x15f4 (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:16:07.258093 IP (tos 0x0, ttl 57, id 12605, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 10.8.0.2.61881: Flags [.], cksum 0x799b (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
```

### Output tcpdump interface venet0 (setelah ada NAT)

```no-highlight
root@server:~# tcpdump host 111.111.111.111 -vvv -n
tcpdump: listening on venet0, link-type LINUX_SLL (Linux cooked), capture size 262144 bytes
23:15:26.684621 IP (tos 0x0, ttl 127, id 3403, offset 0, flags [DF], proto TCP (6), length 52)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [S], cksum 0xd44f (correct), seq 2407710383, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
23:15:26.703706 IP (tos 0x0, ttl 57, id 0, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [S.], cksum 0x40ae (correct), seq 4155132261, ack 2407710384, win 29200, options [mss 1460,nop,nop,sackOK,nop,wscale 6], length 0
23:15:26.754781 IP (tos 0x0, ttl 127, id 3405, offset 0, flags [DF], proto TCP (6), length 40)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [.], cksum 0xb2dd (correct), seq 1, ack 1, win 16562, length 0
23:15:26.754896 IP (tos 0x0, ttl 127, id 3406, offset 0, flags [DF], proto TCP (6), length 473)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [P.], cksum 0x2b2e (correct), seq 1:434, ack 1, win 16562, length 433: HTTP, length: 433
        GET / HTTP/1.1
        Host: 111.111.111.111
        User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        DNT: 1
        Connection: keep-alive
        Upgrade-Insecure-Requests: 1
        If-Modified-Since: Wed, 16 Nov 2016 04:45:46 GMT
        If-None-Match: "582be47a-264"
        Cache-Control: max-age=0

23:15:26.773097 IP (tos 0x0, ttl 57, id 12597, offset 0, flags [DF], proto TCP (6), length 40)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [.], cksum 0xf005 (correct), seq 1, ack 434, win 473, length 0
23:15:26.773645 IP (tos 0x0, ttl 57, id 12598, offset 0, flags [DF], proto TCP (6), length 229)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [P.], cksum 0x01e9 (correct), seq 1:190, ack 434, win 473, length 189: HTTP, length: 189
        HTTP/1.1 304 Not Modified
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Last-Modified: Wed, 16 Nov 2016 04:45:46 GMT
        Connection: keep-alive
        ETag: "582be47a-264"

23:15:26.909722 IP (tos 0x0, ttl 127, id 3409, offset 0, flags [DF], proto TCP (6), length 287)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [P.], cksum 0xca03 (correct), seq 434:681, ack 190, win 16514, length 247: HTTP, length: 247
        GET /favicon.ico HTTP/1.1
        Host: 111.111.111.111
        User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
        Accept: */*
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        DNT: 1
        Connection: keep-alive

23:15:26.924592 IP (tos 0x0, ttl 127, id 3410, offset 0, flags [DF], proto TCP (6), length 52)
    222.222.222.222.61882 > 111.111.111.111.80: Flags [S], cksum 0x9699 (correct), seq 3927024085, win 8192, options [mss 1352,nop,wscale 2,nop,nop,sackOK], length 0
23:15:26.928278 IP (tos 0x0, ttl 57, id 12599, offset 0, flags [DF], proto TCP (6), length 387)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [P.], cksum 0xadbd (correct), seq 190:537, ack 681, win 490, length 347: HTTP, length: 347
        HTTP/1.1 404 Not Found
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Content-Encoding: gzip

        8d
23:15:26.941946 IP (tos 0x0, ttl 57, id 0, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 222.222.222.222.61882: Flags [S.], cksum 0x7ba7 (correct), seq 807966776, ack 3927024086, win 29200, options [mss 1460,nop,nop,sackOK,nop,wscale 6], length 0
23:15:26.979705 IP (tos 0x0, ttl 127, id 3411, offset 0, flags [DF], proto TCP (6), length 347)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [P.], cksum 0xc20f (correct), seq 681:988, ack 537, win 16428, length 307: HTTP, length: 307
        GET /favicon.ico HTTP/1.1
        Host: 111.111.111.111
        User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        DNT: 1
        Connection: keep-alive

23:15:26.979871 IP (tos 0x0, ttl 127, id 3412, offset 0, flags [DF], proto TCP (6), length 40)
    222.222.222.222.61882 > 111.111.111.111.80: Flags [.], cksum 0xedd6 (correct), seq 1, ack 1, win 16562, length 0
23:15:26.998251 IP (tos 0x0, ttl 57, id 12600, offset 0, flags [DF], proto TCP (6), length 387)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [P.], cksum 0xab1e (correct), seq 537:884, ack 988, win 507, length 347: HTTP, length: 347
        HTTP/1.1 404 Not Found
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Content-Encoding: gzip

        8d
23:15:27.269752 IP (tos 0x0, ttl 127, id 3414, offset 0, flags [DF], proto TCP (6), length 40)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [.], cksum 0xac6c (correct), seq 988, ack 884, win 16341, length 0
23:15:27.276906 IP (tos 0x0, ttl 57, id 12601, offset 0, flags [DF], proto TCP (6), length 387)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [P.], cksum 0xab1e (correct), seq 537:884, ack 988, win 507, length 347: HTTP, length: 347
        HTTP/1.1 404 Not Found
        Server: nginx/1.10.0 (Ubuntu)
        Date: Fri, 10 Feb 2017 16:15:26 GMT
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Content-Encoding: gzip

        8d
23:15:27.324686 IP (tos 0x0, ttl 127, id 3415, offset 0, flags [DF], proto TCP (6), length 52)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [.], cksum 0xeea7 (correct), seq 988, ack 884, win 16341, options [nop,nop,sack 1 {537:884}], length 0
23:15:31.989914 IP (tos 0x0, ttl 127, id 3437, offset 0, flags [DF], proto TCP (6), length 40)
    222.222.222.222.61882 > 111.111.111.111.80: Flags [F.], cksum 0xedd5 (correct), seq 1, ack 1, win 16562, length 0
23:15:32.007327 IP (tos 0x0, ttl 57, id 57522, offset 0, flags [DF], proto TCP (6), length 40)
    111.111.111.111.80 > 222.222.222.222.61882: Flags [F.], cksum 0x2cbe (correct), seq 1, ack 2, win 457, length 0
23:15:32.104746 IP (tos 0x0, ttl 127, id 3438, offset 0, flags [DF], proto TCP (6), length 40)
    222.222.222.222.61882 > 111.111.111.111.80: Flags [.], cksum 0xedd4 (correct), seq 2, ack 2, win 16562, length 0
23:15:37.039706 IP (tos 0x0, ttl 127, id 3449, offset 0, flags [DF], proto TCP (6), length 41)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [.], cksum 0xac6c (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:15:37.057715 IP (tos 0x0, ttl 57, id 12602, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [.], cksum 0x1014 (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
23:15:47.114875 IP (tos 0x0, ttl 127, id 3468, offset 0, flags [DF], proto TCP (6), length 41)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [.], cksum 0xac6c (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:15:47.132923 IP (tos 0x0, ttl 57, id 12603, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [.], cksum 0x1014 (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
23:15:57.189929 IP (tos 0x0, ttl 127, id 3492, offset 0, flags [DF], proto TCP (6), length 41)
    222.222.222.222.61881 > 111.111.111.111.80: Flags [.], cksum 0xac6c (correct), seq 987:988, ack 884, win 16341, length 1: HTTP
23:15:57.208299 IP (tos 0x0, ttl 57, id 12604, offset 0, flags [DF], proto TCP (6), length 52)
    111.111.111.111.80 > 222.222.222.222.61881: Flags [.], cksum 0x1014 (correct), seq 884, ack 988, win 507, options [nop,nop,sack 1 {987:988}], length 0
```
