# OpenSSH Server for Windows XP


Cara terbaik untuk menginstall OpenSSH server di mesin berbasis Windows adalah 
dengan menggunakan Cygwin seperti yang telah dibahas pada 
[tulisan sebelumnya][1].

Namun saat tulisan ini dibuat, Cygwin telah berhenti mendukung windows XP.

> NOTE: As previously announced, Cygwin version 2.5.2 was the last version 
> supporting Windows XP and Server 2003. (Instructions for obtaining that 
> version)

Sumber: http://www.cygwin.com/

![Screenshot.](/images/screenshotxp.13.png)

Terdapat tiga program yang sama-sama menggunakan engine openssh dan dibuat 
sedemikian rupa sehingga compatible dengan Windows, salah satunya Windows XP
yakni:

1. http://sshwindows.sourceforge.net ([Download][2])
2. http://opensshwindows.sourceforge.net ([Download][3])
3. http://sshwindows.webheat.co.uk ([Download][4])

Setelah mencicipi ketiga program diatas, saya memilih nomor 2, yakni: 
http://opensshwindows.sourceforge.net dengan sedikit tambahan aktifitas.

## Install Notepad++

Sebelum memulai, ada baiknya kita menginstall Notepad++ terlebih dahulu di 
Windows XP.

![Screenshot.](/images/screenshotxp.9.png)

![Screenshot.](/images/screenshotxp.11.png)

## Multi User

`OpenSSH for Windows` memiliki kendala dalam multi user. 

Kita buat user lain selain `Administrator`. 

Masuk ke `Control Panel >> User Accounts`. Cara cepat menggunakan `Run` ketik 
`control userpasswords2`.

![Screenshot.](/images/screenshotxp.16.png)

Tambah user selain `Administrator`, yakni `ijortengab`.

![Screenshot.](/images/screenshotxp.17.png)

Tambah role sebagai `Administrators`.

![Screenshot.](/images/screenshotxp.18.png)

## Install OpenSSH for Windows

Download program `OpenSSH for Windows` dari repository [IjorTengab Tools][3].
Lakukan instalasi.

![Screenshot.](/images/screenshotxp.12.png)

Setelah instalasi, lakukan verifikasi port 22 yang didengar oleh sshd.

```
netstat -aon | find /i "22"
```

![Screenshot.](/images/screenshotxp.14.png)

Secara default, lokasi direktori OpenSSH for Windows adalah di 
`C:\Program Files\OpenSSH for Windows`. 

Masuk ke direktori tersebut. Buka file berlokasi di `etc/passwd` menggunakan 
`notepad++`.

![Screenshot.](/images/screenshotxp.15.png)

Dari isi file tersebut terlihat bahwa login ssh hanya untuk user 
`Administrator` dengan home direktori berlokasi di `/home` alias di 
`C:\Program Files\OpenSSH for Windows\home`. 

![Screenshot.](/images/screenshotxp.22.png)

## After Install

**PATH**

Klik kanan pada `My Computer >> Properties`. 

![Screenshot.](/images/screenshotxp.29.png)

Tab `Advanced`. Tombol `Environment Variables`.

![Screenshot.](/images/screenshotxp.30.png)

System Variables. Variable Path. Append value berikut:

```
C:\Program Files\OpenSSH for Windows\bin
```

![Screenshot.](/images/screenshotxp.31.png)

Restart mesin agar penambahan variable `Path` terimplementasi.

```
shutdown -r -t 0
```

Test dengan membuka command prompt, kemudian eksekusi command `ls`.

![Screenshot.](/images/screenshotxp.32.png)

**Firewall**

Masuk ke Windows Firewall. Run `firewall.cpl`.

![Screenshot.](/images/screenshotxp.7.png)

Tambahkan port `22` sebagai Exception pada Firewall.

![Screenshot.](/images/screenshotxp.8.png)

**Banner**

File banner cukup mengganggu sebagai welcome screen setelah login ssh. 
Sebaiknya kita singkirkan.

Edit file `C:\Program Files\OpenSSH for Windows\etc\sshd_config` dengan 
`notepad++`.

Lalu edit baris config dari:

```
# default banner path
Banner /etc/banner.txt
```

menjadi:

```
# default banner path
# Banner /etc/banner.txt
```

Alias matikan direct Banner dengan menjadikannya comment.

Restart daemon agar config reload. Buka command prompt:

```
net stop opensshd
net start opensshd
```

**Test_SSH**

Buka command prompt dan ssh ke diri sendiri.

```shell
ssh localhost
```

Sukses.

![Screenshot.](/images/screenshotxp.33.png)

Terminal yang terbuka adalah `cmd` dimana environmentnya adalah `Windows`.

