---
title: Setup Wildcard Subdomain
# draft: true
---

## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Pendahuluan

Tulisan ini akan praktek membuat wildcard subdomain. Wildcard artinya karakter apa saja. Contoh:

```
*.example.com
```

Wildcard tersebut dapat menjadi kata apa saja. Contoh:

```
ijortengab.example.com
mailserver.example.com
vpnserver.example.com
```

## DNS Management

Setup wildcard Subdomain berada pada DNS Management. Tulisan ini akan menggunakan dua ISP untuk praktek wildcard subdomain.

DNS RumahWeb untuk digunakan pada domain `phonenumber.id`.

DNS DigitalOcean untuk digunakan pada domain `biography.id`.

## Siapkan server

VPS dibeli melalui DigitalOcean, didapat IP Publik (contoh): `1.2.3.4`.

Webserver menggunakan nginx.

```
apt-get install nginx
```

Tampilan default dari http://1.2.3.4 harusnya adalah halaman default dari nginx.

<img cloudinary="ijortengab.id/screenshot.728.png">

## phonenumber.id

Domain `phonenumber.id` akan menggunakan DNS dari RumahWeb. Login ke client area-nya RumahWeb.

Pastikan Nameserver mengarah ke RumahWeb.

<img cloudinary="ijortengab.id/screenshot.730.png" style="border:1px solid black;">

Manage DNS untuk domain `phonenumber.id`.

<img cloudinary="ijortengab.id/screenshot.729.png" style="border:1px solid black;">

Add new record dan create A Record untuk domain `phonenumber.id`.

<img cloudinary="ijortengab.id/screenshot.732.png" style="border:1px solid black;">

Add new record dan create A Record untuk domain `*. phonenumber.id`.

<img cloudinary="ijortengab.id/screenshot.731.png" style="border:1px solid black;">

Tunggu beberapa saat kemudian kunjungi `phonenumber.id` dan `apapun.phonenumber.id`. Kedua situs tersebut akan menampilkan hasil yang sama. Tampilan default bawaan nginx.

## biography.id

Domain `biography.id` akan menggunakan DNS dari DigitalOcean. Login ke client area-nya RumahWeb.

Pastikan Nameserver mengarah ke DigitalOcean.

<img cloudinary="ijortengab.id/screenshot.733.png" style="border:1px solid black;">

Login ke client area-nya RumahWeb. Masuk ke menu "Networking". Add a domain untuk `biography.id`.

<img cloudinary="ijortengab.id/screenshot.734.png" style="border:1px solid black;">

Create A record. Input Hostname adalah `@` yang berarti domain utama yang didaftarkan.

<img cloudinary="ijortengab.id/screenshot.735.png" style="border:1px solid black;">

Create A record. Input Hostname adalah `*` yang berarti subdomain wildcard yang didaftarkan.

<img cloudinary="ijortengab.id/screenshot.736.png" style="border:1px solid black;">

Tunggu beberapa saat kemudian kunjungi `biography.id` dan `apapun.biography.id`. Kedua situs tersebut akan menampilkan hasil yang sama. Tampilan default bawaan nginx.
