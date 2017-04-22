---
title: SSH Key untuk koneksi ke Server tanpa Password
---

## Shortcut

Bagi pengguna Windows, terdapat cara cepat untuk masuk ke server via [putty]. Buka text editor, lalu isi sebagai berikut:

```
cd "C:\Program Files (x86)\PuTTY"
start putty.exe 1.2.3.4 -l ijortengab -pw s3cr3t
```

Sesuaikan variable diatas dengan value aktual, lalu save dengan nama file `login.bat`.

Eksekusi file `login.bat` maka Putty muncul dalam keadaan sudah login dan siap digunakan.

<img cloudinary="ijortengab.id/screenshot.749.png">

## Ada cara yang lebih aman?

Cara diatas tidak aman karena menyimpan password (yakni `s3cr3t`) kedalam file text. 

Cara yang lebih aman ialah dengan menggunakan SSH key.

Login sebagai user yang akan dibuat private key-nya. Misalnya user `ijortengab`. Buat file `authorized_keys` di dalam direktori `.ssh` di dalam HOME. Kemudian tingkatkan security agar group tidak bisa edit.

```
cd ~
mkdir .ssh
cd .ssh
touch authorized_keys
chmod g-w $HOME $HOME/.ssh $HOME/.ssh/authorized_keys
```

## Putty Generator

Pastikan Putty yang terinstall versi lengkap satu set yang mana instalasi Putty menggunakan Windows Installer (.msi). Sehingga pada direktori instalasi terdapat program `puttygen.exe`.

Jalankan `puttygen.exe`. 

<img cloudinary="ijortengab.id/screenshot.750.png">

Pada input `Number of bits in a generated key:` masukkan value `2048`. 

Pada input `Type of key to generate:` pilih value `SSH-2-RSA`.

Klik tombol Generate. Putar-putar cursor mouse di blank area fieldset `Key` agar tecipta random string.

<img cloudinary="ijortengab.id/screenshot.752.png">

Tunggu sampai loading selesai sampai pair public dan private key tercipta. 

Block text dan copy pada fieldset Key `Public key for pasting into OpenSSH authorized_keys file:`.

Kemudian paste pada file `authorized_keys` di server.

```
su ijortengab
cd ~/.ssh
vi authorized_keys
```

Save public key ke dalam file misal `C:\Users\ijortengab\.ssh\ijortengab-server1.pub`.

Save private key ke dalam file misal `C:\Users\ijortengab\.ssh\ijortengab-server1.key.ppk`.

Passphrase kita kosongkan saja.

<img cloudinary="ijortengab.id/screenshot.753.png">

## Finishing

Edit kembali file `login.bat`. Kini isi file menjadi:

```
cd "C:\Program Files (x86)\PuTTY"
start putty.exe 1.2.3.4 -l ijortengab -i "C:\Users\ijortengab\.ssh\ijortengab-server1.key.ppk"
```

<img cloudinary="ijortengab.id/screenshot.754.png">

Eksekusi file `login.bat` maka Putty muncul dalam keadaan sudah login dan siap digunakan.


[putty]: http://www.putty.org/




## Referensi

http://the.earth.li/~sgtatham/putty/0.53b/htmldoc/Chapter8.html

http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html

