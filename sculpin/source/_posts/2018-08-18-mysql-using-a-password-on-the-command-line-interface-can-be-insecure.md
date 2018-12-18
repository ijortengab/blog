---
title: MySQL - Using a password on the command line interface can be insecure.
---

## Latar Belakang

Saat mengeksekusi command sebagai berikut:

```
mysql -u $USER -p$PASSWORD -e 'command'
```

mulai muncul warning sebagai berikut:

> Using a password on the command line interface can be insecure.

Warning tersebut dikarenakan perintah mysql tersebut dapat terbaca oleh user lain menggunakan command ```ps```.

## Solusi

Gunakan command alternative sebagai berikut:

```
mysql --defaults-extra-file=<(printf "[client]\nuser = %s\npassword = %s" "${USER}" "${PASSWORD}") -e "command"
```

## Referensi
https://stackoverflow.com/questions/20751352/suppress-warning-messages-using-mysql-from-within-terminal-but-password-written#comment42372603_22933056
