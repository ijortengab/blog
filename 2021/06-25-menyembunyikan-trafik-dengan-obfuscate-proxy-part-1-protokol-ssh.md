# Menyembunyikan trafik dengan Obfuscate Proxy - Part 1 Protokol SSH

---
tags:
  - obfuscate-proxy
---

## Latar Belakang

Firewall Next Generation yang digunakan oleh jaringan di sebuah perusahaan sudah bisa mendeteksi SSH Trafik dengan menggunakan teknik DPI (Deep Packet Inspection) lalu kemudian memblokirnya.

Masuk ke server pribadi menggunakan SSH dari jaringan tersebut dengan mengubah port SSH Server dari default `22` ke `443` sudah tidak lagi bisa digunakan.

Bagaimanakah caranya agar kita bisa tetap SSH ke Server Pribadi tanpa terblokir oleh Firewall Next Generation?

## Solusi

Gunakan penyamaran (`obfuscate`) agar paket data yang dikirim adalah paket acak tanpa pola protokol ala SSH.

## Server & Client Configuration

Konfigurasi dibawah ini diperlukan di server dan di client.

Server dan Client pada contoh tulisan ini menggunakan Ubuntu 20.04.

Jika client adalah Windows, maka gunakan **WSL 2** dan pasang Ubuntu 20.04 didalamnya.

Blog terkait:

 > [Berkenalan dengan Windows Subsytem of Linux (WSL)](/blog/2021/03/06/berkenalan-dengan-windows-subsytem-of-linux-wsl/)

Install `obfs4proxy`.

```
apt-get install obfs4proxy
```

Buat user.

```
adduser \
  --system \
  --home "/var/lib/obfs4proxy-ssh/" \
  --shell "/usr/sbin/nologin" \
  --group \
  --gecos "obfs4proxy for ssh" \
  obfs4-ssh
```

## Client Configuration

Install `ncat` untuk kebutuhan penggunaan socket proxy.

```
apt-get install ncat
```

## Server Command

Variable yang kita gunakan sebagai contoh adalah:

 - ssh daemon port: `22`
 - obfs4proxy daemon port: `2222`

Jalankan program `obfs4proxy` di sisi server.

```
sudo -u obfs4-ssh \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-ssh/" \
    TOR_PT_SERVER_TRANSPORTS="obfs4" \
    TOR_PT_SERVER_BINDADDR="obfs4-0.0.0.0:2222" \
    TOR_PT_ORPORT="127.0.0.1:22" \
obfs4proxy -enableLogging -logLevel DEBUG
```

Output (contoh):

```
VERSION 1
SMETHOD obfs4 [::]:2222 ARGS:cert=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh,iat-mode=0
SMETHODS DONE
```

Keterangan:

 - Program berjalan secara foreground. Tekan `CTRL+c` sebanyak dua kali untuk menutup program. Eksekusi program membuat terminal tidak bisa digunakan lagi.
 - Bind Address, yakni `0.0.0.0:2222`. Berarti `obfs4proxy` mendengar port `2222` dari semua interface `0.0.0.0`.
 - Forwarded Address, yakni `127.0.0.1:22`. Berarti trafik akan diteruskan ke port SSH daemon, yakni `22` dari interface localhost `127.0.0.1`.

Catat dua variable penting dari output (contoh):

 - cert: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh`
 - iat-mode: `0`

Informasi diatas juga terdapat pada file `/var/lib/obfs4proxy-ssh/obfs4_bridgeline.txt`.

## Server Daemon

Agar program berjalan secara background, kita bisa menggunakan `screen` atau `systemctl`.

Buat file eksekusi bernama `obfs4proxy-ssh-server.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-ssh-server.sh
chmod a+x obfs4proxy-ssh-server.sh
vi        obfs4proxy-ssh-server.sh
```

Isi file:

```
#!/bin/bash
sudo -u obfs4-ssh \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-ssh/" \
    TOR_PT_SERVER_TRANSPORTS="obfs4" \
    TOR_PT_SERVER_BINDADDR="obfs4-0.0.0.0:2222" \
    TOR_PT_ORPORT="127.0.0.1:22" \
obfs4proxy -enableLogging -logLevel DEBUG
```

**visudo**

```
visudo
```

Tambahkan baris berikut:

```
ALL ALL = NOPASSWD: /usr/local/bin/obfs4proxy-ssh-server.sh
```

Sehingga command menjadi:

```
sudo obfs4proxy-ssh-server.sh
```

Eksekusi command diatas oleh user reguler tidak membutuhkan akses root.

**screen**

Gunakan option `-d -m` untuk auto detach screen.

Kemudian eksekusi screen untuk menciptakan daemon.

```
screen -d -m sudo obfs4proxy-ssh-server.sh
```

**systemctl**

Buat file service:

```
cd /etc/systemd/system/
touch     obfs4proxy-ssh-server.service
chmod 644 obfs4proxy-ssh-server.service
vi        obfs4proxy-ssh-server.service
```

Isi file:

```
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/obfs4proxy-ssh-server.sh

