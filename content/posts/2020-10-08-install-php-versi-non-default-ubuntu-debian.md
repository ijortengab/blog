---
title: Install PHP versi non default pada Server Ubuntu/Debian
slug: /blog/2020/10/08/install-php-versi-non-default-ubuntu-debian/
date: 2020-10-08
---

## Pendahuluan

Pada saat menginstall PHP menggunakan command `apt` pada mesin Ubuntu/Debian, versi yang diinstal adalah versi default.

Contoh pada mesin Ubuntu 18.04, PHP yang diinstall adalah versi 7.2.

## Pertanyaan 

Pada saat tulisan ini dibuat, versi terbaru dan stable dari PHP adalah versi 7.4.

Bagaimanakah menginstall PHP versi 7.4 di mesin Ubuntu 18.04.

## Gerak cepat

Persiapan.

```
sudo su
apt-get update
apt -y install software-properties-common
add-apt-repository ppa:ondrej/php
apt-get update
```

Install dengan menggunakan versi, yakni alih-alih `php`, gunakan `php7.4`.

```
apt-get install php7.4 php7.4-fpm php7.4-xml php7.4-zip php7.4-mbstring
apt-get install php7.4 php7.4-{fpm,xml,zip,mbstring}
```

## Referensi

https://launchpad.net/~ondrej/+archive/ubuntu/php