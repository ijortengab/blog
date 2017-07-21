---
title: Membuat Repository Git Pribadi di Localhost
---

## Skenario

Sebuah server terdapat user `ijortengab` (selanjutnya disebut sebagai client) mempunyai project dengan `working directory` berlokasi di:

```
/home/ijortengab/project/production
```

Versioning System Control menggunakan git dengan repository localhost.

Untuk kebutuhan sederhana, kita hanya perlu repository pribadi di server kita sendiri. Mari membuatnya.

## Setup Git Server

Login sebagai root untuk mempermudah. Install Git dan buat user `git`.

```
sudo su
apt-get install git
adduser git
```

Login sebagai git dan persiapkan perlengkapan ssh.

```
su git
cd
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
```

Persiapkan repository untuk project user `ijortengab`.

```
cd
mkdir -p ijortengab/project-production.git
cd ijortengab/project-production.git
git init --bare
```

## Setup Git Client

Masuk kembali ke client:

```
su ijortengab
```

Masuk ke working directory:

```
cd /home/ijortengab/project/production
```

Initialize Git dan tambah informasi repository.

```
git init
git remote add origin git@localhost:ijortengab/project-production.git
```

Untuk verifikasi gunakan command:

```
git remote -v
```

Perbaikan alamat repository menggunakan command:

```
git remote set-url origin git@localhost:ijortengab/project-production.git
```

## Setup SSH Key

```
ssh-keygen -t rsa
```

Saat muncul dialog, kosongkan passphrase. 

Private Key berlokasi di `/home/ijortengab/.ssh/id_rsa` dan Public Key berlokasi di `/home/ijortengab/.ssh/id_rsa.pub`.

Oper Public Key ke user `git`.

```
cat /home/ijortengab/.ssh/id_rsa.pub | ssh git@localhost "cat >> ~/.ssh/authorized_keys"
```

## Test

Pastikan sudah daftar identitas diri ke Git.

```
git config --global user.email "mail@ijortengab.id"
git config --global user.name "IjorTengab"
```

Tambahkan semua file untuk di-tracking oleh Git. Commit dan Push.

```
cd /home/ijortengab/project/production
git add .
git commit -m "init"
git push origin master
```

Jika sukses, akan muncul informasi sbb:

```
Counting objects: n, done.
Writing objects: 100% (n/n), 223 bytes | 0 bytes/s, done.
Total n (delta 0), reused 0 (delta 0)
To git@localhost:ijortengab/project-production.git
 * [new branch]      master -> master
```
