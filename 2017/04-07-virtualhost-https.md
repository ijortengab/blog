---
title: VirtualHost dan https
---

## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Pendahuluan

Sejak pemberlakuan warning oleh [Firefox] dan [Chrome] pada awal 2017, `https` menjadi keharusan terutama bagi website yang menggunakan CMS yang mempunyai form login.

Virtualhost yang selama ini berjalan diranah `http` bergegas menuju era `https`. Tulisan ini akan praktek menjadikan virtualhost menggunakan https.

Target tulisan ini adalah live-nya dua website `https` yang di-host dalam satu server (1 IP).

[Firefox]: https://support.mozilla.org/t5/Protect-your-privacy/Insecure-password-warning-in-Firefox/ta-p/27861
[Chrome]: https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html

## Persiapan

Server menggunakan VPS [DigitalOcean], IP yang didapat (contoh) `1.2.3.4`. Sistem Operasi Ubuntu 16.04 LTS.

Untuk implementasi virtualhost, maka setidaknya dibutuhkan dua domain. Domain yang digunakan adalah `ui.web.id` dan `juragan.web.id`. Keduanya didaftarkan menggunakan registrar [RumahWeb].

Certificate Authority menggunakan [GeoTrust]. Terdapat free trial certificate selama 30 hari. GeoTrust dipilih karena menduduki peringkat pertama dalam pencarian Google dengan query "free trial ssl". 

<img cloudinary="ijortengab.id/screenshot.703.png">

[RumahWeb]: https://www.rumahweb.com/
[DigitalOcean]: https://www.digitalocean.com/
[GeoTrust]: https://www.geotrust.com/

Berbeda dengan pembuatan sertifikat yang dibahas pada [tulisan sebelumnya]. Untuk keperluan virtualhost, kita menggunakan fitur Server Name Indication (SNI). 

> About SNI

> Although hosting several sites on a single virtual private server is not a challenge with the use of virtual hosts, providing separate SSL certificates for each site traditionally required separate IP addresses. The process has recently been simplified through the use of Server Name Indication (SNI), which sends a site visitor the certificate that matches the requested server name.
> 
> Note:
> 
> SNI can only be used for serving multiple SSL sites from your web server and is not likely to work at all on other daemons, such as mail servers, etc. There are also a small percentage of older web browsers that may still give certificate errors. Wikipedia has an updated list of software that does and does not support this TLS extension.

Sumber: <https://www.digitalocean.com/community/tutorials/how-to-set-up-multiple-ssl-certificates-on-one-ip-with-nginx-on-ubuntu-12-04> 

[tulisan sebelumnya]: /2017/03/12/dari-http-ke-https/

## Create A Record

Masuk ke DNS Management dari registrar RumahWeb. Arahkan `juragan.web.id` ke IP DigitalOcean `1.2.3.4`. Lakukan hal yang sama dengan domain `ui.web.id`.

<img cloudinary="ijortengab.id/screenshot.704.png" style="border:1px solid black;">

## Create User

Seperti webhosting pada umumnya (shared hosting), kita buat user terpisah untuk domain `juragan.web.id` dan `ui.web.id`. Web root untuk hosting kita buat pada direktori `public_html`.

Untuk kemudahan dan kecepatan instalasi, maka login sebagai `root` kemudian install password generator.

```
sudo su
apt-get install pwgen
```

Buat password untuk user `juragan` dan user `ui`. Kemudian create user.

```
pwgen -1s 12 | tee /root/passwd-juragan.txt
adduser juragan
pwgen -1s 12 | tee /root/passwd-ui.txt
adduser ui
```

## Create Web Server port 80

```
apt-get install nginx
```

### juragan.web.id

Kita buat virtual host untuk domain `juragan.web.id`.
 
```
cd /etc/nginx/sites-available
vi juragan.web.id
```

Edit file `juragan.web.id`.

```
server {
    listen 80;
    listen [::]:80;
    server_name juragan.web.id;
    root /home/juragan/public_html;
    index index.html;
}
```

Buat symbolic link pada `sites-enabled`.

```
cd /etc/nginx/sites-enabled/
ln -s ../sites-available/juragan.web.id juragan.web.id
```

Persiapkan direktori web root dan file index sementara.

```
mkdir /home/juragan/public_html
chown juragan:juragan /home/juragan/public_html
echo OK> /home/juragan/public_html/index.html
```

Reload nginx.

```
nginx -s reload
```

Test di browser untuk verifikasi bahwa website port 80 telah live.

```
wget juragan.web.id -q -O -
curl juragan.web.id
```

** Optional **

Untuk Common Gateway Interface (CGI) menggunakan pemrograman PHP, maka kita perlu instalasi php-fpm. 

```
apt-get install php-fpm
```

Buat PHP FPM khusus user `juragan`. Sesuaikan lokasi direktori PHP-FPM dengan versi PHP saat ini.


```
cd /etc/php/7.0/fpm/pool.d
```

