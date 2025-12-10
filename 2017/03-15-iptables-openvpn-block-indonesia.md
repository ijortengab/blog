# Block akses ke VPN Server dari negara Indonesia menggunakan IPTables


## Studi Kasus

Kita punya usaha VPN Server, dengan target market kita adalah WNI yang sedang berada di luar Indonesia.

Sebagaimana promosi pada umumnya, kita bisa memberikan free trial selama 7 hari bagi calon pelanggan kita.

Bagaimanakah caranya menghindari *abuse* (penyalahgunaan) promo free trial oleh pelanggan yang ternyata tidak berada di luar Indonesia?

## Solusi

Gunakan IPTables kemudian block akses ke port VPN dari negara Indonesia.

## Gerak Cepat

Website rujukan untuk IP berdasarkan negara adalah:

http://www.ipdeny.com/ipblocks/data/countries/

Untuk negara Indonesia, maka rujukan berada pada file `id.zone`.

Login sebagai root
```
sudo su
```

Buat direktori untuk penampungan file hasil download-an IP Indonesia.
```
read -p "Nama Direktori: " -e -i '/root/iptables' DIR && [ ! -d $DIR ] && mkdir -p $DIR && cd $DIR
```

Download list IP Indonesia. Set [http proxy][1] jika diperlukan.
```
wget http://www.ipdeny.com/ipblocks/data/countries/id.zone
```

[1]: /blog/2017/01/25/set-http-proxy-pada-linux/

Kita akan buat new Chain, sebelumnya kita flush dan delete Chain yang pernah exists.
```
iptables -D INPUT -j countrydrop
iptables -F countrydrop
iptables -X countrydrop
```

Create new Chain.
```
iptables -N countrydrop
```

Create rules iptables secara looping. Sebaiknya gunakan [screen][2] karena proses agak lama.
```
read -p "Protocol VPN Server (udp/tcp): " -e -i 'udp' PROTO && read -p "Port VPN Server: " -e -i '1194' PORT && BADIPS=$(egrep -v "^#|^$" './id.zone') && for ipblock in $BADIPS; do echo iptables -A countrydrop -p $PROTO -s $ipblock --dport $PORT -j DROP && iptables -A countrydrop -p $PROTO -s $ipblock --dport $PORT -j DROP; done
```

[2]: /blog/2017/01/24/screen-solusi-remote-connection/

Drop koneksi masuk berdasarkan chain yang baru dibuat.
```
iptables -I INPUT -j countrydrop
```

Untuk cek hasil, gunakan text editor `vi` karena list yang terlalu panjang.
```
iptables -S countrydrop > /tmp/countrydrop && vi /tmp/countrydrop
```

Untuk membatalkan sementara:
```
iptables -D INPUT -j countrydrop
```

Untuk mengaktifkan kembali:
```
iptables -I INPUT -j countrydrop
```

Untuk membatalkan permanent:
```
iptables -D INPUT -j countrydrop
# Flush
iptables -F countrydrop
# Delete
iptables -X countrydrop
```

## CronJob

List IP berdasarkan negara perlu diupdate secara berkala, oleh karena itu kita gunakan Cron Job weekly, dengan script dibawah ini.

```
#!/bin/bash
DIR="/root/iptables"
CHAIN="countrydrop"
VPNPROTO="udp"
VPNPORT=1194
URL="http://www.ipdeny.com/ipblocks/data/countries/id.zone"

[ ! -d $DIR ] && mkdir -p $DIR
FILE=$DIR/id.zone
wget -O $FILE $URL

iptables -D INPUT -j $CHAIN 2> /dev/null
iptables -F $CHAIN 2> /dev/null
iptables -X $CHAIN 2> /dev/null

iptables -N $CHAIN

BADIPS=$(egrep -v "^#|^$" $FILE)
for ipblock in $BADIPS
do
    iptables -A $CHAIN -p $VPNPROTO -s $ipblock --dport $VPNPORT -j DROP
done

iptables -I INPUT -j $CHAIN
```

## Reference

https://www.cyberciti.biz/faq/block-entier-country-using-iptables/

https://www.cyberciti.biz/faq/linux-unix-bash-for-loop-one-line-command/

http://ipset.netfilter.org/iptables.man.html

http://ipset.netfilter.org/iptables-extensions.man.html
