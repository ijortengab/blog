# Virtual Machine - Merakit LAN dan SSH


## Pendahuluan

Setelah membuat tiga virtual machine (Guests) yakni: [Ubuntu 16.04][1],
[Debian 9.1][2], dan [Windows XP][3], sekarang saatnya membangun jaringan LAN
diantara Host dan Guests. Host menggunakan Operating System Windows 7.

![Screenshot.](/images/screenshot.1162.png)

Target yang ingin dicapai adalah:

1. LAN menggunakan jaringan private dengan IP Subnet `192.168.212.0/24`.
2. Bisa koneksi `ssh` antara Host dan Guests juga antara Guest dan Guest.
3. Guest harus bisa terkoneksi internet.

## IP Address

Untuk rencana subnetwork 192.168.212.0/24, maka ditentukan sebagai berikut:

| Type  | OS           | IP              | Last Octet |
|-------|--------------|-----------------|------------|
| Host  | Windows 7    | 192.168.212.1   | 1          |
| Guest | Ubuntu 16.04 | 192.168.212.101 | 101        |
| Guest | Debian 9.1   | 192.168.212.102 | 102        |
| Guest | Windows XP   | 192.168.212.103 | 103        |

## Host Configuration

**Network Configuration**

Pada Host, masuk ke `Control Panel >> Network Connection` atau melalui `Run`
dengan command `ncpa.cpl`.

![Screenshot.](/images/screenshot.1159.png)

Harusnya saat instalasi VirtualBox sudah terinstall Virtual LAN Card khusus
VirtualBox. Simpan nama aktual dari Virtual Lan Card tersebut. Pada kasus
komputer saya, namanya adalah `VirtualBox Host-Only Network`. Nama dapat
berbeda-beda karena mudah di-rename.

![Screenshot](/images/screenshot.1160.edited.png)

Jalankan Command Prompt sebagai Administrator.

![Screenshot.](/images/screenshot.1161.edited.png)

Ganti IP dengan command line sebagai berikut

```
netsh interface ipv4 set address name="VirtualBox Host-Only Network" static 192.168.212.1 255.255.255.0
```

Verifikasi dengan command:

```
netsh interface ipv4 show config
```

Output:

```
Configuration for interface "VirtualBox Host-Only Network"
    DHCP enabled:                         No
    IP Address:                           192.168.212.1
    Subnet Prefix:                        192.168.212.0/24 (mask 255.255.255.0)
    InterfaceMetric:                      10
    Statically Configured DNS Servers:    None
    Register with which suffix:           Primary only
    Statically Configured WINS Servers:   None
```

**SSH Configuration**

Memasang SSH server pada Host telah dibahas pada [tulisan sebelumnya][4].

## Guests Configuration

Matikan seluruh virtual machine. Tambahkan satu lagi kartu jaringan (interface)
sebagai berikut:

```
Attached To: Host-only Adapter
Name: VirtualBox Hos-Only Ethernet Adapter
```

![Screenshot.](/images/screenshot.1163.png)

Lakukan pada ketiga virtual machine.

Nantinya:

1. Interface 1 (pertama) dengan tipe NAT akan menjadi sumber internet.
2. Interface 2 (kedua) yang baru saja ditambahkan akan menjadi private LAN untuk
   saling terhubung dengan ssh.

Maka perlu setting `route` secara default mengarah ke NAT (interface 1) agar
bisa internet.

Setiap interface memiliki nilai metric serupa dengan nilai ranking. Nilai
ranking paling atas menjadi prioritas route default. Interface dengan metric
`10` akan menjadi route default jika interface lainnya memiliki nilai
metric `1000`.

Pada interface 2 akan diset `metric` dengan prioritas paling rendah, yakni
nilai metric `1000`.

## Ubuntu Configuration

Jalankan virtual machine Ubuntu. Login sebagai user reguler.

![Screenshot.](/images/screenshot.1189.png)

Beralih ke root dengan command `sudo su`, masukkan password yang sama dengan
user reguler tadi.

![Screenshot.](/images/screenshot.1190.png)

**Network Configuration**

Periksa kartu jaringan.

```
ifconfig -a
```

Output:

```
enp0s3    ...

enp0s8    ...

lo        ...
```

Terdapat dua kartu jaringan (interface) selain loopback, yakni:

1. Interface 1 dengan nama `enp0s3` (dengan IP DHCP dan NAT)
2. Interface 2 dengan nama `enp0s8` (yang baru ditambahkan)

Set IP pada interface 2.

```
vi /etc/network/interfaces
```

Edit sehingga menjadi:

```
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto enp0s3
iface enp0s3 inet dhcp

# The secondary network interface
auto enp0s8
iface enp0s8 inet static
  address 192.168.212.101
  netmask 255.255.255.0
  network 192.168.212.0
  broadcast 192.168.212.255
  gateway 192.168.212.1
  metric 1000
```

Restart network atau jika terjadi kendala, reboot machine.

```
/etc/init.d/networking restart
reboot
```

Verifikasi kembali.

```
ifconfig -a
```

Output:

```
enp0s3    ...

enp0s8    ...
          inet addr:192.168.212.101  Bcast:192.168.212.255  Mask:255.255.255.0
          ...

lo        ...
```

Verifikasi route. Default harusnya ke interface 1.

```
route
```

Output:

