---
title: WSL2 - Memindahkan virtual disk (file dot vhdx)
tags:
  - wsl2
---

## Pertanyaan

Kita sudah mengaktifkan WSL2 dan Memasang dua sistem operasi: `Ubuntu 18.04` dan `Ubuntu 20.04`.

Kedua sistem operasi tersebut terdapat file virtual disk dengan extension `vhdx`.

Bagaimanakan memindahkan file dot vhdx tersebut dari default Windows drive (biasanya di `C:\`) ke drive lain?

## Solusi

Daripada menggunakan fitur export dan import, terdapat cara cepat dengan mengubah alamat direktori di Registry Editor.

## Gerak Cepat

Matikan WSL. Buka `Command Prompt` atau `Power Shell` dan jalankan command:

```
wsl --shutdown
```

Command Prompt:

![Screenshot.](/images/2021/screenshot.2021-03-06_19.17.57.jpg)

PowerShell:

![Screenshot.](/images/2021/screenshot.2021-03-06_19.18.25.jpg)

Buka Registry Editor melalui Run.

Ketik `regedit` dan Enter.

![Screenshot.](/images/2021/screenshot.2021-03-06_19.11.03.jpg)

Copy path berikut:

```
HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss
```

dan paste di Address Bar-nya Registry Editor:

![Screenshot.](/images/2021/screenshot.2021-03-06_19.12.22.jpg)

Kita akan menemukan sub `key` dibawah `Lxss` dengan format nama UUID (Universally unique identifier).

Tiap key merupakan virtual machine.

Edit string `BasePath` di tiap `key` dan ganti menjadi nama direktori yang akan dituju untuk penyimpanan file `.vhdx`.

Ubah value dari (misalnya)

```
C:\Users\ijortengab\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu20.04onWindows_79rhkp1fndgsc\LocalState
```

ke direktori lain, misalnya:

```
Z:\WSL\ubuntu-20.04
```

![Screenshot.](/images/2021/screenshot.2021-03-06_19.30.02.jpg)

Lalu pindahkan file `.vhdx` dari direktori sebelumnya ke direktori baru.

![Screenshot.](/images/2021/screenshot.2021-03-06_19.33.06.jpg)

Selesai dan jalankan kembali terminal untuk automatis menjalankan WSL.

![Screenshot.](/images/2021/screenshot.2021-03-06_21.28.22.jpg)

## Reference

https://blog.suraj-mittal.dev/moving-the-wsl2-vhdx/

https://blog.iany.me/2020/06/move-wsl-to-another-drive/
