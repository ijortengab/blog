---
title: SSH Key untuk koneksi ke Server tanpa Password - 2
slug: /blog/2017/09/14/ssh-key-server-2/
date: 2017-09-14
---

## Pendahuluan

Pada [tulisan sebelumnya][3] telah dibahas koneksi ssh tanpa password
menggunakan pair public/private key dimana SSH Client adalah `Windows`.

Bagaimanakah jika SSH Client adalah `Linux`?

Mari bermain.

## Client

Client menggunakan Linux distro `Debian 9.1`. Username `ijortengab`. Hostname
`debian`.

Login langsung ke mesin dan gunakan terminal.

```shell
ijortengab@debian:~$
```

Perhatikan pada home direktori. Apakah telah terdapat file `~/.ssh/id_rsa`?

Jika telah ada, kita bisa menggunakan file tersebut dimana file private key
bernama `id_rsa` dan file public key bernama `id_rsa.pub`.

Jika tidak ada, atau ingin menggunakan pair private/public key yang lain, maka
lakukan cara sbb:

```shell
ssh-keygen -t rsa
```

atau

```shell
ssh-keygen -t rsa -b 4096
```

atau

```shell
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Output:

```shell
ijortengab@debian:~$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ijortengab/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ijortengab/.ssh/id_rsa.
Your public key has been saved in /home/ijortengab/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:n/aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz ijortengab@debian
The key's randomart image is:
+---[RSA 2048]----+
|     .+.o.       |
|    . oB.        |
|   . oo...       |
|. o o.+..        |
| o +.oo=S .      |
|  . +oo +o +     |
|     =o+. E o =  |
|   ..o.=.+ . * o |
|    =+=.. . o..  |
+----[SHA256]-----+
ijortengab@debian:~$
```

Jika output terdapat tambahan `Created directory` seperti dibawah ini:

```shell
Enter file in which to save the key (/home/ijortengab/.ssh/id_rsa):
Created directory '/home/ijortengab/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

Maka pastikan direkotri `.ssh` memiliki permission mode 0700 atau `rwx------`.

```shell
$ cd
$ ls -la | grep .ssh
drwx------ 2 ijortengab ijortengab 4.0K Sep 13 15:56 .ssh
```

## Server

Tugas berikutnya adalah kita menaruh public key pada server tujuan.

Server yang akan dituju terbagi menjadi 2.

1. [Server Linux][1] diwakili oleh `Ubuntu 16.04`
2. [Server Windows][2] yang telah terpasang `OpenSSH Server` menggunakan Cygwin

## Server Linux

Koneksi ke server untuk kali pertama.

```shell
ssh ijortengab@192.168.212.101
```

Muncul output berupa kofirmasi karena server mengirim public key-nya
yang belum dikenal sebelumnya.

```shell
The authenticity of host '192.168.212.101 (192.168.212.101)' can't be established.
ECDSA key fingerprint is SHA256:aaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbb.
Are you sure you want to continue connecting (yes/no)?
```

Untuk gerak cepat, kita bisa langsung konfirmasi `yes`. Namun untuk security,
kita perlu masuk ke server tujuan dan mengecek apakah benar public key yang
dikirim server adalah identik.

Login ke server tujuan langsung ke mesin. Kemudian cek finger print dari tipe
key ECDSA.

```shell
ijortengab@ubuntu:~$  find /etc -iname *ecdsa* 2>/dev/null
/etc/ssh/ssh_host_ecdsa_key
/etc/ssh/ssh_host_ecdsa_key.pub
ijortengab@ubuntu:~$ ssh-keygen -lf /etc/ssh/ssh_host_ecdsa_key.pub
256 SHA256:aaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbb root@ubuntu (ECDSA)
ijortengab@ubuntu:~$
```

Setelah diverifikasi dan hasil fingerprint identik, maka kita bisa melanjutkan.

```shell
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.212.101' (ECDSA) to the list of known hosts.
ijortengab@192.168.212.101's password:
```

Setelah masuk ke server tujuan melalui ssh, Create directory `.ssh` di home dan
file `authorized_keys` di dalam direktori `.ssh`. Kemudian tingkatkan security
melalui perubahan mode permission.

```shell
cd
mkdir -p .ssh
chmod 0700 .ssh
cd .ssh
touch authorized_keys
chmod 640 authorized_keys
```

Kemudian keluar dari server.

```shell
exit
```

Upload public key ke server tujuan.

