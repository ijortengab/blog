---
title: Membangun Mail Server Sendiri Memanfaatkan ISPConfig
slug: /blog/2021/07/25/membangun-mail-server-sendiri-memanfaatkan-ispconfig/
date: 2021-07-25
---

## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Pertanyaan

Misalkan kita memiliki domain bernama `example.com`.

Bagaimanakah caranya kita membangun mail server sendiri sehingga kita bisa memiliki alamat email sebagai berikut:

 - `info@example.com`
 - `admin@example.com`
 - dan lain-lain

## Literasi

**ISPConfig, Roundcube, PHPMyAdmin**

ISPConfig adalah software management hosting. Roundcube adalah software management mail client. PHPMyAdmin adalah software management database mysql/mariadb.

Ketiga software tersebut bersifat open source dan memberikan tampilan web interface.

**Referensi utama**

Referensi utama tulisan ini adalah panduan instalasi ISPConfig di Sistem Operasi Debian 10 dari tautan berikut:

`https://www.howtoforge.com/perfect-server-debian-10-nginx-bind-dovecot-ispconfig-3.1/`

ISPConfig pada tulisan ini akan dimanfaatkan hanya untuk mail server, sehingga pilihan software binary yang di-install di server terbatas hanya untuk kebutuhan mail server.

Dari referensi utama tersebut, kita buat shell script versi otomatis setup:

`https://github.com/ijortengab/ispconfig-autoinstaller`

## Perencanaan

**Penentuan Domain dan FQDN**

Domain yang kita pilih adalah <strike>example.com</strike> `build.web.id`.

FQDN (Fully Qualified Domain Name) harus berupa subdomain dan domain, oleh karena itu kita tetapkan value FQDN adalah: `server.build.web.id`.

**Penentuan Vendor**

Domain kita beli menggunakan jasa registrar `RumahWeb`.

Hosting/Server kita beli menggunakan jasa provider `DigitalOcean`.

**Name Server**

Kita memilih menggunakan DNS milik DigitalOcean karena terdapat API untuk otomatisasi pencatatan DNS record.

Oleh karena itu kita ubah name server dari `RumahWeb` ke `DigitalOcean` melalui DNS Management di Control Panel RumahWeb.

**Penentuan URL**

Kita tetapkan nantinya alamat untuk ISPConfig, PHPMyAdmin dan Roundcube adalah:

 - `https://cp.build.web.id` (ISPConfig)
 - `https://db.build.web.id` (PHPMyAdmin)
 - `https://mail.build.web.id` (Roundcube)

## Domain

Beli domain `build.web.id` di `RumahWeb`, selesaikan adminstrasi, kemudian masuk ke DNS Management, dan ubah name server ke `DigitalOcean`.

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-23_22.56.10.jpg)

Name server default adalah: ns1.rumahweb.com (1-4).

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-23_23.45.10.jpg)

Kita ubah menjadi: ns1.digitalocean.com (1-3).

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-23_23.45.27.jpg)

Verifikasi dengan `dig`.

```
dig +trace build.web.id
```

Sebagian output:

```
;; Received 262 bytes from 127.0.0.53#53(127.0.0.53) in 0 ms
;; Received 727 bytes from 193.0.14.129#53(k.root-servers.net) in 84 ms
build.web.id.           3600    IN      NS      NS2.DIGITALOCEAN.com.
build.web.id.           3600    IN      NS      NS3.DIGITALOCEAN.com.
build.web.id.           3600    IN      NS      NS1.DIGITALOCEAN.com.
;; Received 726 bytes from 103.19.179.179#53(b.dns.id) in 196 ms
;; Received 41 bytes from 173.245.59.41#53(NS2.DIGITALOCEAN.com) in 236 ms
```

Berdasarkan output, maka perubahan DNS sudah propagate.

## Hosting

**DNS Reverse**

`DNS Reverse`/`IP Reverse`/`PTR Record` adalah kebalikan dari query DNS, yakni menerjemahkan/mengasosiasikan IP sebagai sebuah domain.

DNS Reverse yang valid diperlukan sebagai salah satu cara meningkatkan reputasi mail server.

Droplet adalah istilah penamaan server (VPS) di `DigitalOcean` yang mana saat kita membuatnya langsung mendapatkan satu buah IP Address (Public).

Pada DigitalOcean, mengeset DNS Reverse dari IP yang didapat dari pembelian droplet adalah dengan cara memberi nama droplet dengan nama `FQDN` (Fully Qualified Domain Name).

**Tambah Droplet**

Tambah droplet melalui Control Panel DigitalOcean. Linux Distribution yang kita pilih adalah `Debian 10` sesuai dengan referensi utama.

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_14.17.41.jpg)

Beri nama droplet dengan `FQDN`, yakni: `server.build.web.id`.

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_14.20.09.jpg)

Jika berhasil, maka satu server tersebut sudah terdapat satu buah IP Publik.

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_18.16.27.jpg)

Verifikasi hostname:

```
hostname
hostname -f
```

