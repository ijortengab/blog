---
title: Berkenalan dengan Windows Subsytem of Linux (WSL)
tags:
  - wsl2
---

## Pendahuluan

Untuk merasakan pengalaman *environment* Linux menggunakan mesin Windows 10, kita bisa menggunakan Virtual Machine atau Cygwin.

Blog terkait:

 - [Belajar Virtual Box](/blog/2015/04/10/virtualbox/)
 - [Windows rasa Linux - remote Windows dengan CLI menggunakan Cygwin-OpenSSH](/blog/2017/01/28/windows-rasa-linux-cygwin-openssh-server/)

Windows 10 kini menghadirkan Windows Subsytem of Linux (WSL).

![Screenshot.](/images/2021/screenshot.2021-03-03_17.04.34.jpg)

Saat tulisan ini dibuat, terdapat dua versi WSL, yakni versi 1 (WSL 1) dan versi 2 (WSL 2).

Tulisan ini akan fokus membahas cara mengaktifkan `WSL 2` dan memasang `Ubuntu 20.04` didalamnya.

## Requirement

 1. Versi Windows 10

 2. Dukungan hardware

Bagi pengguna processor Intel 64bit, maka diperlukan Windows 10 minimal versi `1903.81` dan build minimal versi `18362`.

Cek melalui Run, lalu ketik `winver`.

![Screenshot.](/images/2021/screenshot.2021-03-03_18.03.08.jpg)

Versi Windows 10 yang kita gunakan adalah versi `2004`. Memenuhi syarat untuk mengaktifkan WSL 2.

![Screenshot.](/images/2021/screenshot.2021-03-03_18.05.43.jpg)

Secara hardware, diperlukan *processor* yang mendukung virtualisasi, lalu di-*enable* melalui BIOS.

Contoh settingan BIOS pada Komputer merk HP (*release* 2018), Asus (*release* 2012), dan Lenovo Thinkpad (*release* 2011).

![Screenshot HP.](/images/2021/camscanner_03-04-2021_16.56_1.jpg)

![Screenshot Asus.](/images/2021/camscanner_03-04-2021_16.56_3.jpg)

![Screenshot Thinkpad.](/images/2021/camscanner_03-04-2021_16.56_4.jpg)

## Mengaktifkan WSL 2

Jalankan PowerShell sebagai administrator.

![Screenshot.](/images/2021/screenshot.2021-03-03_17.32.21.jpg)

Aktifkan `Windows Subsystem for Linux` melalui eksekusi command:

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

![Screenshot.](/images/2021/screenshot.2021-03-03_17.34.20.jpg)

Aktifkan `Virtual Machine Platform` melalui eksekusi command:

```
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

![Screenshot.](/images/2021/screenshot.2021-03-03_18.09.42.jpg)

Selain melalui command, bisa juga melalui GUI.

Masuk ke `Control Panel\Programs\Programs and Features` melalui Run, ketik `appwiz.cpl`.

![Screenshot.](/images/2021/screenshot.2021-03-06_14.28.44.jpg)

Klik `Turn Windows fatures on or off`. Kasih centang pada `Windows Subsystem for Linux` dan `Virtual Machine Platform`.

![Screenshot.](/images/2021/screenshot.2021-03-06_14.33.25.jpg)

Restart Komputer.

```
shutdown -r -t 0
```

Download dan install WSL Update.

Link dibawah ini untuk mesin dengan processor Intel 64bit.

https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

Buka kembali PowerShell, dan jadikan WSL 2 sebagai versi default.

```
wsl --set-default-version 2
```

![Screenshot.](/images/2021/screenshot.2021-03-03_18.32.28.jpg)

Selesai

## Memilih Linux Distribution

Untuk memasang `Ubuntu 20.04` kunjungi `page` di Microsoft Store.

Link cepat:

 1. Klik link berikut di mesin Windows: [ms-windows-store://pdp?productId=9N6SVWS3RX71](ms-windows-store://pdp?productId=9N6SVWS3RX71)

 2. Klik link berikut di browser: https://www.microsoft.com/store/apps/9n6svws3rx71

Atau buka program `Microsoft Store`, dan ketik `wsl` pada input pencarian.

Langsung ketemu pencarian Ubuntu.

![Screenshot.](/images/2021/screenshot.2021-03-03_19.02.08.jpg)

Pilih dan `Get` Ubuntu 20.04.

![Screenshot.](/images/2021/screenshot.2021-03-03_19.04.08.jpg)

Download image dengan size 453,7 MB.

![Screenshot.](/images/2021/screenshot.2021-03-03_19.07.01.jpg)

Launch.

![Screenshot.](/images/2021/screenshot.2021-03-03_19.08.26.jpg)

Masukkan username untuk pengguna sudo di `Ubuntu 20.04`.

![Screenshot.](/images/2021/screenshot.2021-03-04_17.07.25.jpg)

Ubuntu server siap di-*install* berbagai software dengan `apt install`.

![Screenshot.](/images/2021/screenshot.2021-03-04_17.08.42.jpg)

## Troubleshooting

Jika terdapat error saat launch sebagai berikut:

```
Installing, this may take a few minutes...
WslRegisterDistribution failed with error: 0x80370102
Error: 0x80370102 The virtual machine could not be started because a required feature is not installed.

Press any key to continue...
```

![Screenshot.](/images/2021/screenshot.2021-03-03_19.22.58.jpg)

Artinya, setting virtualisasi di BIOS belum di-*enable*.

## Reference

https://docs.microsoft.com/en-us/windows/wsl/install-win10

https://docs.microsoft.com/en-us/windows/wsl/compare-versions

https://askubuntu.com/questions/1264102/wsl-2-wont-run-ubuntu-error-0x80370102
