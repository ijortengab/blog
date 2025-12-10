# Windows rasa Linux - remote Windows dengan CLI menggunakan Cygwin-OpenSSH


## Latar Belakang

Mengakses mesin komputer Windows secara remote dapat menggunakan berbagai software, diantaranya:

 - Remote Desktop Connection (bawaan Windows)
 - TightVNC
 - Radmin
 - TeamViewer

Software-software diatas memberikan GUI (Graphic User Interface). 

Bagaimana jika kita menginginkan CLI (Command Line Interface)?

Untuk kebutuhan tugas tertentu, seperti network administrator, CLI jauh lebih efisien dibandingkan GUI.

Solusi untuk mengakses Windows dengan CLI adalah (salah satunya) Cygwin dan OpenSSH.

Cygwin adalah software yang memberikan fasilitas Linux pada Windows.

## Install Cygwin

Komputer saya menggunakan Windows 7 64bit. Maka saya mendownload Cygwin versi 64 bit.

Download file setup di: https://cygwin.com/setup-x86_64.exe dan kemudian eksekusi.

Pada opsi "Choose a download source", saya memilih "Install from Internet".

Pada opsi "Select Root Install Directory", saya memilih ```C:\cygwin64```. 

Pada opsi "Install For", saya memilih "All Users". 

Pada opsi "Select Local Package Directory", saya memilih ```C:\Users\<user>\Downloads\Cygwin```. 

> Variable ```<user>``` disesuaikan dengan *current* home folder.

Pada opsi "Select Your Internet Connection", saya memilih "Use Internet Explorer Proxy Settings".

> Opsi ini membuat settingan koneksi proxy terpusat pada satu tempat. 

Pada opsi "Choose A Download Site", saya memilih list teratas yakni "http://cygwin.mirror.constant.com".

Pada opsi "Select Packages", search dengan query "openssh", expand kategori "Net", lalu klik tombol toggle "Skip" sehingga berganti menjadi nomor versi openssh terbaru (7.3p1-2) dan pastikan kolom Bin tersilang (checklist).

Instalasi berjalan, dan diakhiri dengan opsi untuk membuat shortcut pada Desktop atau Start Menu. Saya memilih default (keduanya dibuat).

## Konfigurasi OpenSSH Server

Jalankan Cygwin Terminal yang terdapat di Desktop. Jalankan dengan Administrator Privilages.

Jika tidak tersedia (misalnya karena dihapus), maka jalankan CMD alias Command Prompt, gunakan Administrator Privilages, kemudian eksekusi:

```C:\cygwin64\bin\mintty.exe -``` 

> Pastikan karakter dash "-" dimasukkan sebagai option.

Untuk kali pertama, akan muncul notice sbb:

```
Copying skeleton files.
These files are for the users to personalise their cygwin experience.

They will never be overwritten nor automatically updated.

'./.bashrc' -> '/home/<user>//.bashrc'
'./.bash_profile' -> '/home/<user>//.bash_profile'
'./.inputrc' -> '/home/<user>//.inputrc'
'./.profile' -> '/home/<user>//.profile'
```

Tidak seperti menginstall openssh-server di Ubuntu yang siap pakai, di Windows ini kita perlu konfigurasi server.

Pada Cygwin Terminal, jalankan command dan masukkan input sesuai permintaan:

```
$ ssh-host-config
```

### Daftar Input

Pemilihan jawaban saya sesuaikan dengan [sumber reference][1].

> Should StrictModes be used? **no**

Sesuai dengan penjelasan yang tertera pada terminal, maka saya melonggarkan permission dengan memilih opsi no.

> Should privilege separation be used? **yes**

> Should this script attempt to create a new local account 'sshd'? **yes**

> Do you want to install sshd as a service? (Say "no" if it is already installed as a service) **yes**

> Enter the value of CYGWIN for the daemon: [] **ntsec**

> This script plans to use 'cyg_server'. Info: 'cyg_server' will only be used by registered services. Do you want to use a different name? **no**

> Create new privileged user account '<hostname>\cyg_server' (Cygwin name: 'cyg_server')? **yes**

> Please enter the password: **<password>**

> Reenter: **<password>**

## Konfigurasi Service SSH Daemon

### Jalankan service secara manual.

Untuk menjalankan service secara manual, masuk ke terminal Cygwin atau Command Prompt, lalu eksekusi:

``` 
net start sshd
``` 

Atau melalui GUI, masuk ke Run (Tombol Windows + r), ketik ```services.msc```, enter, cari service dengan nama "CYGWIN sshd", lalu klik link "Start the service".

### Jalankan service secara autostart.

Meski pada GUI tertera bahwa service akan startup secara otomatis, kenyataannya hal tersebut selalu failed.

Alternative-nya adalah dengan menggunakan Task Scheduler.

Masuk ke Run (Tombol Windows + r), ketik ```taskschd.msc```, enter. 

- Create Basic

- Tab General

- Name: SSHD

- Run whether user is logged on or not. Do not store password.

- Tab Triggers

- Begin the task: at startup

