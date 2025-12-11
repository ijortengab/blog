---
tags:
  - nfs
---

# Belajar NFS (Network File System) - Studi Kasus Create Backup

## Studi Kasus

Pada [tulisan sebelumnya][1], sebuah PC jadul telah terdapat partisi LVM dengan
Logical Volume (LV) berkapasitas 223,6GB.

[1]: /blog/2021/08-13-belajar-lvm-logical-volume-manager.md

Untuk mengantisipasi kegagalan hard disk, kita perlu buat backup.

Backup kita buat skenario sebagai berikut:

 - Menggunakan PC yang berbeda, terhubungan dengan LAN.
 - Menggunakan LV dengan kapasitas yang identik.
 - Menggunakan `rsync` over NFS.

PC jadul (jaman dulu/sudah tua) kita beri nama `pcjadul` berada pada alamat IP `192.168.38.34`.

PC untuk backup kita beri nama `pcbackup` berada pada alamat IP `192.168.38.35`.

## Kondisi PC Backup

`pcbackup` terdapat 4 Hard Disk dengan rincian sebagai berikut:

```
fdisk -l | sed -e '/Disk \/dev\/loop/,+5d'
```

Output:

```
Disk /dev/sda: 298,9 GiB, 320072933376 bytes, 625142448 sectors
Disk model: ST3320813AS

Disk /dev/sdb: 149,5 GiB, 160041885696 bytes, 312581808 sectors
Disk model: Hitachi HDS72161

Disk /dev/sdc: 74,55 GiB, 80032038912 bytes, 156312576 sectors
Disk model: WDC WD800JD-08MS

Disk /dev/sdd: 298,9 GiB, 320072933376 bytes, 625142448 sectors
Disk model: ST3320813AS
```

Cek partisi:

```
lsblk | grep -v loop
```

Output:

```
root@pcbackup:~# lsblk | grep -v loop
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 298,1G  0 disk
├─sda1   8:1    0 149,6G  0 part /mnt/4CF
└─sda2   8:2    0 148,5G  0 part /mnt/6A9
sdb      8:16   0 149,1G  0 disk
├─sdb1   8:17   0   512M  0 part /boot/efi
├─sdb2   8:18   0     1K  0 part
└─sdb5   8:21   0 148,6G  0 part /
sdc      8:32   0  74,5G  0 disk
└─sdc1   8:33   0  74,5G  0 part /mnt/F86
sdd      8:48   0 298,1G  0 disk
```

Hard disk ke-4 masih kosong belum ada partisi.

Kita akan menggunakan hard disk ke-4 `/dev/sdd` sebagai tempat backup data.

## Partisi LVM Identik

Kita akan buat partisi identik dengan partisi LVM di `pcjadul`.

Lihat rincian sektor pada LV di `pcjadul`:

```
lvdisplay /dev/vg00/lv00 --units s
```

```
root@pcjadul:~# lvdisplay -v /dev/vg00/lv00 --units s
  --- Logical volume ---
  LV Path                /dev/vg00/lv00
  LV Name                lv00
  VG Name                vg00
  LV UUID                SHhzL3-iLec-AzNE-JggT-nfzH-oA0Z-FJHvGb
  LV Write Access        read/write
  LV Creation host, time pcjadul, 2021-08-13 18:03:57 +0700
  LV Status              available
  # open                 1
  LV Size                468893696 Se
  Current LE             57238
  Segments               3
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

Jumlah sector sebanyak 468893696.

> Berdasarkan pengalaman (empiris), maka kita perlu menambah 8192 sector (16 byte)
> saat membuat partisi agar hasil size LV menjadi identik.

Kita format hard disk `/dev/sdd`.

```
fdisk /dev/sdd
```

Output:

```
root@pcbackup:~# fdisk /dev/sdd

Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help):
```

Pilih `n`, yakni `add a new partition`.

Output:

```
Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p):
```

Pilih jawaban default pada opsi `Partition type`, `Partition number`, dan `First sector`.

Output:

```
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p):

Using default response p.
Partition number (1-4, default 1):
First sector (2048-625142447, default 2048):
```

Pada last sector, kita gunakan rumus:

[sector pada LV] + 8192 = 468893696 + 8192 = 468901888.

Gunakan prefix `+` pada jawaban.

Output:

```
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-625142447, default 625142447): +468901888

Created a new partition 1 of type 'Linux' and of size 223,6 GiB.
```

Terakhir, write.

```
Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

Cek ulang partisi.

```
lsblk | grep -v loop
```

Output:

