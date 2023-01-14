---
title: Merakit Galera Cluster Part 1 - Setup
slug: /blog/2021/11/16/merakit-galera-cluster-part-1-setup/
date: 2021-11-16
---

## Pendahuluan

Galera Cluster adalah solusi database synchronous dengan berbagai komputer (multi master) sehingga menjamin ketersediaan data jika salah satu node mengalami kegagalan.

Kita memiliki lima buah PC, yang akan kita jadikan satu buah cluster database.

Kelima PC tersebut kita pasang `Ubuntu 20.04`.

Kelima PC tersebut kita beri nama (hostname) dan IP sebagai berikut:

 - pcfafa (192.168.212.3)
 - pchaha (192.168.212.4)
 - pcyuyu (192.168.212.5)
 - pcdede (192.168.212.6)
 - pcroro (192.168.212.7)

PC tersebut selanjutnya akan kita sebut sebagai `node`.

## Gerak Cepat

Install `mariadb` dan `rsync` pada seluruh node:

```
apt-get install mariadb-server mariadb-client rsync
```

Verifikasi:

```
mysql -V
```

Output:

```
mysql  Ver 15.1 Distrib 10.3.31-MariaDB, for debian-linux-gnu (x86_64) using readline 5.2
```

Matikan secara bersama-sama mariadb service karena autostart pasca instalasi.

```
systemctl stop mariadb
```

Pada semua node, kita buat file template config untuk galera.

```
mkdir -p /etc/mysql/conf.d
touch /etc/mysql/conf.d/galera.cnf
```

```
CONTENT=$(cat <<- 'EOF'
[mysqld]
binlog_format=ROW
default-storage-engine=innodb
innodb_autoinc_lock_mode=2
bind-address=0.0.0.0

# Galera Provider Configuration
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so

# Galera Cluster Configuration
wsrep_cluster_name="|wsrep_cluster_name|"
wsrep_cluster_address="gcomm://|wsrep_cluster_address|"

# Galera Synchronization Configuration
wsrep_sst_method=rsync

# Galera Node Configuration
wsrep_node_address="|wsrep_node_address|"
wsrep_node_name="|wsrep_node_name|"
EOF
)
echo "$CONTENT" > /etc/mysql/conf.d/galera.cnf
```

Pada semua node, kita edit placeholder pada template:

```
wsrep_cluster_name="dede_cluster"
wsrep_cluster_address="192.168.212.3,192.168.212.4,192.168.212.5,192.168.212.6,192.168.212.7"
sed -e "s/|wsrep_cluster_name|/$wsrep_cluster_name/" \
    -e "s/|wsrep_cluster_address|/$wsrep_cluster_address/" \
    -i /etc/mysql/conf.d/galera.cnf
```

Pada setiap node, edit placeholder sesuai dengan node name dan IP Address.

Misalnya pada `pcyuyu` kita gunakan command sebagai berikut (tanpa editing):

```
sed -e 's/|wsrep_node_address|/192.168.212.5/' \
    -e 's/|wsrep_node_name|/pcyuyu/' \
    /etc/mysql/conf.d/galera.cnf
```

Tapi untuk mempercepat, kita sepakati saja bahwa node name adalah hostname,
sehingga kita bisa menggunakan command berikut di semua node:

```
prefix=192.168.
cidr=26
ip4=$( ip -4 addr | grep inet | grep -oE "$prefix[0-9\.]+/$cidr" | sed "s,/$cidr,,")
name=$(hostname)
sed -e 's/|wsrep_node_address|/'"$ip4"'/' \
    -e 's/|wsrep_node_name|/'"$name"'/' \
    -i /etc/mysql/conf.d/galera.cnf
```

Verifikasi:

```
cat /etc/mysql/conf.d/galera.cnf
```

Pada salah satu node, aktifkan galera cluster dengan command:

```
galera_new_cluster
```

Verifikasi

```
mysql -u root -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
```

Output:

```
root@pcyuyu:~# mysql -u root -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| wsrep_cluster_size | 1     |
+--------------------+-------+
```

Untuk node lainnya, cukup nyalakan seperti biasa.

```
systemctl start mysql
```

Jika seluruh node aktif, maka value dari wsrep_cluster_size harusnya adalah 5.

```
root@pchaha:~# mysql -u root -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| wsrep_cluster_size | 5     |
+--------------------+-------+
```

## Testing

Gunakan fitur pane/sub tab pada [Windows Terminal](/blog/2021/03/08/berkenalan-dengan-windows-terminal/) untuk shell login ke 5 node sekaligus dalam satu layar/window.

Jalankan watch pada keempat node:

```
watch -n 2 'mysql -e "SHOW DATABASES;"'
```

Lalu salah satu node, kita buat satu buah database test.

```
mysql -e "CREATE DATABASE ijortengab;"
```

Dalam hitungan detik database sudah terbentuk pada keempat node lainnya.

Hapus database tadi:

```
mysql -e "DROP DATABASE ijortengab;"
```

## Reference

Google query: galera cluster tutorial

https://www.digitalocean.com/community/tutorials/how-to-configure-a-galera-cluster-with-mariadb-on-centos-7-servers

https://www.digitalocean.com/community/tutorials/how-to-configure-a-galera-cluster-with-mariadb-on-ubuntu-18-04-servers

https://galeracluster.com/library/documentation/