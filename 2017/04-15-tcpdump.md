# Monitoring Network dengan tcpdump


## tcpdump adalah

`tcpdump` adalah software untuk monitoring lalu lintas packet data dalam jaringan.

Install:

```
apt-get install tcpdump
```

## Gerak Cepat

Listing kartu jaringan (interface) yang tersedia.

```
root@server:~# tcpdump -D
1.eth0
2.tun0
3.any (Pseudo-device that captures on all interfaces)
4.lo
```

Execute `tcpdump` saja berarti menggunakan interface dengan nomor paling rendah.

`tcpdump` = `tcpdump -i 1` = `tcpdump -i eth0`

## Contoh Output

Fokus kepada interface yang digunakan dalam jaringan VPN.

```
tcpdump -i tun0
```

Argument `-c` untuk membatasi output. Contoh output dari dari jaringan VPN sebanyak 10 saja:

```no-highlight
root@server:~# tcpdump -i tun0 -c 10
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on tun0, link-type RAW (Raw IP), capture size 65535 bytes
19:45:13.171730 IP 10.8.0.2.64635 > sin11s02-in-f8.1e100.net.https: Flags [.], seq 1780272944:1780272945, ack 2376683074, win 16476, length 1
19:45:13.186872 IP sin11s02-in-f8.1e100.net.https > 10.8.0.2.64635: Flags [.], ack 1, win 380, options [nop,nop,sack 1 {0:1}], length 0
19:45:16.073207 IP ec2-52-20-16-14.compute-1.amazonaws.com.https > 10.8.0.2.64654: Flags [P.], seq 347411586:347411618, ack 3162076752, win 122, length 32
19:45:16.334665 IP 10.8.0.2.64654 > ec2-52-20-16-14.compute-1.amazonaws.com.https: Flags [.], ack 32, win 16432, length 0
19:45:16.757155 IP 10.8.0.2.64648 > edge-star-mini-shv-01-ort2.facebook.com.https: Flags [.], seq 3144226628:3144226629, ack 3388856420, win 16387, length 1
19:45:17.002020 IP edge-star-mini-shv-01-ort2.facebook.com.https > 10.8.0.2.64648: Flags [.], ack 1, win 348, length 0
19:45:25.947089 IP 10.8.0.2.64673 > sc-in-f138.1e100.net.https: Flags [.], seq 3630266669:3630266670, ack 3455177894, win 16511, length 1
19:45:25.962844 IP sc-in-f138.1e100.net.https > 10.8.0.2.64673: Flags [.], ack 1, win 395, options [nop,nop,sack 1 {0:1}], length 0
19:45:27.168602 IP sea24.ff.avast.com.http > 10.8.0.2.64634: Flags [P.], seq 385453341:385453520, ack 250163468, win 2, length 179
19:45:27.217393 IP 10.8.0.2.64634 > sea24.ff.avast.com.http: Flags [P.], seq 1:303, ack 179, win 16427, length 302
10 packets captured
11 packets received by filter
0 packets dropped by kernel
root@server:~#
```

Informasi diatas sudah autoresolve host dan resolve port ke bahasa manusia (`http` berarti 80, `https` berarti 443, `domain` berarti 53, `ssh` berarti 22). Argument `-n` untuk meniadakan autoresolve. Contoh:

```no-highlight
root@servercciid170317:~# tcpdump -i tun0 -c 10 -n
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on tun0, link-type RAW (Raw IP), capture size 65535 bytes
20:10:59.790559 IP 10.8.0.2.64628 > 74.125.130.188.5228: Flags [.], seq 2911520992:2911520993, ack 255407579, win 16445, length 1
20:10:59.809180 IP 74.125.130.188.5228 > 10.8.0.2.64628: Flags [.], ack 1, win 360, options [nop,nop,sack 1 {0:1}], length 0
20:11:01.140691 IP 10.8.0.2.64654 > 52.20.16.14.443: Flags [.], seq 3162078131:3162078132, ack 347413843, win 16562, length 1
20:11:01.398937 IP 52.20.16.14.443 > 10.8.0.2.64654: Flags [.], ack 1, win 152, options [nop,nop,sack 1 {0:1}], length 0
20:11:02.780923 IP 10.8.0.2.64876 > 31.13.69.232.443: Flags [.], seq 546272058:546272059, ack 1678827372, win 16562, length 1
20:11:03.028654 IP 31.13.69.232.443 > 10.8.0.2.64876: Flags [R], seq 1678827372, win 0, length 0
20:11:07.511099 IP 10.8.0.2.64871 > 31.13.69.232.443: Flags [.], seq 118771628:118771629, ack 1842747092, win 16486, length 1
20:11:07.560612 IP 10.8.0.2.64874 > 31.13.69.232.443: Flags [.], seq 2417215610:2417215611, ack 989887177, win 16486, length 1
20:11:07.640731 IP 10.8.0.2.64869 > 31.13.69.232.443: Flags [.], seq 2228747857:2228747858, ack 2452753246, win 16486, length 1
20:11:07.641031 IP 10.8.0.2.64872 > 31.13.69.232.443: Flags [.], seq 1626832043:1626832044, ack 1870466108, win 16486, length 1
10 packets captured
14 packets received by filter
0 packets dropped by kernel
root@servercciid170317:~#
```

Argument `port` untuk membatasi port.

Contoh output dari dari aktivitas DNS (port 53) dalam me-resolve domain `ijortengab.id`.

```no-highlight
root@server:~# tcpdump -i tun0 -c 100 -n port 53
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on tun0, link-type RAW (Raw IP), capture size 65535 bytes
...
19:59:58.711082 IP 10.8.0.2.64749 > 103.16.198.198.53: 29663+ A? ijortengab.id. (31)
...
19:59:58.920653 IP 103.16.198.198.53 > 10.8.0.2.64749: 29663 1/3/2 A 128.199.70.158 (149)
...
```

## Case Study

Monitoring packet data http.

```
tcpdump -i eth0 port 80 -vvv
```

Monitoring packet data http dari interface/ip tertentu.

```
tcpdump -i eth0 'src 10.8.0.2 and port 80' -vvv
```

Monitoring packet data http menuju interface/ip tertentu.

```
tcpdump -i eth0 'dst 10.8.0.2 and port 80' -vvv
```

Monitoring packet data http dan https.

```
tcpdump -i eth0 'port 80 or port 443' -vvv -n
```

Monitoring packet data VPN ke salahsatu server game (map server di port 5000) di jaringan `202.93.24.0` subnet mask `255.255.248.0` (kondisi tahun 2017).

```
tcpdump -i tun0 'net 202.93.24.0/21 and port 5000' -vvv -n
```

## Reference

http://www.tcpdump.org/tcpdump_man.html