[Install]
WantedBy=default.target
```

Enable:

```
sudo systemctl daemon-reload
sudo systemctl enable --now obfs4proxy-ssh-server.service
```

Verifikasi:

```
systemctl status obfs4proxy-ssh-server.service
```

## Client Command

Jalankan program `obfs4proxy` di sisi client.

```
sudo -u obfs4-ssh \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-ssh/" \
    TOR_PT_CLIENT_TRANSPORTS="obfs4" \
obfs4proxy -enableLogging -logLevel DEBUG
```

Output (contoh):

```
VERSION 1
CMETHOD obfs4 socks5 127.0.0.1:34567
CMETHODS DONE
```

Keterangan:

 - Program berjalan secara foreground. Tekan `CTRL+c` sebanyak dua kali untuk menutup program. Eksekusi program membuat terminal tidak bisa digunakan lagi.
 - Local port yang tercipta nilainya berubah-ubah setiap kali command dieksekusi.

Catat variable penting:

 - port: 34567

## Client Daemon

Agar program berjalan secara background, kita bisa menggunakan `screen` atau `systemctl`.

Buat file eksekusi bernama `obfs4proxy-ssh-client.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-ssh-client.sh
chmod a+x obfs4proxy-ssh-client.sh
vi        obfs4proxy-ssh-client.sh
```

Isi file:

```
#!/bin/bash
sudo -u obfs4-ssh \
env TOR_PT_MANAGED_TRANSPORT_VER="1" \
    TOR_PT_STATE_LOCATION="/var/lib/obfs4proxy-ssh/" \
    TOR_PT_CLIENT_TRANSPORTS="obfs4" \
obfs4proxy -enableLogging -logLevel DEBUG
```

**visudo**

```
visudo
```

Tambahkan baris berikut:

```
ALL ALL = NOPASSWD: /usr/local/bin/obfs4proxy-ssh-client.sh
```

Sehingga command menjadi:

```
sudo obfs4proxy-ssh-client.sh
```

Eksekusi command diatas oleh user reguler tidak membutuhkan akses root.

**screen**

Gunakan option `-d -m` untuk auto detach screen.

Kemudian eksekusi screen untuk menciptakan daemon.

```
screen -d -m sudo obfs4proxy-ssh-client.sh
```

**systemctl**

Buat file service:

```
cd /etc/systemd/system/
touch     obfs4proxy-ssh-client.service
chmod 644 obfs4proxy-ssh-client.service
vi        obfs4proxy-ssh-client.service
```

Isi file:

```
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/obfs4proxy-ssh-client.sh

[Install]
WantedBy=default.target
```

Enable:

```
sudo systemctl daemon-reload
sudo systemctl enable --now obfs4proxy-ssh-client.service
```

Verifikasi:

```
systemctl status obfs4proxy-ssh-client.service
```

## Tips Screen

Command untuk reattach screen:

```
screen -r
```

Untuk kembali deattach screen:

 - Tekan `CTRL+a`
 - Langsung tekan `d`.

Blog terkait:

 > [Screen sebagai solusi remote connection](/blog/2017/01/24/screen-solusi-remote-connection/)

## SSH Command

Eksekusi `ssh` dengan menggunakan option dari variable standard output diatas.

Misalnya, akses normal ke server `ijortengab.id` adalah:

```
ssh ijortengab@ijortengab.id
```

Maka akses menggunakan obfuscate proxy adalah:

```
ssh -o 'ProxyCommand ncat \
    --proxy "127.0.0.1:34567" \
    --proxy-type "socks5" \
    --proxy-auth "cert=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh;iat-mode=:0" %h %p' \
    -p 2222 \
    ijortengab@ijortengab.id
