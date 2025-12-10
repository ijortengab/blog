# Linux - Cleanup direktori /var/log


## Pendahuluan

Command `du` untuk sementara kita jadikan sebagai [pembaca size direktori][1]
pada CWD. Kita buat alias:

```
alias du='du -d 1 -h 2>/dev/null | sort -hr'
```

[1]: /blog/2017/08/20/linux-mengecek-size-direktori-dengan-du/

Masuk ke direktori root dan scan size direktori.

```
# cd /
# du
11G     .
5.3G    ./home
3.4G    ./var
885M    ./usr
126M    ./lib
32M     ./boot
16M     ./bin
14M     ./sbin
6.9M    ./etc
5.0M    ./root
3.9M    ./run
892K    ./tmp
16K     ./lost+found
8.0K    ./media
4.0K    ./srv
4.0K    ./snap
4.0K    ./opt
4.0K    ./mnt
4.0K    ./lib64
0       ./sys
0       ./proc
0       ./dev
```

Kita lihat bahwa selain direktori `/home` yang menjadi penampungan semua data
user, direktori `/var` adalah direktori yang memiliki ukuran penyimpanan
terbesar.

```
# cd /var
# du
3.4G    .
2.7G    ./log
557M    ./lib
97M     ./cache
1.7M    ./backups
32K     ./spool
20K     ./tmp
8.0K    ./www
4.0K    ./snap
4.0K    ./opt
4.0K    ./mail
4.0K    ./local
4.0K    ./crash
```

Masuk ke dalam direktori `/var` dan didapati bahwa direktori `/var/log` menjadi
direktori yang memiliki ukuran penyimpanan terbesar.

Direktori `/var/log` pada sistem operasi Linux dijadikan sebagai penampungan
semua log pada hampir semua aplikasi.

Untuk kebutuhan tertentu, seperti menghemat kapasitas storage, kita perlu
cleaning direktori ini.

## Execute

Preview semua yang berakhiran `.gz`.

```
find /var/log -type f -regex ".*\.gz$"
```

Amankan data `.gz` yang mungkin penting. Setelah itu delete.

```
find /var/log -type f -regex ".*\.gz$"  -delete
```

Preview semua yang berakhiran integer.

```
find /var/log -type f -regex ".*\.[0-9]+$"
```

Amankan data log yang mungkin penting. Setelah itu delete.

```
find /var/log -type f -regex ".*\.[0-9]+$" -delete
```

Seluruh isi dari direktori journal, delete!

```
cd /var/log/journal
rm -rf *
```

File btmp dibuat truncate.

```
> /var/log/btmp
```

## Finish

Sementara file yang lain di dalam direktori log bisa dibiarkan (ignore) karena
termasuk file sedang digunakan (on the fly).

Hapus alias du.

```
unalias du
```

## References

Google "/var/log/btmp clear"

https://askubuntu.com/questions/620458/is-it-safe-to-delete-btmp-from-log-on-ubuntu-14-04-rackapace-server

Google "/var/log/journal cleanup"

https://bbs.archlinux.org/viewtopic.php?id=158510

https://serverfault.com/questions/185253/delete-all-of-var-log
