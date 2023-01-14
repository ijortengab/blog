---
title: Virtual Machine 64bit
slug: /blog/2017/08/24/virtual-machine-64bit/
date: 2017-08-24
---

## Pendahuluan

Salah satu provider virtual machine adalah [VirtualBox].

[VirtualBox]: /blog/2015/04/10/virtualbox/

Saat akan memilih virtual machine, maka opsi yang tersedia ternyata hanya CPU
32bit.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.1017.png"></img>

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.1018.png"></img>

Jika dipaksakan menginstall sistem operasi 64 bit akan muncul notifikasi gagal.

Contoh saat menginstall Debian 64bit di CPU 32bit:

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/VirtualBox_24_08_2017_09_22_59.png"></img>

## Pertanyaan

Bagaimanakah agar kita bisa mendapatkan virtual machine 64bit?

## Solusi

> Note: You can use Windows Virtual PC to run Windows XP Mode on your computer.
> Windows Virtual PC requires processor capable of hardware virtualization,
> with AMD-V., Intel® VT or VIA® VT turned on in the BIOS.

Sumber: https://www.microsoft.com/en-us/download/details.aspx%3Fid=8002

Berdasarkan pengalaman dan sesuai dengan kutipan dari website Microsoft
diatas, maka kita perlu meng-enable fitur Virtualisasi Prosesor di BIOS.

Pastikan prosesor yang tertanam pada motherboard mendukung fitur Virtualisasi.
Contoh yang mendukung yakni:

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.1020.png" width="800"></img>

## Setup Bios

Untuk laptop Lenovo Thinkpad, cara masuk ke Setup BIOS adalah dengan menekan F1
segera setelah menekan tombol power untuk turn on.

Masuk ke tab "Security" >> menu "Virtualization" dan Enable pada Item
"Intel (R) Virtualization Technology" dan kemudian Save.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/IMG_20170824_100637.jpg"></img>

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/IMG_20170824_100724.jpg"></img>

Setelah Restart, maka opsi 64 bit pada virtual machine di VirtualBox akhirnya
muncul.

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.1021.png"></img>

<img src="https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/screenshot.1022.png"></img>

