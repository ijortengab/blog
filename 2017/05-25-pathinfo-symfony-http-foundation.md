# Mendapatkan PathInfo dengan Symfony HTTP-Foundation


## Pendahuluan

Contoh URL dengan [PathInfo][1] (mode regular, diluar mode rewrite) ialah:

1. `http://localhost/script.php`**/argument/subargument?query=1&subquery=2**

2. `http://localhost/directory/subdirectory/script.php`**/argument/subargument?query=1&subquery=2**

Pada URL diatas, (dengan menggunakan bahasa PHP), kita bisa mendapatkan informasi PathInfo menggunakan code sebagai berikut:

```php
var_dump($_SERVER['PATH_INFO']);
```

Informasi diatas didapat setelah melakukan konfigurasi di [web server][2].

[1]: /blog/2017/05-23-definisi-pathinfo-pada-url.md
[2]: /blog/2017/05-24-nginx-pathinfo.md

## Permasalahan

URL pada contoh diatas, jika di *turn* ke mode rewrite menjadi sebagai berikut:

1. `http://localhost`**/argument/subargument?query=1&subquery=2**

2. `http://localhost/directory/subdirectory`**/argument/subargument?query=1&subquery=2**


Terdapat kendala karena informasi dari `$_SERVER['PATH_INFO']` adalah empty string.

## Solusi

Project [HTTP Foundation] bawaan Symfony Component menyediakan cara untuk mendapatkan informasi PathInfo dengan URL mode rewrite maupun non rewrite.

[HTTP Foundation]: http://symfony.com/components/HttpFoundation

Gunakan method `::getPathInfo()`. Contoh:

```php
use Symfony\Component\HttpFoundation\Request;
$request = Request::createFromGlobals();
$path_info = $request->getPathInfo();
```
