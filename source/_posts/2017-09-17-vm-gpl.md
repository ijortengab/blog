---
title: Virtual Machine - Gak Pake Lama
---

## Dasar Pemalas

Untuk bisa `ssh` ke Guest virtual machine menggunakan terminal di Host, maka
setidaknya terdapat dua proses yang harus dilakukan terpisah dan `synchronous`.

 1. Execute command di Host untuk menyalakan Virtual Machine.
 2. Execute command di Host untuk login ssh ke Guest.

Kedua proses tersebut bersifat synchronous. Artinya Proses 1 harus selesai dulu
baru bisa lanjut ke proses 2.

Menunggu proses 1 selesai adalah membosankan.

## Pertanyaan

Bisakah kedua proses tersebut berjalan berkelanjutan secara otomatis?

## Project

Project ini dinamakan `Virtual Machine - Gak Pake Lama`.

Baik Host maupun Guest, kita buat direktori project.

```
mkdir -p ~/.gpl
```

## Brain Storming

Programmer pemalas pun berpikir:

> Intinya adalah diperlukan trigger.
>
> Guest yang telah selesai booting memberikan trigger ke Host agar Host
> menjalankan terminal ssh ke Guest.

Setelah berpikir, kemudian dibuat sketsa:

```
                   ---------
                   | Mulai |
                   ---------
                      ||
                      ||
                      ||
                      \/
          ----------------------------
          | User menjalankan program |
          |         GPL.bat          |
          ----------------------------
                      ||
                      ||
                      ||
                      \/
                    __/\__                         IjorTengab
                ___/      \___                         was
               /   Program    \                       here
              /  GPL.bat cek   \
              \   apakah VM    /
               \___  live? ___/  YA
                   \__  __/
                      \/           \\
                    TIDAK           \\
                                     \\
                      ||              \\
                      ||               \\
                      ||                \\
                      ||                 \\
                      \/                  \\
         --------------------------        \\
         |     Program GPL.bat    |         \\
         | menghidupkan VM secara |          \\
         |         HEADLESS       |           \\
         --------------------------            \\
                      ||                        ||
                      ||                        \/
                      ||                       ---------------------------
                      \/                       |     Program GPL.bat     |
            ----------------------             |   menjalankan terminal  |
            | VM selesai booting |             | dan autologin SSH ke VM |
            |     dan live       |             ---------------------------
            ----------------------              /\          ||
                      ||                        ||          ||
                      ||                        //          ||
                      ||                       //           ||
                      \/                      //            ||
            -----------------------          //             ||
            |  VM mengabari Host  |         //              ||
            | bahwa VM telah live |        //               ||
            -----------------------       //                ||
                      ||                 //                 ||
                      ||                //                  ||
                      ||               //                   ||
                      \/              //                    ||
         --------------------------------                   ||
         | Host melalui Program GPL.bat |                   ||
         |   menerima kabar dari VM     |                   ||
         |    bahwa VM telah live       |                   ||
         --------------------------------                   ||
                                                            \/
                                                       -----------
                                                       | Selesai |
                                                       -----------
```

## Environment Variable

Berikut ini informasi Host dan Guest (vm). Tulisan ini akan menggunakan
variable-variable di bawah ini.

|            | Host          | Guest                                |
|------------|---------------|--------------------------------------|
| OS         | Windows 7     | Debian 9.1                           |
| Username   | ijortengab    | ijortengab                           |
| OpenSSH    | via Cygwin    | native                               |
| VM Name    | -             | Debian 9.1                           |
| IP Address | 192.168.212.1 | 192.168.212.102                      |

Host dan Guest sama-sama berada pada satu [private LAN][5].

Terminal di Host menggunakan `mintty.exe` bawaan [Cygwin][4].

SSH Client di Host menggunakan `ssh.exe` bawaan Cygwin.

Baik Host maupun Guest sudah bisa login `ssh` satu sama lain
[tanpa menggunakan password][2].

## Ngoprek Guest

Guest perlu memberi kabar berupa pesan kepada Host setelah dia selesai booting.

Pesan tersebut akan hilang setelah 3 detik.

Pada Guest buat file bernama `sayhaihost.sh`.

```
cd ~/.gpl
touch sayhaihost.sh
chmod u+x sayhaihost.sh
vi sayhaihost.sh
```

Isi file sbb:

```
ssh ijortengab@192.168.212.1 'mkdir -p .gpl && echo hai > .gpl/msgfromguestdebian91.txt'
sleep 3
ssh ijortengab@192.168.212.1 'rm .gpl/msgfromguestdebian91.txt'
```

