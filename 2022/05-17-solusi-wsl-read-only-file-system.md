---
tags:
  - wsl2
---

# Solusi WSL Read-only file system

## Latar Belakang

Kita menjalankan WSL dan ternyata file system berjalan pada mode read only.

Contoh error:

```
ijortengab@pchome:~$ mkdir tmp
mkdir: cannot create directory ‘tmp’: Read-only file system
```

```
ijortengab@pchome:~$ touch abc
touch: cannot touch 'abc': Read-only file system
```

## Debug

Cek mounting.

```
ijortengab@pchome:~$ mount | grep ext4
/dev/sdb on / type ext4 (ro,relatime,discard,errors=remount-ro,data=ordered)
```

Cek disk.

```
ijortengab@pchome:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdb        251G  4.9G  234G   3% /
tmpfs           3.1G     0  3.1G   0% /mnt/wsl
```

Cek dmesg.

```
ijortengab@pchome:~$ sudo dmesg -w
```

Sebagian output:

```
[    1.363623] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready
[    1.783617] Adding 2097152k swap on /swap/file.  Priority:-2 extents:3 across:2113536k
[    2.493858] scsi 0:0:0:1: Direct-Access     Msft     Virtual Disk     1.0  PQ: 0 ANSI: 5
[    2.494675] sd 0:0:0:1: Attached scsi generic sg1 type 0
[    2.495785] sd 0:0:0:1: [sdb] 536870912 512-byte logical blocks: (275 GB/256 GiB)
[    2.495787] sd 0:0:0:1: [sdb] 4096-byte physical blocks
[    2.495921] sd 0:0:0:1: [sdb] Write Protect is off
[    2.495923] sd 0:0:0:1: [sdb] Mode Sense: 0f 00 00 00
[    2.496169] sd 0:0:0:1: [sdb] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
[    2.520036] sd 0:0:0:1: [sdb] Attached SCSI disk
[    2.633582] EXT4-fs (sdb): mounted filesystem with ordered data mode. Opts: discard,errors=remount-ro,data=ordered
[    2.890568] FS-Cache: Duplicate cookie detected
[    2.890572] FS-Cache: O-cookie c=000000008e4aff7d [p=00000000c70894ab fl=222 nc=0 na=1]
[    2.890573] FS-Cache: O-cookie d=0000000001fc883c n=00000000b0664b39
[    2.890574] FS-Cache: O-key=[10] '34323934393337353736'
[    2.890582] FS-Cache: N-cookie c=00000000e4ab5830 [p=00000000c70894ab fl=2 nc=0 na=1]
[    2.890583] FS-Cache: N-cookie d=0000000001fc883c n=00000000ac80c7cc
[    2.890584] FS-Cache: N-key=[10] '34323934393337353736'
[    6.050149] EXT4-fs error (device sdb): mb_free_blocks:1506: group 32, block 1068032:freeing already freed block (bit 19456); block bitmap corrupt.
[    6.077072] Aborting journal on device sdb-8.
[    6.099894] EXT4-fs (sdb): Remounting filesystem read-only
[    6.099903] EXT4-fs error (device sdb): ext4_mb_generate_buddy:802: group 32, block bitmap and bg descriptor inconsistent: 15814 vs 15815 free clusters
[    6.182343] init: (1) ERROR: ConfigInitializeCommon:803: rmdir(/crossdistroNaFpEn) failed
[    6.182346] 30
[    6.182588] init: (1) ERROR: ConfigUpdateInformation:2727: creat /etc/hostname failed: 30
[    6.182597] init: (1) ERROR: ConfigUpdateInformation:2761: creat /etc/hosts failed 30
[    6.283298] init: (1) ERROR: UtilMkdir:1260: mkdir(/mnt/b, 777) failed 30
[    6.288965] FS-Cache: Duplicate cookie detected
[    6.288969] FS-Cache: O-cookie c=000000007faf572d [p=00000000c70894ab fl=222 nc=0 na=1]
[    6.288970] FS-Cache: O-cookie d=0000000001fc883c n=00000000ee7cb120
[    6.288970] FS-Cache: O-key=[10] '34323934393337393136'
[    6.288976] FS-Cache: N-cookie c=0000000041241b50 [p=00000000c70894ab fl=2 nc=0 na=1]
[    6.288977] FS-Cache: N-cookie d=0000000001fc883c n=00000000740181c1
[    6.288977] FS-Cache: N-key=[10] '34323934393337393136'
[    6.345659] init: (1) ERROR: UpdateTimezone:108: unlink failed 30
[    6.345667] init: (1) ERROR: InitEntryUtilityVm:2434: UpdateTimezone failed
[   49.174147] hv_balloon: Max. dynamic memory size: 6508 MB
[   61.582507] WSL2: Performing memory compaction.
```

## Solusi

Karena disk berada pada file `/dev/sdb`, maka:

```
sudo e2fsck /dev/sdb -y
```

Output:

```
ijortengab@pchome:~$ sudo e2fsck /dev/sdb -y
[sudo] password for ijortengab:
e2fsck 1.45.5 (07-Jan-2020)
/dev/sdb: recovering journal
/dev/sdb contains a file system with errors, check forced.
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Unattached inode 362893
Connect to /lost+found? yes

Inode 362893 ref count is 2, should be 1.  Fix? yes

Pass 5: Checking group summary information
Block bitmap differences:  +(1064960--1064961) -(1065984--1065986) +(1066498--1066503) -(1067521--1067522) +(1068032--1068041) -(1068544--1068550)
Fix? yes

Free blocks count wrong for group #32 (16837, counted=16831).
Fix? yes

Free blocks count wrong (64532258, counted=64532252).
Fix? yes

Inode bitmap differences:  +362893
Fix? yes

Free inodes count wrong for group #21 (1, counted=0).
Fix? yes

/dev/sdb: ***** FILE SYSTEM WAS MODIFIED *****
/dev/sdb: ***** REBOOT SYSTEM *****
/dev/sdb: 362936/16777216 files (0.0% non-contiguous), 2576612/67108864 blocks
ijortengab@pchome:~$ sudo e2fsck /dev/sdb -p
/dev/sdb: clean, 362936/16777216 files, 2576612/67108864 blocks
ijortengab@pchome:~$
```

Restart dari Powershell atau Command Prompt:

```
wsl --shutdown
wsl
```

## Reference

https://github.com/microsoft/WSL/issues/6220

https://github.com/microsoft/WSL/issues/7433