```
root@pcbackup:~# lsblk | grep -v loop
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 298,1G  0 disk
├─sda1   8:1    0 149,6G  0 part /mnt/4CF
└─sda2   8:2    0 148,5G  0 part /mnt/6A9
sdb      8:16   0 149,1G  0 disk
├─sdb1   8:17   0   512M  0 part /boot/efi
├─sdb2   8:18   0     1K  0 part
└─sdb5   8:21   0 148,6G  0 part /
sdc      8:32   0  74,5G  0 disk
└─sdc1   8:33   0  74,5G  0 part /mnt/F86
sdd      8:48   0 298,1G  0 disk
└─sdd1   8:49   0 223,6G  0 part
```

Buat lv dengan command sebagai berikut:

```
pvcreate /dev/sdd1
vgcreate vg00 /dev/sdd1
lvcreate -n lv00 -l 100%FREE vg00
```

Output:

```
root@pcbackup:~# pvcreate /dev/sdd1
  Physical volume "/dev/sdd1" successfully created.
root@pcbackup:~# vgcreate vg00 /dev/sdd1
  Volume group "vg00" successfully created
root@pcbackup:~# lvcreate -n lv00 -l 100%FREE vg00
  Logical volume "lv00" created.
```

Verifikasi sector pada LV yang baru dibuat.

```
lvdisplay /dev/vg00/lv00 --units s
```

Output:

```
root@pcbackup:~# lvdisplay /dev/vg00/lv00 --units s
  --- Logical volume ---
  LV Path                /dev/vg00/lv00
  LV Name                lv00
  VG Name                vg00
  LV UUID                NQdCJr-3F5l-wA9X-W1KH-K8Ad-2cxR-FR7rIA
  LV Write Access        read/write
  LV Creation host, time pcbackup, 2021-08-15 09:47:14 +0700
  LV Status              available
  # open                 0
  LV Size                468893696 Se
  Current LE             57238
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

Partisi LV yang dibuat pada `pcbackup` identik size-nya dengan LV di `pcjadul`.

Format file system, buat direktori, dan mounting.

```
mkfs.ext4 /dev/vg00/lv00

mkdir -p /mnt/lv00

mount /dev/vg00/lv00 /mnt/lv00
```

Auto Mounting. Cek UUID.

```
blkid
```

Output:

```
/dev/mapper/vg00-lv00: UUID="5ea808ac-8051-4559-8990-8b0fac7eba6d" TYPE="ext4"
```

Tambah baris berikut pada file `/etc/fstab`:

```
UUID=5ea808ac-8051-4559-8990-8b0fac7eba6d /mnt/lv00 ext4 defaults 0 0
```

## Linux NFS (Network File System)

NFS akan kita gunakan sebagai remote file system, agar direktori pada `pcbackup` dapat dimount pada `pcjadul`.

Kedua PC menggunakan Sistem Operasi Ubuntu `20.04`.

**Install**

Server NFS adalah `pcbackup`, install NFS Kernel:

```
apt install nfs-kernel-server
```

Client NFS adalah `pcjadul`, install NFS Common:

```
apt install nfs-common
```

**Server Configuration**

Direktori `/mnt/lv00` pada `pcbackup` akan kita beri akses ke `pcjadul` yang memiliki IP `192.168.38.34`.

Edit file `/etc/exports` pada `pcbackup`:

```
/mnt/lv00 192.168.38.34(rw,sync,no_subtree_check,no_root_squash)
```

Options:

 - `rw` Allow both read and write requests on this NFS volume. The default is to disallow any request which changes the filesystem.
 - `sync` Reply to requests only after the changes have been committed to stable storage
 - `no_subtree_check` This option disables subtree checking, which has mild security implications, but can improve reliability in some circumstances.
 - `no_root_squash` Turn off root squashing. This option is mainly useful for diskless clients.

Lengkapnya pada manual `man exports`.

Invoke table exports:

```
exportfs -a
```

Verifikasi:

```
cat  /var/lib/nfs/etab
```

Output:

```
/mnt/lv00       152.118.38.34(rw,sync,wdelay,hide,nocrossmnt,secure,no_root_squash,no_all_squash,no_subtree_check,secure_locks,acl,no_pnfs,anonuid=65534,anongid=65534,sec=sys,rw,secure,no_root_squash,no_all_squash)
```

Restart daemon:

```
systemctl restart nfs-server.service
```

Verifikasi:

```
systemctl status nfs-server.service
```

Output:

```
root@pcbackup:~# systemctl status nfs-server.service
● nfs-server.service - NFS server and services
     Loaded: loaded (/lib/systemd/system/nfs-server.service; enabled; vendor preset: enabled)
    Drop-In: /run/systemd/generator/nfs-server.service.d
             └─order-with-mounts.conf
     Active: active (exited) since Sun 2021-08-15 21:40:39 WIB; 1min 24s ago
    Process: 104405 ExecStartPre=/usr/sbin/exportfs -r (code=exited, status=0/SUCCESS)
    Process: 104406 ExecStart=/usr/sbin/rpc.nfsd $RPCNFSDARGS (code=exited, status=0/SUCCESS)
   Main PID: 104406 (code=exited, status=0/SUCCESS)

