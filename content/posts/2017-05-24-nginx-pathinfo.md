---
title: Konfigurasi NginX untuk mendapatkan PathInfo
---

## Skenario

Defini PathInfo telah dijelaskan pada [tulisan sebelumnya].

[tulisan sebelumnya]: /blog/2017/05/23/definisi-pathinfo-pada-url/

Contoh URL dengan PathInfo (mode regular, diluar mode rewrite) ialah:

1. `http://localhost/script.php`/argument/subargument?query=1&subquery=2

2. `http://localhost/directory/subdirectory/script.php`/argument/subargument?query=1&subquery=2

PathInfo pada kedua URL diatas adalah `/argument/subargument`.

Bagaimana caranya agar `script.php`, bisa mendapatkan informasi PathInfo tersebut?

## Konfigurasi Web Server

Untuk aplikasi yang menggunakan web server NginX, maka perlu konfigurasi khusus agar variable Super Global $_SERVER, memberikan informasi 'PATH INFO'.

Minimal configuration adalah sebagai berikut:

```nginx
server localhost;
root /home/ijortengab/public_html;
location / {
    try_files $uri /script.php$is_args$args;
}
location /directory/subdirectory {
    try_files $uri /directory/subdirectory/script.php$is_args$args;
}
# location ~ \.php$ {
location ~ ^(.+\.php)(.*)$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php7.0-fpm.sock;
}
```

Isi dari file `snippets/fastcgi-php.conf` adalah sebagai berikut:

```nginx
# regex to split $uri to $fastcgi_script_name and $fastcgi_path
fastcgi_split_path_info ^(.+\.php)(/.+)$;

# Check that the PHP script exists before passing it
try_files $fastcgi_script_name =404;

# Bypass the fact that try_files resets $fastcgi_path_info
# see: http://trac.nginx.org/nginx/ticket/321
set $path_info $fastcgi_path_info;
fastcgi_param PATH_INFO $path_info;

fastcgi_index script.php;
include fastcgi.conf;
```

Isi dari `fastcgi.conf` adalah sebagai berikut:

```nginx
fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;
fastcgi_param  REQUEST_SCHEME     $scheme;
fastcgi_param  HTTPS              $https if_not_empty;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP only, required if PHP was built with --enable-force-cgi-redirect
fastcgi_param  REDIRECT_STATUS    200;
```

**Catatan Penting**

Point penting pada konfigurasi diatas adalah:

 - Setelah `script.php` harus diikuti dengan penambahan variable  `$is_args$args`. Jika dilewati, maka informasi `$_SERVER['QUERY_STRING']` akan bernilai empty string.

 - Directive `location` untuk script `.php`, harus menggunakan regex yang sesuai agar menerima `PATH INFO`.
Syntax `location ~ \.php$` adalah SALAH.
Syntax `location ~ ^(.+\.php)(.*)$` adalah BENAR.

## Debug

Konfigurasi diatas memberikan informasi PathInfo didalam variable Super Global $_SERVER. 

Front Controller `script.php` bisa mendapatkannya melalui code berikut:

```php
var_dump($_SERVER['PATH_INFO']);
```

## Reference

<https://www.nginx.com/resources/wiki/start/topics/recipes/drupal/>

<http://symfony.com/doc/current/setup/web_server_configuration.html>

<https://stackoverflow.com/questions/12654521/why-is-nginx-is-ignoring-my-query-strings>
