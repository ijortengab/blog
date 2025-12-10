# Solusi temporary file system pada Cygwin menggunakan ImDisk

---
tags:
  - cygwin
---

## ImDisk

ImDisk adalah salah satu software yang bisa membuat RAM Disk.

Install dengan cara download dan eksekusi:

http://www.ltr-data.se/files/imdiskinst.exe

atau:

https://ijortengab.id/tools/imdiskinst.exe

Verifikasi dengan command prompt, `where imdisk`. Output:

```
C:\Windows\System32\imdisk.exe
```

Contoh membuat RAM Disk dengan drive `R:\`, size 512M, format NTFS, dan berperilaku seperti Removeable Devices:

```
set drive=R
set size=512M
imdisk -a -s %size% -m %drive%: -o rem -p "/fs:ntfs /v:RAM_Disk /q /y"
label %drive%: RAM Disk
```

Menghapus RAM Disk:

```
imdisk -d -m R:
```

Hasil benchmark:

![Screenshot.](/images/2022/screenshot.2022-06-07_12.32.12.jpg)

Kecepatan hingga Gigabyte per second yang membuktikan bahwa RAM Disk berjalan normal.

## Shared Memory

Pada disto linux, umumnya direktori `/dev/shm` adalah temporary file system (tmpfs).

```
df -k /dev/shm
```

Output:

```
# df -k /dev/shm
Filesystem     1K-blocks  Used Available Use% Mounted on
tmpfs             500176     0    500176   0% /dev/shm
```

Pada Cygwin, folder `/dev/shm` adalah folder reguler.

## Solusi

Kita buat batch script agar menjadikan direktori `/dev/shm` pada Cygwin adalah
symbolic link ke RAM Disk.

```
touch /usr/local/rebuild-dev-shm.bat
vi /usr/local/rebuild-dev-shm.bat
```

Content file (pastikan `End of line` adalah `CRLF`):

```
@echo off
REM ----------------------------------------------------------------------------
REM Variable
REM ----------------------------------------------------------------------------
set size=512M
set cygwin_directory=C:\cygwin64
set target=%cygwin_directory%\dev\shm
set drive=R
set cygwin_directory_ram=%drive%:\cygwin64
set link=%cygwin_directory_ram%\dev\shm
REM ----------------------------------------------------------------------------
REM Procedure
REM ----------------------------------------------------------------------------
if not exist %drive%:\ (
    C:\WINDOWS\system32\imdisk.exe -a -s %size% -m %drive%: -p "/fs:ntfs /v:RAM_Disk /q /y" > NUL
    C:\Windows\System32\label.exe %drive%: RAM Disk
)
if not exist %link% (
    mkdir %link%
    C:\Windows\System32\attrib.exe +s +h /D %cygwin_directory_ram%
)
rmdir /s %target% /q 2> NUL
mklink /D %target% %link% > NUL
```

## Autorun

Kita akan menggunakan `cron` pada Cygwin sebagai autorun alih-alih Task Schedule. Blog terkait:

[Cron di Cygwin](/blog/2022/03-12-cron-cygwin.md)

Jalankan crontab:

```
crontab -e
```

Lalu tambahkan baris berikut:

```
@reboot /cygdrive/c/WINDOWS/system32/cmd.exe /C $(cygpath -w /usr/local/rebuild-dev-shm.bat)
```

Restart komputer atau rerun cron untuk eksekusi batch script.

```
net stop cron
net start cron
```

## Reference

http://www.ltr-data.se/opencode.html/#ImDisk

https://alternativeto.net/software/imdisk-virtual-disk-driver/about/

https://cygwin.com/cygwin-ug-net/using-specialnames.html#pathnames-posixdevices

https://datacadamia.com/os/linux/shared_memory

https://superuser.com/questions/45342/when-should-i-use-dev-shm-and-when-should-i-use-tmp

https://www.tenforums.com/tutorials/174094-how-create-ram-disk-imdisk-windows-10-a.html

https://www.easytutorial.com/ram-disk-windows-imdisk.html

https://www.maketecheasier.com/setup-ram-disk-windows/

https://forums.guru3d.com/threads/guide-using-imdisk-to-set-up-ram-disk-s-in-windows-with-no-limit-on-disk-size.356046/

https://en.wikipedia.org/wiki/Tmpfs