Lalu script tersebut didaftarkan pada [crontab][1] agar running saat reboot.

```
crontab -e
```

Value:

```
@reboot /home/ijortengab/.gpl/sayhaihost.sh
```

## Ngoprek Host

**Detect_VM**

Pada Host buat file bernama `1.bat` dengan isi sbb:

```
@echo off
REM Clear Previous Set
SET isrun=0
FOR /F "tokens=* USEBACKQ" %%F IN (`C:\cygwin64\bin\ssh.exe ijortengab@192.168.212.102 -o 'ConnectTimeout 1' 'echo 1'`) DO (
  SET isrun=%%F
)
if %isrun% == 1 echo Server ON.
if not %isrun% == 1 echo Server OFF.
pause
```

Pada Host buat file bernama `1b.bat` dengan isi sbb:

```
@echo off
REM Clear Previous Set
SET isrun=0
C:\cygwin64\bin\ssh.exe ijortengab@192.168.212.102 -o 'ConnectTimeout 1' 'echo 1' >tmpFile.txt
SET /P isrun=<tmpFile.txt
del tmpFile.txt
if %isrun% == 1 echo Server ON.
if not %isrun% == 1 echo Server OFF.
pause
```

Pada Host buat file bernama `1c.bat` dengan isi sbb:

```
@echo off
REM Clear Previous Set
SET isrun=0
vboxmanage list runningvms | findstr /c:"Debian 9.1">nul && set isrun=1 || set isrun=0
if %isrun% == 1 echo Server ON.
if not %isrun% == 1 echo Server OFF.
pause
```

File `1.bat` menggunakan cara koneksi langsung ke vm menggunakan `ssh`.

File `1b.bat` adalah alternative syntax menggunakan temporary file untuk
populate variable.

File `1c.bat` menggunakan command line `vboxmanage`. Namun hasil dari command
`list runningvms` berbeda-beda tergantung user yang mengeksekusi.

Kita gunakan cara pada file `1.bat`.

**Run_VM**

Pada Host buat file bernama `2.bat` dengan isi sbb:

```
vboxmanage startvm "Debian 9.1" --type headless
```

**Detect_Guest**

Host perlu mendetect kabar `hai` yang dikirim oleh Guest.

Pada Host buat file bernama `3.bat`.

```
@echo off
echo Menanti salam "Hai" dari Guest...
:loop
if not exist "C:\cygwin64\home\ijortengab\.gpl\msgfromguestdebian91.txt" (
  TIMEOUT 1 1>nul
  goto loop
)
echo Salam "Hai" diterima.
pause
```

Eksekusi file `3.bat` kemudian reboot (restart) Guest untuk melihat efek dari
file `3.bat` ini.

**Run_Terminal**

Pada Host buat file bernama `4.bat`.

```
C:\cygwin64\bin\mintty.exe /bin/ssh.exe ijortengab@192.168.212.102
```

Script diatas sudah [login ssh tanpa password][2].

## Assembly

Saatnya merakit keseluruhan logic diatas.

Pada Host buat file bernama `GPL.bat`.

```
@echo off
REM Find and Replace variable dibawah ini untuk next instance
REM Guest VM Name: Debian 9.1
REM Guest Address: ijortengab@192.168.212.102
REM Guest Message Name: msgfromguestdebian91.txt
REM Host Home Directory: C:\cygwin64\home\ijortengab
REM Log File: C:\Windows\Temp\gpl.log
set isrun=0
FOR /F "tokens=* USEBACKQ" %%F IN (`C:\cygwin64\bin\ssh.exe ijortengab@192.168.212.102 -o 'ConnectTimeout 1' 'echo 1'`) DO (
  SET isrun=%%F
)
if %isrun% == 1 echo Server ON.
if not %isrun% == 1 echo Server OFF.
if %isrun% == 1 goto serveron
echo %DATE% %TIME% - VM Debian 9.1 starting. >> C:\Windows\Temp\gpl.log
echo Starting Virtual Machine...
vboxmanage startvm "Debian 9.1" --type headless
echo %DATE% %TIME% - VM Debian 9.1 started. >> C:\Windows\Temp\gpl.log
echo Virtual Machine Started.
echo Menanti salam "Hai" dari Guest...
set waktubooting=0
:loop
if not exist "C:\cygwin64\home\ijortengab\.gpl\msgfromguestdebian91.txt" (
  TIMEOUT 1 1>nul
  set /a waktubooting=%waktubooting%+1
  goto loop
)
echo %DATE% %TIME% - VM Debian 9.1 loaded (%waktubooting% seconds). >> C:\Windows\Temp\gpl.log
echo Salam "Hai" diterima.
set issshserverready=0
:loopagain
FOR /F "tokens=* USEBACKQ" %%F IN (`C:\cygwin64\bin\ssh.exe ijortengab@192.168.212.102 -o 'ConnectTimeout 1' 'echo 1'`) DO (
  SET issshserverready=%%F
)
if not %issshserverready% == 1 goto loopagain
:serveron
echo Menjalankan Terminal.
C:\cygwin64\bin\mintty.exe /bin/ssh.exe ijortengab@192.168.212.102
echo Mission Completed.
if %isrun% == 1 TIMEOUT 2 1>nul
if not %isrun% == 1 TIMEOUT 5 1>nul
```

