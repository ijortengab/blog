---
title: SSH bersembunyi dibalik HTTPS (SSL/TLS) menggunakan Nginx
---

## Studi Kasus

Kita menggunakan jaringan internet publik misalnya hotspot.

Biasanya firewall pada jaringan tersebut membatasi akses hanya untuk aktivitas browsing.

Port yang diijinkan biasanya hanya default http dan https yakni `80` dan `443`.

Artinya kita tidak bisa masuk ke server karena Protokol SSH server kita menggunakan port default `22`.

**Catatan:**

Firewall yang kita maksud adalah firewall yang rules-nya sederhana berdasarkan filtering port.

Untuk firewall next-generation perlu cara tersendiri. Blog terkait:

> [Menyembunyikan trafik dengan Obfuscate Proxy - Part 1 Protokol SSH](/blog/2021/06/25/menyembunyikan-trafik-dengan-obfuscate-proxy-part-1-protokol-ssh/)

Agar bisa masuk ke server masih bisa diakali dengan berbagai solusi.

## Solusi Cepat

Solusi cepat adalah dengan mengganti port SSH server menjadi port `443` (menggunakan jaringan lain).

Mirip dengan mengganti port VPN dari default `1194` menjadi port `443`. Blog terkait:

> [Akses VPN Server via WiFi Publik (gratisan)](/blog/2017/01/30/akses-vpn-server-wifi-publik/)

## Solusi Terkini

Solusi cepat tidak bisa diterapkan jika server yang akan kita masuki menggunakan port `443` sebagai https pada website production.

Solusi terkini adalah menggunakan software yang bisa membedakan protokol SSH dan TLS dalam satu port `443`.

Beberapa software tersebut adalah:

 - Apache dengan module proxy connect (mod_proxy/mod_proxy_connect)
 - Stunnel + SSLH
 - Nginx versi >= 1.15.2

## Solusi Nginx

Sejak 24 Juli 2018, Nginx versi `1.15.2` sudah mendukung cara memperbedakan multi protokol dalam satu port.

> This is useful if you want to avoid firewall restrictions by (for example) running SSL/TLS and SSH services on the same port.

Sumber: https://www.nginx.com/blog/running-non-ssl-protocols-over-ssl-port-nginx-1-15-2/

Eksekusi command dibawah untuk uji kelayakan versi nginx.

```
curl -L https://git.io/nginx-1.15.2.sh | bash
```

## Gerak cepat

Backup terlebih dahulu seluruh nginx configuration.

```
cp -rf /etc/nginx /etc/nginx-$(date +%Y%m%d-%H%M%S)
```

Kita perlu menyepakati bahwa seluruh virtual host yang menggunakan https (http over SSL/TLS) akan mendengar port 443 yang diforward ke port 8443.

Oleh karena itu, edit seluruh port 443 ke 8443 didalam direktori virtual host (`/etc/nginx/sites-available/`).

```
portfind=443
portreplace=8443
directory=/etc/nginx/sites-available/
grep -E -rlZ '\s*listen[ :]'"$portfind"'\s+.*$' "$directory" | \
    xargs -0 sed -i -E 's/([ :])'"$portfind"'([^0-9])/\1'"$portreplace"'\2/g'
```

Edit file `/etc/nginx/nginx.conf`. Pada root context, kita tambahkan (append) `stream` context.

```
sshport=22
tlsport=8443
cat <<EOF >> /etc/nginx/nginx.conf
stream {
    upstream ssh {
        server 127.0.0.1:$sshport;
    }

    upstream web {
        server 127.0.0.1:$tlsport;
    }

    map \$ssl_preread_protocol \$upstream {
        default ssh;
        "TLSv1.0" web;
        "TLSv1.1" web;
        "TLSv1.2" web;
        "TLSv1.3" web;
    }

    # SSH and SSL on the same port
    server {
        listen 443;
        proxy_pass \$upstream;
        ssl_preread on;
   }
}
EOF
```

Reload nginx.

```
nginx -s reload
```

## Finish

Sekarang masuk ke server bisa menggunakan port 22:

```
ssh ijortengab.id
```

atau menggunakan port 443:

```
ssh ijortengab.id -p 443
```

## Reference

Google query: nginx ssh over https

https://github.com/nginx/nginx/releases/tag/release-1.15.2

https://superuser.com/questions/1135208/can-nginx-serve-ssh-and-https-at-the-same-time-on-the-same-port

https://www.nginx.com/blog/running-non-ssl-protocols-over-ssl-port-nginx-1-15-2/

https://raymii.org/s/tutorials/nginx_1.15.2_ssl_preread_protocol_multiplex_https_and_ssh_on_the_same_port.html

http://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html

https://benctechnicalblog.blogspot.com/2011/03/ssh-over-connect-over-port-80.html

https://synzack.github.io/Tunneling-Traffic-With-SSL-and-TLS/

https://linuxize.com/post/how-to-use-sed-to-find-and-replace-string-in-files/
