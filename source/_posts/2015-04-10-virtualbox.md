---
layout: post
title: 'Belajar Virtual Box'
date: 2015-04-10 04:56
comments: true
categories: [virtualbox]
---
Dalam rangka belajar dan menambah pengetahuan tentang pengembangan dan
pengelolaan server, aku mulai menginstall virtual mesin pada laptop dan PC
kantor. Software yang kugunakan adalah
[virtualbox](https://www.virtualbox.org/).

Beberapa istilah dalam virtual mesin ialah Host dan Guest. Host adalah sebutan
untuk mesin utama yang fisiknya benar-benar ada, sementara Guest adalah sebutan
untuk mesin virtualnya. Host yang kugunakan, baik laptop maupun PC kantor,
sama-sama menggunakan windows 7 OEM dan untuk Guest aku memilih sistem operasi
Ubuntu. Versi yang digunakan adalah Ubuntu 14.04 LTS alih-alih versi 14.10
(versi terbaru saat tulisan ini dibuat).

Langkah-langkah yang kulakukan adalah sebagai berikut:

1. Download
2. Install Virtual Box
3. Create Virtual Machine
4. Install Ubuntu
5. Install Guest Additions
6. Network setup

## Download
Seluruh file yang didownload adalah versi terbaru per tanggal 9 April 2015.

**Virtualbox**. Sistem operasi di laptop dan PC kantor adalah windows 7 64bit,
sehingga aku memilih opsi VirtualBox 4.3.26 for Windows hosts x86/amd64.
Download pada link berikut: https://www.virtualbox.org/wiki/Downloads.

**Ubuntu** 14.04 Image file (.iso). Saya mengambil file yang 32 bit dan 64bit,
untuk sebagai persiapan jika butuh platform mesin yang berbeda. Versi desktop
saya pilih dibanding server karena kebutuhan akan <abbr title="Graphical user
interface">GUI</abbr>. Download pada link berikut:
http://kambing.ui.ac.id/iso/ubuntu/releases/14.04/.

Keseluruhan file yang saya dapat sebagai bahan belajar virtual mesin adalah:

 - VirtualBox-4.3.26-98988-Win.exe
 - ubuntu-14.04.2-desktop-amd64.iso
 - ubuntu-14.04.2-desktop-i386.iso


## Install Virtual Box
Eksekusi file installer virtual box dan lakukan step-step yang diminta. Jika
diminta instal device, maka pilih Instal.

<img cloudinary="ijortengab.id/screenshot-1.jpg">

<img cloudinary="ijortengab.id/screenshot-2.jpg">

<img cloudinary="ijortengab.id/screenshot-3.jpg">

<img cloudinary="ijortengab.id/screenshot-4.jpg">

<img cloudinary="ijortengab.id/screenshot-5.jpg">

<img cloudinary="ijortengab.id/screenshot-6.jpg">

<img cloudinary="ijortengab.id/screenshot-7.jpg">

<img cloudinary="ijortengab.id/screenshot-8.jpg">

<img cloudinary="ijortengab.id/screenshot-9.jpg">

<img cloudinary="ijortengab.id/screenshot-10.jpg">

## Create Virtual Machine

Jalankan aplikasi Oracle VM Virtualbox. Pilih New. Muncul window form. Pada
name: Ubuntuku. Type: Linux. Version: Ubuntu (32bit). Pada PC kantor terdapat
opsi untuk 64bit sementara pada Laptopku hanya tersedia opsi untuk 32bit.
Perlu settingan di BIOS pada opsi Virtualisasi agar opsi 64bit muncul.
Alokasi Memori saya pilih 512 MB. Alokasi storage saya pilih type VDI, Fix,
8 GB. Setelah konfigurasi ini, akan muncul pada sidebar sebuah virtual mesin
dengan nama Ubuntuku.

<img cloudinary="ijortengab.id/screenshot-11.jpg">

<img cloudinary="ijortengab.id/screenshot-13b.jpg">

<img cloudinary="ijortengab.id/screenshot-14.jpg">

<img cloudinary="ijortengab.id/screenshot-15.jpg">

<img cloudinary="ijortengab.id/screenshot-16.jpg">


## Install Ubuntu
Jalankan (Start) Virtual Mesin yang bernama Ubuntuku. Seharusnya muncul window
untuk start-up disk. Kita browse, select file .iso ubuntu versi 32bit (sesuai
dengan pilihan saat memilih version), lalu start. Window virtualbox kini
seperti layar dari sebuah PC yang sedang booting dari Optical Disc (CD/DVD).
Lakukan instalasi dan akan ada opsi restart jika finish.

<img cloudinary="ijortengab.id/screenshot-17.jpg">

<img cloudinary="ijortengab.id/screenshot-18.jpg">

<img cloudinary="ijortengab.id/screenshot-19.jpg">

<img cloudinary="ijortengab.id/ubuntuku1.png">

<img cloudinary="ijortengab.id/ubuntuku2.png">

<img cloudinary="ijortengab.id/ubuntuku3.png">

<img cloudinary="ijortengab.id/ubuntuku4.png">

<img cloudinary="ijortengab.id/ubuntuku5.png">

<img cloudinary="ijortengab.id/ubuntuku7.png">

<img cloudinary="ijortengab.id/ubuntuku6.png">

<img cloudinary="ijortengab.id/ubuntuku8.png">

<img cloudinary="ijortengab.id/ubuntuku9.png">

<img cloudinary="ijortengab.id/ubuntuku10.png">

<img cloudinary="ijortengab.id/ubuntuku11.png">

## Install Guest Additions

Tampilan resolusi dari ubuntu saat kali pertama muncul adalah 640x 480 pixels
(dapat dicek pada System Settings >> Displays) dan resolusi ini tidak dapat
dinaikkan menjadi lebih tinggi. Solusi untuk ini ialah kita menginstall
software bawaan Virtualbox pada Ubuntu.

Masukkan file CD Image (.iso) bawaan Virtual box (secara default berada pada
lokasi path `C:\Program Files\Oracle\VirtualBox\VBoxGuestAdditions.iso`) kedalam
virtual machine. Pada window virtual machine, pilih menu
*Devices* >> *CD/DVD Devices* >> *Choose a virtual CD/DVD disk file...* .
Lalu pilih file `VBoxGuestAdditions.iso` tersebut.

Kini, kita seolah-olah memasukkan CD kedalam mesin ubuntu, sehingga secara
default muncul pop up dari ubuntu untuk menjalankan fitur autorun pada CD
tersebut. Tekan tombol run, instalasi program addition dari virtual box akan
berjalan. Setelah selesai maka restart, dan resolusi layar dari virtual mesin
kini menjadi 1024x768 dan dapat diubah menjadi variasi lainnya.

<img cloudinary="ijortengab.id/ubuntuku12.png">

<img cloudinary="ijortengab.id/ubuntuku13.png">

<img cloudinary="ijortengab.id/screenshot-20.jpg">

<img cloudinary="ijortengab.id/ubuntuku14.png">

<img cloudinary="ijortengab.id/ubuntuku15.png">

<img cloudinary="ijortengab.id/ubuntuku16.png">

<img cloudinary="ijortengab.id/ubuntuku17.png">

<img cloudinary="ijortengab.id/ubuntuku18.png">

<img cloudinary="ijortengab.id/ubuntuku19.png">

## Network setup

Sekarang kita perlu ping dari Host (Windows 7) ke Guest (Ubuntu 14.04) agar
nantinya bisa kita bermain-main dengan program yang berhubungan dengan jaringan
seperti web server, file sharing, dsb.

Saat instalasi virtualbox pada Host, akan terdapat virtual kartu jaringan
(ethernet) yang bernama *Ethernet adapter VirtualBox Host-Only Network*. Hasil
command ipconfig/all pada Command Prompt memberi kita informasi bahwa virtual
kartu jaringan tersebut memiliki alamat IP Lokal 192.168.56.1. Agar bisa terjadi
komunikasi dengan Guest (ubuntu), maka alamat IP Ubuntu setidaknya berada pada
kisaran `192.168.56.*`.

Sementara hasil command ifconfig -a pada Terminal Ubuntu (CTRL+ALT+T) memberi
kita informasi bahwa terdapat 1 buah ethernet bernama eth0 dengan alamat
IP 10.0.2.15. Kita perlu menambah satu kartu jaringan lagi pada Guest dimana
kita perlu configurasi pada VirtualBox.

Shutdown Ubuntu, masuk ke Settings pada Guest Ubuntuku. Pada menu Network kita
melihat Adapter 1 otomatis tersedia secara default. Kita beralih ke
Tab Adapter 2. Disini kita Enabled, dan attached to Host-only Adapter. Tekan
tombol OK. Turn On kembali Guest Ubuntuku, dan kini sudah terdapat ethernet baru
bernama eth1 dengan alamat IP lokal 192.168.56.101. Saat dilakukan ping dari
Host ke Guest hasilnya terdapat respon yang artinya antara Host dan Guest sudah
dapat saling berkomunikasi.

<img cloudinary="ijortengab.id/screenshot-21.jpg">

<img cloudinary="ijortengab.id/806568-screenshot-from-2015-04-10-11_07_03.png">

<img cloudinary="ijortengab.id/screenshot-22.jpg">

<img cloudinary="ijortengab.id/screenshot-23.jpg">

<img cloudinary="ijortengab.id/705600-screenshot-from-2015-04-10-11_45_08.png">

<img cloudinary="ijortengab.id/screenshot-24.jpg">

Virtual mesin sudah tercipta dan kini tersedia alat untuk belajar pengembangan
dan pengelolaan server.

## Referensi

 - http://askubuntu.com/questions/451805/screen-resolution-problem-with-ubuntu-14-04-and-virtualbox
 - http://serverfault.com/questions/225155/virtualbox-how-to-set-up-networking-so-both-host-and-guest-can-access-internet
