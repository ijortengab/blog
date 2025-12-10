# Hiren Boot USB


## Pendahuluan

[Hiren](https://www.hiren.info/) adalah nama produk kompilasi software.

Software yang dikumpulkan berupa tools/utility untuk kebutuhan administrasi sistem termasuk recovery dan repair.

Hiren dijalankan dengan booting di BIOS melalui media CD atau USB.

Tulisan ini akan membahas cara *burning* file image .ISO Hiren ke USB Flash Disk alih-alih CD.

## Persiapan

Download tiga file sebagai berikut:

 - File Image ISO Hiren 15.2 [Hirens.BootCD.15.2.zip][1].
 - Program USB Disk Storage Format [USBFormat.zip][2].
 - Program Grup4DOS [grub4dos.zip][3].

Tersedia alternative download melalui [IjorTengab Tools][4].

Extract keseluruhan file zip tersebut.

## Gerak Cepat

Colok USB Flash Drive.

Jalankan binary `usb_format.exe` run as admin. Format Flash disk dengan FileSystem FAT32, centang QuickFormat.

![screenshot.947.png](/images/screenshot.947.png)

Jalankan binary `grubinst_gui.exe`.

Pada fieldset `Device Name`, pada options Disk, pilih device FlashDisk (berdasarkan size). Pada contoh ini yang menggunakan Flash Disk 8GB, maka opsi yang dipilih adalah `(hd2) [7663M]`.

Tekan tombol Refresh disamping field Part List hingga muncul options pada field Part List. Pilih `Whole Disk (MBR)`,

Tekan tombol Install.

![screenshot.917.png](/images/screenshot.917.png)

Muncul command prompt, tekan ENTER untuk melanjutkan.

![screenshot.918.png](/images/screenshot.918.png)

Mount file dot ISO `Hiren's.BootCD.15.2.iso` ke salah satu Virtual CD Drive atau extract file dot ISO tersebut.

Copy seluruh file didalam iso tersebut ke flash disk.

Kemudian masuk ke folder `HBCD`, copy file `grldr` dan `menu.lst` ke folder satu level diatas (root dari Flash Disk).

Sehingga hasil akhir seperti terlihat pada gambar dibawah ini.

![screenshot.948.png](/images/screenshot.948.png)

## Finish

USB siap digunakan untuk booting HIREN.

## Reference

http://www.hirensbootcd.org/download/

http://www.hirensbootcd.org/usb-booting/

https://www.raymond.cc/blog/how-to-put-hirens-bootcd-on-flash-memory/

[1]: http://www.hirensbootcd.org/files/Hirens.BootCD.15.2.zip

[2]: http://www.hirensbootcd.org/files/USBFormat.zip

[3]: http://www.hirensbootcd.org/files/grub4dos.zip

[4]: http://ijortengab.id/tools/
