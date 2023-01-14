---
title: Konfigurasi Nginx Drupal yang berada di dalam subdirektori
slug: /blog/2018/01/31/konfigurasi-nginx-drupal-subdirektori/
date: 2018-01-31
---

## Pertanyaan

Bagaimanakah konfigurasi Nginx untuk website Drupal yang berada di dalam subdirektori?

## Gerak Cepat

Misalnya subdirektori bernama `v2`, sehingga alamat website kita seperti ini `http://localhost/v2`. Maka:

```
server {
        listen 80;
        listen [::]:80;
        root /home/ijortengab/public_html;
        index index.php index.html index.htm index.nginx-debian.html;
        server_name localhost;
        location / {
                try_files $uri $uri/ =404;
        }
        location ~ \.php(/|$) {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }
        location /v2 {
                try_files $uri /v2/index.php$is_args$args;
                # Semua PHP Code di balik subdirektori root Drupal adalah deny.
                location ~ /v2/.*/.*\.(php|inc|test|module|install|profile)$ {
                        deny all;
                }
                # Semua informasi txt adalah deny.
                location ~ /v2/.*\.(txt|info)$ {
                        deny all;
                }
                # Folder scripts hanya untuk CLI.
                location ~/v2/scripts {
                        deny all;
                }
        }
}
```