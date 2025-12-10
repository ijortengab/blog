# Install Distro WSL 2 Tanpa Microsoft Store

---
slug: blog/2023/03/10/install-distro-wsl2-tanpa-ms-store
date: 2023-03-10
tags:
  - wsl2
---

## Permasalahan

[Tulisan sebelumnya][1] sudah membahas cara menginstall WSL2.

[1]: /blog/2021/03-06-berkenalan-dengan-windows-subsytem-of-linux-wsl.md

Bagaimanakah memasang Distro Linux tanpa Microsoft Store?

## Solusi

Install melalui command line.

## Gerak Cepat

Download Distro `Ubuntu-22.04` menggunakan curl.

```
curl -L -o ubuntu-2204.appx https://aka.ms/wslubuntu2204
```

Install dengan powershell.

```
powershell.exe -Command Add-AppxPackage ubuntu-2204.appx
```

Jalankan first setup, buka Run, dan ketik lalu enter.

```
ubuntu2204
```

WSL2 dengan Distro `Ubuntu-22.04` ready untuk digunakan.

## Verifikasi

Buka command prompt, lalu verifikasi:

```
wsl --list --running
```

## Referensi

https://github.com/microsoft/WSL/issues/8835

https://learn.microsoft.com/en-us/windows/wsl/install-manual

https://stackoverflow.com/questions/52512026/is-it-possible-install-ubuntu-in-windows-10-wsl-without-microsoft-store
