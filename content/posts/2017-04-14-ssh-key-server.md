---
title: SSH Key untuk koneksi ke Server tanpa Password
slug: /blog/2017/04/14/ssh-key-server/
date: 2017-04-14
---

## Shortcut

Bagi pengguna Windows, terdapat cara cepat untuk masuk ke server via [putty]. Buka text editor, lalu isi sebagai berikut:

```
cd "C:\Program Files (x86)\PuTTY"
start putty.exe 1.2.3.4 -l ijortengab -pw s3cr3t
```

Sesuaikan variable diatas dengan value aktual, lalu save dengan nama file `login.bat`.

Eksekusi file `login.bat` maka Putty muncul dalam keadaan sudah login dan siap digunakan.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.749.png"></img>

## Ada cara yang lebih aman?

Cara diatas tidak aman karena menyimpan password (yakni `s3cr3t`) kedalam file text. 

Cara yang lebih aman ialah dengan menggunakan SSH key.

Masuk ke server dengan cara regular (input username dan password) sebagai user yang akan dibuat private key-nya. Misalnya user `ijortengab`. Buat file `authorized_keys` di dalam direktori `.ssh` di dalam HOME. Kemudian tingkatkan security agar group tidak bisa edit.

```
cd ~
mkdir .ssh
cd .ssh
touch authorized_keys
chmod g-w $HOME $HOME/.ssh $HOME/.ssh/authorized_keys
```

## Putty Generator

Download program `puttygen.exe` (bisa diambil dari [IjorTengab Tools][1] atau dari situs resmi http://www.putty.org/).

Program sudah tersedia jika instalasi `putty` menggunakan versi Installer `.msi`.

[1]: http://ijortengab.id/tools/

Jalankan `puttygen.exe`. 

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.750.png"></img>

Pada input `Number of bits in a generated key:` masukkan value `2048`. 

Pada input `Type of key to generate:` pilih value `SSH-2-RSA`.

Klik tombol Generate. Putar-putar cursor mouse di blank area fieldset `Key` agar tecipta random string.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.752.png"></img>

Tunggu sampai loading selesai sampai pair public dan private key tercipta. 

Block text dan copy pada fieldset Key `Public key for pasting into OpenSSH authorized_keys file:`.

Kemudian paste pada file `authorized_keys` di server. Satu baris untuk satu public key.

```
su ijortengab
cd ~/.ssh
vi authorized_keys
```

Save public key ke dalam file misal `C:\Users\ijortengab\.ssh\ijortengab-server1.pub` untuk tujuan backup.

Save private key ke dalam file misal `C:\Users\ijortengab\.ssh\ijortengab-server1.key.ppk`.

Passphrase kita kosongkan saja.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.753.png"></img>

## Finishing

Edit kembali file `login.bat`. Kini isi file menjadi:

```
cd "C:\Program Files (x86)\PuTTY"
start putty.exe 1.2.3.4 -l ijortengab -i "C:\Users\ijortengab\.ssh\ijortengab-server1.key.ppk"
```

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.754.png"></img>

Eksekusi file `login.bat` maka Putty muncul dalam keadaan sudah login dan siap digunakan.


[putty]: http://www.putty.org/




## Referensi

http://the.earth.li/~sgtatham/putty/0.53b/htmldoc/Chapter8.html

http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
