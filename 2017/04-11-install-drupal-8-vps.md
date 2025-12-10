# Instalasi Drupal 8 di Virtual Private Server

---
# draft: true
---

## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Configuration Management

Drupal 8 hadir membawa berbagai *initiative* baru. Salah satunya adalah fitur [Configuration Management][d8cm].

Segala variable konfigurasi tidak disimpan kedalam database, melainkan sebagai plain text dengan format `yaml`. Namun isi dari plain text tersebut dicache kedalam database untuk peningkatan performa. Configuration ini nanti dapat ditukar antar environtment website.

[d8cm]: https://www.drupal.org/docs/8/configuration-management/managing-your-sites-configuration

Dari beberapa opsi environtment, diantaranya:

 - development, production,
 - development, staging, production,
 - local, development, staging, production,

tulisan ini akan menggunakan pilihan pertama, yakni `development` dan `production`.

Drupal terdapat fitur multisite, satu script Drupal untuk menge-host banyak website. Fitur ini tidak disarankan digunakan untuk website antar environtment (production dan development). Perlu dipisah script antara environtment development dan production. Sampai suatu saat kita perlu mengupgrade script Drupal di development, maka akan tidak berdampak ke production.

## Domain

 - Production berada pada URL `https://juragan.web.id`
 - Development berada pada URL `https://devel.juragan.web.id`

Setup web server untuk domain <https://juragan.web.id> diatas dapat dilihat pada [pembahasan sebelumnya]. Sementara untuk domain <https://devel.juragan.web.id> juga [telah dibahas] sebelumnya.



## Software

 - Ubuntu 16.04 sebagai sistem operasi.
 - NginX sebagai web server.
 - MySQL sebagai database.

Install database MySQL. Akan muncul dialog untuk input password root.

```
apt-get install mysql-server
```

Install software pelengkap lainnya.

```
apt-get install php-curl php-mysql php-gd php-mbstring php-xml
```


## Setup Database MySQL.

Generate password dengan `pwgen`.

```bash
pwgen -1s 12 | tee /root/passwd-juragan-mysql.txt
```

Sebagai contoh, output dari pwgen adalah `aabbccddeeff`.

Login ke database.

```
mysql -u root -p
```

List current user.

```no-highlight
mysql> select user from mysql.user;
+------------------+
| user             |
+------------------+
| debian-sys-maint |
| mysql.sys        |
| root             |
+------------------+
3 rows in set (0.00 sec)
```

List current database;

```no-highlight
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.02 sec)
```

Buat user.

```no-highlight
mysql> create user 'juragan'@'localhost' identified by 'aabbccddeeff';
Query OK, 0 rows affected (0.00 sec)
```

Buat database. Database production bernama `juragan`, dan database development bernama `juragan_devel`.

```no-highlight
mysql> create database if not exists `juragan`;
Query OK, 1 row affected (0.00 sec)
```
```no-highlight
mysql> create database if not exists `juragan_devel`;
Query OK, 1 row affected (0.00 sec)
```

Assign user ke database.

```
mysql> grant all privileges on `juragan`.* to 'juragan'@'localhost';
Query OK, 0 rows affected (0.00 sec)
```

Tiap database dengan prefix `juragan_`, maka otomatis akan ter-assign ke user `juragan`.

```
mysql> grant all privileges on `juragan\_%`.* to 'juragan'@'localhost';
Query OK, 0 rows affected (0.00 sec)
```

`localhost` pada query diatas dapat diganti dengan `%` yang berarti berlaku semua host.

## Download Drupal

Masuk ke home.

```
cd /home/juragan
```

Backup.

```bash
mv public_html public_html~
mv public_html_devel public_html_devel~
```

[Versi stable][drupal] terbaru April 2017 adalah 8.3.0, maka masukkan link berikut pada input dialog:

[drupal]: https://www.drupal.org/project/drupal

<https://ftp.drupal.org/files/projects/drupal-8.3.0.tar.gz>

```
read -p "Link Download: " -e LINK && wget $LINK && ls | grep drupal
```

atau

```
wget https://ftp.drupal.org/files/projects/drupal-8.3.0.tar.gz
```

Jika file yang didownload berakhiran .tar.gz, extract file tersebut.

```
find . -maxdepth 1 -type f -iname "drupal*.tar.gz" | xargs tar xvfz
```

atau

```
tar xvfz drupal-8.3.0.tar.gz
```

Rename directory hasil extract Drupal ke `public_html`.

```
read -p "Rename ke directory: " -i public_html -e DIR && find . -maxdepth 1 -type d -iname "drupal*" -exec sh -c 'mv $0 '$DIR {} \;
```

atau

```
mv drupal-8.3.0 public_html
```

Jika saat extract menggunakan user `root`, maka ubah kepemilikan file menjadi `juragan`.

```bash
chown juragan:juragan public_html -hR
```

Copy directory `public_html` ke `public_html_devel`.

```
read -p "Copy ke directory: " -i public_html_devel -e DIR && find . -maxdepth 1 -type d -iname "public_html" -exec sh -c 'cp -avrf $0 '$DIR {} \;
```
atau

```
cp -avrf public_html public_html_devel
```

Kemudian delete archive Drupal karena sudah di extract.

