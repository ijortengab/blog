# Membuat service autostart Nginx dan PHP-FPM pada Cygwin di Mesin Windows 10

---
tags:
  - cygwin
  - nginx
  - php
---

## Pendahuluan

[Cygwin adalah](/blog/2017/01-28-windows-rasa-linux-cygwin-openssh-server.md) software yang memberikan fasilitas Linux pada Windows.

Instalasi Nginx dan PHP-FPM pada environment Linux umumnya sudah otomatis dengan service berupa daemon.

Lantas bagaimanakah membuat service otomatis start Nginx dan PHP-FPM menggunakan environment Cygwin?

## Install

Kunjungi website Cygwin (http://www.cygwin.com/) dan download file `setup-x86_64.exe`, kemudian jalankan.

![Screenshot.](/images/2021/screenshot.2021-03-01_23.22.57.jpg)

Pilih `nginx` dan `php` dengan cara mencari pada input pencarian. Lalu double click pada kolom `New` sehingga berubah dari `Skip` menjadi version terkini.

![Screenshot.](/images/2021/screenshot.2021-03-01_21.49.56.jpg)

Sebaiknya seluruh aplikasi `php` dan turunan-nya di-install agar tidak perlu mengulang setup.

![Screenshot.](/images/2021/screenshot.2021-03-01_21.50.42.jpg)

Next, dan selesaikan proses download dan instalasi.

![Screenshot.](/images/2021/screenshot.2021-03-01_21.56.24.jpg)

Tambahkan icon pada Desktop.

![Screenshot.](/images/2021/screenshot.2021-03-01_22.09.21.jpg)

## Setup Service Cygserver

Jalankan mintty dengan run as admin.

![Screenshot.](/images/2021/screenshot.2021-03-01_21.59.35.jpg)

Jalankan command `cygserver-config` jika belum pernah dijalankan sebelumnya.

```
cygserver-config
```

Output:

```
Generating /etc/cygserver.conf file

Warning: The following function requires administrator privileges!

Do you want to install cygserver as service?
(Say "no" if it's already installed as service) (yes/no) yes

The service has been installed under LocalSystem account.
To start it, call `net start cygserver' or `cygrunsrv -S cygserver'.

Further configuration options are available by editing the configuration
file /etc/cygserver.conf.  Please read the inline information in that
file carefully. The best option for the start is to just leave it alone.

Basic Cygserver configuration finished. Have fun!
```

![Screenshot.](/images/2021/screenshot.2021-03-01_22.15.35.jpg)

## Setup Service Nginx dan PHP-FPM

Pastikan file `nginx.exe` exists.

```
ls /usr/sbin/nginx.exe
```

Daftarkan service Nginx.

```
cygrunsrv --install nginx --path /usr/sbin/nginx.exe --disp "CYGWIN nginx" --termsig QUIT --shutdown --dep cygserver
```

Pastikan file `php-fpm.exe` dan file `php-fpm.conf` exists.

```
ls /usr/sbin/php-fpm.exe
ls /etc/php-fpm.conf
```

Daftarkan service PHP-FPM.

```
cygrunsrv --install php-fpm --path /usr/sbin/php-fpm.exe --args "--fpm-config /etc/php-fpm.conf --nodaemonize --allow-to-run-as-root" --disp "CYGWIN php-fpm" --termsig QUIT --shutdown --dep cygserver
```

Run, ketik `services.msc`, Enter.

![Screenshot.](/images/2021/screenshot.2021-03-01_23.10.33.jpg)

Verifikasi dengan melihat melalui Services.

![Screenshot.](/images/2021/screenshot.2021-03-01_23.10.19.jpg)

## Jalankan service

Run Cygserver.

```
net start cygserver
```

Output:

```
The CYGWIN cygserver service is starting.
The CYGWIN cygserver service was started successfully.
```

Nginx.

Test terlebih dahulu.

```
/usr/sbin/nginx.exe -t
```

Output:

```
nginx: [alert] could not open error log file: open() "/var/log/nginx/error.log" failed (2: No such file or directory)
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
2021/03/01 22:53:18 [emerg] 1792#0: mkdir() "/var/lib/nginx/tmp/client_body" failed (2: No such file or directory)
nginx: configuration file /etc/nginx/nginx.conf test failed
```

Resolve:

```
mkdir -p /var/log/nginx
mkdir -p /var/lib/nginx/tmp/
```

Retest.

```
/usr/sbin/nginx.exe -t
```

Output:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Run Nginx service.

```
net start nginx
```

Output:

```
The CYGWIN nginx service is starting.
The CYGWIN nginx service could not be started.

The service did not report an error.

More help is available by typing NET HELPMSG 3534.
```

Terlihat error, tetapi jika dilihat pada process, service Nginx sudah exists.

```
tasklist.exe | grep.exe nginx
```

![Screenshot.](/images/2021/screenshot.2021-03-01_23.08.37.jpg)

Run PHP-FPM service.

```
net start php-fpm
```

Output:

```
The CYGWIN php-fpm service is starting.
The CYGWIN php-fpm service was started successfully.
```

Verifikasi:

```
tasklist.exe | grep.exe php-fpm
```

![Screenshot.](/images/2021/screenshot.2021-03-01_23.39.04.jpg)

## Setup Virtual Host

Buat direktori untuk kebutuhan virtual host.

```
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled
```

Semua virtual host berada pada direktori sites-enabled, khas Debian.

Buat file `default` sebagai virtual host default.

```
touch /etc/nginx/sites-available/default
cd /etc/nginx/sites-enabled
ln -s ../sites-available/default default
```

Edit file `/etc/nginx/nginx.conf`.

```
vi /etc/nginx/nginx.conf
```

Tambahkan line berikut pada block `http`.

```
include /etc/nginx/sites-enabled/*;
```

Preview:

```
http {
    ...
    include /etc/nginx/sites-enabled/*;
    ...
}
```

Pindahkan semua block `server` ke file `/etc/nginx/sites-available/default`.

Pastikan location ke file php diarahkan ke PHP-FPM.

```
        location ~ \.php$ {
            root           html;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            # fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
```

Restart Nginx.

```
/usr/sbin/nginx.exe -t
/usr/sbin/nginx.exe -s reload
```

![Screenshot.](/images/2021/screenshot.2021-03-02_05.06.39.jpg)

Buat satu contoh file `.php`.

```
touch /usr/share/nginx/html/index.php
```

Isi dari file `.php` adalah sebagai berikut:

```
<?php
phpinfo();
?>
```

## Test

Test dengan membuka browser dan kunjungi `localhost/index.php`.

![Screenshot.](/images/2021/screenshot.2021-03-02_05.16.20.jpg)

Restart mesin Windows 10 untuk memastikan service autostart saat mesin dinyalakan.

```
shutdown -r -t 0
```

![Screenshot.](/images/2021/screenshot.2021-03-02_05.22.00.jpg)

Buka browser dan kunjungi kembali `localhost/index.php`.

## Reference

https://www.ronella.xyz/?p=105

https://github.com/devgrok/cygwin-scripts/blob/master/service/php-fpm

https://stackoverflow.com/questions/21377321/nginx-no-input-file-specified-php-fast-cgi
