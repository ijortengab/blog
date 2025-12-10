# Virtual Machine - Install Ubuntu Server 16.04 LTS


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

> Untuk menghemat bandwidth, gambar screenshot dibawah ini diubah menjadi text.

> Klik pada text untuk mengubahnya kembali menjadi gambar.

> Klik tombol "Show All" untuk menampilkan semua gambar.

<button onclick="javascript:a2img.showAll();">Show All</button>

Tekan tombol New untuk memulai membuat virtual machine.

![Screenshot Program Virtual Box.](/images/screenshot.1023.png)

Isi nama dari VM. Sesuaikan tipe dan versinya.

![Screenshot window 'Create Virtual Machine'.](/images/screenshot.1024.png)

Tentukan alokasi memory RAM.

![Screenshot window 'Create Virtual Machine'.](/images/screenshot.1025.png)

Create a virtual hard disk now.

![Screenshot window 'Create Virtual Machine'.](/images/screenshot.1026.png)

Pilih tipe VDI (VirtualBox Disk Image).

![Screenshot window 'Create Virtual Hard Disk'.](/images/screenshot.1027.png)

Pilih Dynamically allocated.

![Screenshot window 'Create Virtual Hard Disk'.](/images/screenshot.1028.png)

File location and size.

![Screenshot window 'Create Virtual Hard Disk'.](/images/screenshot.1029.png)

Tekan tombol Start untuk memulai menjalankan virtual machine.

![Screenshot Program Virtual Box.](/images/screenshot.1030.png)

Untuk kali pertama, kita akan diminta startup disk. Pilih file image Ubuntu yang telah didownload.

![Screenshot window select start-up disk.](/images/screenshot.1031.png)

Pilih bahasa untuk memulai booting.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1032.png)

Menu utama instalasi. Pilih Install Ubuntu Server.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1033.png)

Pilih bahasa untuk digunakan selama instalasi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1034.png)

Pilih lokasi tempat server berada.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1035.png)

Pilih konfigurasi keyboard.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1036.png)

Proses loading komponen instalasi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1037.png)

Masukkan nama hostname.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1038.png)

Masukkan nama lengkap pengguna baru.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1039.png)

Masukkan username login pengguna baru.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1040.png)

Masukkan password bagi pengguna baru tersebut.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1041.png)

Masukkan kembali password. Konfirmasi untuk verifikasi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1042.png)

Pilihan encrypt home directory. Pilih no.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1043.png)

Pilihan zona waktu. Yes karena server berada di Asia/Jakarta.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1044.png)

Pilihan methode partisi. Guided - use entire disk and set up LVM

![Screenshot virtual machine Ubuntu.](/images/screenshot.1045.png)

Pilihan hard disk untuk partisi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1046.png)

Konfirmasi pilihan hard disk.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1047.png)

Pemilihan size volume partisi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1048.png)

Konfirmasi volume partisi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1049.png)

Proses instalasi sistem.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1050.png)

Setting proxy jika dibutuhkan untuk install package application.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1051.png)

Pilihan skema update sistem.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1052.png)

Pilihan software yang perlu diinstall.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1053.png)

Proses instalasi paket aplikasi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1054.png)

Pilihan boot loader.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1055.png)

Instalasi boot loader.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1056.png)

Notifikasi selesai instalasi.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1057.png)

Tampilan Shell setelah login.

![Screenshot virtual machine Ubuntu.](/images/screenshot.1058.png)

## References

<http://www.pcworld.com/article/3182088/linux/why-you-might-want-to-skip-ubuntu-1704.html>

[VirtualBox]: https://www.virtualbox.org/

[lewati]: http://www.pcworld.com/article/3182088/linux/why-you-might-want-to-skip-ubuntu-1704.html

[Kambing UI]: http://kambing.ui.ac.id/iso/ubuntu/

[1]: /blog/2017/08/24/virtual-machine-64bit/
