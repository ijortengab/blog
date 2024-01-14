---
title: Install Drupal Console
---

## Pendahuluan

Drupal Console adalah teman akrab dari [Drush]. Keduanya memudahkan penggunaan Drupal melalui CLI (Command Line Interface).

[Drush]: /blog/2017/04/10/install-drush/

## Install 

Misalnya project drupal kita berada di direktori `~/public_html` untuk production dan `~/public_html_dev` untuk `development`. Maka:

```
cd ~/public_html
composer require drupal/console:~1.0 --prefer-dist --optimize-autoloader
```

dan

```
cd ~/public_html_dev
composer require drupal/console:~1.0 --prefer-dist --optimize-autoloader
```

Selesai, dan eksekusi command dapat dilakukan dengan cara:

```
./vendor/bin/drupal --version
```

Contoh command pada direktori `production`.

```
ijortengab@server:~$ cd public_html
ijortengab@server:~/public_html$ ./vendor/bin/drupal --version
Drupal Console version 1.0.0-rc17
ijortengab@server:~/public_html$ 
```

## Install Global Launcher

Kita dapat menggunakan alias atau set link pada direktori PATH untuk mempersingkat command. Misalnya:

```
alias drupal=~/public_html/vendor/bin/drupal
```

Namun alias diatas berlaku bagi drupal di direktori `production`. Bagaimana dengan direktori `development`?

Solusinya adalah gunakan Drupal Console Global Launcher.

### dengan akses root

```
cd /usr/local/bin
wget https://drupalconsole.com/installer -O drupal
chmod +x drupal
```

### tanpa akses root

Prepare (jika sebelumnya tidak ada).

```
mkdir ~/bin
export PATH=$HOME/bin:$PATH
```

Download.

```
cd ~/bin
wget https://drupalconsole.com/installer -O drupal
chmod +x drupal
```

## Test Eksekusi

```
which drupal
drupal --version
```

List command drupal console dapat dilihat dengan command:

```
cd ~/public_html
drupal list
cd ~/public_html_dev
drupal list
```

## References

<https://pantheon.io/drupal-8/introduction-drush-and-drupal-console>

<https://ffwagency.com/digital-strategies-blog/ten-things-you-need-know-about-drupal-console>

<http://enzolutions.com/articles/2015/01/25/what-is-drupal-console-for-me/>