```

Catatan:

 - Pemisah antara `cert` dan `iat-mode` adalah titik koma `;` dan bukan koma `,`.
 - Value `iat-mode` didahului karakter titik dua `:`.
 - Port SSH diganti menjadi port obfuscate proxy di sisi server yakni `2222`.

## Tips Client Variable

Command untuk mendapatkan variable port di client adalah:

```
output=$(netstat -tapn | grep obfs4proxy) && \
cat /var/lib/obfs4proxy-ssh/obfs4proxy.log | \
grep -o registered\ listener\:\ 127\.0\.0\.1\:.*$ | \
sed 's/.*\:\([[:digit:]]*\)$/\1/g' | \
while IFS= read -r line; do \
    [[ $(echo "$output" | grep -o "$line") ]] && \
    echo "$line"; \
done
```

Catatan:

 - Standard Output (stdout) kemungkinan multi line jika program berjalan lebih dari satu kali.

Buat file eksekusi bernama `obfs4proxy-ssh-getport.sh`.

```
cd /usr/local/bin/
touch     obfs4proxy-ssh-getport.sh
chmod a+x obfs4proxy-ssh-getport.sh
vi        obfs4proxy-ssh-getport.sh
```

Isi file:

```
#!/bin/bash
output=$(netstat -tapn | grep obfs4proxy) && \
cat /var/lib/obfs4proxy-ssh/obfs4proxy.log | \
grep -o registered\ listener\:\ 127\.0\.0\.1\:.*$ | \
sed 's/.*\:\([[:digit:]]*\)$/\1/g' | \
while IFS= read -r line; do \
    [[ $(echo "$output" | grep -o "$line") ]] && \
    echo "$line"; \
done
```

**visudo**

```
visudo
```

Tambahkan baris berikut:

```
ALL ALL = NOPASSWD: /usr/local/bin/obfs4proxy-ssh-getport.sh
```

Sehingga command menjadi:

```
sudo obfs4proxy-ssh-getport.sh
```

Eksekusi command diatas oleh user reguler tidak membutuhkan akses root.

## Tips Server Variables

Kita akan menjadikan client bisa mendapatkan informasi `cert` dan `iat-mode` menggunakan http request dengan web server `nginx`.

Variable yang kita gunakan sebagai contoh adalah:

 - username: `ijortengab`
 - password: `luarbiasa`
 - hostname: `ijortengab.id`
 - port: `2223`
 - HTTPS self signed certificate

Set HTTP Authenticate:

```
htpasswd -m /etc/nginx/snippets/htpasswd ijortengab
```

Tambah virtual host yang mendengar port `2223`.

```
cd /etc/nginx/sites-available
touch obfs4proxy-ssh
cd /etc/nginx/sites-enabled
ln -s ../sites-available/obfs4proxy-ssh obfs4proxy-ssh
vi obfs4proxy-ssh
```

Isi dari file `obfs4proxy-ssh`:

```
server {
	listen 2223 ssl;
	listen [::]:2223 ssl;
	root /var/lib/obfs4proxy-ssh;
	server_name _;
	index obfs4_bridgeline.txt;
	location / {
		try_files $uri $uri/ =404;
	}
    include snippets/snakeoil.conf;
    auth_basic "";
    auth_basic_user_file snippets/htpasswd;
}
```

Jika `nginx` berjalan dengan user `www-data`, maka tambahkan akses:

```
gpasswd -a www-data obfs4-ssh
chmod g+r /var/lib/obfs4proxy-ssh/obfs4_bridgeline.txt
```

Reload nginx.

```
nginx -s reload
```

Verifikasi dengan `curl` di sisi server:

```
curl -m 3 -k https://localhost:2223/ --user ijortengab:luarbiasa
```

Verifikasi dengan hostname di sisi client:

```
curl -m 3 -k https://ijortengab.id:2223/ --user ijortengab:luarbiasa
```

**Download dan Save sebagai Cache**

Dari link tersebut, maka download file `/var/lib/obfs4proxy-ssh/obfs4_bridgeline.txt` dari server yang berisi informasi `cert` dan `iat-mode` kemudian simpan di client sebagai `cache`.

```
if [ ! -d ~/.cache ];then mkdir -p ~/.cache; chmod 0700 ~/.cache; fi
cache=~/.cache/obfs4proxy-ssh-ijortengab.id.2223.txt
curl -m 3 -sS -o "$cache" -k https://ijortengab.id:2223/ --user ijortengab:luarbiasa
```

## Tips SSH Command

Eksekusi program `obfs4proxy` di sisi client menciptakan local port yang nilainya berubah-ubah sehingga eksekusi command `ssh` perlu menyesuaikan dengan nilai port terkini.

Kita bisa menjadikan argument dari command `ssh` menjadi fix dengan memanfaatkan dua command berikut:

 - `screen -d -m sudo obfs4proxy-ssh-client.sh`
 - `sudo obfs4proxy-ssh-getport.sh`

Variable yang kita gunakan sebagai contoh adalah:

 - hostname: `ijortengab.id`
 - ssh username: `ijortengab`
 - remote port proxy: `2222`
 - local port proxy: `34567`

Command sebelumnya (contoh):

```
ssh -o 'ProxyCommand ncat \
    --proxy "127.0.0.1:34567" \
    --proxy-type "socks5" \
    --proxy-auth "cert=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefgh;iat-mode=:0" %h %p' \
    -p 2222 \
    ijortengab@ijortengab.id