```
find . -maxdepth 1 -type f -iname drupal*.tar.gz | xargs rm
```

atau

```
rm drupal-8.3.0.tar.gz
```

## Instalasi Drupal

Untuk environtment production, kita akan instalasi melalui GUI (Graphic User Interface) melalui browser

Untuk environtment development, kita akan menggunakan instalasi dengan command line interface menggunakan [drush].

### Production

Untuk mengantisipasi timeout saat menggunakan browser, lakukan pengeditan sebagai berikut. Lokasi path file configuration disesuaikan dengan kondisi server sesuai [pembahasan sebelumnya].

File `/etc/php/7.0/fpm/php.ini`, edit:

```
max_execution_time = 300
memory_limit = 256M
```

File `/etc/php/7.0/fpm/pool.d/juragan.conf`, edit:

```
request_terminate_timeout = 300
```

File `/etc/nginx/sites-available/juragan.web.id`, edit:
```
server {
    ...
    server_name juragan.web.id;
    ...
    location ~ \.php$ {
        ...
        fastcgi_read_timeout 300;
        ...
    }
}
```

Restart php-fpm dan nginx.

```
nginx -s reload
service php7.0-fpm restart
```

Buka website via browser dan jalankan instalasi.

![screenshot.716.png](/images/screenshot.716.png)

![screenshot.717.png](/images/screenshot.717.png)

![screenshot.718.png](/images/screenshot.718.png)

### Development

Masuk ke direktori development.

```
cd /home/juragan/public_html_devel
```

Gunakan pola:

```
drush site-install [profile] --db-url='mysql://[db_user]:[db_pass]@localhost/[db_name]' --site-name=[Example]
```

Variable [profile] dapat diisi default `standard` atau `minimal`.

```
drush site-install standard --db-url='mysql://juragan:aabbccddeeff@localhost/juragan_devel' --site-name=JuraganDev
```

```
You are about to DROP all tables in your 'juragan_devel' database. Do you want to continue? (y/n): y
Starting Drupal installation. This takes a while. Consider using the --notify global option.         [ok]
Installation complete.  User name: admin  User password: gghhiijjkkll                                [ok]
Congratulations, you installed Drupal!                                                               [status]
```

Finish dan lihat di browser, website Drupal Development.

![screenshot.719.png](/images/screenshot.719.png)

## Nginx Configuration

Khusus Drupal perlu ada configuration khusus agar mendukung `clean URL` serta penguatan security.

Agar berlaku pada semua virtual host, configuration khusus Drupal kita buat terpisah untuk nantinya di-include kan didalam tiap virtual host.

```
cd /etc/nginx/snippets
vi drupal.conf
```

Isi dari `drupal.conf` adalah sebagai berikut:

```
location / {
    try_files $uri /index.php$is_args$args;
}
location = /favicon.ico {
    log_not_found off;
    access_log off;
}
location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
}
location ~* \.(txt|log)$ {
    allow 192.168.0.0/16;
    deny all;
}
location ~ \..*/.*\.php$ {
    return 403;
}
location ~ ^/sites/.*/private/ {
    return 403;
}
location ~* ^/.well-known/ {
    allow all;
}
location ~ (^|/)\. {
    return 403;
}
location @rewrite {
    rewrite ^/(.*)$ /index.php?q=$1;
}
location ~ /vendor/.*\.php$ {
    deny all;
    return 404;
}
location ~ ^/sites/.*/files/styles/ {
    try_files $uri @rewrite;
}
location ~ ^(/[a-z\-]+)?/system/files/ {
    try_files $uri /index.php?$query_string;
}
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires max;
    log_not_found off;
}
```

Masukkan snippet diatas kedalam configuration `juragan.web.id`.

```
vi /etc/nginx/sites-available/juragan.web.id
```

```
server {
    ...
    server_name juragan.web.id;
    ...
    include snippets/drupal.conf;
    ...
}
server {
    ...
    server_name devel.juragan.web.id;
    ...
    include snippets/drupal.conf;
    ...
}
```

Ubah PHP location dari:

```
location ~ \.php$ {
    ...
}
```

menjadi

```
location ~ \.php(/|$) {
    ...
}
```

untuk meghindari terjadinya error pada kasus `core/authorize.php/core/authorize.php` saat instalasi module melalui admin web interface.

Reload nginx.

```
nginx -s reload
```

## Finish

Selamat menikamati Drupal 8.

## Reference

[pembahasan sebelumnya]: /blog/2017/04/07/virtualhost-https/
[telah dibahas]: /blog/2017/04/08/self-signed-certificate-untuk-devel/
[composer]: /blog/2017/04/09/install-composer/
[drush]: /blog/2017/04/10/install-drush/

<http://stackoverflow.com/questions/1135245/how-to-get-a-list-of-mysql-user-accounts>

<https://dev.mysql.com/doc/refman/5.7/en/adding-users.html>

<https://www.nginx.com/resources/wiki/start/topics/recipes/drupal/>

<https://www.scalescale.com/tips/nginx/504-gateway-time-out-using-nginx/>

<https://www.drupal.org/documentation/install/developers>

<https://pantheon.io/blog/update-your-nginx-config-drupal-8>
