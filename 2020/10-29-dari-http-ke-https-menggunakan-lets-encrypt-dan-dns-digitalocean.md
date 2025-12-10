# Dari http ke https menggunakan Let's Encrypt dan DNS DigitalOcean


## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Pendahuluan

Pada awal tahun 2017, halaman web dengan protokol plain text HTTP yang mengandung input password dan kartu kredit diberi tanda "**Not Secure**" [oleh Browser Chrome][1].

[1]: https://developers.google.com/web/updates/2016/10/avoid-not-secure-warn

Pada tengah tahun 2018, seluruh halaman web HTTP diberi tanda "**Not Secure**" [oleh Browser Chrome][2] dan sekaligus memberi saran untuk pindah ke HTTPS menggunakan Certificate Authority Let's Encrypt yang mana Browser Chrome menjadi platinum sponsor.

[2]: https://blog.google/products/chrome/milestone-chrome-security-marking-http-not-secure/

Pada akhirnya, browser-browser populer (Edge, Opera, Firefox, Chrome) memberikan tanda "**Not Secure**" bagi website dengan koneksi HTTP.

*Flag* tidak aman tersebut juga akan muncul jika sertifikat SSL dari koneksi HTTPS bukan berasal dari *Certificate Authority* yang dipercaya oleh Browser.

Pada tulisan sebelumnya dibahas penggunaan Certificate Authority [Comodo][3] dan [GeoTrust][4].

[3]: https://ssl.comodo.com/
[4]: https://www.geotrust.com/

- [Dari http ke https](/blog/2017/03/12/dari-http-ke-https/)
- [VirtualHost dan https](/blog/2017/04/07/virtualhost-https/)