```

Kita jadikan fix menjadi sebagai berikut:

```
ssh -o 'ProxyCommand bash -c "$HOME/bin/ijortengabproxy %h %p"' \
    -p 2222 \
    ijortengab@ijortengab.id
```

Buat direktori:

```
mkdir -p ~/bin
```

Buat file eksekusi bernama `ijortengabproxy`.

```
cd ~/bin
touch     ijortengabproxy
chmod u+x ijortengabproxy
vi        ijortengabproxy
```

Isi file:

```
#!/bin/bash
cache=~/.cache/obfs4proxy-ssh-ijortengab.id.2223.txt
output=$(<"$cache")
cert=$(echo "$output" | grep -o 'cert=.*\s' | sed 's/cert=\(.*\)\s/\1/g')
iat_mode=$(echo "$output" | grep -o 'iat-mode=.*' | sed 's/iat-mode=\(.\)/\1/g')
if [ -z $cert ];then
    exit 1
fi
if [ -z $iat_mode ];then
    exit 2
fi
port=$(sudo obfs4proxy-ssh-getport.sh | head -1)
if [ -z $port ];then
    screen -d -m sudo obfs4proxy-ssh-client.sh
    sleep 1
    port=$(sudo obfs4proxy-ssh-getport.sh | head -1)
fi
if [ -z $port ];then
    exit 3
fi
ncat \
    --proxy "127.0.0.1:$port" \
    --proxy-type "socks5" \
    --proxy-auth "cert=${cert};iat-mode=:${iat_mode}" \
   $1 $2
```

## Kesimpulan

Beberapa command yang direkomendasikan.

Command di server:

 - `screen -d -m sudo obfs4proxy-ssh-server.sh`
 - `systemctl status obfs4proxy-ssh-server.service`

Command umum di client:

 - `screen -d -m sudo obfs4proxy-ssh-client.sh`
 - `systemctl status obfs4proxy-ssh-client.service`
 - `sudo obfs4proxy-ssh-getport.sh`

Command khusus di client (contoh):

 - `curl -m 3 -k https://ijortengab.id:2223/ --user ijortengab:luarbiasa`
 - `ssh -o 'ProxyCommand bash -c "$HOME/bin/ijortengabproxy %h %p"' -p 2222 ijortengab@ijortengab.id`

Akses ssh kini bisa dengan cara normal maupun dengan cara menyamar `obfuscate`.

Kita buat shortcut, edit ssh client config:

```
vi ~/.ssh/config
```

Tambahkan baris berikut:

```
Host ijortengab
    Hostname ijortengab.id
    User ijortengab
Host ijortengabproxy
    Hostname ijortengab.id
    User ijortengab
    Port 2222
    ProxyCommand bash -c '$HOME/bin/ijortengabproxy %h %p'
```

Akses normal:

```
ssh ijortengab
```

Akses dengan penyamaran

```
ssh ijortengabproxy
```

## Reference

https://hamy.io/post/000e/how-to-hide-obfuscate-ssh-traffic-using-obfs4

https://docs.paloaltonetworks.com/pan-os/9-0/pan-os-admin/decryption/decryption-concepts/ssh-proxy

http://code.danyork.com/2015/07/31/firewalls-now-looking-at-intercepting-ssh-traffic-via-a-mitm-attack/

https://stackoverflow.com/questions/33486339/can-an-ssh-config-file-use-variables
