---
title: Set HTTP Proxy pada Linux
slug: /blog/2017/01/25/set-http-proxy-pada-linux/
date: 2017-01-25
---

Proxy yang dimaksud pada tulisan ini adalah **forward proxy server**. Mengingat saat ini sudah ada versi terbalik dari proxy yakni **reverse-proxy**.

## Langsung aja mas bro...

Proxy yang akan dipasang untuk mengakses protokol HTTP.

Misalnya, proxy server berada dialamat 192.168.80.80 port 8080.

Konek ke ssh dan ketik command berikut

```
export http_proxy=192.168.80.80:8080
export https_proxy=192.168.80.80:8080
export no_proxy=127.0.0.1
```

Done. Test dengan wget dan curl. 

```
wget s.id
curl s.id
```

Settingan ini hanya berlaku untuk satu session login ssh ke server.

Untuk permanen maka edit file .profile pada home direktori.

```
vi ~/.profile
```

Lalu copas tiga baris code export tadi pada file ```.profile```, save dan reconnect ke server.

## Reference:

http://stackoverflow.com/questions/224664/difference-between-proxy-server-and-reverse-proxy-server