Duplikat default configurasi.

```
cp www.conf juragan.conf
vi juragan.conf
```


Bersihkan seluruh kalimat comment pada file tersebut yang dicirikan dengan awalan `;`. Berdasarkan pola `:%s/pattern/replace/` maka gunakan command berikut `:%s/^;.*\n//`. Kemudian hapus duplikat blank line secara manual dengan command `dd`. Hasilnya adalah sebagai berikut:

```ini
[www]
user = www-data
group = www-data
listen = /run/php/php7.0-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

Edit pada *user*, *group*, dan *listen* sehingga menjadi seperti dibawah ini. Sertakan tambahan konfigurasi keamanan dengan memblock fungsi yang berbahaya.

```ini
[juragan]
user = juragan
group = juragan
listen = /run/php/php7.0-fpm-juragan.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
php_admin_value[disable_functions] = exec,passthru,shell_exec,system
php_admin_flag[allow_url_fopen] = off
```

Restart php-fpm.

```
/etc/init.d/php7.0-fpm restart
```

atau

```
service php7.0-fpm restart
```

Verifikasi dengan `ps`.

```
ps aux | grep php-fpm
```

Output jika verifikasi sukses.

```
juragan  24678  0.0  0.7 354320  7956 ?        S    13:07   0:00 php-fpm: pool juragan
juragan  24679  0.0  0.7 354320  7956 ?        S    13:07   0:00 php-fpm: pool juragan
```

Edit konfigurasi nginx pada file `juragan.web.id`.

```
vi /etc/nginx/sites-available/juragan.web.id
```

Ubah agar memproses file PHP sebagai user `juragan`.

Edit file `juragan.web.id`.

```
server {
    listen 80;
    listen [::]:80;
    server_name juragan.web.id;
    root /home/juragan/public_html;
    index index.php;
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.0-fpm-juragan.sock;
    }
}
```

Reload nginx.

```
nginx -s reload
```

Verifikasi dengan mengecek menggunakan browser.

```
cd /home/juragan/public_html
rm index.html
echo '<?php echo "OK\n";' > index.php
curl juragan.web.id
wget juragan.web.id -q -O -
```

### ui.web.id

Lakukan hal yang sama untuk domain `ui.web.id`.

Gunakan command `sed` untuk menduplikat konfigurasi. Contoh:

```
cd /etc/nginx/sites-available
cat juragan.web.id | sed 's/juragan/ui/g' > ui.web.id
```

```
cd /etc/php/7.0/fpm/pool.d
cat juragan.conf | sed 's/juragan/ui/g' > ui.conf
```

Restart nginx dan php-fpm untuk melihat perubahan.


## Create Certificate 

### juragan.web.id

Buat direktori khusus untuk menampung sertifikat.

```
mkdir -p /home/juragan/ssl
cd /home/juragan/ssl
```

Mulai membuat *private server key*. Akan muncul dialog untuk pembuatan passphrase. Contoh passphrase yang digunakan kali ini adalah `aabbccddeeff`. 

```
openssl genrsa -des3 -out server.key 2048
```

```
Generating RSA private key, 2048 bit long modulus
........................................++++++
.++++++
e is 65537 (0x10001)
Enter pass phrase for server.key: aabbccddeeff
Verifying - Enter pass phrase for server.key: aabbccddeeff
```

Lanjutkan dengan membuat CSR (certificate signing request). Certificate ini yang akan kita kirim untuk mendaftar ke GeoTrust.

Saat membuat CSR akan muncul dialog input. Pada pertanyaan `Common Name` wajib diisi dengan nama domain (`juragan.web.id`) dan pada alamat email wajib diisi email yang aktif.

```
openssl req -new -key server.key -out server.csr
```

```
Enter pass phrase for server.key: aabbccddeeff
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:ID
State or Province Name (full name) [Some-State]:DKI Jakarta
Locality Name (eg, city) []:Kota Jakarta
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Juragan Web ID
Organizational Unit Name (eg, section) []:IT Department
Common Name (e.g. server FQDN or YOUR name) []:juragan.web.id
Email Address []:user@example.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

Hapus passphrase untuk antisipasi jika terjadi reload nginx. 

Backup `key` yang lama.

```
mv server.key server.key~
```

Kemudian hapus passphrase.

```
openssl rsa -in server.key~ -out server.key
```

```
Enter pass phrase for server.key~: aabbccddeeff
writing RSA key
```

### ui.web.id

Ulangi proses untuk pembuatan certificate bagi domain `ui.web.id`.

```
mkdir -p /home/ui/ssl
cd /home/ui/ssl
openssl genrsa -des3 -out server.key 2048
openssl req -new -key server.key -out server.csr
```

