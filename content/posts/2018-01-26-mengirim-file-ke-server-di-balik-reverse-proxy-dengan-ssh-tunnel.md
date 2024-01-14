---
title: Mengirim file ke server di balik reverse proxy dengan SSH tunnel
---

## Pertanyaan

Server di balik reverse proxy biasanya merupakan virtual machine (VM).

Bagaimanakah mengirim file ke server yang berada di balik reverse proxy?

## Gerak Cepat

Buat tunnel secara background. Contoh: port local 12345.

```
ssh -fN -L 12345:192.168.50.100:22 ijortengab@reverseproxy.ijortengab.id
```

Setelah tunnel terbuat, maka kirim file menggunakan rsync atau scp. Gunakan port local pada command.

```
rsync -Pavz -e "ssh -p 12345" db.sql ijortengabvm@127.0.0.1:db.sql
```

```
scp -o 'Port=12345' db.sql ijortengabvm@127.0.0.1:db.sql
```

File `sql.db` telah tiba di server tujuan yang berada di balik reverse proxy.

## Reference

Google query: "rsync ssh tunnel"

<https://stackoverflow.com/questions/16654751/rsync-through-ssh-tunnel>

<https://linux.die.net/man/1/scp>
