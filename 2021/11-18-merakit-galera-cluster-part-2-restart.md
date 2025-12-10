# Merakit Galera Cluster Part 2 - Restart

---
tags:
  - galera-cluster
---

## Skenario

Ada kalanya kita perlu mematikan mesin di semua node atau terjadi kegagalan power (mati listrik).

Ketika mesin menyala kembali, maka service `mariadb` akan gagal autostart.

Verifikasi dengan command berikut pada semua node:

```
systemctl status mariadb
```

Seluruh node mengalami kegagalan startup service `mariadb`. Otomatis galeracluster juga tidak berjalan.

## Solusi

Kita asumsikan penyimpanan data mariadb berada pada direktori data default yakni:

```
/var/lib/mysql
```

Terdapat file `grastate.dat` pada direktori data di seluruh node.

Cek isi file pada masing-masing node dengan command:

```
cat /var/lib/mysql/grastate.dat
```

Output:

```
root@pcfafa:~# cat /var/lib/mysql/grastate.dat
# GALERA saved state
version: 2.1
uuid:    20ea3b8e-45e3-11ec-a24e-865c3ac57566
seqno:   -1
safe_to_bootstrap: 0
```

Output:

```
root@pchaha:~# cat /var/lib/mysql/grastate.dat
# GALERA saved state
version: 2.1
uuid:    20ea3b8e-45e3-11ec-a24e-865c3ac57566
seqno:   -1
safe_to_bootstrap: 1
```

Output:

```
root@pcyuyu:~# cat /var/lib/mysql/grastate.dat
# GALERA saved state
version: 2.1
uuid:    20ea3b8e-45e3-11ec-a24e-865c3ac57566
seqno:   -1
safe_to_bootstrap: 0
```

Output:

```
root@pcdede:~# cat /var/lib/mysql/grastate.dat
# GALERA saved state
version: 2.1
uuid:    20ea3b8e-45e3-11ec-a24e-865c3ac57566
seqno:   -1
safe_to_bootstrap: 0
```

Output:

```
root@pcroro:~# cat /var/lib/mysql/grastate.dat
# GALERA saved state
version: 2.1
uuid:    20ea3b8e-45e3-11ec-a24e-865c3ac57566
seqno:   -1
safe_to_bootstrap: 0
```

Dari seluruh output, hanya `pchaha` yang memiliki value `safe_to_bootstrap: 1`.

Artinya dari `pchaha` ini kita mulai menyalakan galera cluster dengan command:

```
galera_new_cluster
```

verifikasi dengan:

```
systemctl status mariadb
```

Output:

```
root@pchaha:~# systemctl status mariadb
● mariadb.service - MariaDB 10.3.31 database server
     Loaded: loaded (/lib/systemd/system/mariadb.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2021-11-18 13:27:52 UTC; 20s ago
       Docs: man:mysqld(8)
             https://mariadb.com/kb/en/library/systemd/
    Process: 1635 ExecStartPre=/usr/bin/install -m 755 -o mysql -g root -d /var/run/mysqld (code=exit>
    Process: 1637 ExecStartPre=/bin/sh -c systemctl unset-environment _WSREP_START_POSITION (code=exi>
    Process: 1647 ExecStartPre=/bin/sh -c [ ! -e /usr/bin/galera_recovery ] && VAR= ||   VAR=`cd /usr>
    Process: 1798 ExecStartPost=/bin/sh -c systemctl unset-environment _WSREP_START_POSITION (code=ex>
    Process: 1800 ExecStartPost=/etc/mysql/debian-start (code=exited, status=0/SUCCESS)
   Main PID: 1762 (mysqld)
```

Node lainnya cukup menyalakan dengan command:

```
systemctl start mysql
```

## Finish

Pastikan seluruh node sudah berjalan.

```
mysql -u root -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
```

Output:

```
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| wsrep_cluster_size | 5     |
+--------------------+-------+
```

## Reference

Google query: galera cluster all nodes down

https://mariadb.com/kb/en/galera-cluster-all-nodes-down-restart-query/

https://galeracluster.com/library/documentation/crash-recovery.html

https://galeracluster.com/library/training/tutorials/restarting-cluster.html
