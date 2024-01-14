---
title: Composer adalah
#draft: true
---

## Composer adalah

Composer adalah software untuk mempermudah download dependency suatu software yang menggunakan bahasa pemrograman PHP.

Composer adalah sebuah file dengan nama asli `composer.phar`.

Composer sejatinya adalah kumpulan file-file dengan bahasa pemrograman PHP yang di-bundle menjadi satu file berformat PHP Archive (phar).

Software yang didownload menggunakan Composer dapat menjadi aplikasi yang mandiri (project) atau menjadi bagian yang dibutuhkan dari sebuah software (library).

## Requirement

Composer agar dapat berjalan membutuhkan php-cli dan php-zip.

```
apt-get install php-cli php-zip
```

## Basic penggunaan

Sebagai sebuah file `php`, maka kita bisa mengeksekusi dengan cara *native* menggunakan command `php`.

```
php composer.phar [argument]
```

Syntax command diatas biasanya diringkas dengan cara menggunakan alias atau penempatan pada direktori yang terdaftar pada variable PATH sehingga mudah dieksekusi. Contoh:

```
composer [argument]
```

## Download Manual

Untuk mendownload file `composer.phar` secara manual yakni dengan mengunjungi link berikut:

<https://getcomposer.org/download/>

Lihat pada section Manual Download.

Download file `composer.phar` dari versi-versi yang tersedia.

Eksekusi dengan pola `php composer.phar [argument]`.

Contoh: `php composer.phar -V`.

## Download yang disarankan

Berikut ini adalah langkah setup Composer sehingga eksekusinya menggunakan syntax yang ringkas sebagaimana dijelaskan diatas.

### dengan akses root

Kita set agar Composer dapat diakses oleh semua user.

```
cd /usr/local/bin
wget getcomposer.org/installer
php installer
chmod a+x composer.phar
mv composer.phar composer
```

### tanpa akses root

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

Download.

```
cd ~/bin
wget getcomposer.org/installer
php installer
chmod u+x composer.phar
mv composer.phar composer
```

## Test Eksekusi

```
which composer
composer -V
```
