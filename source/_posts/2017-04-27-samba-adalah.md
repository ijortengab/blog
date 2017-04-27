---
title: Samba - Solusi Coding Windows Linux
layout: post_ini
---


## Perubahan Style

Saat ini, komputer localhost menggunakan sistem operasi Windows (bawaan pabrik) sementara sistem operasi server menggunakan Linux. Server yang dimaksud adalah VPS (Virtual Private Server) yang semakin hari semakin murah. 

Selama ini *ngoprek* code (coding) dilakukan dimana file script berada di localhost, dan interpreter script juga berada dan berjalan di localhost.

Sekarang semua berganti dari localhost menjadi server yang terletak di awan (cloud) sehingga bisa diakses dimana-mana. 

## Explore File

Mengexplore file yang berada di server Linux dari localhost (Windows) secara GUI dapat menggunakan program SCP/FTP Client. 

Namun untuk keperluan *ngoprek code* sebaiknya explore file tetap menggunakan program client `explorer.exe` bawaan Windows agar tidak perlu program tambahan. Untuk itu perlu sedikit konfigurasi di sisi server Linux.

## Samba adalah

Samba adalah software yang menjembatani sharing files antara sistem operasi Linux dan Windows.

Windows menggunakan port 445 untuk sharing files. Oleh karena itu pastikan port 445 di server tidak digunakan.

```
netstat --listen -n | grep 445
```

### Install

```
apt-get install samba
```

Setelah samba terinstall, maka harusnya server dapat diakses melalui domain atau IP Address Public dengan syntax `\\domain` atau `\\1.2.3.4`.

Contoh masuk ke explorer.exe melalui Run:

<img cloudinary="ijortengab.id/screenshot.795.png">

`Explorer.exe` muncul dengan path `\\ijortengab.id`.

<img cloudinary="ijortengab.id/screenshot.796.png">

Saat ini belum ada direktori sharing. Masuk kembali ke server.

## Konfigurasi

Untuk menambah direktori sharing, perlu penambahan informasi pada file config.

Backup configurasi samba saat ini.

```
cp /etc/samba/smb.conf /etc/samba/smb.conf~
```

Edit file configurasi. Clean comment dengan syntax `:%s/^#.*\n//`.

```
vi /etc/samba/smb.conf
```

Default content:

```ini
[global]
   workgroup = WORKGROUP
   server string = %h server (Samba, Ubuntu)
;   wins server = w.x.y.z
   dns proxy = no
;   interfaces = 127.0.0.0/8 eth0
;   bind interfaces only = yes
   log file = /var/log/samba/log.%m
   max log size = 1000
   syslog = 0
   panic action = /usr/share/samba/panic-action %d
   server role = standalone server
   passdb backend = tdbsam
   obey pam restrictions = yes
   unix password sync = yes
   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .
   pam password change = yes
   map to guest = bad user
;   logon path = \\%N\profiles\%U
;   logon drive = H:
;   logon script = logon.cmd
;   add user script = /usr/sbin/adduser --quiet --disabled-password --gecos "" %u
;   add machine script  = /usr/sbin/useradd -g machines -c "%u machine account" -d /var/lib/samba -s /bin/false %u
;   add group script = /usr/sbin/addgroup --force-badname %g
;   include = /home/samba/etc/smb.conf.%m
;   idmap uid = 10000-20000
;   idmap gid = 10000-20000
;   template shell = /bin/bash
;   usershare max shares = 100
   usershare allow guests = yes

;[homes]
;   comment = Home Directories
;   browseable = no
;   read only = yes
;   create mask = 0700
;   directory mask = 0700
;   valid users = %S

;[netlogon]
;   comment = Network Logon Service
;   path = /home/samba/netlogon
;   guest ok = yes
;   read only = yes

;[profiles]
;   comment = Users profiles
;   path = /home/samba/profiles
;   guest ok = no
;   browseable = no
;   create mask = 0600
;   directory mask = 0700

[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = no
   read only = yes
   create mask = 0700

[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
;   write list = root, @lpadmin
```

Misalnya direktori dari repository [IjorTengab Tools][1] yakni `/home/ijortengab/tools` akan kita sharing.

[1]: /blog/2017/03/16/repository-pribadi-tools/

Tambahkan informasi berikut:

```ini
[Tools]
path = /home/ijortengab/tools
available = yes
valid users = ijortengab
read only = no
browsable = yes
public = yes
writable = yes
create mode = 0660
directory mode = 0770
```

Pada directive `valid users` memerlukan user Linux yang telah exists sebelumnya (dibuat dengan command `adduser`). Pisahkan dengan spasi jika lebih dari satu user.

Secara default, password untuk login user Linux ke dalam sistem berbeda dengan password untuk sharing files menggunakan Samba. Oleh karena itu, buat password baru untuk user `ijortengab`.

```no-highlight
root@server:~# smbpasswd -a ijortengab
New SMB password: ********
Retype new SMB password: ********
Added user ijortengab.
root@server:~#
```

Kemudian restart samba.

```
service smbd restart
```

Cek kembali path `\\ijortengab.id` melalui `explorer.exe`, maka akan muncul direktori sharing bernama `Tools`. 

<img cloudinary="ijortengab.id/screenshot.797.png">

Masuk kedalam direktori akan muncul popup untuk login, gunakan username Linux `ijortengab` dan password Samba-nya.

<img cloudinary="ijortengab.id/screenshot.798.png">

Explore file di Linux sekarang menjadi semudah explore file di Windows menggunakan Windows Explorer (`explorer.exe`).

<img cloudinary="ijortengab.id/screenshot.799.png">

## Reference

https://www.howtogeek.com/176471/how-to-share-files-between-windows-and-linux/

https://www.samba.org/samba/docs/using_samba/ch09.html
