# Screen sebagai solusi remote connection


## Latar Belakang

Terdapat berbagai permasalahan saat remote menggunakan terminal (putty) yang dapat diselesaikan dengan menggunakan program ```screen```. Contoh kasus:

1. Monitoring Log menggunakan ```tail -f```

Sedang asyik-asyiknya menjalankan terminal (putty), lalu kepengen melihat log access:
```
tail -f /var/log/nginx/access.log
```
Setelah itu terminal tidak bisa kita gunakan lagi karena terminal sedang memantau update-an log. Mau tak mau, buka terminal baru.

2. PHP Built-in Web Server

Sedang asyik-asyiknya menjalankan terminal (putty), lalu butuh menjalankan PHP Built-in Web Server:

```
php -S 192.168.1.100:82
```

Setelah itu terminal tidak bisa kita gunakan lagi karena terminal sedang menjalankan program tersebut. Iseng-iseng menekan Ctrl+C, maka terminal **bisa** kita gunakan lagi **namun** web server tewas seketika.

3. Connect VPN Server

Sedang asyik-asyiknya menjalankan terminal (putty), lalu kepengen connect ke VPN Server:

```
openvpn --config ~/ovpn/client.ovpn
```

Setelah itu terminal tidak bisa kita gunakan lagi, 11-12 (baca: sebelas dua belas) dengan nomor dua diatas. Mau tak mau, buka terminal baru.

## Solusi

Gunakan program **screen** untuk membuat hantu alias daemon alias background process. Screen ibarat menciptakan dan menjalankan terminal (virtual) di sisi server (server side).

Secara bawaan lahir, program screen sudah tersedia pada GNU/Linux. Cek saja dengan command ```which screen```. Jadi tidak perlu instalasi.

## Praktek Dasar

Buka terminal lalu connect ke server. Terminal real yang saat ini berjalan kita beri nama **terminal client**.

Ketik command berikut ```screen```, muncul halaman welcome page, tekan ENTER, dan selamat datang di terminal baru yang berjalan *server side*. Terminal baru ini kita beri nama **terminal server 1**.

Untuk kembali ke *terminal client*, ketik ```screen -d```. D disini berarti detach maksudnya lepas interface terminal server dari layar kita saat ini.

Alternativenya adalah tekan ```Ctrl+a``` ```d```. Tekan tombol Control, tahan, tekan tombol ```a```, lepas, kemudian tekan tombol ```d```.

Saat berada di *terminal client*, maka untuk kembali ke *terminal server 1*, ketik ```screen -r```. R disini berarti reattach maksudnya tempel kembali interface terminal server ke layar kita saat ini. Jika kita hanya mengetik ```screen``` saja, itu artinya kita membuat session screen baru (akan dijelaskan kemudian).

Terminal server 1 dapat kita lihat prosesnya dengan command ```ps aux | grep SCREEN```

## Multiple Screen

Pada praktek dasar diatas, kita membuat satu session screen. Tiap session screen dapat dibuat nested screen (multi window).

Pada browser modern kita bisa membuat banyak window dan tiap window kita bisa membuat banyak tab-tab window untuk membuka halaman website. Satu session itu ibarat membuat satu window. Sementara satu nested itu ibarat membuat satu tab window.

## Session Screen

Untuk membuat session baru, kita perlu detach terlebih dahulu, kembali ke *terminal client* dengan command ```screen -d```. Kemudian ketik-kan lagi command ```screen```. Maka akan muncul session baru. Terminal baru ini kita beri nama **terminal server 2**.

Untuk melihat daftar session, ketik command ```screen -ls```. Akan terlihat table session dimana tiap session terdapat process ID (```ps ax```). Contoh output:

```
There are screens on:
	32195.pts-0.localhost	(01/24/2017 08:16:31 AM)	(Detached)
	32177.pts-0.localhost	(01/24/2017 08:16:25 AM)	(Detached)
2 Sockets in /var/run/screen/S-ijortengab.
```

Dari output diatas, maka process ID paling baru (32195) adalah milik dari *terminal server 2*, list output di-sort secara descending.

Untuk reattach screen yang lebih dari satu session, maka command ```screen -r``` akan menampilkan output yang sama dengan ```screen -ls```, kita perlu menambah argument berupa proses ID dari tiap session. Misalnya ```screen -r 32177``` untuk reattach *terminal server 1*.

## Nested Screen

Nested screen adalah window-window screen dalam satu session screen. 

Masuk ke salah satu session screen kemudian tekan tombol berikut ```Ctrl+a``` ```c``` akan tercipta satu buah window screen baru. Jika kita menekan kembali ```Ctrl+a``` ```c```, maka terbuat lagi window baru. Berarti total kita memiliki tiga window screen dalam satu session.

Untuk berpindah dari satu window ke window lain kita bisa menggunakan tombol:

- ```Ctrl+a``` ```0``` untuk mengakses window pertama.
- ```Ctrl+a``` ```1``` untuk mengakses window kedua.
- ```Ctrl+a``` ```2``` untuk mengakses window ketiga.

Jika kita berada di window kedua, maka menekan tombol ```Ctrl+a``` ```p``` akan memindahkan kita ke *previous* window yakni pindah ke window pertama.

Jika kita berada di window kedua, maka menekan tombol ```Ctrl+a``` ```n``` akan memindahkan kita ke *next* window yakni pindah ke window ketiga.

## Mematikan screen

Mematikan screen (quit/kill) berbeda dengan menutup screen (detach).

Tekan tombol ```Ctrl+a``` ```k``` untuk menge-kill satu window pada satu session. Jika hanya terdapat satu window pada satu session, maka session screen tersebut akan di-kill (terminate dari process).

## Penutup

Fitur-fitur lebih lanjut dari screen dapat dilihat dari manual screen dengan command ```man screen```.

Selamat menikmati terminal yang berjalan *server side*. 

## Reference

https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/

http://www.tecmint.com/screen-command-examples-to-manage-linux-terminals/

https://www.gnu.org/software/screen/manual/screen.html
