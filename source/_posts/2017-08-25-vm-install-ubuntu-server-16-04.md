---
title: Virtual Machine - Install Ubuntu Server 16.04 LTS
---

## Pendahuluan

Tulisan ini dibuat pada bulan Agustus 2017, dan saat ini versi Ubuntu yang 
terbaru adalah 17.04 (release pada tahun 17 bulan 04 alias April 2017).

Meski demikian, versi ini dapat kita [lewati] dan lebih memilih versi yang 
termasuk LTS (Long Term Support) yakni 16.04 (release pada tahun 16 bulan 04
alias April 2016).

## Download

Ubuntu versi 16.04.3 dapat kita download pada repository [Kambing UI] dengan link
`http://kambing.ui.ac.id/iso/ubuntu/releases/xenial/ubuntu-16.04.3-server-amd64.iso`

## VirtualBox

Provider virtual machine yang kita gunakan adalah [VirtualBox] yang 
[telah dilakukan konfigurasi][1] pada Host agar mendukung sistem operasi Guest 
sebagai mesin 64bit. 

Tahapan instalasi Ubuntu Server tertera pada gambar-gambar di lampiran.

## Lampiran

Untuk menghemat bandwidth, gambar screenshot dibawah ini diubah menjadi text. 

Klik text untuk menampilkan gambar.

Klik tombol "Show All" untuk menampilkan semua gambar.

<button onclick="javascript:a2img.showAll();">Show All</button>

[Screenshot Program Virtual Box. Tekan tombol New untuk memulai membuat virtual machine.](image://ijortengab.id/screenshot.1023.png)

[Screenshot window 'Create Virtual Machine'. Isi nama dari VM. Sesuaikan tipe dan versinya.](image://ijortengab.id/screenshot.1024.png)

[Screenshot window 'Create Virtual Machine'. Tentukan alokasi memory RAM.](image://ijortengab.id/screenshot.1025.png)

[Screenshot window 'Create Virtual Machine'. Create a virtual hard disk now.](image://ijortengab.id/screenshot.1026.png)

[Screenshot window 'Create Virtual Hard Disk'. Pilih tipe VDI (VirtualBox Disk Image).](image://ijortengab.id/screenshot.1027.png)

[Screenshot window 'Create Virtual Hard Disk'. Pilih Dynamically allocated.](image://ijortengab.id/screenshot.1028.png)

[Screenshot window 'Create Virtual Hard Disk'. File location and size](image://ijortengab.id/screenshot.1029.png)

[Screenshot Program Virtual Box. Tekan tombol Start untuk memulai menjalankan virtual machine.](image://ijortengab.id/screenshot.1030.png)

[Screenshot window select start-up disk. Untuk kali pertama, kita akan diminta startup disk. Pilih file image Ubuntu yang telah didownload.](image://ijortengab.id/screenshot.1031.png)

[Screenshot virtual machine Ubuntu. Pilih bahasa untuk memulai booting.](image://ijortengab.id/screenshot.1032.png)

[Screenshot virtual machine Ubuntu. Menu utama instalasi. Pilih Install Ubuntu Server.](image://ijortengab.id/screenshot.1033.png)

[Screenshot virtual machine Ubuntu. Pilih bahasa untuk digunakan selama instalasi.](image://ijortengab.id/screenshot.1034.png)

[Screenshot virtual machine Ubuntu. Pilih lokasi tempat server berada.](image://ijortengab.id/screenshot.1035.png)

[Screenshot virtual machine Ubuntu. Pilih konfigurasi keyboard.](image://ijortengab.id/screenshot.1036.png)

[Screenshot virtual machine Ubuntu. Proses loading komponen instalasi.](image://ijortengab.id/screenshot.1037.png)

[Screenshot virtual machine Ubuntu. Masukkan nama hostname.](image://ijortengab.id/screenshot.1038.png)

[Screenshot virtual machine Ubuntu. Masukkan nama lengkap pengguna baru.](image://ijortengab.id/screenshot.1039.png)

[Screenshot virtual machine Ubuntu. Masukkan username login pengguna baru.](image://ijortengab.id/screenshot.1040.png)

[Screenshot virtual machine Ubuntu. Masukkan password bagi pengguna baru tersebut.](image://ijortengab.id/screenshot.1041.png)

[Screenshot virtual machine Ubuntu. Masukkan kembali password. Konfirmasi untuk verifikasi.](image://ijortengab.id/screenshot.1042.png)

[Screenshot virtual machine Ubuntu. Pilihan encrypt home directory. Pilih no.](image://ijortengab.id/screenshot.1043.png)

[Screenshot virtual machine Ubuntu. Pilihan zona waktu. Yes karena server berada di Asia/Jakarta.](image://ijortengab.id/screenshot.1044.png)

[Screenshot virtual machine Ubuntu. Pilihan methode partisi. Guided - use entire disk and set up LVM](image://ijortengab.id/screenshot.1045.png)

[Screenshot virtual machine Ubuntu. Pilihan hard disk untuk partisi.](image://ijortengab.id/screenshot.1046.png)

[Screenshot virtual machine Ubuntu. Konfirmasi pilihan hard disk.](image://ijortengab.id/screenshot.1047.png)

[Screenshot virtual machine Ubuntu. Pemilihan size volume partisi.](image://ijortengab.id/screenshot.1048.png)

[Screenshot virtual machine Ubuntu. Konfirmasi volume partisi.](image://ijortengab.id/screenshot.1049.png)

[Screenshot virtual machine Ubuntu. Proses instalasi sistem.](image://ijortengab.id/screenshot.1050.png)

[Screenshot virtual machine Ubuntu. Setting proxy jika dibutuhkan untuk install package application.](image://ijortengab.id/screenshot.1051.png)

[Screenshot virtual machine Ubuntu. Pilihan skema update sistem. ](image://ijortengab.id/screenshot.1052.png)

[Screenshot virtual machine Ubuntu. Pilihan software yang perlu diinstall.](image://ijortengab.id/screenshot.1053.png)

[Screenshot virtual machine Ubuntu. Proses instalasi paket aplikasi.](image://ijortengab.id/screenshot.1054.png)

[Screenshot virtual machine Ubuntu. Pilihan boot loader.](image://ijortengab.id/screenshot.1055.png)

[Screenshot virtual machine Ubuntu. Instalasi boot loader.](image://ijortengab.id/screenshot.1056.png)

[Screenshot virtual machine Ubuntu. Notifikasi selesai instalasi.](image://ijortengab.id/screenshot.1057.png)

Screenshot virtual machine Ubuntu. Tampilan Shell setelah login.

![Screenshot virtual machine Ubuntu. Tampilan Shell setelah login.](image://ijortengab.id/screenshot.1058.png)

## References

<http://www.pcworld.com/article/3182088/linux/why-you-might-want-to-skip-ubuntu-1704.html>

[VirtualBox]: https://www.virtualbox.org/

[lewati]: http://www.pcworld.com/article/3182088/linux/why-you-might-want-to-skip-ubuntu-1704.html

[Kambing UI]: http://kambing.ui.ac.id/iso/ubuntu/

[1]: /blog/2017/08/24/virtual-machine-64bit/

