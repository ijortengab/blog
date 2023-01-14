---
title: Repository Pribadi - Tools
slug: /blog/2017/03/16/repository-pribadi-tools/
date: 2017-03-16
---

## Pendahuluan

Repository yang dimaksud dalam tulisan ini adalah tempat penyimpanan software.

Suatu ketika, saat sedang menggunakan PC orang lain, saya butuh akses ke server.

PC yang sedang saya gunakan tidak terdapat software [putty], maka saya mencari-cari software `putty` di internet.

[putty]: http://www.putty.org/

Lalu terlintas pikiran, kenapa tidak taruh saja di server dan diakses dengan cara cepat gak pake lama, misal: `ijortengab.id/putty.exe`. 

##  Requirements specification

Saya menganalisis kebutuhan akan repository ini: 

 1. Seluruh software berada pada link http://ijortengab.id/tools
 2. Terdapat shortcut untuk software tertentu, misal putty, maka cukup dengan mengetikkan http://ijortengab.id/putty.exe.

Dari kebutuhan diatas, maka mari kita ngoprek server.

## Kebutuhan Pertama

Domain `ijortengab.id` berada pada direktori root `/home/ijortengab/public_html`. Seluruh isi direktori ini akan dikosongkan dan digenerate file baru saat ada tulisan baru karena ini konsekuensi menggunakan software [static generator] Sculpin. Oleh karena itu bukan ide yang baik, jika membuat direktori `tools` didalam root.

[static generator]: https://www.staticgen.com/sculpin

Buat direktori repository software.
```
mkdir /home/ijortengab/tools
```


Edit configurasi nginx:

```
vi /etc/nginx/sites-available/ijortengab.id
```

Tambahkan kode berikut
```
location ^~/tools {
  root /home/ijortengab;
  try_files $uri $uri/ =404;
  autoindex on;
}
```

Konfigurasi diatas akan mengubah root jika request nya adalah http://ijortengab.id/tools.

Reload nginx dan test dengan wget. Hasilnya memuaskan.
```
wget ijortengab.id/tools -q -O -
```
```
<html>
<head><title>Index of /tools/</title></head>
<body bgcolor="white">
<h1>Index of /tools/</h1><hr><pre><a href="../">../</a>
</pre><hr></body>
</html>
```

## Kebutuhan Kedua

Download berbagai software yang dibutuhkan kedalam direktori `/tools/` kemudian buat symbolic link untuk mempermudah penamaan. Contohnya pada software `putty`:

```
ln -s putty-0.68-32bit-portable.exe putty.exe
```

Edit kembali nginx configuration dan buat shortcut untuk semua request yang berbau dot exe.


```
vi /etc/nginx/sites-available/ijortengab.id
```

Tambahkan kode berikut
```
location ~ ([^\/]+)\.exe$ {
  root /home/ijortengab;
  try_files /tools/$1.exe =404;
}
```

Arti kode diatas adalah apapun request yang berakhiran dot exe akan dicoba melihat file dot exe tersebut pada direktori `tools`, jika ada maka respond, jika tidak ada maka [404].

[404]: https://en.wikipedia.org/wiki/HTTP_404

Test dengan langsung lihat di browser, cekidot http://ijortengab.id/putty.exe. Hasilnya memuaskan, tertera pada gambar dibawah.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.593.png"></img>

## Finishing

Sebagai finishing, maka kita buat menu di template Sculpin untuk mengakses repository `/tools/` dan juga mengubah `robots.txt` untuk meng-ignore isi dari direktori `/tools/`.

```
Disallow: /tools/
```