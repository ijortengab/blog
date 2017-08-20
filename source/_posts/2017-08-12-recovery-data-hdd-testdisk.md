---
title: Recovery Data pada Hard Disk Drive menggunakan TestDisk
---

## Muqaddimah

Seluruh isi data di hard disk terhapus. 

All partition has been accidentally deleted.

Bagaimana cara mengembalikan data yang ada didalamnya?

## Persiapan

Proses selama recovery menggunakan sistem operasi Windows 7.

Masuk ke Computer Management. Ketik `compmgmt.msc` pada Run.

<img cloudinary="ijortengab.id/screenshot.958.png">

Lihat pada Computer Management > Storage > Disk Management. 

Akan terlihat berbagai storage yang tercolok ke dalam komputer (laptop).

<img cloudinary="ijortengab.id/screenshot.959.png" width="800">

Saat ini baru terdapat satu SSD berukuran 128GB dengan 3 partisi didalamnya.

Colok hard disk yang akan kita recovery menggunakan converter SATA to USB.

<img cloudinary="ijortengab.id/IMG_20170812_061534.jpg" width="800">

Pada Disk Management akan tertera tambahan Disk baru yakni Disk1. 

Disk ini adalah HDD 500GB yang seluruh partisi terhapus.

<img cloudinary="ijortengab.id/screenshot.960.png" width="800">

## Recovery menggunakan TestDisk.

Sebuah proyek opensource bernama "TestDisk" memiliki fitur mengembalikan partisi yang terhapus.

Download program dari homepagenya http://www.cgsecurity.org/.

<img cloudinary="ijortengab.id/screenshot.965.png" width="800">

Versi yang saya gunakan adalah versi 7.1 (beta), versi terbaru per Agustus 2017.

File program telah dibuat mirror pada [IjorTengab Tools][tools]. Download [32bit][1] atau [64bit][2]. 

[tools]: /blog/2017/03/16/repository-pribadi-tools/

[1]:http://ijortengab.id/tools/testdisk-7.1-WIP.win.zip

[2]:http://ijortengab.id/tools/testdisk-7.1-WIP.win64.zip

Extract archive hasil download dan temukan file binary `testdisk_win.exe`.

## Gerak Lambat

Alih-alih gerak cepat, kita perlu perlambat ritme saat recovery.

Jalankan file binary `testdisk_win.exe`.

Opsi untuk membuat log. Create.

<img cloudinary="ijortengab.id/screenshot.994.png">

Pilih hard disk. Perhatikan pada ukuran hard disk. Pada gambar terlihat bahwa:

- /dev/sda adalah SSD 128GB
- /dev/sdb adalah HDD 500GB

Oleh karena itu kita pilih `/dev/sdb`. Proceed.

<img cloudinary="ijortengab.id/screenshot.993.png">

Pilih tipe partisi. Sesuai pada panduan di [wiki], maka opsi default yang kita pilih (autodetect) yakni `Intel`. 

<img cloudinary="ijortengab.id/screenshot.976.png">

Memulai Analyze.

<img cloudinary="ijortengab.id/screenshot.977.png">

Pilih Quick Search.

<img cloudinary="ijortengab.id/screenshot.978.png">

Proses pencarian partisi yang hilang dimulai.

<img cloudinary="ijortengab.id/screenshot.979.png">

Proses pencarian selesai. Continue.

<img cloudinary="ijortengab.id/screenshot.980.png">

Terlihat beberapa partisi yang terdelete. Kita perlu memeriksanya secara manual melalui opsi `P` yakni list files.

Pada gambar tertera 3 partisi.

<img cloudinary="ijortengab.id/screenshot.981.png">

Partisi yang pertama yakni:

```
* (Primary bootable). HPFS - NTFS. Start pada 0 32 33 dan End pada 12 223 19.
```

Partisi ini dalam keadaan baik-baik saja. Skip.

Partisi yang kedua yakni:

```
D (Deleted) HPFS - NTFS. Start pada 12 223 20 dan End pada 25496 139 51. 
```

Partisi yang ketiga yakni:

```
D (Deleted) HPFS - NTFS. Start pada 13 1 1 dan End pada 60800 254 63. 
```

Partisi kedua dan ketiga sama-sama berstatus Delete.

Posisi keduanya saling overlap. 

Berarti salah satu adalah partisi yang dapat ter-recover.

Menurut panduan di [wiki], kita perlu cek manual dengan melihat isi file.

Pilih partisi baris kedua dan tekan `P` untuk list files. Hasilnya adalah partisi tidak dapat terbaca. Tekan q, untuk kembali ke halaman sebelumnya.

<img cloudinary="ijortengab.id/screenshot.987.png">

Pilih partisi baris ketiga dan tekan `P` untuk list files. Hasilnya adalah partisi dapat terbaca. 

Partisi ketiga ini adalah kondisi partisi terbaru sebelum hard disk terhapus.

<img cloudinary="ijortengab.id/screenshot.986.png">

Tekan q, untuk kembali ke halaman sebelumnya.

Partisi pada baris ketiga yang akan kita recovery, tekan tombol panah kiri/kanan sehingga status berubah dari `D` ke `P`.

<img cloudinary="ijortengab.id/screenshot.988.png">

Pastikan baris partisi yang akan kita recovery ter-highlight. Enter to continue.

Masuk ke menu terakhir. Pilih write untuk mengembalikan partisi.

<img cloudinary="ijortengab.id/screenshot.990.png">

Menu terakhir adalah Quit dan reboot komputer untuk melihat effectnya.

Pada windows shortcut untuk reboot adalah `shutdown -r -t 0`.

## Partisi terselamatkan

Setelah reboot, partisi otomatis terlihat pada `My Computer` ter-mount dengan letter `J`.

<img cloudinary="ijortengab.id/screenshot.992.png" width="800">

Alhamdulillah, data terselamatkan.

<img cloudinary="ijortengab.id/screenshot.995.png" width="800">

## Jangan lupa donasi

Dalam rangka berterimakasih karena ini kasus yang sangat private (data pribadi), maka donasi adalah jalan yang tepat.

<img cloudinary="ijortengab.id/screenshot.996.png" style="border:1px solid black;">

<img cloudinary="ijortengab.id/screenshot.997.png" width="800"  style="border:1px solid black;">

## Reference

[wiki]: https://www.cgsecurity.org/wiki/TestDisk_Step_By_Step

Google: open source recovery partition

http://www.cgsecurity.org/wiki/TestDisk
