# Setup Wildcard Subdomain


## Disclaimer

Tulisan ini bersifat live report dan akan menyebut merek/brand tanpa pernah bermaksud untuk promosi.

## Pendahuluan

Tulisan ini akan praktek membuat wildcard subdomain. Wildcard artinya karakter apa saja. Contoh:

```
*.example.com
```

Wildcard tersebut dapat menjadi kata apa saja. Contoh:

```
ijortengab.example.com
mailserver.example.com
vpnserver.example.com
```

## DNS Management

Setup wildcard Subdomain berada pada DNS Management. Tulisan ini akan menggunakan dua ISP untuk praktek wildcard subdomain.

DNS RumahWeb untuk digunakan pada domain `phonenumber.id`.

DNS DigitalOcean untuk digunakan pada domain `biography.id`.

## Siapkan server

VPS dibeli melalui DigitalOcean, didapat IP Publik (contoh): `1.2.3.4`.

Webserver menggunakan nginx.

```
apt-get install nginx
```

Tampilan default dari http://1.2.3.4 harusnya adalah halaman default dari nginx.

![screenshot.728.png](/images/screenshot.728.png)

## phonenumber.id

Domain `phonenumber.id` akan menggunakan DNS dari RumahWeb. Login ke client area-nya RumahWeb.

Pastikan Nameserver mengarah ke RumahWeb.

![screenshot.730.png](/images/screenshot.730.png)

Manage DNS untuk domain `phonenumber.id`.

![screenshot.729.png](/images/screenshot.729.png)

Add new record dan create A Record untuk domain `phonenumber.id`.

![screenshot.732.png](/images/screenshot.732.png)

Add new record dan create A Record untuk domain `*. phonenumber.id`.

![screenshot.731.png](/images/screenshot.731.png)

Tunggu beberapa saat kemudian kunjungi `phonenumber.id` dan `apapun.phonenumber.id`. Kedua situs tersebut akan menampilkan hasil yang sama. Tampilan default bawaan nginx.

## biography.id

Domain `biography.id` akan menggunakan DNS dari DigitalOcean. Login ke client area-nya RumahWeb.

Pastikan Nameserver mengarah ke DigitalOcean.

![screenshot.733.png](/images/screenshot.733.png)

Login ke client area-nya RumahWeb. Masuk ke menu "Networking". Add a domain untuk `biography.id`.

![screenshot.734.png](/images/screenshot.734.png)

Create A record. Input Hostname adalah `@` yang berarti domain utama yang didaftarkan.

![screenshot.735.png](/images/screenshot.735.png)

Create A record. Input Hostname adalah `*` yang berarti subdomain wildcard yang didaftarkan.

![screenshot.736.png](/images/screenshot.736.png)

Tunggu beberapa saat kemudian kunjungi `biography.id` dan `apapun.biography.id`. Kedua situs tersebut akan menampilkan hasil yang sama. Tampilan default bawaan nginx.