Tulisan kali ini kita akan praktek menggunakan layanan SSL gratis dari Certificate Authority [Let's Encrypt](https://letsencrypt.org/).

[Pada akhir tahun 2019][5] aplikasi certbot buatan Let'sEncrypt sudah selesai masa beta dan memasuki versi `1.0`.

[5]: https://www.eff.org/deeplinks/2019/12/certbot-leaves-beta-release-10

## Studi Kasus

Buatlah versi https dari domain berikut ini:

Website Utama

- http://systemix.id
- http://cloud.systemix.id
- http://cdn.systemix.id
- http://webmail.systemix.id

Website Client 1

- http://client1.systemix.id
- http://sso.client1.systemix.id
- http://finance.client1.systemix.id
- http://elearning.client1.systemix.id

Website Client 2

- http://client2.systemix.id
- http://sso.client2.systemix.id
- http://commerce.client2.systemix.id
- http://pos.client2.systemix.id
- http://finance.client2.systemix.id

## Tentang Wildcard Subdomain

Dikutip dari https://certbot.eff.org/glossary

> wildcard certificate
> a wildcard certificate is a certificate that includes one or more names starting with \*.. browsers will accept any label in place of the asterisk (\*). for example, a certificate for \*.example.com will be valid for www.example.com, mail.example.com, hello.example.com, and goodbye.example.com.

> however, a wildcard certificate including only the name \*.example.com will not be valid for example.com: the substituted label can not be empty. if you want the certificate to be valid for example.com, you also need to include example.com (i.e. without the \*. part) on the certificate.

> additionally, the asterisk can only be substituted by a single label and not by multiple labels. for example, the name hello.goodbye.example.com will not be covered by a certificate including only the name \*.example.com. it will be covered however, by \*.goodbye.example.com. note that a wildcard name can not contain multiple asterisks. for example, \*.\*.example.com is not valid.

Berdasarkan *quote* tersebut, maka kita perlu buat tiga sertifikat untuk studi kasus diatas, yakni:

- satu sertifikat untuk dua domain, yakni: systemix.id dan wildcard subdomain \*.systemix.id
- satu sertifikat untuk dua domain, yakni: client1.systemix.id dan wildcard subdomain \*.client1.systemix.id
- satu sertifikat untuk dua domain, yakni: client2.systemix.id dan wildcard subdomain \*.client2.systemix.id

## Persiapan

**Environment**

Untuk memasang sertifikat SSL dari Let's Encrypt, kita akan menggunakan environment sebagai berikut:

- Ubuntu 18.04 sebagai sistem operasi
- Nginx sebagai webserver yang me-listen port 80
- certbot, aplikasi client yang dibuat oleh Let's Encrypt.

**DNS Validation**

Domain `systemix.id` dihosting menggunakan VPS dari DigitalOcean, sebuah perusahaan IaaS (Infrastructure as a Service).

Name server untuk domain `systemix.id` juga menggunakan DNS dari DigitalOcean.

Untuk membuktikan bahwa domain `systemix.id` adalah benar milik kita, kita akan menggunakan auto validasi karena DigitalOcean menyediakan API untuk memodifikasi DNS.

API DNS DigitalOcean termasuk yang [disupport oleh certbot][6]. Untuk akses API, kita membutuhkan credential berupa token.

[6]: https://certbot.eff.org/docs/using.html#dns-plugins

Token dapat di-generate pada dashboard DigitalOcean pada menu Applications & API.

![Screenshot.](/images/screenshot.2020-10-28_3.jpg)

Pada saat generate token, tambahkan akses "write" pada scopes.

![Screenshot.](/images/screenshot.2020-10-28_5.jpg)

Jika hanya akses "read", maka saat auto validasi DNS akan gagal.

Simpan token sebagai file `.ini` dengan format sebagai berikut:

```ini
# DigitalOcean API credentials used by Certbot
dns_digitalocean_token = abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01
```

Sebagai contoh, credentials ini disimpan sebagai file dengan path `~/.secrets/certbot/digitalocean.ini`.

```sh
sudo su
mkdir -p ~/.secrets/certbot
touch ~/.secrets/certbot/digitalocean.ini
chmod 600 ~/.secrets/certbot/digitalocean.ini
cat > ~/.secrets/certbot/digitalocean.ini <<- 'EOM'
# DigitalOcean API credentials used by Certbot
dns_digitalocean_token = abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01
EOM
```

## Install Aplikasi

**certbot**

[Sejak April 2020][7] `certbot` diinstall menggunakan package manager `snap`.

[7]: https://community.letsencrypt.org/t/a-new-way-to-install-certbot-on-linux/120408

```
apt update
apt install snapd
```

> Ensure that your version of snapd is up to date

```
sudo snap install core; sudo snap refresh core
```

Output:

```
root@server:~# sudo snap install core; sudo snap refresh core
2020-10-28T09:20:18+07:00 INFO Waiting for automatic snapd restart...
core 16-2.47.1 from Canonical✓ installed
snap "core" has no updates available
```

Check versi `certbot` saat ini.

```
certbot --version
```

Output:

```
root@server:~# certbot --version
certbot 0.26.1
```

Hapus versi lama yang diinstall menggunakan `aptitude` (jika ada).

```
apt-get remove certbot
```

Install `certbot` menggunakan `snap`.

```
snap install --classic certbot
```

Output:

```
root@server:~# sudo snap install --classic certbot
certbot 1.9.0 from Certbot Project (certbot-eff✓) installed
```

Buat link untuk `certbot`.

```
ln -s /snap/bin/certbot /usr/bin/certbot
```

> Confirm plugin containment level.

```
snap set certbot trust-plugin-with-root=ok
```

Install plugin untuk auto validasi DNS DigitalOcean.

```
snap install certbot-dns-digitalocean
```

Output:

```
root@server:~# snap install certbot-dns-digitalocean
certbot-dns-digitalocean 1.9.0 from Certbot Project (certbot-eff✓) installed
```

## Konfigurasi nginx

Untuk domain `systemix.id` dan wildcard subdomain `*.systemix.id` pastikan sudah terdapat A Record pada DNS DigitalOcean.

![Screenshot.](/images/screenshot.2020-10-29_2.jpg)

**Website Utama**

Kita tentukan webroot, misalnya `/var/www/systemix.prod/web`.

Kita tentukan user yang berjalan pada webserver adalah user `systemix` alih-alih `www-data`.

```
mkdir -p /var/www/systemix.prod/web
echo "Hallo World!" > /var/www/systemix.prod/web/index.html
cd /var/www
chown -R systemix:systemix systemix.prod
```

Buat file `/etc/nginx/sites-available/systemix.id` dengan content sebagai berikut.

```
server {
    listen 80;
    listen [::]:80;
	root /var/www/systemix.prod/web;
	index index.html;
	server_name systemix.id *.systemix.id;
	location / {
		try_files $uri $uri/ =404;
	}
}
```

Buat link dan reload nginx.

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/systemix.id systemix.id
nginx -s reload
```

Test dengan browser.

```
root@server:~# wget -qO - systemix.id
Hallo World!
root@server:~# wget -qO - apapun.systemix.id
Hallo World!
root@server:~# wget -qO - wildcard.systemix.id
Hallo World!
```

**Website Client 1**

Kita tentukan webroot, misalnya `/var/www/client1.prod/web`.

Kita tentukan user yang berjalan pada webserver adalah user `client1` alih-alih `www-data`.

```
mkdir -p /var/www/client1.prod/web
echo "Hallo World! I am Client1" > /var/www/client1.prod/web/index.html
cd /var/www
chown -R client1:client1 client1.prod
```

Buat file `/etc/nginx/sites-available/client1.systemix.id` dengan content sebagai berikut.

```
server {
    listen 80;
    listen [::]:80;
	root /var/www/client1.prod/web;
	index index.html;
	server_name client1.systemix.id *.client1.systemix.id;
	location / {
		try_files $uri $uri/ =404;
	}
}
```

Buat link dan reload nginx.

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/client1.systemix.id client1.systemix.id
nginx -s reload
```

Test dengan browser.

```
root@server:~# wget -qO - client1.systemix.id
Hallo World! I am Client1
root@server:~# wget -qO - apapun.client1.systemix.id
Hallo World! I am Client1
root@server:~# wget -qO - wildcard.client1.systemix.id
Hallo World! I am Client1
```

**Website Client 2**

Kita tentukan webroot, misalnya `/var/www/client2.prod/web`.

Kita tentukan user yang berjalan pada webserver adalah user `client2` alih-alih `www-data`.

```
mkdir -p /var/www/client2.prod/web
echo "Hallo World! I am Client2" > /var/www/client2.prod/web/index.html
cd /var/www
chown -R client2:client2 client2.prod
```

Buat file `/etc/nginx/sites-available/client2.systemix.id` dengan content sebagai berikut.

```
server {
    listen 80;
    listen [::]:80;
	root /var/www/client2.prod/web;
	index index.html;
	server_name client2.systemix.id *.client2.systemix.id;
	location / {
		try_files $uri $uri/ =404;
	}
}
```

Buat link dan reload nginx.

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/client2.systemix.id client2.systemix.id
nginx -s reload
```

Test dengan browser.

```
root@server:~# wget -qO - client2.systemix.id
Hallo World! I am Client2
root@server:~# wget -qO - apapun.client2.systemix.id
Hallo World! I am Client2
root@server:~# wget -qO - wildcard.client2.systemix.id
Hallo World! I am Client2
```


## Eksekusi Certbot

Setelah dipastikan port 80 berjalan, kemudian kita pasang sertifikat SSL dengan menggunakan `certbot`.

**Website Utama**

```
certbot -i nginx \
   --dns-digitalocean \
   --dns-digitalocean-credentials ~/.secrets/certbot/digitalocean.ini \
   -d systemix.id \
   -d *.systemix.id
```

Output:

```
root@server:~# certbot -i nginx    --dns-digitalocean    --dns-digitalocean-credentials ~/.secrets/certbot/digitalocean.ini    -d systemix.id    -d *.systemix.id
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator dns-digitalocean, Installer nginx
Obtaining a new certificate
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/systemix.id

Which server blocks would you like to modify?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1:
2:
3: File: /etc/nginx/sites-enabled/systemix.id
Addresses: 443 ssl, [::]:80, 80, [::]:443 ssl
Names: *.systemix.id, systemix.id
HTTPS: Yes
4:
5:
6: File: /etc/nginx/sites-enabled/client1.systemix.id
Addresses: [::]:80, 80
Names: client1.systemix.id, *.client1.systemix.id
HTTPS: No
7:
8:
9: File: /etc/nginx/sites-enabled/client2.systemix.id
Addresses: [::]:80, 80
Names: client2.systemix.id, *.client2.systemix.id
HTTPS: No
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
```

Muncul dialog untuk update file konfigurasi nginx.
File konfigurasi `systemix.id` berada pada block server pada urutan nomor 3.
Dengan memilih nomor 3, maka akan ditambahkan konfigurasi nginx untuk informasi SSL.

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 3
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/systemix.id
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/systemix.id

Which server blocks would you like to modify?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1:
2:
3:
4:
5: File: /etc/nginx/sites-enabled/client1.systemix.id
Addresses: [::]:80, 80
Names: client1.systemix.id, *.client1.systemix.id
HTTPS: No
6:
7:
8: File: /etc/nginx/sites-enabled/systemix.id
Addresses: [::]:80, 80
Names: *.systemix.id, systemix.id
HTTPS: No
9: File: /etc/nginx/sites-enabled/client2.systemix.id
Addresses: [::]:80, 80
Names: client2.systemix.id, *.client2.systemix.id
HTTPS: No
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
```

Muncul dialog untuk update file konfigurasi nginx.
File konfigurasi `systemix.id` berada pada block server pada urutan nomor 8 berbeda urutan dengan pilihan sebelumnya.
Dengan memilih nomor 3, maka akan ditambahkan konfigurasi nginx untuk redirect port 80 ke port 443.

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 8
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/systemix.id

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://systemix.id and
https://*.systemix.id
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/systemix.id/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/systemix.id/privkey.pem
   Your cert will expire on 2021-01-28. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

root@server:~#
```

Pilihan auto konfigurasi tersebut akan mengubah content file `/etc/nginx/sites-available/systemix.id` menjadi:

```
server {
	root /var/www/systemix.prod/web;
	index index.html;
	server_name systemix.id *.systemix.id;
	location / {
		try_files $uri $uri/ =404;
	}
    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/systemix.id/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/systemix.id/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host ~ ^[^.]+\.systemix\.id$) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = systemix.id) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
	listen 80;
	listen [::]:80;
	server_name systemix.id *.systemix.id;
    return 404; # managed by Certbot
}
```

**Website Client 1**

```
certbot -i nginx \
   --dns-digitalocean \
   --dns-digitalocean-credentials ~/.secrets/certbot/digitalocean.ini \
   -d client1.systemix.id \
   -d *.client1.systemix.id
