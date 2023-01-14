---
title: Install OpenVPN Server GPL (Gak Pake Lama)
slug: /blog/2017/01/23/install-openvpn-server-gpl/
date: 2017-01-23
---

## Pendahuluan

Programmer yang baik hati telah membuat script untuk instalasi OpenVPN Server
dengan sangat cepat dan mudah. 

Cekidot Link ini: [OpenVPN road warrior installer for Debian, Ubuntu and CentOS][1]

## Gerak Cepat

```sh
sudo su
mkdir ~/ovpn
cd ~/ovpn
wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
```

## Dibalik layar

- Awalnya Googling dengan keyword "site:digitalocean.com setup vpn server"
- Berlabuh di link ini: https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-ubuntu-16-04
- Langsung praktek langkah-langkah instalasi pada artikel tersebut dan hasilnya gatot (Gagal Total).
- Lanjut baca kolom komentar
- Pada [komentar pertama][2], komentator memberikan link ke [script instalasi OpenVPN Server cepat gak pake lama][1].
- Setelah di-eksekusi script tersebut, hasilnya luar biasa. Sukses.

[1]: https://github.com/Nyr/openvpn-install
[2]: https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-ubuntu-16-04?comment=46637