---
title: Menginstall Ubuntu 24.04 di WSL2
---

## Gerak Cepat

Buka command prompt pada Run.

```
cmd
```

Ketik `wsl --list --online`. Hasilnya:

```
The following is a list of valid distributions that can be installed.
Install using 'wsl --install -d <Distro>'.

NAME                                   FRIENDLY NAME
Ubuntu                                 Ubuntu
Debian                                 Debian GNU/Linux
kali-linux                             Kali Linux Rolling
Ubuntu-18.04                           Ubuntu 18.04 LTS
Ubuntu-20.04                           Ubuntu 20.04 LTS
Ubuntu-22.04                           Ubuntu 22.04 LTS
Ubuntu-24.04                           Ubuntu 24.04 LTS
OracleLinux_7_9                        Oracle Linux 7.9
OracleLinux_8_7                        Oracle Linux 8.7
OracleLinux_9_1                        Oracle Linux 9.1
openSUSE-Leap-15.5                     openSUSE Leap 15.5
SUSE-Linux-Enterprise-Server-15-SP4    SUSE Linux Enterprise Server 15 SP4
SUSE-Linux-Enterprise-15-SP5           SUSE Linux Enterprise 15 SP5
openSUSE-Tumbleweed                    openSUSE Tumbleweed
```

Install:

```
wsl --install -d Ubuntu-24.04
```

Output:

```
Installing: Ubuntu 24.04 LTS
[========                  15,0%                           ]
```

```
Installing: Ubuntu 24.04 LTS
[==========================85,0%==================         ]
```

Berhasil.

![Gambar](/images/2024/07/20240723_151513_screenshot.19.jpg)
