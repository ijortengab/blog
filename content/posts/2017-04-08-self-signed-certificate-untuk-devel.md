---
title: Self Signed Certificate untuk Website Development
# draft: true
---

## Pendahuluan

Tulisan ini terkait dengan [tulisan sebelumnya].

[tulisan sebelumnya]: /blog/2017/04/07/virtualhost-https/

Website `juragan.web.id` menggunakan protokol `https` dengan Certificate Authority dari GeoTrust. Untuk kebutuhan development, maka dibuatlah domain khusus untuk kebutuhan pengembangan dengan subdomain `devel.juragan.web.id`.

Website development ini juga perlu diamankan dengan `https` karena adanya form login. Namun karena target penggunanya adalah orang-orang tertentu, maka cukup kita gunakan `self signed certificate`.

Tampilan warning oleh Browser karena situs tidak dapat dipercaya nantinya dapat kita acuhkan.

## Gerak Cepat

Masuk kembali ke DNS Management-nya [RumahWeb]. Create Record CNAME untuk pembuatan subdomain `devel.juragan.web.id`. 

[RumahWeb]: https://www.rumahweb.com/

<img cloudinary="ijortengab.id/screenshot.655.png">

Masuk kembali ke direktori penampungan ssl.

```
cd /home/juragan/ssl
```

Didalam direktori, saat ini sudah tersedia `key` dan `csr` hasil generate oleh `openssl`, dan `crt` yang didapat dari GeoTrust.

```bash
# ls
geotrust.crt  server.csr  server.key  server.key~
```

File `server.key` dibuat dengan command berikut:

```
openssl genrsa -des3 -out server.key 2048
```

File `server.csr` dibuat dengan command berikut:

```
openssl req -new -key server.key -out server.csr
```

File `server.key` diupdate dengan command berikut:

```
mv server.key server.key~
openssl rsa -in server.key~ -out server.key
```

File `geotrust.crt` didapat dari [CA][1] [GeoTrust][2] melalui email.

[1]: https://en.wikipedia.org/wiki/Certificate_authority
[2]: https://www.geotrust.com/


Create certificate `server.crt` untuk penggunaan website `devel.juragan.web.id`.

```
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

Buat web root khusus untuk development serta file index.

```
mkdir -p /home/juragan/public_html_devel
chown juragan:juragan /home/juragan/public_html_devel
cd /home/juragan/public_html_devel
echo '<?php echo "OK\n";' > index.php
```

Edit kembali file konfigurasi nginx, dan tambahkan code untuk host `devel.juragan.web.id`. 

```
vi /etc/nginx/sites-available/juragan.web.id
```

Hasil akhir konfigurasi nginx setelah ditambahkan adalah:

```
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
server {
    listen 80;
    listen [::]:80;
    server_name devel.juragan.web.id;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name devel.juragan.web.id;
    root /home/juragan/public_html_devel;
    index index.php;
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;        
        fastcgi_pass unix:/run/php/php7.0-fpm-juragan.sock;
    }
    ssl_certificate /home/juragan/ssl/server.crt;
    ssl_certificate_key /home/juragan/ssl/server.key;
}
```

Reload nginx.

```
nginx -s reload
```

Test pada browser Firefox dan Chrome. Keduanya sama-sama memberikan warning bahwa Certificate Authority tidak mereka kenal. Resiko ditanggung penumpang. 

<img cloudinary="ijortengab.id/screenshot.712.png">

<img cloudinary="ijortengab.id/screenshot.713.png">

Karena pengguna website development terbatas hanya kepada developer dan orang-orang tertentu, maka kita lanjutkan mengunjungi website tersebut.

<img cloudinary="ijortengab.id/screenshot.714.png">

<img cloudinary="ijortengab.id/screenshot.715.png">


## Reference

<https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04>
