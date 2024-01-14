---
title: Fitur Profile pada Firefox

---

## Pendahuluan

Profile pada Firefox dapat disamakan dengan user pada sistem operasi. 
Satu profile adalah satu **customize**. Dalam satu profile itu terdiri dari satu 
database untuk menyimpan history, cookie, dan informasi add-ons.

Secara default, satu user pada sistem operasi memiliki satu profile untuk
Firefox. Firefox mendukung agar satu user memiliki banyak profile untuk memisahkan
masing-masing "customize". Misalnya satu profile khusus untuk browsing tanpa
perlu banyak tambahan add-ons, satu profile lagi khusus untuk developing
dengan banyak tambahan add-ons.

## Gerak cepat

Contoh pada tulisan ini menggunakan sistem operasi Windows. Matikan firefox,
dan pastikan proses *firefox.exe* telah hilang pada task manager. 
Lalu pada box RUN, ketik command utama sebagai berikut 

```firefox -ProfileManager```
alternatif
 ```firefox -P```
untuk memulai firefox dengan didahului interface manager profile.


```firefox -CreateProfile devel```
untuk membuat profile dengan nama profile *devel*. Firefox tidak start.

```firefox -P devel```
menjalankan firefox dengan profile *devel*. 

## Direktori Profile

Secara default lokasi direktori berada pada App Data. Ketik pada box Run
```%appdata%``` untuk cara cepat masuk ke direktori App Data,
kemudian masuk ke sub direktori ```Mozilla/Firefox/Profiles```.

Untuk lokasi direktori agar diluar default, maka saat pembuatan profile beri keterangan 
mengenai lokasi, contoh:

```firefox -P "devel d:\firefox```

## Referensi

[Dokumentasi Firefox][1]

[1]:https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options