Ciri khas environtment `Windows` adalah adanya command `PATH`.

![Screenshot.](/images/screenshotxp.34.png)

Untuk berpindah ke environment `Linux`, gunakan command `bash`.

Ciri khas environtment `Linux` adalah adanya command `export` dan directory khas
root `ls /`.

```shell
bash-3.2$ export
...
declare -x PATH="/cygdrive/c/WINDOWS/system32:/cygdrive/c/WINDOWS:/cygdrive/c/WINDOWS/System32/Wbem:/usr/bin:/usr/bin:/usr/bin"
...
bash-3.2$ ls /
bin  cygdrive  docs  etc  home  proc  tmp  usr  var
bash-3.2$ 
```

## Multiuser

Setelah install, maka user yang digenerate pada `OpenSSH for Windows` versi ini 
hanya `Administrator`. 

Buka file `C:\Program Files\OpenSSH for Windows\etc\passwd` dengan `notepad++`.

![Screenshot.](/images/screenshotxp.22.png)

Agar support multi user, maka kita perlu generate value pada file `passwd` agar
support untuk user lainnya.

Buka command prompt, masuk ke:

```
cd C:\Program Files\OpenSSH for Windows\bin
```

Jalankan program `mkpasswd`.

```
mkpasswd -l > ../etc/passwd
```

Buka kembali program notepad++, muncul warning karena file `passwd` telah 
dimodifikasi (dalam kasus ini program `mkpasswd` telah memperbarui file 
`passwd`).

![Screenshot.](/images/screenshotxp.19.png)

Kini seluruh user dalam system termasuk (invisible account) tercatat dalam file 
`passwd`. Termasuk lokasi direktori `/home` yang kini per account sudah punya
rumah masing-masing.

![Screenshot.](/images/screenshotxp.20.png)

## Home_Directory

Directory atau folder `/home` masing-masing account perlu dibuat secara manual.

Untuk alasan kompatibilitas Linux di Windows, maka tiap user harus membuat home
directory-nya masing-masing. 

User `Administrator`-lah yang harus membuat `/home/Administrator` dan bukan yang
lain.

User `ijortengab`-lah yang harus membuat `/home/ijortengab` dan bukan yang
lain.

Mengapa? Agar kepemilikan home direktori sesuai dengan user yang bersangkutan.

**User_Administrator**

Saat ini session yang aktif adalah user `Administrator`.

![Screenshot.](/images/screenshotxp.24.png)

Masuk ke folder `/home` atau `C:\Program Files\OpenSSH for Windows\home`.

![Screenshot.](/images/screenshotxp.21.png)

Buat folder untuk user `Administrator`. Lalu copy paste file
`C:\Program Files\OpenSSH for Windows\home\bash_profile` ke dalam folder 
tersebut.

![Screenshot.](/images/screenshotxp.25.png)

**User_ijortengab**

Log Off. 

![Screenshot.](/images/screenshotxp.26.png)

Ganti user ke `ijortengab`.

![Screenshot.](/images/screenshotxp.27.png)

Ulangi pembuatan home direktori `ijortengab` oleh username `ijortengab`.

Masuk ke folder `/home` atau `C:\Program Files\OpenSSH for Windows\home`.

Buat folder untuk user `ijortengab`. Lalu copy paste file
`C:\Program Files\OpenSSH for Windows\home\bash_profile` ke dalam folder 
tersebut. 

![Screenshot.](/images/screenshotxp.28.png)

Test kepemilikan direktori home dengan command `ls -l`.

```
ssh localhost
bash
cd /home
ls -l
```

Output sebagai berikut:

```shell
drwx------+ 1 Administrator None  0 2017-09-14 22:03 Administrator
drwx------+ 1 ijortengab    None  0 2017-09-14 22:13 ijortengab
```

Terlihat bahwa mode permission setiap file atau folder yang dibuat selalu
bernilai `700`.

## Test SSH Multiuser

Gunakan mesin lain untuk ssh ke server Windows XP.

Login sebagai user `Administrator` sukses.

![Screenshot.](/images/screenshot.1200.png)

Login sebagai user `ijortengab` juga sukses.

![Screenshot.](/images/screenshot.1201.png)

## Reference

[1]: /blog/2017/01-28-windows-rasa-linux-cygwin-openssh-server.md
[2]: /tools/ssh/sshwindows.sourceforge.net/setupssh381-20040709.zip
[3]: /tools/ssh/opensshwindows.sourceforge.net/OpenSSHWindows53p1-2.msi
[4]: /tools/ssh/sshwindows.webheat.co.uk/OpenSSH_for_Windows_5.6p1-2.exe

