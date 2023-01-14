---
title: phpMyAdmin Resep Cepat Gak Pake Lama
slug: /blog/2017/03/10/phpmyadmin-resep-cepat/
date: 2017-03-10
---

## Requirements

```
apt-get install mysql-server php-mysql
```

## Gerak Cepat

Pindah direktori root web server.

```
cd /var/www/html
```

Versi stable terbaru Maret 2017 adalah 4.6.6, maka masukkan link berikut pada input dialog:

https://files.phpmyadmin.net/phpMyAdmin/4.6.6/phpMyAdmin-4.6.6-english.tar.gz

```
echo https://www.phpmyadmin.net/downloads/
read -p "Link Download: " -e LINK && wget $LINK && ls | grep phpMyAdmin
```

Jika file yang didownload berakhiran .tar.gz, extract file tersebut.

```
find . -maxdepth 1 -type f -iname phpmyadmin*.tar.gz | xargs tar xvfz
```

Kemudian delete karena sudah di extract.

```
find . -maxdepth 1 -type f -iname phpmyadmin*.tar.gz | xargs rm
```

Rename hasil extract-an dengan nama directory yang mudah diingat (misalnya `phpmyadmin`).

```
read -p "New Name: " -e NAME && find . -maxdepth 1 -type d -iname phpmyadmin* -exec sh -c 'mv "$0"'' '$NAME {} +
```

Finish.

## Reference

http://unix.stackexchange.com/questions/247924/how-do-i-pipe-ls-to-grep-and-delete-the-files-filtered-by-grep

https://superuser.com/questions/71041/find-all-files-on-server-with-777-permissions

http://unix.stackexchange.com/questions/144268/find-directories-and-files-with-permissions-other-than-775-664

http://stackoverflow.com/questions/4498061/linux-grep-write-output-in-to-a-file