# Optimasi Samba dengan VPN


Tulisan ini terkait dengan [tulisan sebelumnya][1].

## Pendahuluan

[1]: /blog/2017/04/27/samba-adalah/

Mengakses file di server Linux dengan client Windows dapat dilakukan setelah server Linux dipasang software Samba.

Samba bertindak sebagai emulator untuk menerima port 445 kemudian memprosesnya agar file di Linux dapat diakses di Windows menggunakan `explorer.exe`.

## Kendala

Terdapat kendala saat mengexplore file di server. Contoh kasus sebagai berikut:

Masuk ke server melalui `explorer.exe` menggunakan path domain (misal `\\ijortengab.id`).

Idle selama tiga menit.

Saat kembali ke `explorer.exe` terjadi proses loading (refreshing) yang membutuhkan waktu cukup lama (20 detik).

Setiap kali idle, maka `explorer.exe` seperti terputus dan untuk kembali bisa masuk ke folder membutuhkan loading yang cukup lama.

## Debug dengan Tcpview.exe

Untuk megecek koneksi software ke internet kita gunakan `Tcpview.exe`.

Software dapat didownload di `https://live.sysinternals.com/`.

Pengamatan dilakukan.

![screenshot.810.edited.png](/images/screenshot.810.edited.png)

Koneksi `System` yang mengakses port 445 ternyata mudah ngedrop jika idle selama sekitar tiga menit (Local Port berganti dari sebelumnya `xxx` menjadi `yyy`).

![screenshot.811.edited.png](/images/screenshot.811.edited.png)

## Solusi

Solusi agar stabil adalah menggunakan VPN. Solusi didapat berdasarkan pengalaman empirik.

[OpenVPN dipasang di server][2] dengan protokol `udp`. IP Address private dari server adalah `10.8.0.1` subnet mask `255.255.255.0`.

[2]: /blog/2017/01/23/install-openvpn-server-gpl/

Koneksi ke VPN dilakukan dan komputer localhost mendapat IP Address private.

Mencoba konek ke file sharing windows dengan mengakses path IP Address `\\10.8.0.1` melalui `explorer.exe` dan berhasil dengan sukses.

![screenshot.813.png](/images/screenshot.813.png)

Idle selama 5 menit, kemudian kembali mengakses folder file sharing dan kali ini tanpa hambatan. Langsung tanpa proses loading seperti sebelumya.

![screenshot.814.png](/images/screenshot.814.png)

Pengamatan melalui `Tcpview.exe` memperlihatkan bahwa localport untuk mengakses server tidak mengalami perubahan. Berarti koneksi stabil.

## Kesimpulan

Gunakan VPN jika ingin mengakses file/folder di server melalui `explorer.exe`.

File konfigurasi `/etc/samba/smb.conf` diubah karena akses hanya melalui VPN.

```
hosts allow =  10.8.0.0/24
interfaces = tun0
```
