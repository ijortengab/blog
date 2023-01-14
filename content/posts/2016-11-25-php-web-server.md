---
title: Membuat web server dengan PHP-CLI
slug: /blog/2016/11/25/php-web-server/
date: 2016-11-25
---

Software web server populer adalah Apache dan Nginx.

PHP CLI ternyata bisa juga dijadikan web server. 

Saya baru tahu setelah baca dokumentasi Symfony tentang "Create your own PHP Framework".

## Gerak Cepat

Bikin web server dengan argument ```-S```. Current directory akan menjadi root.

```
mkdir ~/phpwebserver
cd ~/phpwebserver
echo "Halo Dunia" > index.html
sudo php -S 127.0.0.1:99
```

Buka terminal baru (atau gunakan screen) dan test web server tersebut.

```
curl 127.0.0.1:99
```

Server merespon dengan mengembalikan isi index.html:
```
Halo Dunia
```

## Kesimpulan

Membaca dokumentasi software ternyata bisa membawa pengetahuan lebih dari yang kita harapkan.

## Referensi

https://symfony.com/doc/current/create_framework/introduction.html