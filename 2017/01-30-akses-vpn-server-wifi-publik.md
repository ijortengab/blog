# Akses VPN Server via WiFi Publik (gratisan)


## Latar Belakang

Salah satu bengkel motor resmi merk terkemuka di Indonesia menyediakan fasilitas WiFi gratis bagi pelanggannya. 

Untuk alasan tertentu, seperti keamanan, saya kadang menggunakan VPN pribadi ketika menumpang koneksi via WiFi gratisan.

Saat mencoba connect ke VPN Server, apa daya, koneksi selalu gagal pada proses `TLS` (terlampir).

Kemungkinan router pada access point memblock koneksi ke port default bawaan OpenVPN Server yakni 1194. 

## Solusi

WiFi gratisan dapat dipastikan membuka akses ke port 80 (untuk http) dan port 443 (untuk https). Jadi dalam kasus ini, kita cukup ganti port dari default 1194 ke salah-satu alternative port 80 atau 443.

Selain mengganti port, kemungkinan kita juga perlu mengganti tipe koneksi jika masih gagal. Mengganti dari tipe default `udp` menjadi `tcp`.

## Contoh Kasus

Contoh kasus pada tulisan ini ialah jika instalasi OpenVPN Server menggunakan [cara cepat gak pake lama][gpl] dan server menggunakan Ubuntu 16.04 LTS.

Pada kasus kali ini, saya mengganti port dari 1194 ke 443 karena server tidak melayani akses https. 

- Masuk ke server (menggunakan alternative koneksi lain).
- Ubah port VPN Server dari default 1194 menjadi 443.
- Edit file `/etc/openvpn/server.conf`
- Ganti value pada directive `port 1194` menjadi `port 443`
- Save file `/etc/openvpn/server.conf`
- Edit file `/etc/openvpn/client-common.txt`
- Ganti value pada directive `remote <IP> 1194` menjadi `remote <IP> 443`
- Save file `/etc/openvpn/client-common.txt`
- Restart service `systemctl restart openvpn@server.service`.
 
Create config baru dengan kembali meng-eksekusi file `openvpn-install.sh` hasil download dari link `http://git.io/vpn`.

Ulangi koneksi ke VPN Server dengan config yang baru. Pada kasus saya, hasilnya **sukses**.

## Hikmah

"Banyak Jalan Menuju Roma".

## Lampiran

```
Sun Jan 29 14:33:52 2017 VERIFY EKU OK
Sun Jan 29 14:33:52 2017 VERIFY OK: depth=0, CN=server
Sun Jan 29 14:34:43 2017 TLS Error: TLS key negotiation failed to occur within 60 seconds (check your network connectivity)
Sun Jan 29 14:34:43 2017 TLS Error: TLS handshake failed
Sun Jan 29 14:34:43 2017 SIGUSR1[soft,tls-error] received, process restarting
Sun Jan 29 14:34:43 2017 MANAGEMENT: >STATE:1485675283,RECONNECTING,tls-error,,
Sun Jan 29 14:34:43 2017 Restart pause, 2 second(s)
```
[gpl]: /blog/2017/01-23-install-openvpn-server-gpl.md
