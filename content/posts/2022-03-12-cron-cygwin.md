---
title: Cron di Cygwin
slug: /blog/2022/03/12/cron-cygwin/
date: 2022-03-12
---

## Pendahuluan

[Cygwin adalah](/blog/2017/01/28/windows-rasa-linux-cygwin-openssh-server/) software yang memberikan fasilitas Linux pada Windows.

## Pertanyaan

Bagaimanakah setup Cron di Cygwin?

## Gerak Cepat

Cek cron apakah sudah terinstall atau belum.

```
ls /bin/ | grep crontab
```

Output:

```
ijortengab@pchome ~
$ ls /bin/ | grep crontab
crontab.exe
```

Jika belum ada, download ulang `setup-x86_64.exe` dan install package `cron`.

Pastikan pada kolom New, berubah dari `Skip` menjadi version number.

https://cygwin.com/setup-x86_64.exe

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-11-20_22.33.12.jpg)

## Cron Config

Kita akan menjalankan cron sebagai service di Windows.

Jalankan Cygwin Terminal dengan priviledge administrator. (Klik kanan run as administrator).

![Screenshot.](https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/2021/screenshot.2021-11-20_22.50.48.jpg)

Jalankan cron-config.

```
cron-config
```

Berbagai skenario yang bisa digunakan.

 1. Menjalankan Cron daemon sebagai current user.
 2. Menjalankan Cron daemon sebagai user terpisah misalnya `cyg_server`.
 3. Menjalankan Cron daemon sebagai `SYSTEM`.

Skenario yang relative cocok sebagai service adalah menjalankan sebagai Local System account (user `SYSTEM`).

**1. Menjalankan Cron sebagai current user**

Kita anggap user `ijortengab` adalah user satu-satunya di PC.

```
ijortengab@pchome ~
$ cron-config
The cron daemon can run as a service or as a job. The latter is not recommended.
Do you want to install the cron daemon as a service? (yes/no) yes
Enter the value of CYGWIN for the daemon: [ ] ntsec

You must decide under what account the cron daemon will run.
If you are the only user on this machine, the daemon can run as yourself.
   This gives access to all network drives but only allows you as user.
To run multiple users, cron must change user context without knowing
  the passwords. There are three methods to do that, as explained in
  http://cygwin.com/cygwin-ug-net/ntsec.html#ntsec-nopasswd1
If all the cron users have executed "passwd -R" (see man passwd),
  which provides access to network drives, or if you are using the
  cyglsa package, then cron should run under the local system account.
Otherwise you need to have or to create a privileged account.
  This script will help you do so.
Do you want the cron daemon to run as yourself? (yes/no) yes

Please enter the password for user 'ijortengab':
Reenter:
Running cron_diagnose ...
WARNING: You do not currently have a crontab file.

... no problem found.

Do you want to start the cron daemon as a service now? (yes/no) yes
OK. The cron daemon is now running.

In case of problem, examine the log file for cron,
/var/log/cron.log, and the Windows event log (using /usr/bin/cronevents)
for information about the problem cron is having.

Examine also any cron.log file in the HOME directory
(or the file specified in MAILTO) and cron related files in /tmp.

If you cannot fix the problem, then report it to cygwin@cygwin.com.
Please run the script /usr/bin/cronbug and ATTACH its output
(the file cronbug.txt) to your e-mail.

WARNING: PATH may be set differently under cron than in interactive shells.
         Names such as "find" and "date" may refer to Windows programs.
```

**2. Menjalankan Cron sebagai user terpisah (cyg_server)**

Dengan skenario ini, maka cron akan dijalankan dengan user baru bernama `cyg_server`.

```
ijortengab@pchome ~
$ cron-config
The cron daemon can run as a service or as a job. The latter is not recommended.
Do you want to install the cron daemon as a service? (yes/no) yes
Enter the value of CYGWIN for the daemon: [ ] ntsec

You must decide under what account the cron daemon will run.
If you are the only user on this machine, the daemon can run as yourself.
   This gives access to all network drives but only allows you as user.
To run multiple users, cron must change user context without knowing
  the passwords. There are three methods to do that, as explained in
  http://cygwin.com/cygwin-ug-net/ntsec.html#ntsec-nopasswd1
If all the cron users have executed "passwd -R" (see man passwd),
  which provides access to network drives, or if you are using the
  cyglsa package, then cron should run under the local system account.
Otherwise you need to have or to create a privileged account.
  This script will help you do so.
Do you want the cron daemon to run as yourself? (yes/no) no

Were the passwords of all cron users saved with "passwd -R", or
are you using the cyglsa package ? (yes/no) no

Finding or creating a privileged user.
No privileged account could be found.
This script plans to use account cyg_server.
Do you want to use another privileged account name? (yes/no) no

Account cyg_server needs a password. It must match
the rules in force on your system.
Please enter the password:
Reenter:

Account 'cyg_server' has been created with password '***'.
If you change the password, please keep in mind to change the
password for the exim service, too.

INFO: The cygwin user name for account cyg_server is cyg_server.

Running cron_diagnose ...
WARNING: You do not currently have a crontab file.

... no problem found.

Do you want to start the cron daemon as a service now? (yes/no) yes
OK. The cron daemon is now running.

In case of problem, examine the log file for cron,
/var/log/cron.log, and the Windows event log (using /usr/bin/cronevents)
for information about the problem cron is having.

Examine also any cron.log file in the HOME directory
(or the file specified in MAILTO) and cron related files in /tmp.

If you cannot fix the problem, then report it to cygwin@cygwin.com.
Please run the script /usr/bin/cronbug and ATTACH its output
(the file cronbug.txt) to your e-mail.

WARNING: PATH may be set differently under cron than in interactive shells.
         Names such as "find" and "date" may refer to Windows programs.

```

