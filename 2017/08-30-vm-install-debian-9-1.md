# Virtual Machine - Install Debian 9.1


## Pendahuluan

Debian versi stable pada saat tulisan ini dibuat adalah Debian 9.1 code name
"stretch". Release pada tanggal [22 Juli 2017]

## Download

Untuk kebutuhan server, kita cukup menggunakan paket distribusi Debian
versi paling ringan yakni `net installer`.

Download dari repository [Kambing UI] dengan link
`http://kambing.ui.ac.id/iso/debian/9.1.0/amd64/iso-cd/debian-9.1.0-amd64-netinst.iso`.

## VirtualBox

Provider virtual machine yang kita gunakan adalah [VirtualBox] yang
[telah dilakukan konfigurasi][1] pada Host agar mendukung sistem operasi Guest
sebagai mesin 64bit.

Tahapan instalasi Debian tertera pada gambar-gambar di lampiran.

## Lampiran

> Untuk menghemat bandwidth, gambar screenshot dibawah ini diubah menjadi text.

> Klik pada text untuk mengubahnya kembali menjadi gambar.

> Klik tombol "Show All" untuk menampilkan semua gambar.

<button onclick="javascript:a2img.showAll();">Show All</button>

Tekan tombol New untuk memulai membuat virtual machine.

![Screenshot program VirtualBox.](/images/screenshot.1059.png)

Masukkan nama dari virtual machine.

![Screenshot window Create Virtual Machine.](/images/screenshot.1060.png)

Tentukan alokasi RAM. Default adalah 1 GB.

![Screenshot window Create Virtual Machine.](/images/screenshot.1061.png)

Pilihan membuat virtual hard disk. Create a virtual hard disk now.

![Screenshot window Create Virtual Machine.](/images/screenshot.1062.png)

Pilihan tipe virtual hard disk. VDI (VirtualBox Disk Image).

![Screenshot window Create Virtual Hard Disk.](/images/screenshot.1063.png)

Pilihan metode penyimpanan virtual hard disk. Dynamically allocated.

![Screenshot window Create Virtual Hard Disk.](/images/screenshot.1064.png)

Tentukan lokasi penyimpanan virtual hard disk.

![Screenshot window Create Virtual Hard Disk.](/images/screenshot.1065.png)

Klik tombol Start untuk memulai menjalankan virtual machine.

![Screenshot program VirtualBox.](/images/screenshot.1066.png)

Untuk kali pertama run, tentukan file image dot iso untuk menjalankan virtual CD.

![Screenshot window Select start-up disk.](/images/screenshot.1067.png)

Menu awal booting dari Debian. Pilih menu Install alih-alih Graphical Install untuk mempercepat proses.

![Screenshot virtual machine.](/images/screenshot.1068.png)

Tentukan bahasa yang digunakan selama proses instalasi.

![Screenshot virtual machine.](/images/screenshot.1069.png)

Tentukan lokasi mesin. Pilih other.

![Screenshot virtual machine.](/images/screenshot.1071.png)

Tentukan lokasi mesin. Pilih Asia.

![Screenshot virtual machine.](/images/screenshot.1072.png)

Tentukan lokasi mesin. Pilih Indonesia.

![Screenshot virtual machine.](/images/screenshot.1073.png)

Tentukan lokalisasi format.

![Screenshot virtual machine.](/images/screenshot.1074.png)

Tentukan konfigurasi keyoboard.

![Screenshot virtual machine.](/images/screenshot.1075.png)

Tentukan name server address. Skip.

![Screenshot virtual machine.](/images/screenshot.1076.png)

Masukkan nama host untuk virtual machine ini.

![Screenshot virtual machine.](/images/screenshot.1077.png)

Tentukan domain name. Skip.

![Screenshot virtual machine.](/images/screenshot.1078.png)

Masukkan password untuk user root.

![Screenshot virtual machine.](/images/screenshot.1079.png)

Konfirmasi untuk verifikasi. Masukkan kembali password untuk user root.

![Screenshot virtual machine.](/images/screenshot.1080.png)

Masukkan nama lengkap untuk satu pengguna reguler.

![Screenshot virtual machine.](/images/screenshot.1081.png)

Masukkan username untuk pengguna reguler tadi.

![Screenshot virtual machine.](/images/screenshot.1082.png)

Masukkan password untuk user reguler tersebut.

![Screenshot virtual machine.](/images/screenshot.1083.png)

Konfirmasi untuk verifikasi. Masukkan kembali passwordnya.

![Screenshot virtual machine.](/images/screenshot.1084.png)

Pilih time zone dari negara Indonesia. Pilih WIB.

![Screenshot virtual machine.](/images/screenshot.1085.png)

Pilih metode partisi. Guided - use entire disk.

![Screenshot virtual machine.](/images/screenshot.1086.png)

Pilih hard disk yang akan dipartisi.

![Screenshot virtual machine.](/images/screenshot.1087.png)

Pilih skema partisi. All files in one partition.

![Screenshot virtual machine.](/images/screenshot.1088.png)

Overview. Finish setting partisi.

![Screenshot virtual machine.](/images/screenshot.1089.png)

Konfirmasi untuk memulai melakukan partisi. Yes.

![Screenshot virtual machine.](/images/screenshot.1090.png)

Proses loading berdasarkan isi dari CD/DVD (file image dot iso saat ini).

![Screenshot virtual machine.](/images/screenshot.1092.png)

Konfirmasi penambahan CD/DVD berikutnya. No.

![Screenshot virtual machine.](/images/screenshot.1093.png)

Pilihan sumber repository mirror berdasarkan negara. Tekan tombol Escape untuk melewati tahap ini untuk mempercepat proses.

![Screenshot virtual machine.](/images/screenshot.1094.png)

Konfirmasi melewati repository mirror.

![Screenshot virtual machine.](/images/screenshot.1098.png)

Pertanyaan untuk mengikuti survey. Skip.

![Screenshot virtual machine.](/images/screenshot.1100.png)

Software Selection. Hanya menginstall komponen utama sistem operasi. Continue.

![Screenshot virtual machine.](/images/screenshot.1101.png)

Proses instalasi sistem operasi.

![Screenshot virtual machine.](/images/screenshot.1102.png)

Permintaan instalasi GRUB Loader di Master Boot Record. Yes.

![Screenshot virtual machine.](/images/screenshot.1103.png)

Pilih device untuk lokasi penginstallan GRUB Loader.

![Screenshot virtual machine.](/images/screenshot.1104.png)

Instalasi sistem operasi Debian selesai. Konfirmasi untuk reboot. Continue.

![Screenshot virtual machine.](/images/screenshot.1105.png)

Menu GRUB Loader setelah mesin di turn on.

![Screenshot virtual machine.](/images/screenshot.1106.png)

Login dengan username dan password. Setelah sukses otentikasi, Debian siap digunakan.

![Screenshot virtual machine.](/images/screenshot.1108.png)

## References

<https://www.debian.org/News/2017/20170722>

[22 Juli 2017]: https://www.debian.org/News/2017/20170722

[Kambing UI]: http://kambing.ui.ac.id/iso/debian/

[VirtualBox]: https://www.virtualbox.org/

[1]: /blog/2017/08/24/virtual-machine-64bit/
