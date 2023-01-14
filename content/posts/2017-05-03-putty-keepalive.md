---
title: Keepalive pada PuTTy.exe secara CLI
slug: /blog/2017/05/03/putty-keepalive/
date: 2017-05-03
---

## Keepalive

PuTTy adalah software ssh client untuk masuk ke dalam server dan bekerja secara Command Line Interface.

Untuk mencegah timeout (server disconnect karena idle), kita bisa menggunakan fitur `keepalive` yang disediakan PuTTy, yakni pada opsi sbb:

Pada input:

```
PuTTy > Category > Connection > Sending of null packets to keep session active > Seconds between keepalives:
```

Isi dengan value antara 10 sampai 30 (satuan detik). Saya prefer di angka `10`.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.820.png"></img>

## Permasalahan

Kebutuhan akan opsi keepalive terpenuhi saat startup PuTTy secara GUI (Graphic User Interface).

Namun untuk eksekusi `putty.exe` secara CLI (Command Line Interface) tidak ditemukan adanya opsi untuk keepalive.

Beberapa server yang Saya *handle* mudah terjadi timeout dengan sedikit saja `idle`.

## Solusi

Solusinya adalah mengakali fitur `keepalive` yang tersedia secara GUI dengan opsi `load` yang tersedia secara CLI.

Jalankan PuTTy secara GUI terlebih dahulu.

Buat session bernama (contoh) `keepalive` dan pada opsi keepalive berikan nilai `10` (yang berarti tiap 10 detik mengirim dummy package).

Opsi lainnya dikosongkan (atau opsi default) seperti host name, port, type, dll.

Kemudian save session tersebut.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.822.png"></img>

## Test

Jalankan putty.exe dengan pola sebagai berikut:

```
putty.exe -load keepalive 1.2.3.4 -l root -i "C:\Users\whoami\.ssh\secret.ppk"
```

Sesuaikan value dengan kondisi aktual. Maka berdasarkan pengalaman empirik, cara tersebut work dan sukses.

Happy ngoprek.