Taruh file `GPL.bat` pada salah satu folder yang terdaftar di [PATH][3] sehingga
bisa kita eksekusi gak pake lama melalui RUN.

## Test

Matikan vm `Debian 9.1`.

![Screenshot.](image://ijortengab.id/screenshot.1204.png)

Masuk ke Run, ketikkan `GPL`. Ekstensi `.bat` dapat diacuhkan. Enter.

![Screenshot.](image://ijortengab.id/screenshot.1203.png)

Program `GPL.bat` sedang menjalankan VM.

![Screenshot.](image://ijortengab.id/screenshot.1205.png)

Program `GPL.bat` sedang menanti trigger selesai booting dari Guest.

![Screenshot.](image://ijortengab.id/screenshot.1206.png)

Trigger diterima, saatnya menjalankan terminal. Lima detik kemudian program
`GPL.bat` akan auto close.

![Screenshot.](image://ijortengab.id/screenshot.1207.png)

Terminal pun muncul sudah `ssh` ke Guest.

![Screenshot.](image://ijortengab.id/screenshot.1202.png)

Tampilan pada VirtualBox Manager, terlihat bahwa `Debian 9.1` telah running.

![Screenshot.](image://ijortengab.id/screenshot.1208.png)

## Test 2

Ketika VM telah running. Kita bisa langsung buka terminal dan autologin ssh ke
Guest.

Execute kembali `GPL` melalui Run. Bisa huruf kecil karena Windows case
insensitive.

![Screenshot.](image://ijortengab.id/screenshot.1209.png)

Program `GPL.bat` langsung mendetect bahwa VM telah running, dan kemudian
menjalankan terminal dan koneksi ssh ke Guest.

![Screenshot.](image://ijortengab.id/screenshot.1210.png)

![Screenshot.](image://ijortengab.id/screenshot.1211.png)

## Instance

Untuk virtual machine berikutnya, kita duplicate file `GPL.bat` (pada Host) dan file `sayhaihost.sh` (pada Guest) kemudian rename file sesuai selera dan edit 
variable di dalam file tersebut dengan value aktual.

## Penutup

Sebelumnya diperlukan dua tahap yang bersifat `synchronous` untuk bisa bermain
di Guest VM.

 1. Execute command di Host untuk menyalakan Virtual Machine. Diwakili oleh
    file `2.bat`.
 2. Execute command di Host untuk login ssh ke Guest. Diwakili oleh file
    `4.bat`.

File `2.bat`:

```
vboxmanage startvm "Debian 9.1" --type headless
```

File `4.bat`:

```
C:\cygwin64\bin\mintty.exe /bin/ssh.exe ijortengab@192.168.212.102
```

Sekarang dua proses tersebut sudah berjalan berkelanjutan secara otomatis dengan
trick diatas.

Selamat bermain.

## References

[1]: /blog/2017/09/16/linux-autostart-script-saat-selesai-booting/
[2]: /blog/2017/09/14/ssh-key-server-2/
[3]: /blog/2015/04/19/path-cli/
[4]: /blog/2017/01/28/windows-rasa-linux-cygwin-openssh-server/
[5]: /blog/2017/09/13/vm-lan-ssh/

Googling:

- windows cmd stdout to variable
- cmd while true
- ssh connection timeout

<https://askubuntu.com/questions/469143/how-to-enable-ssh-root-access-on-ubuntu-14-04>

<https://linux.die.net/man/1/ssh>

<https://stackoverflow.com/questions/6359820/how-to-set-commands-output-as-a-variable-in-a-batch-file>

<https://stackoverflow.com/questions/1289026/syntax-for-a-single-line-bash-infinite-while-loop>

<https://stackoverflow.com/questions/5487473/how-to-create-an-infinite-loop-in-windows-batch-file>

<https://www.computerhope.com/issues/ch001050.htm>

<https://www.computerhope.com/choicehl.htm>

<https://www.computerhope.com/issues/ch001674.htm>
