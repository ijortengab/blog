---
title: Definisi PathInfo pada URL
---

## Front Controller dan Rewrite

[Front Controller][1] didalam pemrograman PHP adalah **satu** file script sebagai pintu masuk semua request. Biasanya file ini bernama `index.php`. Cara ini digunakan oleh banyak PHP Framework, misalnya [Drupal 8][3] dan [Symfony][4]. 

Argument yang diberikan ke front controller (melalui browser) dapat menggunakan PathInfo atau Query.

Drupal versi 5, 6, dan 7 menggunakan query untuk memberikan argument. Contoh:

```no-highlight
http://localhost/index.php?q=user/login

http://localhost/index.php?q=about-us
```

Sejak Drupal versi 8 yang berbasis Symfony, argument menggunakan PathInfo. Contoh:

```no-highlight
http://localhost/index.php/user/login

http://localhost/index.php/about-us
```

URL diatas akan lebih cantik jika menggunakan fitur *rewrite* sehingga menjadi seperti ini:

```no-highlight
http://localhost/user/login

http://localhost/about-us
```

Konfigurasi *rewrite* berada pada web server (Apache/Nginx).

## Definisi

Definisi PathInfo mengacu pada dokumentasi Symfony pada Project [HTTP Foundation][2] versi 2.8.18 didalam file `Request.php`.

Term yang terkait dengan PathInfo adalah BasePath dan BaseURL.

**PathInfo**

> Returns the path being requested relative to the executed script.
> The path info always starts with a /.
> The raw path (i.e. not urldecoded).

**BasePath**

> The root path from which this request is executed.
> The raw path (i.e. not urldecoded).

**BaseURL**

> The root URL from which this request is executed.
> The base URL never ends with a /.
> This is similar to BasePath, except that it also includes the script filename (e.g. index.php) if one exists.
> The raw path (i.e. not urldecoded).

## Contoh

URL berikut akan dijadikan contoh.

1. Front Controller tidak di dalam directory
2. Front Controller tidak di dalam directory dan mode rewrite
3. Front Controller di dalam directory
4. Front Controller di dalam directory dan mode rewrite

### Front Controller tidak di dalam directory

Contoh:

```no-highlight
http://localhost/script.php/argument/subargument?query=1&subquery=2
```

Maka:

```no-highlight
PathInfo = "/argument/subargument"
BasePath = ""
BaseUrl = "/script.php"
```

Debug:

```php
$_SERVER["HTTP_HOST"]       = "localhost";
$_SERVER["DOCUMENT_ROOT"]   = "/home/ijortengab/public_html";
$_SERVER["SCRIPT_FILENAME"] = "/home/ijortengab/public_html/script.php";
$_SERVER["QUERY_STRING"]    = "query=1&subquery=2";
$_SERVER["REQUEST_URI"]     = "/script.php/argument/subargument?query=1&subquery=2";
$_SERVER["SCRIPT_NAME"]     = "/script.php";
$_SERVER["PATH_INFO"]       = "/argument/subargument";
$_SERVER["PHP_SELF"]        = "/script.php/argument/subargument";
```

### Front Controller tidak di dalam directory dan mode rewrite

Contoh:

```no-highlight
http://localhost/argument/subargument?query=1&subquery=2
```

Maka:

```no-highlight
PathInfo = "/argument/subargument"
BasePath = ""
BaseUrl = ""
```

Debug:

```php
$_SERVER["HTTP_HOST"]       = "localhost";
$_SERVER["DOCUMENT_ROOT"]   = "/home/ijortengab/public_html";
$_SERVER["SCRIPT_FILENAME"] = "/home/ijortengab/public_html/script.php";
$_SERVER["QUERY_STRING"]    = "query=1&subquery=2";
$_SERVER["REQUEST_URI"]     = "/argument/subargument?query=1&subquery=2";
$_SERVER["SCRIPT_NAME"]     = "/script.php";
$_SERVER["PATH_INFO"]       = "";
$_SERVER["PHP_SELF"]        = "/script.php";
```

### Front Controller di dalam directory

Contoh:

```no-highlight
http://localhost/directory/subdirectory/script.php/argument/subargument?query=1&subquery=2
```

Maka:

```no-highlight
PathInfo = "/argument/subargument"
BasePath = "/directory/subdirectory"
BaseUrl = "/directory/subdirectory/script.php"
```

Debug:

```php
$_SERVER["HTTP_HOST"]       = "localhost";
$_SERVER["DOCUMENT_ROOT"]   = "/home/ijortengab/public_html";
$_SERVER["SCRIPT_FILENAME"] = "/home/ijortengab/public_html/directory/subdirectory/script.php";
$_SERVER["QUERY_STRING"]    = "query=1&subquery=2";
$_SERVER["REQUEST_URI"]     = "/directory/subdirectory/script.php/argument/subargument?query=1&subquery=2";
$_SERVER["SCRIPT_NAME"]     = "/directory/subdirectory/script.php";
$_SERVER["PATH_INFO"]       = "/argument/subargument";
$_SERVER["PHP_SELF"]        = "/directory/subdirectory/script.php/argument/subargument";
```

### Front Controller di dalam directory dan mode rewrite

Contoh:

```no-highlight
http://localhost/directory/subdirectory/argument/subargument?query=1&subquery=2
```

Maka:

```no-highlight
PathInfo = "/argument/subargument"
BasePath = "/directory/subdirectory"
BaseUrl = "/directory/subdirectory"
```

Debug:

```php
$_SERVER["HTTP_HOST"]       = "localhost";
$_SERVER["DOCUMENT_ROOT"]   = "/home/ijortengab/public_html";
$_SERVER["SCRIPT_FILENAME"] = "/home/ijortengab/public_html/directory/subdirectory/script.php";
$_SERVER["QUERY_STRING"]    = "query=1&subquery=2";
$_SERVER["REQUEST_URI"]     = "/directory/subdirectory/argument/subargument?query=1&subquery=2";
$_SERVER["SCRIPT_NAME"]     = "/directory/subdirectory/script.php";
$_SERVER["PATH_INFO"]       = "";
$_SERVER["PHP_SELF"]        = "/directory/subdirectory/script.php";
```

## References

<https://github.com/symfony/http-foundation/blob/master/Request.php>

[1]: https://en.wikipedia.org/wiki/Front_controller
[2]: http://symfony.com/components/HttpFoundation
[3]: https://www.drupal.com
[4]: https://symfony.com
