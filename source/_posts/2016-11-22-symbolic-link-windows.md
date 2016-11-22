---
title: Membuat Symbolic Link pada Windows 7
---

## Pendahuluan

Link pada file system adalah membuat satu file memiliki banyak path tidak hanya
satu. Ada macam-macam link, yang paling populer bagi programmer adalah symbolic
link.

Untuk membuat symbolic link pada linux cukup mudah, yakni:
```
ln -s TARGET LINK
```

Sejak era windows Vista, sudah dibuat command yang menyerupai link pada linux.
Commandnya adalah sebagai berikut:

```
mklink LINK TARGET
```

## Studi Kasus pada Github Windows

Default directory untuk Github for Windows berada pada path 
```C:\Users\X220\GitHub```, sementara default directory root pada XAMPP adalah
```C:\xampp\htdocs```, dengan menggunakan symbolic link pada windows, kita bisa
membuat direktori Github berada didalam direktori root htdocs tanpa perlu
copy paste.
```
mklink /D C:\xampp\htdocs\GitHub C:\Users\X220\GitHub
```
Respon yang diberikan jika berhasil eksekusi mklink adalah 
```
symbolic link created for C:\xampp\htdocs\GitHub <<===>> C:\Users\X220\GitHub
```