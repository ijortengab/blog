---
title: Menjadikan environment pada Sculpin sebagai website tersendiri
tags:
    - sculpin
    - nginx
categories:
    - code
---

## Pendahuluan

[Sculpin][1] sebagai software [static generator][2] menyediakan dua environment 
(secara default) yakni ```dev``` dan ```prod```. Fitur ini bisa kita manfaatkan 
untuk membuat dua website masing-masing untuk tiap environment tersebut. 
Misalnya untuk environment production berada pada website http://example.com, 
dan environment development berada pada website http://dev.example.com.

[1]: https://sculpin.io
[2]: https://www.staticgen.com

## Persiapan

- Subdomain dev.example.com
- Nginx
- User linux dalam contoh ini adalah ```example```.
- Linux yang digunakan adalah ubuntu server 16.04 sehingga konfigurasi
  nginx per virtual host berada pada direktori /etc/nginx/sites-enabled/*

## Konfigurasi Nginx

Berikut ini adalah konfigurasi nginx. Untuk domain http://example.com dan domain
http://dev.example.com kita satukan konfigurasi-nya dalam file example.com

```
server {
	listen 80;
	listen [::]:80;
	server_name example.com;
	root /home/example/public_html;
	index index.html;
	location / {
		try_files $uri $uri/ =404;
	}
}
server {
	listen 80;
	listen [::]:80;
	server_name dev.example.com;
	root /home/example/public_html_dev;
	index index.html;
	#return 302 http://example.com;
	location / {
		try_files $uri $uri/ =404;
	}
}
```

Save file tersebut, lalu reload daemon nginx 
``` sudo nginx -s reload ```

## Finishing

Misalkan project Sculpin berada pada path ```/home/example/sculpin```, maka kita 
buat symbolic link untuk direktori output pada masing-masing environment 
sesuai dengan konfigurasi root nginx.

```sh
ln -s /home/example/sculpin/output_prod /home/example/public_html
ln -s /home/example/sculpin/output_dev /home/example/public_html_dev
```

Selesai. Dua website sekarang merujuk ke masing-masing environment.

Jika kita ingin mematikan website development, maka cukup uncomment pada baris
berikut ```#return 302 http://example.com;```, lalu reload nginx.