Output:

```
root@server:~# hostname
server
root@server:~# hostname -f
server.build.web.id
```

## Setup

**Token API**

Masuk ke Control Panel DigitalOcean, pilih menu item `API`, tambah token:

 - Name: `ispconfig`
 - Scope: read, write

Catat dan simpan informasi token tersebut.

[Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_21.23.21.jpg)

Panduan manual setup ISPConfig sudah dijelaskan secara lengkap di referensi utama, pada tautan berikut:

https://www.howtoforge.com/perfect-server-debian-10-nginx-bind-dovecot-ispconfig-3.1/

Versi shell script untuk otomatis setup berdasarkan panduan tautan diatas sudah tersedia di Github.

Download dan execute:

```
wget -nv https://raw.githubusercontent.com/ijortengab/ispconfig-autoinstaller/master/debian10.digitalocean.sh
bash debian10.digitalocean.sh
```

Muncul dialog dan berikan jawaban.

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-25_18.48.06.jpg)

Execute. Proses berjalan sekitar 7 menit.

Sebagian Output:

```
################################################################################

# CHAPTER 1. SETUP SERVER

################################################################################

# Install Basic Apps

# Update Repository for PHP 7.4

# Modify Domain DNS Record
Domain 'build.web.id' NOT found in DNS Digital Ocean.
Trying to create... Created.

# Modify FQCDN DNS Record
DNS A Record of FQCDN 'server.build.web.id' NOT found in DNS Digital Ocean.
Trying to create... Created.

# Modify CNAME DNS Record for PHPMyAdmin
DNS CNAME Record of FQCDN 'db.build.web.id' NOT found in DNS Digital Ocean.
Trying to create... Created.

# Modify CNAME DNS Record for Roundcube
DNS CNAME Record of FQCDN 'mail.build.web.id' NOT found in DNS Digital Ocean.
Trying to create... Created.

# Modify CNAME DNS Record for ISPConfig
DNS CNAME Record of FQCDN 'cp.build.web.id' NOT found in DNS Digital Ocean.
Trying to create... Created.

# Install Web Server Application

# Certbot Request

# Install Mail Server Application

################################################################################

# CHAPTER 2. SETUP DOMAIN

################################################################################

# Modify MX DNS Record
DNS MX Record of FQCDN 'build.web.id' target to 'server.build.web.id' NOT found in DNS Digital Ocean.
Trying to create... Created.

# Modify TXT DNS Record for SPF
DNS TXT Record of FQCDN 'build.web.id' for SPF NOT found in DNS Digital Ocean.
Trying to create... Created.

# Generate DKIM Public and Private Key

# Execute SOAP mail_domain_add

# Modify TXT DNS Record for DKIM
DNS TXT Record of FQCDN 'default._domainkey.build.web.id' for DKIM NOT found in DNS Digital Ocean.
Trying to create... Created.

# Modify TXT DNS Record for DMARC
DNS TXT Record of FQCDN 'build.web.id' for DMARC NOT found in DNS Digital Ocean.
Trying to create... Created.

################################################################################

# CHAPTER 3. SETUP EMAIL

################################################################################

# Execute SOAP mail_user_add

# Execute SOAP mail_alias_add

```

Proses selesai dengan informasi credentials.

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_22.10.31.jpg)

## Hasil

https://cp.build.web.id

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_22.52.44.jpg)

https://db.build.web.id

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_22.52.56.jpg)

https://mail.build.web.id

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-07-24_22.53.04.jpg)

Penambahan alamat email (mailbox) dari domain `build.web.id` dilakukan melalui Control Panel ISPConfig atau secara CLI (Command Line Interface) menggunakan command `isp`.

## Troubleshooting

Permasalahan hosting mail server di DigitalOcean dan solusinya:

 - [Block Port 25](/blog/2021/07/07/hosting-mail-server-di-digitalocean-dan-block-port-25/)
 - [Yahoo Mail Blacklist](/blog/2021/07/08/hosting-mail-server-di-digitalocean-dan-yahoo-mail-blacklist/)
 - [GMail Auto SPAM Label](/blog/2021/07/24/hosting-mail-server-di-digitalocean-dan-gmail-auto-spam-label/)

## References

https://www.howtoforge.com/perfect-server-debian-10-nginx-bind-dovecot-ispconfig-3.1/

https://github.com/ijortengab/ispconfig-autoinstaller

https://www.digitalocean.com/community/questions/create-a-ptr-record-for-a-droplet-s-public-ip-address?answer=65920

https://www.digitalocean.com/community/questions/how-else-can-i-setup-reverse-dns

https://www.digitalocean.com/community/questions/how-do-i-create-a-reverse-dns-ptr-record

https://computingforgeeks.com/how-to-install-latest-php-on-debian/

https://serverfault.com/questions/143968/automate-the-installation-of-postfix-on-ubuntu

https://www.ietf.org/rfc/rfc2142.txt

https://www.howtoforge.com/install-ispconfig-3-roundcube-plugins-on-debian-10/