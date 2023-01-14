---
title: Menambah Repository pada Linux Debian/Ubuntu
slug: /blog/2017/01/20/menambah-repository-debian-ubuntu/
date: 2017-01-20
---

## Muqaddimah

Tiap kali menginstall Ubuntu Server 16.04 LTS pada Virtual Machine, maka yang
saya lakukan segera adalah mengubah repository dari default menjadi repository
lokal Indonesia.

Berhubung saya dan "machine" saya berada di Jabodetabek, maka repository lokal
yang terdekat adalah http://kambing.ui.ac.id yang berlokasi di Depok,
Universitas Indonesia.

## Ubuntu 16.04

Amankan file lama.

```sh
sudo mv /etc/apt/sources.list /etc/apt/sources.list~
```

Buat file baru.

```sh
sudo vi /etc/apt/sources.list
```

Copas content dibawah ini dan save.

```sh
deb http://kambing.ui.ac.id/ubuntu/ xenial main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-updates main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-security main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-backports main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-proposed main restricted universe multiverse
```

Terakhir, update apt.

```sh
sudo apt-get update
```

## Ubuntu 14.04 LTS

Repository Ubuntu 14.04, maka gunakan source sbb:

```
deb http://kambing.ui.ac.id/ubuntu/ trusty main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ trusty-updates main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ trusty-security main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ trusty-backports main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ trusty-proposed main restricted universe multiverse
```

## Update

Update 2017 09 10 Ahad.

**Debian 7**

```
deb http://kambing.ui.ac.id/debian/ wheezy main contrib non-free
deb http://kambing.ui.ac.id/debian/ wheezy-updates main contrib non-free
deb http://kambing.ui.ac.id/debian-security/ wheezy/updates main contrib non-free
```

**Debian 9.1**

```
deb http://kambing.ui.ac.id/debian/ stretch main contrib non-free
deb http://kambing.ui.ac.id/debian/ stretch-updates main contrib non-free
deb http://kambing.ui.ac.id/debian-security stretch/updates main contrib non-free
```

## Credit

http://blog.antoniclianto.web.id/2012/05/daftar-repository-lokal-untuk-ubuntu.html

https://www.idroot.com/mengubah-repository-debian-ke-repository-local-indonesia