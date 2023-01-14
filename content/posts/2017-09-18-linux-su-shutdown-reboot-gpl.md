---
title: Linux - Switch User Root dan ShutDown/Reboot Gak Pake Lama
slug: /blog/2017/09/18/linux-su-shutdown-reboot-gpl/
date: 2017-09-18
---

## Pendahuluan

Command shutdown (power off) untuk semua Linux Distro adalah

```
init 0
```

Command reboot (restart) untuk semua Linux Distro adalah

```
init 6
```

Kedua command harus di-execute menggunakan user root (super user). 

Switch user ke `root` (`su`) atau execute `sudo` (super user do) memerlukan
input password.

Contoh di Ubuntu Server 16.04:

```
ijortengab@ubuntu:~$ sudo init 0
[sudo] password for ijortengab:
```

Contoh di Debian 9.1 yang belum terinstall `sudo`:

```
ijortengab@debian:~$ su
Password:
root@debian:/home/ijortengab# init 0
```

## Pertanyaan

Bagaimana caranya agar bisa switch user ke account `root` tanpa perlu input
password?

Adakah cara cepat untuk sekedar shutdown/reboot dari user reguler tanpa perlu
input password `root`?

## Gerak Cepat

Pastikan ssh client di Linux terinstal.

```
which ssh
```

Pastikan sudah bisa koneksi ssh [tanpa perlu input password][1].

Show `ijortengab` public key.

```
cat ~/.ssh/id_rsa.pub
```

Masuk sebagai user root dan input password.

Debian:

```
su
```

Ubuntu:

```
sudo su
```

Paket command cepat membuat file `authorized_keys` di user `root`.

```
cd ~ && mkdir -p .ssh && touch .ssh/authorized_keys && chmod 640 .ssh/authorized_keys && vi .ssh/authorized_keys
```

Text editor `vi` mengedit file `authorized_keys`.

Append value public key `ijortengab` pada file `authorized_keys` dan save.

Exit dari user `root`.

```
exit
```

Test ssh ke user root dari user `ijortengab`.

```
ijortengab@ubuntu:~$ ssh root@localhost 'echo 1'
The authenticity of host 'localhost (::1)' can't be established.
ECDSA key fingerprint is SHA256:aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuv.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'localhost' (ECDSA) to the list of known hosts.
1
ijortengab@ubuntu:~$
```

Pastikan sudah memberi nama shortcut untuk koneksi user `root` ke `localhost`
agar bisa koneksi [ssh gak pake lama][2]. Shortcut saya beri nama `rl`.

Edit file config:

```
vi ~/.ssh/config
```

Kemudian append value berikut:

```
Host rl
  HostName localhost
  User root
  #IdentityFile /path/to/private_key
```

Sekarang dari user reguler `ijortengab` kita bisa switch user ke account `root`
gak pake lama. Gunakan command sbb:

```
ssh rl
```

Dari user regular juga bisa execute command `root` melalui ssh untuk aktivitas
monitoring dan shutdown/reboot.

Command shutdown `ssh rl init 0`.

Command reboot `ssh rl init 6`.

## Penutup

Menginput password adalah pekerjaan yang membosankan terlebih jika password
ribet.

Sementara untuk aktifitas sehari-hari kita tidak disarankan menggunakan user
root.

Selamat ngoprek server.

[1]: /blog/2017/09/14/ssh-key-server-2/
[2]: /blog/2017/09/15/ssh-gpl/