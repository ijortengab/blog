---
title: Belajar LVM (Logical Volume Manager)
---

## Contoh Kasus

Sebuah PC Jadul, merk Acer, akan kita jadikan mini server. PC sudah terinstall Ubuntu 20.04.

Tiga hard disk jadul identik merk WD 80GB hasil kanibal kita mount ke PC tersebut.

Kita akan menggunakan LVM untuk menggabungkan ketiga hard disk tersebut menjadi satu partisi.

![Screenshot.](image://ijortengab.id/2021/IMG-20210812-WA0021-crop.jpg)

## Cek Jeroan

Kondisi Processor.

```
cat /proc/cpuinfo
```

Output:

```
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 23
model name      : Intel(R) Core(TM)2 Duo CPU     E7400  @ 2.80GHz

processor       : 1
vendor_id       : GenuineIntel
cpu family      : 6
model           : 23
model name      : Intel(R) Core(TM)2 Duo CPU     E7400  @ 2.80GHz
```

Kondisi RAM.

```
cat /proc/meminfo
```

```
MemTotal:        5829532 kB
MemFree:          888092 kB
MemAvailable:    4791532 kB
```

Kondisi Hard Disk saat ini.

```
fdisk -l | sed -e '/Disk \/dev\/loop/,+5d'
```

**Hard Disk 1**

```
Disk /dev/sda: 74,54 GiB, 80026361856 bytes, 156301488 sectors
Disk model: WDC WD800JD-60LS
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x9c879c87
```

**Hard Disk 2**

```
Disk /dev/sdb: 74,55 GiB, 80032038912 bytes, 156312576 sectors
Disk model: WDC WD800JD-08MS
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x9048d5ec
```

**Hard Disk 3**

```
Disk /dev/sdc: 74,54 GiB, 80026361856 bytes, 156301488 sectors
Disk model: SAMSUNG HD082GJ
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x237860ed
```

**Hard Disk 4**

```
Disk /dev/sdd: 74,54 GiB, 80026361856 bytes, 156301488 sectors
Disk model: WDC WD800JD-60LS
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x9c879c87
```

Kondisi partisi.

```
lsblk | grep -v loop
```

Output:

```
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0  74,5G  0 disk
├─sda1   8:1    0  19,5G  0 part
├─sda2   8:2    0     1K  0 part
└─sda5   8:5    0    55G  0 part /mnt/3ED
sdb      8:16   0  74,5G  0 disk
├─sdb1   8:17   0  37,3G  0 part /mnt/C20
├─sdb2   8:18   0     1K  0 part
└─sdb5   8:21   0  37,3G  0 part /mnt/152
sdc      8:32   0  74,5G  0 disk
├─sdc1   8:33   0   512M  0 part /boot/efi
├─sdc2   8:34   0     1K  0 part
└─sdc5   8:37   0    74G  0 part /
sdd      8:48   0  74,5G  0 disk
├─sdd1   8:49   0  24,4G  0 part /mnt/74B
├─sdd2   8:50   0     1K  0 part
└─sdd5   8:53   0  50,1G  0 part /mnt/70A
```

## Clean Up

Hard disk nomor 3 (/dev/sdc) adalah tempat sistem operasi.

Hard disk tambahan yang akan kita gabung adalah:

  - Hard disk 1 (/dev/sda)
  - Hard disk 2 (/dev/sdb)
  - Hard disk 4 (/dev/sdd)

**Attention**

> Backup seluruh data pada hard disk sebelum melanjutkan.

Unmount seluruh partisi.

```
cd ~
umount /dev/sda5
umount /dev/sdb1
umount /dev/sdb5
umount /dev/sdd1
umount /dev/sdd5
```

Hapus signature file system.

```
wipefs -a /dev/sda
# wipefs -a /dev/sdb (skip for testing)
wipefs -a /dev/sdd
```

Hapus partisi dengan `fdisk`.

```
fdisk /dev/sda
fdisk /dev/sdb
fdisk /dev/sdd
```

Kondisi partisi terbaru:

```
lsblk | grep -v loop
```

Output:

```
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0  74,5G  0 disk
sdb      8:16   0  74,5G  0 disk
sdc      8:32   0  74,5G  0 disk
├─sdc1   8:33   0   512M  0 part /boot/efi
├─sdc2   8:34   0     1K  0 part
└─sdc5   8:37   0    74G  0 part /
sdd      8:48   0  74,5G  0 disk
```

## Physical Volume

Buat PV (Physical Volume).

```
pvcreate /dev/sda
pvcreate /dev/sdb
pvcreate /dev/sdd
```

Output:

```
root@pcacer:~# pvcreate /dev/sda
  Physical volume "/dev/sda" successfully created.
```

```
root@pcacer:~# pvcreate /dev/sdb
WARNING: dos signature detected on /dev/sdb at offset 510. Wipe it? [y/n]: y
  Wiping dos signature on /dev/sdb.
  Physical volume "/dev/sdb" successfully created.
```

```
root@pcacer:~# pvcreate /dev/sdd
  Physical volume "/dev/sdd" successfully created.
```

**Verifikasi**

```
pvdisplay
```

Output:

```
  "/dev/sda" is a new physical volume of "74,53 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/sda
  VG Name
  PV Size               74,53 GiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               YzOhqD-nt8H-d77T-MhwE-034e-AKvx-qLEuzi

  "/dev/sdb" is a new physical volume of "<74,54 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/sdb
  VG Name
  PV Size               <74,54 GiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               2sP861-Y7QO-eeQw-eEtk-oo8H-sUo9-IsJg5K

  "/dev/sdd" is a new physical volume of "74,53 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/sdd
  VG Name
  PV Size               74,53 GiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               0Ym2oj-8c8y-XFlM-qfSl-SlXz-hbay-WMm4In
```

## Volume Group

Kita beri nama Volume Group yakni: `vg00`.

```
vgcreate vg00 /dev/sda /dev/sdb /dev/sdd
```

Output:

```
root@pcacer:/mnt# vgcreate vg00 /dev/sda /dev/sdb /dev/sdd
  Volume group "vg00" successfully created
```

Verifikasi:

```
vgdisplay
```

Output:

```
  --- Volume group ---
  VG Name               vg00
  System ID
  Format                lvm2
  Metadata Areas        3
  Metadata Sequence No  1
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                0
  Open LV               0
  Max PV                0
  Cur PV                3
  Act PV                3
  VG Size               <223,59 GiB
  PE Size               4,00 MiB
  Total PE              57238
  Alloc PE / Size       0 / 0
  Free  PE / Size       57238 / <223,59 GiB
  VG UUID               imB2Iv-ejIq-f1do-TNYg-8KjA-irqz-rMaCS8
```

## Logical Volume

Command:

```
lvcreate -n lvname -L size vgname
lvcreate -n lvname -l extent vgname
```

Seluruh area pada Volume Group kita gunakan.

```
lvcreate -n lv00 -l 100%FREE vg00
```

Output:

```
root@pcacer:/mnt# lvcreate -n lv00 -l 100%FREE vg00
  Logical volume "lv00" created.
```

Verifikasi:

```
  --- Logical volume ---
  LV Path                /dev/vg00/lv00
  LV Name                lv00
  VG Name                vg00
  LV UUID                SHhzL3-iLec-AzNE-JggT-nfzH-oA0Z-FJHvGb
  LV Write Access        read/write
  LV Creation host, time pcacer, 2021-08-13 18:03:57 +0700
  LV Status              available
  # open                 0
  LV Size                <223,59 GiB
  Current LE             57238
  Segments               3
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

## File System

Format logical volume menggunakan file system `ext4`.

```
mkfs.ext4 /dev/vg00/lv00
```

Output:

```
root@pcacer:/mnt# mkfs.ext4 /dev/vg00/lv00
mke2fs 1.45.5 (07-Jan-2020)
Creating filesystem with 58611712 4k blocks and 14655488 inodes
Filesystem UUID: 30bac502-1c94-4f73-a263-f053f0285a07
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000, 7962624, 11239424, 20480000, 23887872

Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done
```

Buat direktori mounting.

```
mkdir -p /mnt/lv00
```

Mounting ke `/mnt/lv00`.

```
mount /dev/vg00/lv00 /mnt/lv00
```

Verifikasi:

```
df -h
```

Output:

```
/dev/mapper/vg00-lv00  220G   61M  208G   1% /mnt/lv00
```

## Auto Mounting

Cek UUID.

```
blkid
```

Output:

```
/dev/mapper/vg00-lv00: UUID="30bac502-1c94-4f73-a263-f053f0285a07" TYPE="ext4"
```

Tambah baris berikut pada file `/etc/fstab`:

```
UUID=30bac502-1c94-4f73-a263-f053f0285a07 /mnt/lv00 ext4 defaults 0 0
```

## Finishing

Restart server.

```
init 6
```

Pastikan auto mount saat reboot. Cek `df` dan `du`.

```
df -h
```

Output:

```
/dev/mapper/vg00-lv00  220G   61M  208G   1% /mnt/lv00
```

List block terbaru.

```
lsblk
```

Output:

```
sda           8:0    0  74,5G  0 disk
└─vg00-lv00 253:0    0 223,6G  0 lvm  /mnt/lv00
sdb           8:16   0  74,5G  0 disk
└─vg00-lv00 253:0    0 223,6G  0 lvm  /mnt/lv00
sdc           8:32   0  74,5G  0 disk
├─sdc1        8:33   0   512M  0 part /boot/efi
├─sdc2        8:34   0     1K  0 part
└─sdc5        8:37   0    74G  0 part /
sdd           8:48   0  74,5G  0 disk
└─vg00-lv00 253:0    0 223,6G  0 lvm  /mnt/lv00
```

## Reference

Google query: linux combine storage

https://askubuntu.com/questions/1195388/how-to-remove-dev-loops

https://www.makeuseof.com/tag/combine-hard-drives-seamless-storage-container-lvm-linux/

https://computingforgeeks.com/how-to-set-up-lvm/

https://www.redhat.com/sysadmin/lvm-vs-partitioning

https://www.simplstor.com/index.php/support/support-faqs/118-lvm-dev-excluded-by-filter

https://wiki.ubuntu.com/Lvm

https://www.linuxquestions.org/questions/linux-hardware-18/lvcreate-with-max-size-available-749253/
