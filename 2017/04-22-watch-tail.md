---
title: Monitoring Server menggunakan Watch dan Tail
---

## Watch adalah

Watch adalah program yang secara berkala akan mengeksekusi program. Tujuannya untuk memantau (watch) perubahan hasil (standard output) dari suatu program tersebut. 

Memantau kondisi direktori saat ini perdetik:

```
watch -n 1 ls -la /var/log/nginx
```

Memantau kondisi file `access.log` saat ini per 10 detik:

```
watch -n 10 'ls -la /var/log/nginx | grep access.log'
```

Memantau pengguna OpenVPN saat ini per 5 detik:

```
watch -n 5 cat /etc/openvpn/openvpn-status.log
```

## Tail adalah

Tail adalah program untuk membaca bagian akhir dari suatu file. Tujuannya untuk melihat catatan terbaru yang ditulis kedalam file secara append.

Memantau yang mengakses web server:

```
tail -f /var/log/nginx/access.log
```

Memantau system log dan lihat 100 baris terakhir.

```
tail -f /var/log/syslog -n 100
```

## Exit

Untuk keluar dari monitoring menggunakan `watch` maupun `tail` dengan menekan tombol `Ctrl+C`.
