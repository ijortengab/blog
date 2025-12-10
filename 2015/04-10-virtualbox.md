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

![screenshot-1.jpg](/images/screenshot-1.jpg)

![screenshot-2.jpg](/images/screenshot-2.jpg)

![screenshot-3.jpg](/images/screenshot-3.jpg)

![screenshot-4.jpg](/images/screenshot-4.jpg)

![screenshot-5.jpg](/images/screenshot-5.jpg)

![screenshot-6.jpg](/images/screenshot-6.jpg)

![screenshot-7.jpg](/images/screenshot-7.jpg)

![screenshot-8.jpg](/images/screenshot-8.jpg)

![screenshot-9.jpg](/images/screenshot-9.jpg)

![screenshot-10.jpg](/images/screenshot-10.jpg)

## Create Virtual Machine

Jalankan aplikasi Oracle VM Virtualbox. Pilih New. Muncul window form. Pada
name: Ubuntuku. Type: Linux. Version: Ubuntu (32bit). Pada PC kantor terdapat
opsi untuk 64bit sementara pada Laptopku hanya tersedia opsi untuk 32bit.
Perlu settingan di BIOS pada opsi Virtualisasi agar opsi 64bit muncul.
Alokasi Memori saya pilih 512 MB. Alokasi storage saya pilih type VDI, Fix,
8 GB. Setelah konfigurasi ini, akan muncul pada sidebar sebuah virtual mesin
dengan nama Ubuntuku.

![screenshot-11.jpg](/images/screenshot-11.jpg)

![screenshot-13b.jpg](/images/screenshot-13b.jpg)

![screenshot-14.jpg](/images/screenshot-14.jpg)

![screenshot-15.jpg](/images/screenshot-15.jpg)

![screenshot-16.jpg](/images/screenshot-16.jpg)


## Install Ubuntu
Jalankan (Start) Virtual Mesin yang bernama Ubuntuku. Seharusnya muncul window
untuk start-up disk. Kita browse, select file .iso ubuntu versi 32bit (sesuai
dengan pilihan saat memilih version), lalu start. Window virtualbox kini
seperti layar dari sebuah PC yang sedang booting dari Optical Disc (CD/DVD).
Lakukan instalasi dan akan ada opsi restart jika finish.

![screenshot-17.jpg](/images/screenshot-17.jpg)

![screenshot-18.jpg](/images/screenshot-18.jpg)

![screenshot-19.jpg](/images/screenshot-19.jpg)

![ubuntuku1.png](/images/ubuntuku1.png)

![ubuntuku2.png](/images/ubuntuku2.png)

![ubuntuku3.png](/images/ubuntuku3.png)

![ubuntuku4.png](/images/ubuntuku4.png)

![ubuntuku5.png](/images/ubuntuku5.png)

![ubuntuku7.png](/images/ubuntuku7.png)

![ubuntuku6.png](/images/ubuntuku6.png)

![ubuntuku8.png](/images/ubuntuku8.png)

![ubuntuku9.png](/images/ubuntuku9.png)

![ubuntuku10.png](/images/ubuntuku10.png)

![ubuntuku11.png](/images/ubuntuku11.png)

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

![ubuntuku12.png](/images/ubuntuku12.png)

![ubuntuku13.png](/images/ubuntuku13.png)

![screenshot-20.jpg](/images/screenshot-20.jpg)

![ubuntuku14.png](/images/ubuntuku14.png)

![ubuntuku15.png](/images/ubuntuku15.png)

![ubuntuku16.png](/images/ubuntuku16.png)

![ubuntuku17.png](/images/ubuntuku17.png)

![ubuntuku18.png](/images/ubuntuku18.png)

![ubuntuku19.png](/images/ubuntuku19.png)

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

![screenshot-21.jpg](/images/screenshot-21.jpg)

![806568-screenshot-from-2015-04-10-11_07_03.png](/images/806568-screenshot-from-2015-04-10-11_07_03.png)

![screenshot-22.jpg](/images/screenshot-22.jpg)

![screenshot-23.jpg](/images/screenshot-23.jpg)

![705600-screenshot-from-2015-04-10-11_45_08.png](/images/705600-screenshot-from-2015-04-10-11_45_08.png)

![screenshot-24.jpg](/images/screenshot-24.jpg)

Virtual mesin sudah tercipta dan kini tersedia alat untuk belajar pengembangan
dan pengelolaan server.

## Referensi

 - http://askubuntu.com/questions/451805/screen-resolution-problem-with-ubuntu-14-04-and-virtualbox
 - http://serverfault.com/questions/225155/virtualbox-how-to-set-up-networking-so-both-host-and-guest-can-access-internet
