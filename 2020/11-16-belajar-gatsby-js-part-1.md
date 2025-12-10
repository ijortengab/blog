---
title: Belajar Gatsby.js - part 1 - Hello World Starter
---

## Pendahuluan

Gatsby adalah tools untuk generate website static dengan pendekatan SPA (Single Page Application).

Website static yang dimaksud adalah website yang mana webserver hanya men-deliver file static tanpa perlu [CGI](https://en.wikipedia.org/wiki/Common_Gateway_Interface) (Common Gateway Interface).

Output dari Gatsby adalah website yang sangat-sangat cepat dalam hal loading karena tidak lagi menggunakan request HTTP tradisional saat pergantian laman web (webpage).

## Requirement

Install dahulu Node.js di server seperti yang sudah dibahas pada [artikel sebelumnya][1].

[1]: /blog/2020/11/15/install-nodejs/

## Install Gatbsy CLI

Gunakan `npm` untuk menginstall Gatsby.

```
npm install -g gatsby-cli
```

Test.

```
gatsby --version
```

Output:

```
$ gatsby --version
Gatsby CLI version: 2.12.111
```

## Hello World Starter

Untuk keperluan ngoprek, kita buat direktori khusus di `~/gatsby`.

```
mkdir -p ~/gatsby
cd ~/gatsby
```

Kita akan membuat website Gatsby Starter yang mana hanya sekedar mengeluarkan output berupa kalimat sakti "Hello world!".

```
gatsby new hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world
cd hello-world
gatsby develop
```

Buka browser kunjungi mesin port 8000, maka sudah muncul halaman Hello world!

`http://localhost:8000`

![Screenshot.](/images/screenshot.2020-11-15_5.jpg)

Command `gatsby develop` diatas akan membuat webserver development pada port `8000` dan menjadikan terminal dalam keadaaan siaga untuk mendeteksi perubahan file source.

![Screenshot.](/images/screenshot.2020-11-15_6.jpg)

Buka terminal baru dan lakukan sedikit perubahan source menggunakan `vi`.

```
cd ~/gatsby
cd hello-world
vi src/pages/index.js
```

Isi dari file `src/pages/index.js` kita modifikasi. Kalimat "Hello world!" kita ganti menjadi "Halo dunia!".

```
import React from "react"

export default function Home() {
  return <div>Halo dunia!</div>
}
```

Simpan file tersebut.

Terminal yang siaga tadi akan *auto detect* perubahan file `index.js` dan kemudian melakukan generate website lagi.

Tanpa perlu melakukan refresh/reload, browser akan di-push perubahan oleh webserver development.

![Screenshot.](/images/screenshot.2020-11-15_7.jpg)

Stop webserver development dengan masuk kembali ke terminal siaga tadi lalu tekan tombol keyboard `Ctrl+c`.

Untuk membuat website versi production, build dengan perintah sbb:

```
gatsby build
```

Test website production menggunakan webserver Nginx pointing webroot ke direktori `public`.

Full path webroot pada contoh diatas adalah `/home/ijortengab/gatsby/hello-world/public`.

```
sudo su
vi /etc/nginx/sites-available/default
```

Isi dari file `/etc/nginx/sites-available/default`:

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /home/ijortengab/gatsby/hello-world/public;
    index index.html;
    server_name _;
    location / {
        try_files $uri $uri/ =404;
    }
}
```

Konfigurasi diatas adalah konfigurasi dasar untuk melihat file `index.html`.

Test dengan browser.

`http://localhost`

![Screenshot.](/images/screenshot.2020-11-15_8.jpg)

Website Gatsby Starter berhasil kita buat.

## Overview

Overview direktori Gatsby Starter.

```
cd ~/gatsby
cd hello-world
du -d 1 -h 2>/dev/null | sort -hr
```

Output:

```
376M    .
372M    ./node_modules
1.6M    ./.cache
1.0M    ./public
444K    ./.git
12K     ./src
8.0K    ./static
```

Kesimpulan: untuk membuat website sederhana "Hallo world!", diperlukan penyimpanan pada development environment setidaknya 370-an Megabyte.

Overview file-file yang digenerate di direktori `public`.

```
cd ~/gatsby
cd hello-world
find public
```

Output:

```
public
public/framework-aaaaaaaaaaaaaaaaaaaa.js
public/page-data
public/page-data/index
public/page-data/index/page-data.json
public/page-data/dev-404-page
public/page-data/app-data.json
public/framework-aaaaaaaaaaaaaaaaaaaa.js.map
public/webpack-runtime-bbbbbbbbbbbbbbbbbbbb.js.map
public/app-cccccccccccccccccccc.js
public/component---src-pages-index-js-dddddddddddddddddddd.js.map
public/app-cccccccccccccccccccc.js.map
public/chunk-map.json
public/webpack-runtime-bbbbbbbbbbbbbbbbbbbb.js
public/component---src-pages-index-js-dddddddddddddddddddd.js
public/favicon.ico
public/webpack.stats.json
public/polyfill-eeeeeeeeeeeeeeeeeeee.js
public/framework-aaaaaaaaaaaaaaaaaaaa.js.LICENSE.txt
public/static
public/polyfill-eeeeeeeeeeeeeeeeeeee.js.map
public/app-cccccccccccccccccccc.js.LICENSE.txt
public/index.html
```

Kesimpulan: file static tipe HTML hanya file bernama `index.html`, selebihnya adalah file javascript karena Gatsby adalah generator website static dengan pendekatan SPA (Single Page Application).

## Referensi

https://www.gatsbyjs.com/tutorial/

https://www.gatsbyjs.com/tutorial/part-zero/#using-the-gatsby-cli

https://www.gatsbyjs.com/tutorial/part-one/

https://www.gatsbyjs.com/docs/quick-start/
