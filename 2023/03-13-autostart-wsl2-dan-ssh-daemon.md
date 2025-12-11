---
slug: blog/2023/03/13/autostart-wsl2-dan-ssh-daemon
date: 2023-03-13
tags:
  - wsl2
  - cygwin
  - ssh
---

# Autostart WSL2 dan SSH Daemon

## Permasalahan

Windows kita sudah terpasang [ssh server][1] yang me-listen port 22 menggunakan
environment Cygwin.

[1]: /blog/2017/01-28-windows-rasa-linux-cygwin-openssh-server.md

Kita akan menambah ssh server, kali ini menggunakan environment WSL2. Kita
gunakan port yang berbeda dari port 22. Misalnya: `40022`.

Bagaimana caranya agar ssh server di WSL2 bisa autostart saat mesin dinyalakan.

## Cara Pertama (membutuhkan user logon Windows)

Cara ini cocok untuk laptop.

Kita akan menggunakan direktori bersama, yakni `%ALLUSERSPROFILE%` yang
(harusnya) memiliki value `C:\ProgramData`.

Masuk ke folder `%ALLUSERSPROFILE%`, lalu buat file bernama `wsl.bat`.

Isi file `wsl.bat` adalah:

```
C:\Windows\System32\wsl.exe -u root /etc/init.d/ssh start
```

Kita buat file bernama `wsl.vbs`. Isi file `wsl.vbs` adalah:

```
Set WinScriptHost = CreateObject("WScript.Shell")
WinScriptHost.Run Chr(34) & "%ALLUSERSPROFILE%\wsl.bat" & Chr(34), 0
Set WinScriptHost = Nothing
```

Jalankan `Run` window, dan ketik `shell:startup`, lalu ENTER. Maka akan masuk
ke folder: `%APPDATA%\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`.

Variable `%APPDATA%` memiliki value: `%USERPROFILE%\AppData\Roaming`.
Variable `%USERPROFILE%` memiliki value: `%HOMEDRIVE%\Users\<username>`.
Variable `%HOMEDRIVE%` memiliki value biasanya: `C:`.

Didalam folder ini kita buat shortcut ke file `wsl.vbs`. Selesai.

WSL dan SSH Daemon-nya WSL akan autostart setelah user login ke Windows.

## Cara Kedua (tanpa user logon Windows)

Cara ini cocok untuk pc yang difungsikan sebagai server.

Kita membutuhkan `cron` di [Cygwin](/blog/2022/03-12-cron-cygwin.md).

Di dalam environment Cygwin, kita buat file bernama `/usr/local/wsl-sshd-autostart.sh`.

```
touch /usr/local/wsl-sshd-autostart.sh
chmod a+x /usr/local/wsl-sshd-autostart.sh
vi /usr/local/wsl-sshd-autostart.sh
```

Isi file adalah:

```
#!/bin/bash
PATH=/cygdrive/c/Windows/system32:$PATH
date 2>&1
wsl -u root /etc/init.d/ssh start 2>&1
until [[ $(wsl --list --running --quiet | wc -l) -gt 0 ]]; do
    sleep 5
    wsl -u root /etc/init.d/ssh start 2>&1
done
```

Daftarkan di cron:

```
crontab -e
```

Append value berikut:

```
@reboot /usr/local/wsl-sshd-autostart.sh | tee -a /var/log/wsl-sshd-autostart.log
```

Restart mesin, dan debug dengan melihat log.

```
tail -f /var/log/wsl-sshd-autostart.log
```

Untuk mematikan `wsl` yang dijalankan via `cron` yang mana cron adalah service
dengan user `SYSTEM`, maka kita perlu command prompt yang dijalankan sebagai
administrator. Lalu matikan dengan `wslconfig`.

```
wslconfig /t Ubuntu-22.04
```

## Setup port 40022

Di dalam environment WSL2, kita edit ssh daemon config agar menggunakan port
40022 untuk ssh server.

Preview.

```
port_not_22=40022
sed -e 's,Port 22,Port '$port_not_22',' \
    -e 's,^#Port ,Port ,' \
    /etc/ssh/sshd_config
```

Execute.

```
port_not_22=40022
sed -e 's,Port 22,Port '$port_not_22',' \
    -e 's,^#Port ,Port ,' \
    -i /etc/ssh/sshd_config
```

## Akses SSH WSL2 melalui jaringan LAN

**Manual**

Kita memerlukan port forwarding dari interface apapun di Host (Windows) ke
interface di WSL2 yang mana memiliki IP Private.

Buat port forwarding dari Cygwin.

```
windows_port=40022
wsl_port=40022
connectaddress=$(wsl ip address show dev eth0 | grep 'inet ' | grep -P -o '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | head -1)
```

Ekseskusi menggunakan command prompt, run as admin.

```
netsh interface portproxy delete v4tov4 listenport=$windows_port
netsh advfirewall firewall delete rule name=$windows_port
netsh interface portproxy add v4tov4 listenport=$windows_port connectport=$wsl_port connectaddress="$connectaddress"
netsh advfirewall firewall add rule name=$windows_port dir=in action=allow protocol=TCP localport=$windows_port
netsh interface portproxy show v4tov4
```

**Automatis**

Kita akan menggunakan Cron di Cygwin untuk melakukan auto port forwarding saat reboot.

Di dalam environment Cygwin, kita buat file bernama `/usr/local/wsl-sshd-port-forwarding.sh`.

```
touch /usr/local/wsl-sshd-port-forwarding.sh
chmod a+x /usr/local/wsl-sshd-port-forwarding.sh
vi /usr/local/wsl-sshd-port-forwarding.sh
```

Isi file adalah:

```
#!/bin/bash
PATH=/cygdrive/c/Windows/system32:$PATH
windows_port=40022
wsl_port=40022
date 2>&1
until [[ $(wsl --list --running --quiet | wc -l) -gt 0 ]]; do
    sleep 10
done
connectaddress=$(wsl ip address show dev eth0 | grep 'inet ' | grep -P -o '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | head -1)
netsh interface portproxy delete v4tov4 listenport=$windows_port 2>&1
netsh advfirewall firewall delete rule name=$windows_port 2>&1
netsh interface portproxy add v4tov4 listenport=$windows_port connectport=$wsl_port connectaddress="$connectaddress" 2>&1
netsh advfirewall firewall add rule name=$windows_port dir=in action=allow protocol=TCP localport=$windows_port 2>&1
netsh interface portproxy show v4tov4 2>&1
```

Daftarkan di cron:

```
crontab -e
```

Append value berikut:

```
@reboot /usr/local/wsl-sshd-port-forwarding.sh | tee -a /var/log/wsl-sshd-port-forwarding.log
```

Restart mesin, dan debug dengan melihat log.

```
tail -f /var/log/wsl-sshd-port-forwarding.log
```
