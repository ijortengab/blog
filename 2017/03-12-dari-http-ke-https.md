# Dari http ke https


## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi. 

## Pendahuluan

Jika menggunakan http, maka kita sebagai pengelola jaringan (misalnya sebagai penyedia VPN server) bisa dengan mudah mengintip lalu linta data (request dan respond) menggunakan command `tcpdump port 80`.  Field password pun bisa diintip dengan mudah (meski ribet juga realitanya). Oleh karena itu, baik [Firefox][1] maupun [Chrome][2], sama-sama sepakat untuk memberi warning **not secure** kepada pengguna jika ada field password pada website yang berjalan pada port 80 (http).

[1]: https://support.mozilla.org/t5/Protect-your-privacy/Insecure-password-warning-in-Firefox/ta-p/27861
[2]: https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html

Tulisan ini akan membahas pengalaman pribadi untuk hijrah dari `http` ke `https`.

## Persiapan

Berikut ini environtment yang digunakan:

 - Server menggunakan VPS dari [Connectindo][5]
 - OS Ubuntu versi 16.04 LTS
 - Webserver menggunakan nginx
 - Domain menggunakan nama `systemix.id` dari registrar [Rumahweb][6]
 - [Certificate Authority][3] menggunakan [Comodo Inc][7].

Connectindo dipilih karena ada promo diskon 50% (saat tulisan ini dibuat).

Rumahweb dipilih karena ada promo domain dot id hanya Rp50.000 dari harga semula Rp250.000 (saat tulisan ini dibuat).

Comodo, Inc dipilih karena terdapat opsi [free trial][4] selama 90 hari. 

[3]: https://en.wikipedia.org/wiki/Certificate_authority

[4]: https://ssl.comodo.com/free-ssl-certificate.php

[5]: https://connectindo.com/

[6]: https://www.rumahweb.com/

[7]: https://ssl.comodo.com/

## Create A Record

Masuk ke DNS Management-nya Rumahweb, kemudian set `systemix.id` diarahkan ke IP VPS.

![screenshot.576](/images/screenshot.576)

## Create User 

Seperti webhosting pada umumnya (shared hosting), kita buat user terpisah untuk domain `systemix.id`. Root untuk hosting kita buat pada direktori public_html.

```bash
sudo su
adduser systemix
```

## Create Web Server Port 80

```
mkdir /home/systemix/public_html
chown systemix:systemix /home/systemix/public_html
cd /etc/nginx/sites-available
vi systemix.id
```

Untuk sementara configurasi nginx pada file `systemix.id` sebagai berikut:
```
server {
    listen 80;
	listen [::]:80;
    server_name systemix.id;
    root /home/systemix/public_html;
    index index.html;
}
```

Buat halaman index.html sederhana sbb:
```
echo OK > /home/systemix/public_html/index.html
```
Buat symbolic link pada sites enabled:

```
cd /etc/nginx/sites-enabled
ln -s ../sites-available/systemix.id systemix.id
```
Terakhir, reload nginx

```
nginx -s reload
```

Cek di browser dan website port 80 telah live.
```
curl systemix.id
wget systemix.id -q -O -
```
![screenshot.577](/images/screenshot.577)


## Create Certificate 


Buat sertifikat dan key.

```
mkdir /home/systemix/ssl
chown systemix:systemix /home/systemix/ssl
cd /home/systemix/ssl
openssl req -new -newkey rsa:2048 -nodes -keyout systemix.key -out systemix.csr
```

Muncul dialog, dan jawab sebagai berikut:

```no-highlight
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
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Systemix ID
Organizational Unit Name (eg, section) []:IT Department
Common Name (e.g. server FQDN or YOUR name) []:systemix.id
Email Address []:email@example.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

Yang perlu diperhatikan adalah pada input Common Name isi dengan nama domain, yakni: **systemix.id** dan Email Address harus aktif.


## Create Comodo Certificate

Buka website Free SSL Certificate dari Comodo:

`https://ssl.comodo.com/free-ssl-certificate.php`

Klik tombol "Free Trial SSL". Muncul form STEP 1.

`cat /home/systemix/ssl/systemix.csr` 

Copy paste isi dari file systemix.csr kedalam box.

Pilih **nginx** pada pertanyaan "Select the server software used to generate the CSR".

