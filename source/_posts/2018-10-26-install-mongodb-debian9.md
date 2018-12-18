---
title: Install Mongodb di Debian 9
---

## Gerak Cepat

Login sebagai root.

Install curl.

```
apt install curl
```

Tambahkan key mongodb.

```
curl https://www.mongodb.org/static/pgp/server-4.0.asc | sudo apt-key add -
```

Tambahkan repository pada source list.

```
echo 'deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main' > /etc/apt/sources.list.d/mongodb-org-4.0.list
```

Update.

```
apt update
```

Install Mongodb.

```
apt-get install mongodb-org
```

Enable Daemon.

```
systemctl enable mongod
```

Start Service.

```
systemctl start mongod
```

Verifikasi.

```
systemctl status mongod
```

Test.

```
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

Check port default Mongodb.

```
netstat -n --listen | grep 27017
```

## Sumber

https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-debian-9