```

**Website Client 2**

```
certbot -i nginx \
   --dns-digitalocean \
   --dns-digitalocean-credentials ~/.secrets/certbot/digitalocean.ini \
   -d client2.systemix.id \
   -d *.client2.systemix.id
```

## Masalah dan Solusi

Setelah deploy SSL untuk https://client2.systemix.id, maka akses ke https://systemix.id terdapat error.

![Screenshot.](/images/screenshot.2020-10-30_1.jpg)

```
root@server:~# curl -L https://systemix.id -v
* Rebuilt URL to: https://systemix.id/
*   Trying 206.189.94.130...
* TCP_NODELAY set
* Connected to systemix.id (206.189.94.130) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS Unknown, Certificate Status (22):
* TLSv1.3 (IN), TLS handshake, Unknown (8):
* TLSv1.3 (IN), TLS Unknown, Certificate Status (22):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS Unknown, Certificate Status (22):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS Unknown, Certificate Status (22):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Client hello (1):
* TLSv1.3 (OUT), TLS Unknown, Certificate Status (22):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=client2.systemix.id
*  start date: Oct 30 02:49:40 2020 GMT
*  expire date: Jan 28 02:49:40 2021 GMT
*  subjectAltName does not match systemix.id
* SSL: no alternative certificate subject name matches target host name 'systemix.id'
* Closing connection 0
* TLSv1.3 (OUT), TLS Unknown, Unknown (21):
* TLSv1.3 (OUT), TLS alert, Client hello (1):
curl: (51) SSL: no alternative certificate subject name matches target host name 'systemix.id'
root@server:~#
```

Ternyata opsi auto konfigurasi ada yang nyasar, dimana File konfigurasi `systemix.id` terdapat perubahan informasi.

Sebelumnya:

```
ssl_certificate /etc/letsencrypt/live/client2.systemix.id/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/client2.systemix.id/privkey.pem; # managed by Certbot
```

Harus diedit manual sehingga kembali ke informasi semula, yakni:

```
ssl_certificate /etc/letsencrypt/live/systemix.id/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/systemix.id/privkey.pem; # managed by Certbot
```

Reload nginx.

```
nginx -s reload
```

Masalah selesai.

## Testing

```
root@server:~# curl https://systemix.id -L
Hallo World!
root@server:~# curl https://apapun.systemix.id -L
Hallo World!
root@server:~# curl https://wildcard.systemix.id -L
Hallo World!
root@server:~# curl https://client1.systemix.id -L
Hallo World! I am Client1
root@server:~# curl https://apapun.client1.systemix.id -L
Hallo World! I am Client1
root@server:~# curl https://wildcard.client1.systemix.id -L
Hallo World! I am Client1
root@server:~# curl https://client2.systemix.id -L
Hallo World! I am Client2
root@server:~# curl https://apapun.client2.systemix.id -L
Hallo World! I am Client2
root@server:~# curl https://wildcard.client2.systemix.id -L
Hallo World! I am Client2
root@server:~#
```

## Penutup

Mengubah transmisi data website dari protokol HTTP ke HTTPS sekarang menjadi
lebih mudah berkat Certificate Authority Let's Encrypt persembahan
EFF (Electronic Frontier Foundation).

## Reference

https://community.letsencrypt.org/t/how-to-stop-using-tls-sni-01-with-certbot/83210

https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx

https://certbot.eff.org/docs/using.html#dns-plugins

https://certbot-dns-digitalocean.readthedocs.io/

https://snapcraft.io/docs/installing-snapd

https://snapcraft.io/docs/installing-snap-on-ubuntu

https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms
