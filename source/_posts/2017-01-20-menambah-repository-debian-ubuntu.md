---
title: Menambah Repository pada Linux Debian/Ubuntu
---

## Muqaddimah

Tiap kali menginstall Ubuntu Server 16.04 LTS pada Virtual Machine, maka yang 
saya lakukan segera adalah mengubah repository dari default menjadi repository 
lokal Indonesia.

Berhubung saya dan "machine" saya berada di Jabodetabek, maka repository lokal
yang terdekat adalah http://kambing.ui.ac.id yang berlokasi di Depok, 
Universitas Indonesia. 

## Kerja, Kerja, Kerja

Amankan file lama.
```sh
sudo mv /etc/apt/sources.list /etc/apt/sources.list~
```

Buat file baru.
```sh
sudo vi /etc/apt/sources.list
```

Copas content dibawah ini dan save.
```sh
deb http://kambing.ui.ac.id/ubuntu/ xenial main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-updates main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-security main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-backports main restricted universe multiverse
deb http://kambing.ui.ac.id/ubuntu/ xenial-proposed main restricted universe multiverse
```

Terakhir, update apt.
```sh
sudo apt-get update
```

## Credit

http://blog.antoniclianto.web.id/2012/05/daftar-repository-lokal-untuk-ubuntu.html

