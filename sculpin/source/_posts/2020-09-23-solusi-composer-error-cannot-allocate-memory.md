---
title: Solusi Composer Error Cannot Allocate Memory
---

## Pendahuluan

Jika saat mengeksekusi command `composer` muncul error sebagai berikut:

```
ijortengab@server:/var/www/developer.web.id$ composer require drush/drush
Using version ^10.3 for drush/drush
./composer.json has been updated

Installation failed, reverting ./composer.json to its original content.
The following exception is caused by a lack of memory or swap, or not having swap configured
Check https://getcomposer.org/doc/articles/troubleshooting.md#proc-open-fork-failed-errors for details

PHP Warning:  proc_open(): fork failed - Cannot allocate memory in phar:///usr/local/bin/composer/vendor/symfony/console/Application.php on line 952

Warning: proc_open(): fork failed - Cannot allocate memory in phar:///usr/local/bin/composer/vendor/symfony/console/Application.php on line 952

  [ErrorException]
  proc_open(): fork failed - Cannot allocate memory

require [--dev] [--prefer-source] [--prefer-dist] [--fixed] [--no-progress] [--no-suggest] [--no-update] [--no-scripts] [--update-no-dev] [--update-with-dependencies] [--update-with-all-dependencies] [--ignore-platform-reqs] [--prefer-stable] [--prefer-lowest] [--sort-packages] [-o|--optimize-autoloader] [-a|--classmap-authoritative] [--apcu-autoloader] [--] [<packages>]...

```

Itu artinya server kita kehabisan memory untuk mengeksekusi `composer`.

## Gerak Cepat

Cek memory tersisa

```
$ free -m
              total        used        free      shared  buff/cache   available
Mem:            985         620          92          63         272         156
Swap:             0           0           0
```

Login sebagai root dan buat swap.

```
/bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
/sbin/mkswap /var/swap.1
/sbin/swapon /var/swap.1
```

Swap sebagai memory tambahan yang mengambil resource dari hard disk.
