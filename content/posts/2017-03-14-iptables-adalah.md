---
title: IPTables adalah
#draft: true
---

## Pendahuluan

IPTables adalah firewall-nya Linux. Berfungsi untuk memblokir dan mengijinkan akses masuk atau keluar server.

Tulisan ini akan membahas dasar IPTables dengan bermain di port SSH.

## Tambah Rules

VPS yang kita sewa ternyata rentan akan aktivitas `serangan` untuk masuk ke server.

Pada sistem operasi Ubuntu 16.04, dengan command `journalctl -xe` akan terlihat proses login ssh melalui IP dari negara China dan Rusia sementara saya login ssh ke server hanya melalui negara Indonesia.

Dengan iptables, kita akan memblock koneksi dari semua tempat kecuali dari [provider Indonesia][1].

[1]: /blog/2017/03/13/ip-address-range-isp-indonesia

Izinkan akses dari ISP Bolt.
```
iptables -A INPUT -p tcp -s 202.62.16.0/20 --dport 22 -j ACCEPT
```

Lalu block akses dari selain itu.
```
iptables -A INPUT -p tcp --dport 22 -j DROP
```

Cek result melalui command:
```
iptables -S
```

```
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-A INPUT -s 202.62.16.0/20 -p tcp -m tcp --dport 22 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 22 -j DROP
```

Jika suatu saat kuota Bolt habis, terpaksa smartphone Telkomsel dijadikan hotspot.

Gunakan parameter -I untuk menaruh perintah baru pada posisi diatas.

```
iptables -I INPUT -p tcp -s 114.120.0.0/13 --dport 22 -j ACCEPT
```

Cek hasil:

```
iptables -S
```

```
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-A INPUT -s 114.120.0.0/13 -p tcp -m tcp --dport 22 -j ACCEPT
-A INPUT -s 202.62.16.0/20 -p tcp -m tcp --dport 22 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 22 -j DROP
```

## Order

iptables bekerja berdasarkan urutan dari baris perintah. 

Jika beris ke-n sudah terpenuhi pada suatu Chain, maka baris ke n+1 dan seterusnya akan diskip.

Untuk melihat order, gunakan command berikut:

```
iptables -L -n --line-numbers
```

```
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  114.120.0.0/13       0.0.0.0/0            tcp dpt:22
2    ACCEPT     tcp  --  202.62.16.0/20       0.0.0.0/0            tcp dpt:22
3    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT)
num  target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
num  target     prot opt source               destination
```

Untuk menyisipkan rules antara poin 1 dan 2, maka kita gunakan penomoran setelah Chain.

```
iptables -I INPUT 2 -m iprange --src-range 112.215.153.0-112.215.178.0 -p tcp --dport 22 -j ACCEPT
```

Cek:

```
iptables -S
```

```
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-A INPUT -s 114.120.0.0/13 -p tcp -m tcp --dport 22 -j ACCEPT
-A INPUT -p tcp -m iprange --src-range 112.215.153.0-112.215.178.0 -m tcp --dport 22 -j ACCEPT
-A INPUT -s 202.62.16.0/20 -p tcp -m tcp --dport 22 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 22 -j DROP
```

## Delete

Untuk menghapus rules, cek kembali penomoran berdasarkan command:

```
iptables -L -n --line-numbers
```

```
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  114.120.0.0/13       0.0.0.0/0            tcp dpt:22
2    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            source IP range 112.215.153.0-112.215.178.0 tcp dpt:22
3    ACCEPT     tcp  --  202.62.16.0/20       0.0.0.0/0            tcp dpt:22
4    DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22

Chain FORWARD (policy ACCEPT)
num  target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
num  target     prot opt source               destination
```

Lalu hapus rules chain berdasarkan nomor:

```
iptables -D INPUT 2
```

atau berdasarkan rules yang tadi dibuat diawal, hanya mengganti argument `-A` atau `-I` dengan `-D`, contoh:

```
iptables -D INPUT -p tcp -m tcp --dport 22 -j DROP
iptables -D INPUT -s 114.120.0.0/13 -p tcp -m tcp --dport 22 -j ACCEPT
iptables -D INPUT -s 202.62.16.0/20 -p tcp -m tcp --dport 22 -j ACCEPT
```

Cek kondisi terkini:

```
iptables -S
```

```
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
```

## Warning

Hati-hati bermain dengan iptables, jika tidak, malah kita bisa terkunci alias tidak bisa masuk ke server.

Untuk server yang menggunakan Provider DigitalOcean telah terdapat fitur web console. 

Melalui web console, rules iptables tidak berlaku sehingga kita bisa menambah IP baru yang belum ditambahkan.

## Reference

https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-using-iptables-on-ubuntu-14-04

https://www.digitalocean.com/community/tutorials/how-to-list-and-delete-iptables-firewall-rules

https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-console-to-access-your-droplet

http://serverfault.com/questions/161401/how-to-allow-a-range-of-ips-with-iptables
