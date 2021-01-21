---
title: Upgrade HTTP Client dari Source Code di mesin server Debian 6 - Part 1 Compiler
---

## Kesimpulan

Kita memiliki mesin server dengan sistem Operasi GNU/Linux distro Debian versi 6.

Distro Debian versi 6 (Squeeze) di-release pada tahun 2011 dan saat tulisan ini dibuat berarti sudah berumur 10 tahun.

Koneksi HTTPS ke `github.com` dan `packagist.org` gagal karena HTTP client (`wget`, dan `curl`) tidak mendukung TLS versi >= `1.2`.

Tulisan ini menjelaskan detail upgrade HTTP Client dari Source Code.

## Latar Belakang

Check versi Debian.

```
cat /etc/debian_version
```

Output:

```
root@debian6:~$ cat /etc/debian_version
6.0.10
```

Sebagian besar source aplikasi di-hosting di [Github](https://github.com/).

Sebagian besar library program berbahasa PHP di-hosting di [Packagist](https://packagist.org/).

Test koneksi ke Github dan Packagist.

```
wget --server-response --spider https://github.com/
wget --server-response --spider https://packagist.org/
curl -v https://packagist.org/
curl -v https://github.com/
```

Output:

```
root@debian6:~# wget --server-response --spider https://github.com/
Spider mode enabled. Check if remote file exists.
--2020-11-25 05:29:32--  https://github.com/
Resolving github.com... 192.30.255.112
Connecting to github.com|192.30.255.112|:443... connected.
OpenSSL: error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
Unable to establish SSL connection.
```

```
root@debian6:~# wget --server-response --spider https://packagist.org/
Spider mode enabled. Check if remote file exists.
--2020-11-25 05:29:06--  https://packagist.org/
Resolving packagist.org... 51.79.162.48, 2402:1f00:8001:73::
Connecting to packagist.org|51.79.162.48|:443... connected.
OpenSSL: error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
Unable to establish SSL connection.
```

```
root@debian6:~# curl -v https://packagist.org/
* About to connect() to packagist.org port 443 (#0)
*   Trying 51.79.162.48... connected
* Connected to packagist.org (51.79.162.48) port 443 (#0)
* successfully set certificate verify locations:
*   CAfile: none
  CApath: /etc/ssl/certs
* SSLv3, TLS handshake, Client hello (1):
* error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
* Closing connection #0
curl: (35) error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
```

```
root@debian6:~# curl -v https://github.com/
* About to connect() to github.com port 443 (#0)
*   Trying 192.30.255.112... connected
* Connected to github.com (192.30.255.112) port 443 (#0)
* successfully set certificate verify locations:
*   CAfile: none
  CApath: /etc/ssl/certs
* SSLv3, TLS handshake, Client hello (1):
* error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
* Closing connection #0
curl: (35) error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
```

Koneksi HTTPS gagal dan pesan error yang muncul sebagai berikut:

> OpenSSL: error:1407742E:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert protocol version
> Unable to establish SSL connection.

## Solusi

Koneksi HTTPS ke `github.com` dan `packagist.org` gagal karena HTTP client (`wget`, dan `curl`) tidak mendukung TLS versi >= `1.2`.

> As a result, GitHub is announcing the immediate deprecation, and eventual disablement, of our use of the following cryptographic standards:
>
> TLSv1/TLSv1.1 – This applies to all HTTPS connections, including web, API, and git connections to https://github.com and https://api.github.com.
> diffie-hellman-group1-sha1 – This applies to all SSH connections to github.com.
> diffie-hellman-group14-sha1 – This applies to all SSH connections to github.com.
> All of the above will be disabled on February 1, 2018.

Sumber: https://github.blog/2017-02-27-crypto-deprecation-notice/

> Adding --secure-protocol=TLSv1_2 to wget might help. If it errors about that not being a supported protocol type, then it means you need to update to wget version 1.16.1 or above.

Sumber: https://github.community/t/cant-communicate-with-remote-repo-due-to-ssl-issues-anyone-familiar-with-this/653/4

Kita perlu meng-upgrade berbagai HTTP client seperti `openssl`, `wget`, `curl`, dan `git` ke versi terbaru.

Upgrade dilakukan dengan cara compile dari Source Code, alih-alih menginstall versi binary dari package `.deb` terbaru yang terkendala dependency.

## Repository

Repository Debian versi 6 yang masih exists berada pada domain `archive.debian.org`.

Tutup semua repository yang ada pada file `/etc/apt/sources.list` dengan cara memberi comment mark (#) pada awal baris.

```
sed -i "s/^/#/g" /etc/apt/sources.list
```

Kita jadikan hanya domain `archive.debian.org` yang dijadikan sebagai repository.

```
echo 'deb http://archive.debian.org/debian squeeze main' >> /etc/apt/sources.list
echo 'deb http://archive.debian.org/debian squeeze-lts main' >> /etc/apt/sources.list
```

Update.

```
apt-get update
```

Output:

```
root@debian6:~# apt-get update
Get:1 http://archive.debian.org squeeze Release.gpg [1655 B]
Ign http://archive.debian.org/debian/ squeeze/main Translation-en
Get:2 http://archive.debian.org squeeze-lts Release.gpg [819 B]
Ign http://archive.debian.org/debian/ squeeze-lts/main Translation-en
Get:3 http://archive.debian.org squeeze Release [96.0 kB]
Ign http://archive.debian.org squeeze Release
Get:4 http://archive.debian.org squeeze-lts Release [34.3 kB]
Ign http://archive.debian.org squeeze-lts Release
Ign http://archive.debian.org squeeze/main amd64 Packages/DiffIndex
Ign http://archive.debian.org squeeze-lts/main amd64 Packages/DiffIndex
Hit http://archive.debian.org squeeze/main amd64 Packages
Hit http://archive.debian.org squeeze-lts/main amd64 Packages
Fetched 2476 B in 1s (1599 B/s)
Reading package lists... Done
W: GPG error: http://archive.debian.org squeeze Release: The following signatures were invalid: KEYEXPIRED 1520281423 KEYEXPIRED 1501892461
W: GPG error: http://archive.debian.org squeeze-lts Release: The following signatures were invalid: KEYEXPIRED 1587841717
```

## Compiler

Untuk meng-compile aplikasi dari Source, kita gunakan `gcc` (The GNU C Compiler).

Menginstall compiler `gcc` tidak harus versi terbaru sehingga kita bisa menginstall melalui repository.

```
apt-get install \
    build-essential \
    pkg-config \
    git-core \
    autoconf \
    bison \
    re2c \
    libltdl-dev \
    libbz2-dev \
    libpspell-dev \
    libreadline-dev
```

Muncul warning sebagai berikut:

> WARNING: The following packages cannot be authenticated!

Balas dialog dengan `yes`/`y` dengan asumsi koneksi ke repository berjalan normal tanpa *interception*.

Check version.

```
gcc --version
```

Output:

```
roji@lib:~$ gcc --version
gcc (Debian 4.4.5-8) 4.4.5
Copyright (C) 2010 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

## Referensi

https://www.websecurity.digicert.com/security-topics/what-is-ssl-tls-https

https://www.globalsign.com/en/blog/ssl-vs-tls-difference

https://midtrans.com/blog/time-to-upgrade-to-tls-version-1-2

