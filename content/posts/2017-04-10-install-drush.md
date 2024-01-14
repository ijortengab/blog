---
title: Install Drush
#draft: true
---

## Drush adalah

Drush adalah Drupal Shell. Tools untuk management Drupal via Command Line.

## Gerak Cepat

Pastikan di server sudah terinstall [Composer] dengan syntax yang ringkas `composer [argument]`. Setup sudah dibahas pada [tulisan sebelumnya].

[Composer]: https://getcomposer.org/
[tulisan sebelumnya]: /blog/2017/04/09/composer-adalah/

Buat direktori project untuk Drush di HOME.

```
cd
mkdir drush
cd drush
```

Download drush dan semua dependency-nya.

```
composer require drush/drush
```

Terakhir, buat shortcut di direktori `bin`.

```
cd ~/bin
ln -s ../drush/vendor/bin/drush drush
```

Pastikan bahwa direktori `bin` didalam HOME sudah terdaftar di variable PATH.

```
cat ~/.profile
cat ~/.bashrc
```

Jika folder `bin` didalam HOME belum tercipta, maka:

```
mkdir ~/bin
export PATH=$HOME/bin:$PATH
```

## Test Eksekusi

```
which drush
drush version
```
