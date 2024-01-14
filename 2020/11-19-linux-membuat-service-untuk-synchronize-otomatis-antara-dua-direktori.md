---
title: Linux - Membuat service untuk synchronize otomatis antara dua direktori
---

## Studi Kasus

Kita memiliki dua hard disk.

Satu hard disk di-mount di path `/var/www`.

Satunya lagi di-mount di path `/var/www2`.

Kita ingin agar setiap perubahan isi direktori pada path `/var/www`, maka secara otomatis akan di-mirror-kan ke direktori pada path `/var/www2`.

Bagaimanakah caranya?

## Persiapan

Environment menggunakan mesin Ubuntu 20.04 (Focal Fossa).

Install aplikasi `rsync` dan `inotify`.

```
sudo apt-get install rsync inotify-tools
```

Untuk kebutuhan verifikasi, kita install juga aplikasi `watch`.

```
sudo apt-get install watch
```

## Bash Script

Untuk syncrhonize antara dua direktori tersebut gunakan perintah sebagai berikut:

```
rsync -ar --delete /var/www/ /var/www2
```

Perintah diatas adalah sekali jalan (one time).

Untuk membuat auto detect perubahan pada path `/var/www/`, gunakan perintah sebagai berikut:

```
while inotifywait -r -e modify,create,delete,move /var/www; do
    rsync -ar --delete /var/www/ /var/www2
done
```

Dengan menggabungkan kedua perintah tersebut, maka kita buat script `rsync-var-www.sh` sebagai berikut:

```
cd /usr/local/bin
touch rsync-var-www.sh
chmod a+x rsync-var-www.sh
```

Isi dari file `rsync-var-www.sh` adalah:

```
#!/bin/bash
rsync -ar --delete /var/www/ /var/www2
while inotifywait -r -e modify,create,delete,move /var/www; do
    rsync -ar --delete /var/www/ /var/www2
done
```

## Service

Service pada linux adalah sebuah aplikasi (atau kumpulan aplikasi) yang berjalan secara background dan menunggu untuk digunakan sewaktu-waktu.

Script diatas akan kita jadikan sebagai sebuah service.

Berikut ini adalah membuat service pada mesin Ubuntu 20.04.

Buat file didalam direktori `/etc/systemd/system` kita beri nama `rsync-var-www.service`.

```
touch /etc/systemd/system/rsync-var-www.service
chmod 644 /etc/systemd/system/rsync-var-www.service
```

Isi dari file `rsync-var-www.service` adalah:

```
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/rsync-var-www.sh

[Install]
WantedBy=default.target
```

Enable service baru tersebut.

```
sudo systemctl daemon-reload
sudo systemctl enable rsync-var-www.service
```

Restart mesin.

```
init 6
```

## Verifikasi

Buka satu terminal (Terminal 1) dan jalankan `watch` per 1 detik pada direktori tujuan `/var/www2`.

```
watch -n 1 ls -la /var/www2
```

Buka satu terminal lagi (Terminal 2) dan test melakukan modifikasi direktori `/var/www`.

```
touch /var/www/test_{1,2,3,4,5}
```

Maka pada Terminal 1 akan terlihat auto synchronize secara realtime, dari path `/var/www` ke `/var/www2`.

## Control

Untuk mengontrol service kita gunakan `systemctl`.

```
systemctl x rsync-var-www.service
```

Subcommand `x` diganti dengan salah satu subcommand sbb: `status`, `start`, `stop`, `restart`, `enable`, dan `disable`.

Contoh cek status.

```
systemctl status rsync-var-www.service
```

Output:

```
ExecStart=/usr/local/bin/rsync-var-www.sh

[Install]
WantedBy=default.target
root@server:/home/ijortengab# sudo systemctl status rsync-var-www.service
● rsync-var-www.service
     Loaded: loaded (/etc/systemd/system/rsync-var-www.service; enabled; vendor preset: ena>
     Active: active (running) since Thu 2020-11-19 20:21:22 WIB; 2h 33min ago
   Main PID: 788 (rsync-var-www.s)
      Tasks: 2 (limit: 3221)
     Memory: 4.7M
     CGroup: /system.slice/rsync-var-www.service
             ├─  788 /bin/bash /usr/local/bin/rsync-var-www.sh
             └─29429 inotifywait -r -e modify,create,delete,move /var/www
```

## Reference

Googling "rsync two directories continuously"

https://stackoverflow.com/questions/12460279/how-to-keep-two-folders-automatically-synchronized

https://www.linux.com/news/introduction-services-runlevels-and-rcd-scripts/

Googling "ubuntu 20.04 startup script"

https://linuxconfig.org/how-to-run-script-on-startup-on-ubuntu-20-04-focal-fossa-server-desktop

https://linuxconfig.org/how-to-start-service-on-boot-on-ubuntu-20-04
