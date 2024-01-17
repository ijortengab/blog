---
title: Menginstall Gitlist di WSL2
tags:
  - gitlist
  - wsl2
---

## Pendahulan

Gitlist adalah web application untuk sekedar melihat repository git menggunakan
browser.

Repository bare tidak bisa di browse.

## Konvensi

Kita sepakati dimana source code web aplikasi berada pada path:

```
/usr/local/share/<project>/<version>/
```

**Direktori Repository**

Pada tulisan ini, user regular Linux yang akan digunakan adalah `ijortengab`.

Buat direktori `repositories`.

```
cd
mkdir -p repositories
```

## Prerequisites

**Setup DNS Local**

Kita jadikan host `gitlist.localhost` merujuk ke IP loopback `127.0.0.1`.

Setting DNS Local pada Windows Host.

Buka dialog RUN. Ketik:

```
notepad C:\Windows\System32\drivers\etc\hosts
```

Lalu tekan CTRL+SHIFT+ENTER agar run as admin. Notepad terbuka, lalu append
value berikut:

```
127.0.0.1 gitlist.localhost
```

**PHP-FPM & NGINX**

Masuk ke WSL2 sebagai root. Buka dialog RUN. Ketik:

```
wsl -u root
```

[Release](https://github.com/klaussilveira/gitlist/releases) terbaru gitlist
adalah versi `2.0.0` dimana membutuhkan PHP versi 8.1. Maka:

```
apt update
apt install nginx php8.1-fpm php8.1-cli
```

Kita set agar PHP-CLI menggunakan versi 8.1 juga.

```
update-alternatives --config php
```

Output:

```
There are 3 choices for the alternative php (providing /usr/bin/php).

  Selection    Path             Priority   Status
------------------------------------------------------------
  0            /usr/bin/php8.2   82        auto mode
  1            /usr/bin/php7.4   74        manual mode
  2            /usr/bin/php8.1   81        manual mode
* 3            /usr/bin/php8.2   82        manual mode

Press <enter> to keep the current choice[*], or type selection number: 2
update-alternatives: using /usr/bin/php8.1 to provide /usr/bin/php (php) in manual mode
```

**Node JS**

Pastikan command npm telah exists.

```
which npm
```

Jika tidak ada, maka:

```
cd
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Tambahkan pada current shell:

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Check npm terbaru.

```
nvm ls-remote
```

Install versi 20.

```
nvm install 20
```

**Setup PHP-FPM**

```
cd /etc/php/8.1/fpm/pool.d
vi ijortengab.conf
```

Content:

```
[ijortengab]
user = ijortengab
group = ijortengab
listen = /run/php/php8.1-fpm-ijortengab.sock
listen.owner = ijortengab
listen.group = ijortengab
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

Restart.

```
/etc/init.d/php8.1-fpm restart
```

## Install

**Download Gitlist**

```
mkdir -p /usr/local/share/gitlist/2.0.0/
cd       /usr/local/share/gitlist/2.0.0/
git clone https://github.com/klaussilveira/gitlist/ . # End line with dot
```

**Node JS**

Install.

```
cd /usr/local/share/gitlist/2.0.0/
npm install
```

Kemudian build. Proses akan berlangsung lama (5 menit).

```
cd /usr/local/share/gitlist/2.0.0/
npm run build
```

Output:

```
 DONE  Compiled successfully in 324479ms
```

**Chown**

User dari process PHP-FPM adalah `ijortengab`.

Change owner.

```
chown -R ijortengab:ijortengab /usr/local/share/gitlist/2.0.0/
```

Jalankan composer sebagai user `ijortengab`.

```
cd /usr/local/share/gitlist/2.0.0/
sudo -u ijortengab HOME=/home/ijortengab composer install
```

**Setup Nginx**

Masuk ke nginx.

```
cd /etc/nginx/sites-available/
vi gitlist.localhost
```

Content:

```
server {
    listen 80;
    listen [::]:80;
    server_name gitlist.localhost;
    root /usr/local/share/gitlist/2.0.0/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm-ijortengab.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Buat symlink, dan reload.

```
cd ../sites-enabled/
ln -sf ../sites-available/gitlist.localhost
nginx -s reload
```

**Setup Gitlist**

```
cd /usr/local/share/gitlist/2.0.0/
vi config/config.yml
```

Ubah value:

```
parameters:
  default_repository_dir: /home/ijortengab/repositories
```

## Test

Pastikan nginx dan PHP-FPM daemon berjalan.

```
/etc/init.d/nginx start
/etc/init.d/php8.1-fpm start
```

Cek pada browser.

[http://gitlist.localhost/](http://gitlist.localhost/)
