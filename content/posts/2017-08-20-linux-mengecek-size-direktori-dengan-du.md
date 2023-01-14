---
title: Linux - Mengecek size direktori dengan du
slug: /blog/2017/08/20/linux-mengecek-size-direktori-dengan-du/
date: 2017-08-20
---

## DU adalah

Command `ls` digunakan untuk mengecek isi dari direktori. Direktori defaultnya
adalah cwd (current working directory) alias direktori saat ini.

Terdapat beberapa parameter yang membantu keluarnya output yang lebih spesifik.

Contoh pada direktori home:

```
ijortengab@ijortengab.id:~$ ls -lahS
...
drwxrwxr-x  2 ijortengab ijortengab 4.0K Jul  5 21:23 share
drwxrwxr-x  2 ijortengab ijortengab 4.0K Aug 18 15:24 tools
...
-rw-r--r--  1 ijortengab ijortengab 3.9K Apr  9 15:12 .bashrc
-rw-r--r--  1 ijortengab ijortengab  655 Nov 16  2016 .profile
...
ijortengab@ijortengab.id:~$
```

Pada command `ls -lahS` diatas yakni ukuran dari direktori selalu sama
(4096 atau 4KB). Karena direktori oleh Linux dianggap sebagai file.

Du adalah `Disk Usage`, command di Linux (GNU tepatnya) yang membantu kita
mengecek ukuran jumlah total size dari isi di dalam sebuah direktori. Command
inilah yang akan membantu melengkapi command `ls` diatas.

## Gerak Cepat

Command `du` terdapat banyak pilihan parameter dan yang saya perlu adalah:

- lihat ukuran dari direktori saat ini (cwd) cukup kedalaman level 1 saja
- human readable
- Output StandardError hindari.
- Sort dengan ukuran size paling besar di posisi teratas

Dari kebutuhan diatas, maka command yang dibutuhkan adalah:

```
du -d 1 -h 2>/dev/null | sort -hr
```

Contoh pada direktori home:

```
ijortengab@ijortengab.id:~$ du -d 1 -h 2>/dev/null | sort -hr
...
753M    ./tools
34M     ./share
...
ijortengab@ijortengab.id:~$
```

## Alias

Gunakan alias untuk mempercepat penulisan command:

```
alias dukun='du -d 1 -h 2>/dev/null | sort -hr'
alias duhai='du -d 1 -h 2>/dev/null | sort -hr'
alias duileh='du -d 1 -h 2>/dev/null | sort -hr'
alias duamenitlagi='du -d 1 -h 2>/dev/null | sort -hr'
alias dudidudidamdam='du -d 1 -h 2>/dev/null | sort -hr'
```

## References

https://serverfault.com/questions/62411/how-can-i-sort-du-h-output-by-size