```
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         10.0.2.2        0.0.0.0         UG    0      0        0 enp0s3
default         192.168.212.1   0.0.0.0         UG    1000   0        0 enp0s8
10.0.2.0        *               255.255.255.0   U     0      0        0 enp0s3
192.168.212.0   *               255.255.255.0   U     0      0        0 enp0s8
```

Test internet dengan wget.

```
wget php.net
```

Sukses.

**SSH Configuration**

Perbarui repository Ubuntu 16.04 dari default ke repository Kambing Universitas
Indonesia kemudian install openssh.

```
mv /etc/apt/sources.list /etc/apt/sources.list~
wget -qO - ijortengab.id/log/ubuntu/16.04/v1/etc/apt/sources.list > /etc/apt/sources.list
apt-get update
apt-get install openssh-server
```

Test ssh melalui Host, dan hasilnya sukses.

![Screenshot.](/images/screenshot.1191.png)

## Debian Configuration

Jalankan virtual machine Debian 9.1. Login sebagai user reguler.

![Screenshot.](/images/screenshot.1192.png)

Beralih ke root dengan command `su`, masukkan password yang sama dengan user
reguler tadi.

![Screenshot.](/images/screenshot.1193.png)

**Network Configuration**

Periksa kartu jaringan.

Command `ifconfig` pada Debian berstatus deprecated, ganti dengan command `ip`.

```
ip a
```

Output:

```
1: lo: ...
    ...
2: enp0s3: ...
    ...
3: enp0s8: ...
    ...
```

Dari output, Terdapat dua kartu jaringan (interface) selain loopback, yakni:

1. Interface 1 dengan nama `enp0s3` (dengan IP DHCP dan NAT)
2. Interface 2 dengan nama `enp0s8` (yang baru ditambahkan)

Set IP pada interface 2.

```
vi /etc/network/interfaces
```

Edit sehingga menjadi:

```
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
allow-hotplug enp0s3
iface enp0s3 inet dhcp

# The secondary network interface
allow-hotplug enp0s8
iface enp0s8 inet static
  address 192.168.212.102
  netmask 255.255.255.0
  network 192.168.212.0
  broadcast 192.168.212.255
  gateway 192.168.212.1
  metric 1000
```

Restart network atau jika terjadi kendala, reboot machine.

```
/etc/init.d/networking restart
reboot
```

Verifikasi kembali.

```
ip a
```

Output:

```
1: lo: ...
    ...
2: enp0s3: ...
    ...
3: enp0s8: ...
    ...
    inet 192.168.212.102/24 brd 192.168.212.255 scope global enp0s8
    ...
```

Verifikasi route. Default harusnya ke interface 1.

```
ip r
```

Output:

```
default via 10.0.2.2 dev enp0s3
default via 192.168.212.1 dev enp0s8 metric 1000 onlink
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
192.168.212.0/24 dev enp0s8 proto kernel scope link src 192.168.212.102
```

Test internet dengan wget.

```
wget php.net
```

Sukses.

**SSH Configuration**

Perbarui repository Debian 9.1 dari default ke repository Kambing Universitas
Indonesia kemudian install openssh.

```
mv /etc/apt/sources.list /etc/apt/sources.list~
wget -qO - ijortengab.id/log/debian/9.1/v1/etc/apt/sources.list > /etc/apt/sources.list
apt-get update
apt-get install openssh-server
```

Test ssh melalui Host, dan hasilnya sukses.

![Screenshot.](/images/screenshot.1194.png)

## Windows XP Configuration

Jalankan virtual machine Windows XP.

**Network Configuration**

Masuk ke `Control Panel >> Network Connection` atau melalui Run dengan command
`ncpa.cpl`.

![Screenshot.](/images/screenshotxp.4.png)

Terdapat dua kartu jaringan (interface), yakni:

1. Interface 1 dengan nama `Local Area Connection` (dengan IP DHCP dan NAT)
2. Interface 2 dengan nama `Local Area Connection 2` (yang baru ditambahkan)

![Screenshot.](/images/screenshotxp.5.png)

Kita beri IP Static, Subnet Mask, Gateway, dan Metric pada interface 2.

```
netsh interface ip set address name="Local Area Connection 2" static 192.168.212.103 255.255.255.0 192.168.212.1 1000
```

Verifikasi kembali dengan command `route print`, dan hasilnya secara default,
koneksi ke internet mengarah pada interface 1 (NAT).

```
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0         10.0.2.2       10.0.2.15       10
          0.0.0.0          0.0.0.0    192.168.212.1  192.168.212.103      1000
```

Test koneksi internet dengan browser `Mozilla Firefox` atau `Google Chrome`.
Hasilnya sukses.

**SSH Configuration**

Instalasi OpenSSH Server for Windows XP telah dibahas pada 
[tulisan sebelumnya][5].

## Penutup

Kini belajar web server, mail server, dan pengembangan aplikasi yang membutuhkan
simulasi jaringan antar komputer kini lebih mudah dengan virtual machine yang
dirakit sehingga menjadi seperti jaringan LAN.

## Reference

[1]: /blog/2017/08-25-vm-install-ubuntu-server-16-04.md
[2]: /blog/2017/08-30-vm-install-debian-9-1.md
[3]: /blog/2017/09-11-vm-winxp.md
[4]: /blog/2017/01-28-windows-rasa-linux-cygwin-openssh-server.md
[5]: /blog/2017/09-12-openssh-server-winxp.md

https://www.howtogeek.com/103190/change-your-ip-address-from-the-command-prompt/

https://winscp.net/eng/docs/guide_windows_openssh_server

http://opensshwindows.sourceforge.net/
