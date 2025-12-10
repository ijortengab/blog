---
title: Hapus Password Windows 7
---

## Disclaimer

Tulisan ini bisa digunakan untuk kejahatan atau kebaikan. Gunakan dengan bijak.

## Pendahuluan

Perhatikan Gambar.

![IMG_20170719_105017.png](/images/IMG_20170719_105017.png)

Seorang staff telah resign dari kantor. Komputer dia dikunci dengan password. Staff yang lain tidak ada yang tahu passwordnya.

Berhubung Sistem Operasi komputer tersebut adalah Windows 7, terdapat cara untuk menghapus (reset) password tersebut.

## Persiapan

Siapkan Hiren Boot USB (Flash Disk). Caranya telah dijelaskan pada [tulisan sebelumnya][1].

![IMG_20170720_103744.png" width="400](/images/IMG_20170720_103744.png" width="400)

## Hack

Colok USB Flash Disk ke PC.

![IMG_20170719_110227.png](/images/IMG_20170719_110227.png)

Nyalakan PC, dan boot melalui Flash Disk (Kingston DataTraveler).

![IMG_20170719_110256.png](/images/IMG_20170719_110256.png)

Jika boot berhasil, maka kita akan tiba di GRUB4DOS. Pilih menu "<strong>Offline NT/2000/XP/Vista/7 Password Changer</strong>".

![IMG_20170719_124111.png](/images/IMG_20170719_124111.png)

Loading berbagai library, tunggu sampai selesai. Ketika sudah hening, tekan ENTER.

![IMG_20170719_124145.png](/images/IMG_20170719_124145.png)

Muncul dialog untuk memilih partisi. Disini kita perlu menduga partisi mana yang terinstall Windows. 

Berdasarkan pengalaman, maka:

Partisi 1 yang hanya 100MB adalah partisi boot yang dibuat oleh proses Instalasi Windows.

Partisi 2 dengan size 100GB kemungkinan adalah drive C:\ yang berisi <abbr title="Operating System">OS</abbr> Windows.

Partisi 3 dengan size 200GB kemungkinan adalah drive D:\ untuk penyimpanan data.

Partisi 4 tentunya adalah Flash Disk.

Maka dialog dijawab dengan memilih nomor 2.

![IMG_20170719_124427.png](/images/IMG_20170719_124427.png)

Muncul dialog untuk menanyakan path to the registry directory. Tekan ENTER untuk memilih jawaban default (yakni windows/system32/config).

![IMG_20170719_124242.png](/images/IMG_20170719_124242.png)

Muncul dialog untuk menanyakan part of registry to load. Tekan ENTER untuk memilih jawaban default (yakni 1). Opsi 1 adalah opsi untuk Password Reset.

![IMG_20170719_124613.png](/images/IMG_20170719_124613.png)


Muncul dialog untuk memilih task. Tekan ENTER untuk memilih jawaban default (yakni 1). Opsi 1 adalah opsi untuk "Edit user data dan passwords"

![IMG_20170719_124634.png](/images/IMG_20170719_124634.png)

Muncul dialog untuk memilih username yang akan diedit. Pada chapter Pendahuluan telah diketahui bahwa username yang digunakan adalah "owner". Oleh karena itu ketik "owner" dan tekan ENTER.

![IMG_20170719_124745.png](/images/IMG_20170719_124745.png)

Muncul dialog untuk memilih opsi edit. Ketik 1 dan tekan ENTER. Opsi 1 adalah untuk menghapus (clear) password.

![IMG_20170719_124805.png](/images/IMG_20170719_124805.png)

Muncul notifikasi berupa tulisan "Password cleared!".

Selanjutnya tersisa opsi untuk save dan exit.

# Hasil

Reboot kembali PC dan barrier login telah hilang.

![IMG_20170719_125152.png](/images/IMG_20170719_125152.png)

Berhasil masuk ke dalam sistem Windows 7 tanpa perlu memasukkan password.

![IMG_20170719_125217.png](/images/IMG_20170719_125217.png)

## Referensi

Buku Seni Teknik Hacking 1 oleh S'to penerbit Jasakom.

http://www.hirensbootcd.org/resetting-windows-password/

[1]: /blog/2017/07/20/hiren-boot-usb/