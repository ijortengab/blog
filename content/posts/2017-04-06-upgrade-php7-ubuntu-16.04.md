---
title: Upgrade PHP 7 di Ubuntu 14.04
---

## Gerak cepat

Tambah repository

```
sudo su
apt-get install software-properties-common
add-apt-repository ppa:ondrej/php
apt-get update
```

Menginstall dengan hanya menggunakan `php` saja tanpa version akan menggunakan PHP versi terbaru (yakni 7.1 per April 2017). 

```
root@server:~# apt-get install php-mysql
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following extra packages will be installed:
  libssl1.0.2 php-common php7.1-common php7.1-mysql
The following NEW packages will be installed:
  libssl1.0.2 php-common php-mysql php7.1-common php7.1-mysql
0 upgraded, 5 newly installed, 0 to remove and 201 not upgraded.
Need to get 2,278 kB of archives.
After this operation, 8,891 kB of additional disk space will be used.
Do you want to continue? [Y/n]
```

Untuk menginstall PHP versi 7.0, maka sertakan dengan versinya saat install.

```
root@server:~# apt-get install php7.0-mysql
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following extra packages will be installed:
  libssl1.0.2 php-common php7.0-common
The following NEW packages will be installed:
  libssl1.0.2 php-common php7.0-common php7.0-mysql
0 upgraded, 4 newly installed, 0 to remove and 201 not upgraded.
Need to get 2,276 kB of archives.
After this operation, 8,874 kB of additional disk space will be used.
Do you want to continue? [Y/n]
```

## Reference

https://www.digitalocean.com/community/tutorials/how-to-upgrade-to-php-7-on-ubuntu-14-04
