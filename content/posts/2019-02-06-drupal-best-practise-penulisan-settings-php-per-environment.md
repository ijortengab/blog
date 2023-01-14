---
title: Drupal - Best Practise penulisan settings.php per environment
slug: /blog/2019/02/06/drupal-best-practise-penulisan-settings-php-per-environment/
date: 2019-02-06
---

## Pendahuluan

File `settings.php` pada Drupal merupakan file yang terdapat informasi variable yang ditulis secara *hard coded*, biasanya variable `$conf` (Drupal 7) atau `$settings`  (Drupal 8) dan `$database` . Pada contoh kali ini kita akan men-split informasi settings.php menjadi tiga environment, yakni:

- localhost, alias laptop yakni tempat ngoprek code secara offline.
- development, atau staging yakni tempat hasil ngoprek code kita di-review oleh orang lain.
- production

Best Practise ini merupakan opini pribadi berdasarkan hasil pengamatan berbagai tulisan dan artikel. Spesifikasi yang digunakan pada tulisan ini adalah webserver `nginx` dan module `php-fpm`.

## Modifikasi file settings.php

Append value berikut pada file `settings.php`.

```php
if (file_exists(__DIR__ . '/settings.local.php')) {
  include __DIR__ . '/settings.local.php';
}
switch (getenv('ENVIRONMENT')) {
  case 'production':
    if (file_exists(__DIR__ . '/settings.production.php')) {
      include __DIR__ . '/settings.production.php';
    }
    break;
  case 'development':
    if (file_exists(__DIR__ . '/settings.development.php')) {
      include __DIR__ . '/settings.development.php';
    }
    break;
}
```

Pindahkan informasi variable `$database` dan informasi lainnya yang berbeda tiap `environment`. Biasanya termasuk:

- `$database`
- `$settings['file_private_path'] `
- `$conf['file_private_path'] `

Pada contoh diatas, maka kita membuat tiga file tambahan, yakni: `settings.local.php`, `settings.production.php`, `settings.development.php`.

File `settings.local.php` merujuk pada pada issue di [Drupal](https://www.drupal.org/project/drupal/issues/2226761#comment-8742451) quote by sun.
> Local settings _may_ be used for development purposes, but you can also use it to host e.g. server-specific settings in a multi-webhead setup. 


Sebagai contoh pada file `settings.local.php` pada Drupal 7, informasi sebagai berikut saya pindahkan dari file `settings.php`:

```php
<?php
$databases = array (
  'default' => 
  array (
    'default' => 
    array (
      'database' => 'systemix_database',
      'username' => 'systemix_username',
      'password' => 'systemix_password',
      'host' => 'localhost',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);
$conf['file_private_path'] = '/home/pajak/files';

```


## Modifikasi file .bashrc untuk PHP-CLI

Bagaimana caranya agar fungsi `getenv('ENVIRONMENT')` mengembalikan value sesuai mesin host pada php-cli?

Pada contoh kali ini, user Linux yang digunakan bernama `pajak` dan environment yang diset adalah `development`.

Eksekusi command sebagai berikut:

```
su pajak
export ENVIRONMENT="development"
```

Untuk otomatis eksekusi ketika mesin reboot, maka perlu append value pada file `.bashrc`.

```
echo 'export ENVIRONMENT="development"' >> ~/.bashrc
```

## Modifikasi file *.conf untuk PHP-FPM

Bagaimana caranya agar fungsi `getenv('ENVIRONMENT')` mengembalikan value sesuai mesin host pada php-fpm?

Lihat konfigurasi pada PHP-FPM. Sebagai contoh, file konfigurasi php-fpm berada pada lokasi `/etc/php/7.3/fpm/pool.d/pajak.conf`.

Lalu tambahkan value sebagai berikut:

```
env[ENVIRONMENT] = development
```

Restart php-fpm.

```
/etc/init.d/php7.3-fpm restart
```

## Test

Buat file sederhana `test.php` dengan value sebagai berikut:

```
<?php
echo getenv('ENVIRONMENT');
```

Eksekusi `test.php` melalui CLI dan browser. Harusnya ekekusi file tersebut mengembalikan value sesuai environment, yakni pada contoh kali ini adalah `development`.

## Finish

Dengan split diatas, maka `rsync` codebase Drupal dari localhost ke server development atau production bisa  menyertakan ketiga file settings tersebut. 

## Referensi
https://medium.com/@tomahock/passing-system-environment-variables-to-php-fpm-when-using-nginx-a70045370fad

Change all default settings and config to fast/safe production values.
https://www.drupal.org/project/drupal/issues/2226761