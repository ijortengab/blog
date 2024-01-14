---
title: Let's Encrypt - Menghapus akun yang duplikat pada satu server
---

## Latar Belakang

Login sebagai root. Check Certbot version.

```
root@server:~# certbot --version
certbot 0.26.1
```

Kita tambah domain untuk di-https-kan menggunakan plugin nginx.

```sh
certbot --nginx -d ijortengab.id
```

Karena suatu hal, kita menjadi memiliki dua akun Lets Encrypt. Output yang muncul sebagai berikut:

```
root@server:~# certbot --nginx -d ijortengab.id
Please choose an account
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: server1.example.id@2018-03-01T06:47:26Z (ae01)
2: systemix@2018-05-21T06:50:46Z (d8c4)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
```

## Pertanyaan

Bagaimana menghapus salah-satu akun yang lama dan gunakan hanya akun lebih baru.

## Gerak Cepat

Buat file `/root/leaccounts` dengan content sebagai berikut:

```sh
#!/usr/bin/env bash
for i in $(ls -d /etc/letsencrypt/accounts/*/);do
    accounttype=$(echo ${i%%/} | cut -d '/' -f5)
    echo "### Account Type: ${accounttype} ###"
    echo ""
    for x in $(ls -d /etc/letsencrypt/accounts/${accounttype}/directory/*/);do
        accountid=$(echo ${x%%/} | cut -d '/' -f7)
        echo "  Account ID: ${accountid}"
        certificates=$(grep -l "$accountid" /etc/letsencrypt/renewal/*.conf)
            for z in $certificates;do
                echo "    Domains associated to renewal conf file $(echo "$z" | cut -d '/' -f5)"
                certfile=$(grep 'cert =' ${z} | cut -d ' ' -f3)
                domains=$(openssl x509 -in ${certfile} -noout -text | grep 'DNS:' | sed 's/^[ \t]*//;s/[ \t]*$//' | sed 's/DNS://g')
                echo "    ${domains}"
                echo ""
            done
    done
    echo ""
done
```

Execute file tersebut.

```sh
sudo su
cd
. leaccounts
```

Contoh Output:

```
root@server:~# . leaccounts
### Account Type: acme-staging.api.letsencrypt.org ###

  Account ID: f3b4be65f8475259ffc9a721ba288a7b

### Account Type: acme-v01.api.letsencrypt.org ###

  Account ID: ae01a19101befcd66cb96d663fbd4988
    Domains associated to renewal conf file cp.example.id.conf
    cp.example.id

    Domains associated to renewal conf file db.example.id.conf
    db.example.id

  Account ID: d8c4324e4491fdab1b30ad813777d81c

    Domains associated to renewal conf file biography.id-0001.conf
    *.biography.id

    Domains associated to renewal conf file biography.id.conf
    biography.id

    Domains associated to renewal conf file example.id-0001.conf
    example.id

    Domains associated to renewal conf file systemix.id.conf
    systemix.id

    Domains associated to renewal conf file webmail.example.id.conf
    webmail.example.id


### Account Type: acme-v02.api.letsencrypt.org ###

  Account ID: ae01a19101befcd66cb96d663fbd4988
    Domains associated to renewal conf file cp.example.id.conf
    cp.example.id

    Domains associated to renewal conf file db.example.id.conf
    db.example.id

  Account ID: d8c4324e4491fdab1b30ad813777d81c

    Domains associated to renewal conf file biography.id-0001.conf
    *.biography.id

    Domains associated to renewal conf file biography.id.conf
    biography.id

    Domains associated to renewal conf file example.id-0001.conf
    example.id

    Domains associated to renewal conf file systemix.id.conf
    systemix.id

    Domains associated to renewal conf file webmail.example.id.conf
    webmail.example.id


root@server:~#
```

Hapus akun menggunakan id.

```sh
certbot unregister --account ae01a19101befcd66cb96d663fbd4988
```

Contoh Output:

```
root@server:~# certbot unregister --account ae01a19101befcd66cb96d663fbd4988
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Are you sure you would like to irrevocably deactivate your account?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(D)eactivate/(A)bort: d

IMPORTANT NOTES:
 - Account deactivated.
root@server:~#
```

## Reference

https://community.letsencrypt.org/t/delete-duplicate-account-on-server/76499/5