```
Enter pass phrase for server.key: aabbccddeeff
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:ID
State or Province Name (full name) [Some-State]:DKI Jakarta
Locality Name (eg, city) []:Kota Jakarta
Organization Name (eg, company) [Internet Widgits Pty Ltd]:UI Web ID
Organizational Unit Name (eg, section) []:IT Department
Common Name (e.g. server FQDN or YOUR name) []:ui.web.id
Email Address []:user@example.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

```
cp server.key server.key~
openssl rsa -in server.key~ -out server.key
```

## Create GeoTrust Certificate


### juragan.web.id

Domain `juragan.web.id` akan didaftarkan terlebih dahulu. Cetak `csr` ke layar console.

```
cat /home/juragan/ssl/server.csr
```

Buka website Free SSL Certificate dari GeoTrust:

https://www.geotrust.com/ssl/free-ssl-certificate/

<img cloudinary="ijortengab.id/screenshot.656.png">

Tekan tombol Get Your Free Certificate Now!

Masuk ke halaman Formulir. Isi dengan lengkap.

<img cloudinary="ijortengab.id/screenshot.677.edited.png">

Masuk ke halaman informasi masa berlaku. Continue.

<img cloudinary="ijortengab.id/screenshot.679.edited.png">

Copy paste isi dari file `server.csr` kedalam textarea formulir. 

<img cloudinary="ijortengab.id/screenshot.681.edited.png">

Masuk ke halaman konfirmasi berdasarkan informasi `csr`. Continue.

<img cloudinary="ijortengab.id/screenshot.684.edited.png">

Isi formulir informasi contact person.

<img cloudinary="ijortengab.id/screenshot.686.edited.png">

Pilih alamat email tujuan untuk verifikasi domain. Opsi email level 1 adalah email berdasarkan `whois` nama domain. Opsi email level 2 adalah email net-admin dari domain yang bersangkutan. Saya memilih opsi email level pertama, karena mail server dari domain `juragan.web.id` belum ada.

<img cloudinary="ijortengab.id/screenshot.688.edited.png">

Masuk ke halaman order summary. Checklist pada pernyataan *agreement* dan Submit Order.

<img cloudinary="ijortengab.id/screenshot.691.edited.png">

Finish, sampai dihalaman terakhir. Catat atau screenshot nomor order untuk kebutuhan nantinya.

<img cloudinary="ijortengab.id/screenshot.695.png">

Cek email tujuan yang digunakan untuk verifikasi domain. Akan tiba email yang berisi link untuk masuk ke halaman konfirmasi.

<img cloudinary="ijortengab.id/screenshot.696.edited.png">

Follow link tersebut. Tiba dihalaman konfirmasi. Klik **I Approve**.

<img cloudinary="ijortengab.id/screenshot.698.edited.png">

Masuk ke halaman notifikasi sukses approval.

<img cloudinary="ijortengab.id/screenshot.701.png">

Terakhir kita cek email yang digunakan saat pendaftaran.

<img cloudinary="ijortengab.id/screenshot.702.edited.png">

Cek pada email yang berjudul **Your GeoTrust SSL Trial order has been completed**. Di dalam email tersebut terdapat kode sertifikat. Copy dan paste sebagai file di server.

```
cd /home/juragan/ssl
vi geotrust.crt
```

<img cloudinary="ijortengab.id/screenshot.705.edited.png">

Edit kembali konfigurasi nginx.

```
vi /etc/nginx/sites-available/juragan.web.id
```

Edit file `juragan.web.id` agar me-redirect seluruh port 80 ke port 443, serta menggunakan certificate yang didapat dari GeoTrust.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name juragan.web.id;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name juragan.web.id;
    root /home/juragan/public_html;
    index index.php;
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.0-fpm-juragan.sock;
    }
    ssl_certificate /home/juragan/ssl/geotrust.crt;
    ssl_certificate_key /home/juragan/ssl/server.key;
}
```

### ui.web.id

Lakukan proses yang sama untuk domain `ui.web.id`. Saya menghindari penggunaan email yang sama untuk mendaftar SSL maupun untuk email verifikasi domain.

## Finish

Test pada browser, maka domain https://juragan.web.id dan https://ui.web.id telah live dengan sukses.

<img cloudinary="ijortengab.id/screenshot.706.png">

<img cloudinary="ijortengab.id/screenshot.707.png">

Browser Firefox dapat dengan cepat memeriksa Certificate Authority cukup menge-klik icon gembok (secure) disamping URL pada Address Bar.

<img cloudinary="ijortengab.id/screenshot.708.png">

<img cloudinary="ijortengab.id/screenshot.709.png">


## Reference

<https://www.digitalocean.com/community/tutorials/how-to-set-up-multiple-ssl-certificates-on-one-ip-with-nginx-on-ubuntu-12-04>

<https://www.digitalocean.com/community/tutorials/how-to-host-multiple-websites-securely-with-nginx-and-php-fpm-on-ubuntu-14-04>

<http://askubuntu.com/questions/420981/how-do-i-save-terminal-output-to-a-file>

<http://www.linfo.org/vi/search.html>