**3. Menjalankan Cron sebagai (SYSTEM)**

Dengan skenario ini, maka cron akan dijalankan dengan user existing bernama `SYSTEM` (alias Local System).

```
$ cron-config
The cron daemon can run as a service or as a job. The latter is not recommended.
Do you want to install the cron daemon as a service? (yes/no) yes
Enter the value of CYGWIN for the daemon: [ ] ntsec

You must decide under what account the cron daemon will run.
If you are the only user on this machine, the daemon can run as yourself.
   This gives access to all network drives but only allows you as user.
To run multiple users, cron must change user context without knowing
  the passwords. There are three methods to do that, as explained in
  http://cygwin.com/cygwin-ug-net/ntsec.html#ntsec-nopasswd1
If all the cron users have executed "passwd -R" (see man passwd),
  which provides access to network drives, or if you are using the
  cyglsa package, then cron should run under the local system account.
Otherwise you need to have or to create a privileged account.
  This script will help you do so.
Do you want the cron daemon to run as yourself? (yes/no) no

Were the passwords of all cron users saved with "passwd -R", or
are you using the cyglsa package ? (yes/no) yes
The cron daemon will run as SYSTEM.

Running cron_diagnose ...
WARNING: You do not currently have a crontab file.

... no problem found.

Do you want to start the cron daemon as a service now? (yes/no) yes
OK. The cron daemon is now running.

In case of problem, examine the log file for cron,
/var/log/cron.log, and the Windows event log (using /usr/bin/cronevents)
for information about the problem cron is having.

Examine also any cron.log file in the HOME directory
(or the file specified in MAILTO) and cron related files in /tmp.

If you cannot fix the problem, then report it to cygwin@cygwin.com.
Please run the script /usr/bin/cronbug and ATTACH its output
(the file cronbug.txt) to your e-mail.

WARNING: PATH may be set differently under cron than in interactive shells.
         Names such as "find" and "date" may refer to Windows programs.
```

## Cron Controller

Untuk validasi keberadaan service cron:

```
cygrunsrv --query cron
```

Contoh output jika status service adalah `Stopped`:

```
ijortengab@pchome /etc
$ cygrunsrv --query cron
Service             : cron
Display name        : Cron daemon
Current State       : Stopped
Command             : /usr/sbin/cron -n
```

Contoh output jika status service adalah `Running`:

```
ijortengab@pchome ~
$ cygrunsrv --query cron
Service             : cron
Display name        : Cron daemon
Current State       : Running
Controls Accepted   : Stop
Command             : /usr/sbin/cron -n
```

Jalankan cron dengan command:

```
net start cron
# atau
cygrunsrv --start cron
```

Stop cron service:

```
net stop cron
# atau
cygrunsrv --stop cron
```

## Cron Job

Edit user's cron table:

```
crontab -e
```

Debug cron:

```
cronevents
```

Cek log:

```
tail -f $HOME/cron.log
```

```
tail -f /var/log/cron.log
```

## Trooubleshooting

Pada kasus skenario nomor 2, user `cyg_server`, terjadi error jika crontab diisi oleh user reguler.

Contoh error:

```
2021/11/21 23:17:00 [cyg_server] /usr/sbin/cron: PID 1599: (CRON) STARTUP (V5.0)
2021/11/21 23:17:00 [cyg_server] /usr/sbin/cron: PID 1603: (ijortengab) CMD (bash -c "echo $(date +%Y-%m-%d\ %H:%M:%S) $(hostname) >> $HOME/.reboot.log")
2021/11/21 23:17:00 [cyg_server] /usr/sbin/cron: PID 1603: (CRON) error (can't switch user context)
2021/11/21 23:17:01 [cyg_server] cron: PID 1598: `cron' service started
```

Solusi adalah menggunakan crontab global, lalu environment disesuaikan.

```
[ -f /etc/crontab ] || {
    touch /etc/crontab
    chown SYSTEM:Administrators /etc/crontab
}
```

Contoh:

```
vi /etc/crontab
```

Edit cron table dan tambahkan environment variable HOME, sehingga file contents menjadi:

```
HOME=/usr/local
@reboot cyg_server bash -c "echo $(date +\%Y-\%m-\%d\ \%H:\%M:\%S) $(hostname) >> $HOME/.reboot.log"
```

Restart cron, dan lihat debug.

```
2021/11/22 00:05:15 [cyg_server] /usr/sbin/cron: PID 1675: (CRON) STARTUP (V5.0)
2021/11/22 00:05:16 [cyg_server] /usr/sbin/cron: PID 1677: (cyg_server) CMD (bash -c "echo $(date +%Y-%m-%d\ %H:%M:%S) $(hostname) >> $HOME/.reboot.log")
2021/11/22 00:05:17 [cyg_server] cron: PID 1674: `cron' service started
```

Verifikasi:

```
ls -la /usr/local/.reboot.log
```

Output:

```
-rw-r--r-- 1 cyg_server None 28 Nov 22 00:05 /usr/local/.reboot.log
```

Job berhasil dijalankan pada skenario ke-2.

## Reference

http://pedroivanlopez.com/cron-on-cygwin/

http://cygwin.com/cygwin-ug-net/ntsec.html#ntsec-nopasswd1

https://stackoverflow.com/questions/707184/how-do-you-run-a-crontab-in-cygwin-on-windows

http://kris.me.uk/2010/08/27/sshd-and-cron-on-windows-using-cygwin.html