- Tab Actions

- Start a program: ```net```. Add arguments ```start sshd```.

- Ok

## Konfigurasi Firewall untuk port 22

Masuk ke Run (Tombol Windows + r), ketik ```firewall.cpl```, enter. 

- Advanced Settings

- Inbound Rules. New Rule.

- Rule Type: Port.

- TCP Port 22.

- Allow the connection.

- Pilih untuk semua profile.

- Name: SSHD

## Test

Untuk mengetest koneksi ssh, hindari menggunakan Cygwin Terminal karena hasilnya tidak terasa bedanya.

Alternatifnya gunakan Command Prompt, masuk ke direktori ```C:\cygwin64\bin```, kemudian eksekusi:

```
ssh -v localhost
```

Untuk mengetest menggunakan komputer lain dalam satu jaringan bisa menggunakan program Putty.

Jika komputer lain tersebut juga terdapat Cygwin maka eksekusi command berikut:

```
ssh -v <ip> -l <user>
```

## Penutup

Selamat menikmati Windows rasa Linux.

## Reference

http://www.howtogeek.com/howto/41560/how-to-get-ssh-command-line-access-to-windows-7-using-cygwin/

http://www.tcm.phy.cam.ac.uk/~mr349/cygwin.html

[1]: http://www.howtogeek.com/howto/41560/how-to-get-ssh-command-line-access-to-windows-7-using-cygwin/

## Lampiran

```
$ ssh-host-config

*** Info: Generating missing SSH host keys
ssh-keygen: generating new host keys: RSA DSA ECDSA ED25519
*** Info: Creating default /etc/ssh_config file
*** Info: Creating default /etc/sshd_config file

*** Info: StrictModes is set to 'yes' by default.
*** Info: This is the recommended setting, but it requires that the POSIX
*** Info: permissions of the user's home directory, the user's .ssh
*** Info: directory, and the user's ssh key files are tight so that
*** Info: only the user has write permissions.
*** Info: On the other hand, StrictModes don't work well with default
*** Info: Windows permissions of a home directory mounted with the
*** Info: 'noacl' option, and they don't work at all if the home
*** Info: directory is on a FAT or FAT32 partition.
*** Query: Should StrictModes be used? (yes/no) no

*** Info: Privilege separation is set to 'sandbox' by default since
*** Info: OpenSSH 6.1.  This is unsupported by Cygwin and has to be set
*** Info: to 'yes' or 'no'.
*** Info: However, using privilege separation requires a non-privileged account
*** Info: called 'sshd'.
*** Info: For more info on privilege separation read /usr/share/doc/openssh/README.privsep.
*** Query: Should privilege separation be used? (yes/no) yes
*** Info: Note that creating a new user requires that the current account have
*** Info: Administrator privileges.  Should this script attempt to create a
*** Query: new local account 'sshd'? (yes/no) yes
*** Info: Updating /etc/sshd_config file

*** Query: Do you want to install sshd as a service?
*** Query: (Say "no" if it is already installed as a service) (yes/no) yes
*** Query: Enter the value of CYGWIN for the daemon: [] ntsec
*** Info: On Windows Server 2003, Windows Vista, and above, the
*** Info: SYSTEM account cannot setuid to other users -- a capability
*** Info: sshd requires.  You need to have or to create a privileged
*** Info: account.  This script will help you do so.

*** Info: It's not possible to use the LocalSystem account for services
*** Info: that can change the user id without an explicit password
*** Info: (such as passwordless logins [e.g. public key authentication]
*** Info: via sshd) when having to create the user token from scratch.
*** Info: For more information on this requirement, see
*** Info: https://cygwin.com/cygwin-ug-net/ntsec.html#ntsec-nopasswd1

*** Info: If you want to enable that functionality, it's required to create
*** Info: a new account with special privileges (unless such an account
*** Info: already exists). This account is then used to run these special
*** Info: servers.

*** Info: Note that creating a new user requires that the current account
*** Info: have Administrator privileges itself.

*** Info: No privileged account could be found.

*** Info: This script plans to use 'cyg_server'.
*** Info: 'cyg_server' will only be used by registered services.
*** Query: Do you want to use a different name? (yes/no) no
*** Query: Create new privileged user account '<hostname>\cyg_server' (Cygwin name: 'cyg_server')? (yes/no) yes
*** Info: Please enter a password for new user cyg_server.  Please be sure
*** Info: that this password matches the password rules given on your system.
*** Info: Entering no password will exit the configuration.
*** Query: Please enter the password:
*** Query: Reenter:

*** Info: User 'cyg_server' has been created with password '<password>'.
*** Info: If you change the password, please remember also to change the
*** Info: password for the installed services which use (or will soon use)
*** Info: the 'cyg_server' account.


*** Info: The sshd service has been installed under the 'cyg_server'
*** Info: account.  To start the service now, call `net start sshd' or
*** Info: `cygrunsrv -S sshd'.  Otherwise, it will start automatically
*** Info: after the next reboot.

*** Info: Host configuration finished. Have fun!
```