![screenshot.570](/images/screenshot.570)

Next dan kita akan sampai pada form STEP 2. Domain Control Validation.

Cara paling mudah untuk validasi domain adalah pada opsi **HTTP CSR Hash**. Kita pilih opsi ini dan perhatikan pada info CSR's hashes yang tertera pada form, yakni:

```
Your CSR's hashes are: 
MD5 = 6720C8C58E17D6A9C3AA5F1A038947B2 
SHA-1 = D471359881F6BF35435AC1EFADFB535200C3879E
```

![screenshot.578](/images/screenshot.578)

Buat file pada server root:

```
vi /home/systemix/public_html/6720C8C58E17D6A9C3AA5F1A038947B2.txt
```
Isi file adalah sbb:

```
D471359881F6BF35435AC1EFADFB535200C3879E
comodoca.com
```

Test pada browser.
```
curl http://systemix.id/6720C8C58E17D6A9C3AA5F1A038947B2.txt
wget -q -O - http://systemix.id/6720C8C58E17D6A9C3AA5F1A038947B2.txt
```

Next dan kita masuk ke Step 3: Your Corporate Details. Isi semua field yang required. Penting: **Alamat email wajib aktif**, karena certificate akan dikirim via email. Alamat email pun **harus sama** dengan yang diisi pada CSR.

Next. Tiba dihalaman Agreement. Checklist pada tickbox, dan klik tombol Continue.

![screenshot.572](/images/screenshot.572)

Tiba di halaman Complete Order. Untuk melihat status validasi certificate dapat melalui halaman client area di https://secure.comodo.net/products/frontpage.

Waktu yang dibutuhkan agar certificate selesai diproses oleh Comodo hanya kurang dari dua menit jika email aktif dan sesuai. Certifikat akan dikirim via attachment serta juga tertera pada body email.

![screenshot.579.edited](/images/screenshot.579.edited)

Jika certificate telah dikirim via email, download lampirannya dan upload kembali ke dalam server folder `/home/systemix/ssl` menggunakan Ftp Client atau Scp Client.

```
cd /home/systemix/ssl
unzip systemix_id.zip
```

Pastikan terdapat file bernama systemix_id.crt


##Create Web Server port 443

Pastikan port 443 tidak digunakan untuk keperluan lainnya, misalnya OpenVPN.

```
netstat --listen -n | grep 443
```

Tambahkan configurasi nginx pada file `/etc/nginx/sites-available/systemix.id` sbb:

```
vi /etc/nginx/sites-available/systemix.id
```

Tambahkan code dibawah ini (append):

```
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name systemix.id;
    root /home/systemix/public_html;
    index index.html;
    ssl_certificate /home/systemix/ssl/systemix_id.crt;
    ssl_certificate_key /home/systemix/ssl/systemix.key;
}
```

Reload nginx

```
nginx -s reload
```


Cek di browser dan website port 443 telah live.

![screenshot.580](/images/screenshot.580)

Cek melalui console bila tanpa verifikasi host:

```
curl https://systemix.id -k
wget https://systemix.id -q -O - --no-check-certificate
```

Fila yang dikirim oleh Comodo melalui email sudah termasuk dengan certificate untuk disertakan saat request melalui console.

```
curl https://systemix.id --cacert /home/systemix/ssl/COMODORSADomainValidationSecureServerCA.crt
wget https://systemix.id --ca-certificate=/home/systemix/ssl/COMODORSADomainValidationSecureServerCA.crt -q -O -
```

## Redirect Port 80 ke Port 443

```
cd /etc/nginx/sites-available
vi systemix.id
```
Paksa arahkan semua http ke https, edit pada server yang me-listen port 80.
```
server {
    listen 80;
    listen [::]:80;
    server_name systemix.id;
    return 301 https://$server_name$request_uri;
}
```
Finishing: reload nginx.
```
nginx -s reload
```

## Reference

https://support.comodo.com/index.php?/Default/Knowledgebase/Article/View/801/19/nginx-csr-generation-using-openssl

https://support.ssl.com/Knowledgebase/Article/View/19/0/der-vs-crt-vs-cer-vs-pem-certificates-and-how-to-convert-them

http://stackoverflow.com/questions/3742983/how-to-get-the-contents-of-a-webpage-in-a-shell-variable