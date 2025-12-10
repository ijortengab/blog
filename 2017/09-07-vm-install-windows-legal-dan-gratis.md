---
title: Virtual Machine - Install Windows legal dan gratis
---

## Pendahuluan

Menginstall sistem operasi Windows ke mesin PC fisik diperlukan license dengan
biaya tertentu.

Meski demikian, Microsoft menyediakan sistem operasi [Windows versi virtual][1]
yang dapat digunakan gratis dan legal untuk tujuan testing dan non commercial.

Versi virtual machine Windows yang dapat diperoleh sampai tulisan ini dibuat 
adalah versi `Windows 7`, `Windows 8.1`, dan `Windows 10`. Bagaimana dengan 
Windows XP?

![Screenshot halaman web Microsoft Download Virtual Machines](/images/screenshot.1158.png)

`Windows XP` telah berakhir masa support oleh Microsoft pada tahun 2014.

Untuk bisa menggunakan virtual machine Windows XP, terdapat program terpisah
bernama **Windows XP Mode**.

Tulisan ini akan membahas langkah-langkah instalasi virtual machine Windows
dan dibatasi hanya pada versi Windows XP.

## Virtual Hard Disk berisi Windows XP

> Untuk menghemat bandwidth, gambar screenshot dibawah ini diubah menjadi text.

> Klik text untuk menampilkan gambar.

> Klik tombol "Show All" untuk menampilkan semua gambar.

<button onclick="javascript:a2img.showAll();">Show All</button>

Download program setup bernama `WindowsXPMode_en-us.exe` dari sumber resmi
[Microsoft]. Setelah download selesai, jangan lakukan instalasi.

Di dalam file `WindowsXPMode_en-us.exe` terdapat virtual hard disk. Extract
virtual hard disk tersebut dengan menggunakan program 7zip atau sejenisnya.

![Screenshot tampilan 7zip.](/images/screenshot.1132.png)

![Screenshot lokasi file VirtualXPVHD.](/images/screenshot.1133.png)

File virtual hard disk bernama `VirtualXPVHD`, setelah di extract, rename
menjadi `VirtualXP.vhd`.

![Screenshot file format dot vhd.](/images/screenshot.1134.png)

## Mainkan VirtualBox


Jalankan VirtualBox. Klik tombol New untuk membuat virtual machine baru.

![Screenshot.](/images/screenshot.1135.png)

Berikan nama virtual machine ini.

![Screenshot.](/images/screenshot.1136.png)

Tentukan alokasi memory RAM.

![Screenshot.](/images/screenshot.1137.png)

Tentukan virtual hard disk. Gunakan existing virtual hard disk file
`VirtualXP.vhd`.

![Screenshot.](/images/screenshot.1138.png)

Selesai. Tekan tombol start untuk menjalankan.

![Screenshot.](/images/screenshot.1139.png)

Proses booting windows XP. Tanda file virtual hard disk berjalan sempurna.

![Screenshot.](/images/screenshot.1140.png)

Proses setup konfigurasi pasca instalasi karena sistem operasi Windows XP telah
terinstall didalam virtual hard disk.

![Screenshot.](/images/screenshot.1141.png)

Pointer mouse masih belum aktif saat pertama kali menjalankan Windows XP.
Oleh karena itu selama proses setup, kita menggunakan keyboard untuk melakukan
aktivitas pengganti pointer mouse untuk `focus` dan `click` button.

Window License Agreement.

`Alt+a` untuk Accept.

`Alt+n` untuk Next.

![Screenshot.](/images/screenshot.1142.png)

Window Regional and Language Options.

`Alt+n` untuk Next.

![Screenshot.](/images/screenshot.1143.png)

Masuk ke window "Computer Name and Administrator Password".

`Alt+c` untuk focus ke input text "Computer Name".

`Alt+d` untuk focus ke input text "Administrator Password".

`Alt+o` untuk focus ke input text "Confirm Password".

Bisa juga menggunakan `Tab` untuk berpindah-pindah posisi focus.

`Alt+n` untuk menekan tombol `Next`.

![Screenshot.](/images/screenshot.1144.png)

Masuk ke window "Date and Time Settings".

`Alt+d` untuk focus ke select "Date and Time". Gunakan `arrow left/right` dan
`Tab` pada keyboard untuk berpindah posisi.

`Alt+t` untuk focus ke select "Time Zone". Gunakan `arrow down/up` pada
keyboard untuk berpindah posisi.

Bisa juga menggunakan `Tab` untuk berpindah-pindah posisi focus.

`Alt+n` untuk menekan tombol `Next`.

![Screenshot.](/images/screenshot.1145.png)

Proses `Networking Settings`. Secara default saat membuat Virtual Machine telah
otomatis terpasang dan enabled Network Adapter NAT

![Screenshot.](/images/screenshot.1146.png)

Proses finishing setup.

![Screenshot.](/images/screenshot.1147.png)

Kemudian akan dilakukan reboot. Namun tampilan layar akan hang (hitam blank).
Solusi sementara adalah reset virtual machine.

![Screenshot.](/images/screenshot.1154.png)

Setelah reset dan restart akan banyak windows `Found New Hardware
Wizard`. Seluruh window ini di-cancel saja.

![Screenshot.](/images/screenshot.1148.png)

Driver untuk hardware-hardware tersebut didapat dari CD image bawaan Virtual Box
bernama `Guest Addition`. Masukkan CD image tersebut ke Guest (virtual machine)
secara otomatis melalui menu `Devices` `>>` `Insert Guest Additions CD image..`

![Screenshot.](/images/screenshot.1149.png)

Eksekusi install Guest Additions.

![Screenshot.](/images/screenshot.1150.png)

Proses install Guest Addition sedang memasang berbagai driver.

![Screenshot.](/images/screenshot.1151.png)

Jika muncul warning, untuk menekan tombol `Continue Anyway`, tekan `Alt+c`.

![Screenshot.](/images/screenshot.1152.png)

Terakhir adalah reboot. Finish. `Alt+f`.

![Screenshot.](/images/screenshot.1153.png)

Sama seperti sebelumnya. Reboot mengakibatkan layar menjadi hang (hitam blank).
Reset.

![Screenshot.](/images/screenshot.1154.png)

Setelah reboot, kini windows XP dapat berjalan sempurna.

Driver mouse telah terpasang sehingga kita bisa menggerakkan pointer mouse
didalam virtual machine.

![Screenshot.](/images/screenshot.1155.png)

Driver video graphic juga telah terpasang sehingga saat shutdown/reboot layar
tidak lagi hang (hitam blank).

![Screenshot.](/images/screenshot.1156.png)

## Masa Trial

Jika masa trial sudah habis, maka kita perlu reinstall kembali. Oleh karena itu
**jangan simpan data didalam virtual hard disk**.

![Screenshot masa trial sudah habis.](/images/screenshot.1157.png)

## References

[Microsoft]: https://www.microsoft.com/en-us/download/details.aspx%3Fid=8002

<https://www.microsoft.com/en-us/download/details.aspx%3Fid=8002>

<http://www.makeuseof.com/tag/download-windows-xp-for-free-and-legally-straight-from-microsoft-si/>

[1]: https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/>

<https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/>

<https://opensource.microsoft.com/>

<https://app.vagrantup.com/Microsoft/boxes/EdgeOnWindows10>

<https://www.howtogeek.com/244678/you-dont-need-a-product-key-to-install-and-use-windows-10/>

<https://en.wikipedia.org/wiki/Microsoft_Product_Activation>

<https://www.windowscentral.com/you-do-not-need-activate-windows-10>