Agu 15 21:40:38 pcbackup systemd[1]: Starting NFS server and services...
Agu 15 21:40:39 pcbackup systemd[1]: Finished NFS server and services.
```

**Client Configuration**

Buat direktori pada `pcjadul` sebagai mount point.

```
mkdir -p /mnt/pcbackup-lv00
```

Verifikasi ulang bahwa IP `pcjadul` bisa mengakses direktori tujuan di `pcbackup`.

```
showmount -e 192.168.38.35
```

Output:

```
root@pcjadul:~# showmount -e 192.168.38.35
Export list for 192.168.38.35:
/mnt/lv00 192.168.38.34
```

Mounting.

```
mount -t nfs 192.168.38.35:/mnt/lv00 /mnt/pcbackup-lv00
```

Auto mounting. Edit file `/etc/fstab`, tambah baris berikut:

```
192.168.38.35:/mnt/lv00 /mnt/pcbackup-lv00 nfs defaults 0 0
```

Verifikasi:

```
df -h
```

Output:

```
/dev/mapper/vg00-lv00    220G   61M  208G   1% /mnt/lv00
192.168.38.35:/mnt/lv00  220G   60M  208G   1% /mnt/pcbackup-lv00
```

## Rsync

Proses backup akan menggunakan `rsync` seperti pada tulisan berikut ini:

[Linux - Membuat service untuk synchronize otomatis antara dua direktori][2]

[2]: /blog/2020/11-19-linux-membuat-service-untuk-synchronize-otomatis-antara-dua-direktori.md

**Gerak cepat**

Pada `pcbackup`:

```
apt-get install rsync inotify-tools
touch /usr/local/bin/rsync-mnt-lv00.sh
chmod a+x /usr/local/bin/rsync-mnt-lv00.sh
CONTENT=$(cat <<- 'EOF'
#!/bin/bash
rsync -ar --delete /mnt/lv00/ /mnt/pcbackup-lv00
while inotifywait -r -e modify,create,delete,move /mnt/lv00; do
    rsync -ar --delete /mnt/lv00/ /mnt/pcbackup-lv00
done
EOF
)
echo "$CONTENT" > /usr/local/bin/rsync-mnt-lv00.sh
touch /etc/systemd/system/rsync-mnt-lv00.service
chmod 644 /etc/systemd/system/rsync-mnt-lv00.service

CONTENT=$(cat <<- 'EOF'
[Unit]
After=network.service

[Service]
ExecStart=/usr/local/bin/rsync-mnt-lv00.sh

[Install]
WantedBy=default.target
EOF
)
echo "$CONTENT" > /etc/systemd/system/rsync-mnt-lv00.service
systemctl daemon-reload
systemctl enable --now rsync-mnt-lv00.service

```

**Test**

Buka terminal baru pada NFS Server (`pcbakcup`). Perhatikan perubahan.

```
watch -n 1 ls -la /mnt/lv00
```

Buat file pada `pcjadul`:

```
touch test.txt
```

Hasil watch pada `pcbackup`:

```
Every 1,0s: ls -la /mnt/lv00                    pcbackup: Sun Aug 15 22:41:04 2021

total 24
drwxr-xr-x  3 root root  4096 Agu 15 22:40 .
drwxr-xr-x 11 root root  4096 Agu 14 10:50 ..
drwx------  2 root root 16384 Agu 13 18:08 lost+found
-rw-r--r--  1 root root     0 Agu 15 22:40 test.txt
```

## Kesimpulan

Partisi LVM di `pcjadul` yang mount di direktori `/mnt/lv00` sekarang sudah
otomatis **backup** realtime (pada layer aplikasi) ke partisi LVM identik di `pcbackup`.

## Reference

Google query: nfs example

https://cloud.netapp.com/blog/azure-anf-blg-linux-nfs-server-how-to-set-up-server-and-client

https://www.tecmint.com/how-to-setup-nfs-server-in-linux/

https://linuxize.com/post/how-to-mount-an-nfs-share-in-linux/
