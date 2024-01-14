---
title: Nginx - mengubah tampilan (theming) directory index
---

## Pertanyaan

Bagaimanakah mengubah tampilan directory index dari web server Nginx?

URL berikut: `ijortengab.id/tools` adalah sebuah directory index.

Kondisi sebelum dan sesudah adalah sebagai berikut:

Sebelum:

![Screenshot.](image://ijortengab.id/2021/screenshot.2021-03-01_09.30.14.jpg)

Sesudah:

![Screenshot.](image://ijortengab.id/2021/screenshot.2021-03-01_11.24.21.jpg)

## Pendahuluan

Nginx bisa meng-index directory seperti tampilan pada aplikasi File Browser dengan menggunakan directive `autoindex` dengan value `on`.

Konfigurasi-nya adalah sebagai berikut:

```
server {
    ...
    server_name ijortengab.id;
    ...
    location /tools {
        ...
        index .--;
        autoindex on;
        ...
    }
    ...
}
```

Pada konfigurasi diatas, kita menambahkan directive `index`, agar memaksa block `location` tidak me-load `index` yang didefinisikan pada block parent (misalnya block `server`).

Kita perlu manual menambahkan `index` dengan file yang tidak pernah exists. Contoh pada tulisan ini adalah file bernama `.--`.

## Gerak Cepat

Tampilan default bawaan Nginx tersebut bisa diubah dengan sedikit tricky.

Pastikan Nginx di-build dengan menyertakan module addition.

```
nginx -V 2>&1 | grep -o -- --with-http_addition_module
```

Misalnya lokasi konfigurasi Nginx adalah di `/etc/nginx/nginx.conf`.

Kita akan membuat URL request `/nginx/theme` dimana point ke direktori `/etc/nginx/theme`.

Buat direktori `theme`.

```
mkdir -p /etc/nginx/theme
```

Buat file konfigurasi agar dapat di-include pada setiap block `server`.

```
touch /etc/nginx/theme/location.conf
```

Isi dari file `/etc/nginx/theme/location.conf` adalah sebagai berikut:

```
location ^~ /nginx/theme {
    root /etc;
    location ~* \.conf$ {
        deny all;
    }
}
```

Kita akan menggunakan theme dari water-css (https://watercss.kognise.dev/)

Buat direktori theme `water-css`.

```
mkdir -p /etc/nginx/theme/water-css
```

Tambahkan file additional pada theme ini.

```
cd /etc/nginx/theme/water-css
touch addition.conf
touch before.txt
touch after.txt
```

Isi dari file `/etc/nginx/theme/water-css/addition.conf` adalah sebagai berikut:

```
add_before_body     "/nginx/theme/water-css/before.txt";
add_after_body      "/nginx/theme/water-css/after.txt";
```

Isi dari file `/etc/nginx/theme/water-css/before.txt` adalah sebagai berikut:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Directory Listing</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/water.css@2/out/water.min.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
    <link rel="stylesheet" href="/nginx/theme/water-css/css/link-icons.css">
    <link rel="stylesheet" href="/nginx/theme/water-css/css/style.css">
</head>
<body>
    <div id="title">
        <span>Directory Listing</span>
        <span class="stats" id='file-stats'></span>
        <span class="stats" id='dir-stats'></span>
    </div>
    <div id='listing'>
```

Isi dari file `/etc/nginx/theme/water-css/after.txt` adalah sebagai berikut:

```
    </div><!-- #listing -->
    <script type="text/javascript" src="/nginx/theme/water-css/js/script.js"></script>
</body>
</html>
```

Buat direktori `css` dan `js`.

```
mkdir -p /etc/nginx/theme/water-css/css
mkdir -p /etc/nginx/theme/water-css/js
```

Untuk asset file .css dan .js, kita download dari repository `ijortengab.id/log`.

```
cd /etc/nginx/theme/water-css/css
wget ijortengab.id/log/water-css/v1/etc/nginx/theme/water-css/css/style.css
wget ijortengab.id/log/water-css/v1/etc/nginx/theme/water-css/css/link-icons.css
cd /etc/nginx/theme/water-css/js
wget ijortengab.id/log/water-css/v1/etc/nginx/theme/water-css/js/script.js
```

Preview.

```
cd /etc/nginx/theme
find
```

Output:

```
.
./location.conf
./water-css
./water-css/js
./water-css/js/script.js
./water-css/before.txt
./water-css/addition.conf
./water-css/after.txt
./water-css/css
./water-css/css/style.css
./water-css/css/link-icons.css
```

## Edit file konfigurasi virtual host

Pada block `server` virtual host domain `ijortengab.id`, tambahkan directive `include` sebagai berikut:

```
server {
    ...
    server_name ijortengab.id;
    ...
    # Theming.
    include theme/location.conf;
    ...
}
```

Terakhir, pada block `location` untuk query `tools`, tambahkan directive `include` sebagai berikut:

```
location /tools {
    ...
    index .--;
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
    # Theming.
    include theme/water-css/addition.conf;
    ...
}
```

Restart nginx dan tampilan direktori akan berubah.

```
nginx -s reload
```

## Reference

https://abhij.it/code/nginx-autoindex-styling/

https://www.linickx.com/css-styling-nginx-directory-listings

https://gschoppe.com/uncategorized/add-auto-sensing-file-type-icons-to-lists-of-downloads-with-fontawesome-and-css/

https://watercss.kognise.dev/

https://github.com/kognise/water.css

https://serverfault.com/questions/940276/force-nginx-to-always-autoindex-and-ignore-index-html-files