```shell
ijortengab@debian:~$ cd
ijortengab@debian:~$ cat .ssh/id_rsa.pub | ssh ijortengab@192.168.212.101 'cat >> .ssh/authorized_keys'
ijortengab@192.168.212.101's password:
```

Finish. Selanjutnya kita bisa masuk ke server tanpa password.

```shell
ssh ijortengab@192.168.212.101
```

Output:

```shell
ijortengab@debian:~$ ssh ijortengab@192.168.212.101
Welcome to Ubuntu 16.04.3 LTS (GNU/Linux 4.4.0-87-generic x86_64
...
Last login: Wed Sep 13 17:11:45 2017 from 192.168.212.102
ijortengab@ubuntu:~$
```

## Server Windows Cygwin

Koneksi ke server untuk kali pertama.

```shell
ssh ijortengab@192.168.212.1
```

Muncul output berupa kofirmasi karena server mengirim public key-nya
yang belum dikenal sebelumnya.

```shell
The authenticity of host '192.168.212.1 (192.168.212.1)' can't be established.
ECDSA key fingerprint is SHA256:cccccccccccc/dddddddddddddddddddddddddddddd.
Are you sure you want to continue connecting (yes/no)?
```

Untuk gerak cepat, kita bisa langsung konfirmasi `yes`. Namun untuk security,
kita perlu masuk ke server tujuan dan mengecek apakah benar public key yang
dikirim server adalah identik.

Login ke server tujuan langsung ke mesin. Kemudian cek finger print dari tipe
key ECDSA.

```shell
ijortengab@X220-THINK ~
$ find /etc -iname *ecdsa* 2>/dev/null
/etc/ssh_host_ecdsa_key
/etc/ssh_host_ecdsa_key.pub

ijortengab@X220-THINK ~
$ ssh-keygen -lf /etc/ssh_host_ecdsa_key.pub
256 SHA256:cccccccccccc/dddddddddddddddddddddddddddddd X220@X220-THINK (ECDSA)
```

Setelah diverifikasi dan hasil fingerprint identik, maka kita bisa melanjutkan.

```shell
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.212.1' (ECDSA) to the list of known hosts.
ijortengab@192.168.212.1's password:
Last login: Wed Sep 13 18:49:04 2017 from ::1

ijortengab@X220-THINK ~
$
```

Setelah masuk ke server tujuan melalui ssh, Create directory `.ssh` di home dan
file `authorized_keys` di dalam direktori `.ssh`. Kemudian tingkatkan security
melalui perubahan mode permission.

```shell
cd
mkdir -p .ssh
chmod 0700 .ssh
cd .ssh
touch authorized_keys
chmod 640 authorized_keys
```

Kemudian keluar dari server.

```shell
exit
```

Upload public key ke server tujuan.

```shell
ijortengab@debian:~$ cd
ijortengab@debian:~$ cat .ssh/id_rsa.pub | ssh ijortengab@192.168.212.1 'cat >> .ssh/authorized_keys'
ijortengab@192.168.212.101's password:
```

Finish. Selanjutnya kita bisa masuk ke server tanpa password.

```shell
ssh ijortengab@192.168.212.1
```

Output:

```shell
ijortengab@debian:~$ ssh ijortengab@192.168.212.1
Last login: Wed Sep 13 18:57:16 2017 from 192.168.212.102

ijortengab@X220-THINK ~
$
```

## Troubleshooting

Jika lokasi private key tidak default `~/.ssh/id_rsa`, maka tambahkan argument 
`-i` saat memulai koneksi.

```shell
ssh ijortengab@192.168.212.1 -i /path/to/private_key
```

Jika muncul warning sbb:

```shell
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0640 for '/home/ijortengab/.ssh/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/home/ijortengab/.ssh/id_rsa": bad permissions
ijortengab@192.168.212.101's password:
```

maka ubah permission mode menjadi 0600.

```shell
$ cd
$ chmod 600 .ssh/id_rsa
```

## Reference

[1]: /blog/2017/08/25/vm-install-ubuntu-server-16-04/
[2]: /blog/2017/01/28/windows-rasa-linux-cygwin-openssh-server/
[3]: /blog/2017/04/14/ssh-key-server/

https://www.tecmint.com/ssh-passwordless-login-using-ssh-keygen-in-5-easy-steps/

https://serverfault.com/questions/690855/check-the-fingerprint-for-the-ecdsa-key-sent-by-the-remote-host
