---
title: Upgrade nginx di mesin Ubuntu 18.04
---

## Pendahuluan

Mesin server kita menggunakan Ubuntu versi 18.04

```
root@ubuntu1804:~# lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 18.04.6 LTS
Release:        18.04
Codename:       bionic
```

Versi nginx default adalah versi `1.14`.

```
root@ubuntu1804:~# apt list --installed 2>/dev/null | grep nginx
libnginx-mod-http-geoip/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 amd64 [installed,automatic]
libnginx-mod-http-image-filter/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 amd64 [installed,automatic]
libnginx-mod-http-xslt-filter/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 amd64 [installed,automatic]
libnginx-mod-mail/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 amd64 [installed,automatic]
libnginx-mod-stream/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 amd64 [installed,automatic]
nginx/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 all [installed,upgradable to: 1.20.2-1~bionic]
nginx-common/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 all [installed,automatic]
nginx-core/bionic-updates,bionic-security,now 1.14.0-0ubuntu1.9 amd64 [installed,automatic]
```

Pada saat tulisan ini dibuat, nginx terbaru adalah versi `1.21.6`.

Untuk mesin Ubuntu 18.04, nginx binary terbaru yang tersedia adalah versi `1.20.2`.

https://ubuntu.pkgs.org/18.04/nginx-amd64/nginx_1.20.2-1~bionic_amd64.deb.html

## Pertanyaan

Bagaimanakah mengupgrade nginx versi terbaru?

## Gerak Cepat

Tambahkan repository:

```
cat <<EOF >> /etc/apt/sources.list.d/nginx.list
deb http://nginx.org/packages/ubuntu/ bionic nginx
deb-src http://nginx.org/packages/ubuntu/ bionic nginx
EOF
```

Tambahkan GPG key:

```
curl -L https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
```

Update repository.

```
apt update
```

Preview Upgrade.

```
apt list --upgradable 2>/dev/null | grep nginx
```

Output:

```
root@ubuntu1804:~# apt list --upgradable 2>/dev/null | grep nginx
nginx/stable 1.20.2-1~bionic all [upgradable from: 1.14.0-0ubuntu1.9]
```

Memulai upgrade khusus nginx.

```
apt upgrade nginx
```

Output:

```
root@ubuntu1804:~# apt upgrade nginx
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
Some packages could not be installed. This may mean that you have
requested an impossible situation or if you are using the unstable
distribution that some required packages have not yet been created
or been moved out of Incoming.
The following information may help to resolve the situation:

The following packages have unmet dependencies:
 nginx : Conflicts: nginx-common but 1.14.0-0ubuntu1.9 is to be installed
         Conflicts: nginx-core but 1.14.0-0ubuntu1.9 is to be installed
E: Broken packages
```

Hasil: gagal.

## Backup, Remove, Reinstall

Backup configuration:

```
cp -rf /etc/nginx/ /etc/nginx.backup/
```

Remove nginx-common.

```
apt remove --purge nginx-common
```

Output:

```
root@ubuntu1804:~# apt remove --purge nginx-common
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following packages will be REMOVED:
  libnginx-mod-http-geoip* libnginx-mod-http-image-filter* libnginx-mod-http-xslt-filter*
  libnginx-mod-mail* libnginx-mod-stream* nginx* nginx-common* nginx-core*
0 upgraded, 0 newly installed, 8 to remove and 0 not upgraded.
After this operation, 2,120 kB disk space will be freed.
Do you want to continue? [Y/n] Y
(Reading database ... 195303 files and directories currently installed.)
Removing nginx (1.14.0-0ubuntu1.9) ...
Removing nginx-core (1.14.0-0ubuntu1.9) ...
Removing libnginx-mod-http-geoip (1.14.0-0ubuntu1.9) ...
Removing libnginx-mod-http-image-filter (1.14.0-0ubuntu1.9) ...
Removing libnginx-mod-http-xslt-filter (1.14.0-0ubuntu1.9) ...
Removing libnginx-mod-mail (1.14.0-0ubuntu1.9) ...
Removing libnginx-mod-stream (1.14.0-0ubuntu1.9) ...
Removing nginx-common (1.14.0-0ubuntu1.9) ...
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
(Reading database ... 195244 files and directories currently installed.)
Purging configuration files for libnginx-mod-stream (1.14.0-0ubuntu1.9) ...
Purging configuration files for nginx-common (1.14.0-0ubuntu1.9) ...
dpkg: warning: while removing nginx-common, directory '/var/www/html' not empty so not removed
Purging configuration files for libnginx-mod-http-image-filter (1.14.0-0ubuntu1.9) ...
Purging configuration files for libnginx-mod-mail (1.14.0-0ubuntu1.9) ...
Purging configuration files for libnginx-mod-http-xslt-filter (1.14.0-0ubuntu1.9) ...
Purging configuration files for libnginx-mod-http-geoip (1.14.0-0ubuntu1.9) ...
Processing triggers for ureadahead (0.100.0-21) ...
Processing triggers for systemd (237-3ubuntu10.53) ...
Processing triggers for ufw (0.36-0ubuntu0.18.04.2) ...
```

Install nginx terbaru.

```
apt install nginx
```

Output:

```
root@ubuntu1804:~# apt install nginx
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following NEW packages will be installed:
  nginx
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 877 kB of archives.
After this operation, 3,074 kB of additional disk space will be used.
Get:1 http://nginx.org/packages/ubuntu bionic/nginx amd64 nginx amd64 1.20.2-1~bionic [877 kB]
Fetched 877 kB in 3s (315 kB/s)
Selecting previously unselected package nginx.
(Reading database ... 195218 files and directories currently installed.)
Preparing to unpack .../nginx_1.20.2-1~bionic_amd64.deb ...
----------------------------------------------------------------------

Thanks for using nginx!

Please find the official documentation for nginx here:
* https://nginx.org/en/docs/

Please subscribe to nginx-announce mailing list to get
the most important news about nginx:
* https://nginx.org/en/support.html

Commercial subscriptions for nginx are available on:
* https://nginx.com/products/

----------------------------------------------------------------------
Unpacking nginx (1.20.2-1~bionic) ...
Setting up nginx (1.20.2-1~bionic) ...
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /lib/systemd/system/nginx.service.
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
Processing triggers for ureadahead (0.100.0-21) ...
Processing triggers for systemd (237-3ubuntu10.53) ...
```

Verifikasi process dan port 80.

```
ps aux | grep nginx
netstat -tapn | grep 80
```

Hasilnya process `nginx` dan listening port 80 tidak exists.

Enable dan start.

```
systemctl enable nginx --now
```

Verifikasi:

```
root@ubuntu1804:~# systemctl status nginx
● nginx.service - nginx - high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2022-03-09 12:37:28 UTC; 15s ago
     Docs: https://nginx.org/en/docs/
  Process: 6303 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited, status=0/SUCCESS)
 Main PID: 6314 (nginx)
    Tasks: 3 (limit: 2314)
   CGroup: /system.slice/nginx.service
           ├─6314 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
           ├─6317 nginx: worker process
           └─6318 nginx: worker process

Mar 09 12:37:28 ubuntu1804 systemd[1]: Starting nginx - high performance web server...
Mar 09 12:37:28 ubuntu1804 systemd[1]: nginx.service: Can't open PID file /var/run/nginx.pid (yet?) after
Mar 09 12:37:28 ubuntu1804 systemd[1]: Started nginx - high performance web server.
```

Verifikasi process dan port 80.

```
ps aux | grep nginx
netstat -tapn | grep 80
```

Output:

```
root@ubuntu1804:~# ps aux | grep nginx
root      6314  0.0  0.0  33388   892 ?        Ss   12:37   0:00 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
nginx     6317  0.0  0.2  38164  4364 ?        S    12:37   0:00 nginx: worker process
nginx     6318  0.0  0.1  38164  3580 ?        S    12:37   0:00 nginx: worker process
root@ubuntu1804:~# netstat -tapn | grep 80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      6314/nginx: master
```

Hasilnya process `nginx` dan listening port 80 exists.

Periksa configuration terbaru.

```
find /etc/nginx/
```

Backup configuration terbaru.

```
cp -rf /etc/nginx /etc/nginx.new.backup
```

Restore configuration lama.

```
mv /etc/nginx -t /tmp
mv /etc/nginx.backup /etc/nginx
```

Restart nginx.

```
systemctl restart nginx
```

Hasil: gagal.

## Trouble Shooting

Pada kasus server ini, perlu install tambahan module terkait:

```
apt install nginx-module-{geoip,image-filter,xslt}
```

Output:

```
root@ubuntu1804:/etc/nginx/modules-enabled# apt install nginx-module-{geoip,image-filter,xslt}
Reading package lists... Done
Building dependency tree
Building dependency tree
Reading state information... Done
The following NEW packages will be installed:
  nginx-module-geoip nginx-module-image-filter nginx-module-xslt
0 upgraded, 3 newly installed, 0 to remove and 0 not upgraded.
Need to get 40.2 kB of archives.
After this operation, 207.1 kB of additional disk space will be used.
Do you want to continue? [Y/n]
Get:1 http://nginx.org/packages/ubuntu bionic/nginx amd64 nginx-module-geoip amd64 1.20.2-1~bionic [11.6 kB]
Get:2 http://nginx.org/packages/ubuntu bionic/nginx amd64 nginx-module-image-filter amd64 1.20.2-1~bionic [15.5 kB]
Get:3 http://nginx.org/packages/ubuntu bionic/nginx amd64 nginx-module-xslt amd64 1.20.2-1~bionic [13.1 kB]
Fetched 40.2 kB in 1s (27.0 kB/s)
Selecting previously unselected package nginx-module-geoip.
(Reading database ... 195252 files and directories currently installed.)
Preparing to unpack .../nginx-module-geoip_1.20.2-1~bionic_amd64.deb ...
Unpacking nginx-module-geoip (1.20.2-1~bionic) ...
Selecting previously unselected package nginx-module-image-filter.
Preparing to unpack .../nginx-module-image-filter_1.20.2-1~bionic_amd64.deb ...
Unpacking nginx-module-image-filter (1.20.2-1~bionic) ...
Selecting previously unselected package nginx-module-xslt.
Preparing to unpack .../nginx-module-xslt_1.20.2-1~bionic_amd64.deb ...
Unpacking nginx-module-xslt (1.20.2-1~bionic) ...
Setting up nginx-module-geoip (1.20.2-1~bionic) ...
----------------------------------------------------------------------

The GeoIP dynamic modules for nginx have been installed.
To enable these modules, add the following to /etc/nginx/nginx.conf
and reload nginx:

    load_module modules/ngx_http_geoip_module.so;
    load_module modules/ngx_stream_geoip_module.so;

Please refer to the modules documentation for further details:
https://nginx.org/en/docs/http/ngx_http_geoip_module.html
https://nginx.org/en/docs/stream/ngx_stream_geoip_module.html

----------------------------------------------------------------------
Setting up nginx-module-image-filter (1.20.2-1~bionic) ...
----------------------------------------------------------------------

The image filter dynamic module for nginx has been installed.
To enable this module, add the following to /etc/nginx/nginx.conf
and reload nginx:

    load_module modules/ngx_http_image_filter_module.so;

Please refer to the module documentation for further details:
https://nginx.org/en/docs/http/ngx_http_image_filter_module.html

----------------------------------------------------------------------
Setting up nginx-module-xslt (1.20.2-1~bionic) ...
----------------------------------------------------------------------

The xslt dynamic module for nginx has been installed.
To enable this module, add the following to /etc/nginx/nginx.conf
and reload nginx:

    load_module modules/ngx_http_xslt_filter_module.so;

Please refer to the module documentation for further details:
https://nginx.org/en/docs/http/ngx_http_xslt_module.html
```

Hapus dan atau sesuaikan module yang tidak lagi exists pada directory `/etc/nginx/modules-enabled`.

```
root@ubuntu1804:/etc/nginx/modules-enabled# ls -la
total 16
drwxr-xr-x 2 root root 4096 Mar  9 12:35 .
drwxr-xr-x 8 root root 4096 Mar  9 12:35 ..
lrwxrwxrwx 1 root root   54 Mar  9 12:35 50-mod-http-geoip.conf -> /usr/share/nginx/modules-available/mod-http-geoip.conf
lrwxrwxrwx 1 root root   61 Mar  9 12:35 50-mod-http-image-filter.conf -> /usr/share/nginx/modules-available/mod-http-image-filter.conf
lrwxrwxrwx 1 root root   60 Mar  9 12:35 50-mod-http-xslt-filter.conf -> /usr/share/nginx/modules-available/mod-http-xslt-filter.conf
lrwxrwxrwx 1 root root   48 Mar  9 12:35 50-mod-mail.conf -> /usr/share/nginx/modules-available/mod-mail.conf
lrwxrwxrwx 1 root root   50 Mar  9 12:35 50-mod-stream.conf -> /usr/share/nginx/modules-available/mod-stream.conf
root@ubuntu1804:/etc/nginx/modules-enabled#
```

Re-Enable.

```
systemctl enable nginx --now
systemctl status nginx
```

Verifikasi:

```
root@ubuntu1804:/etc/nginx/modules-enabled# systemctl status nginx
● nginx.service - nginx - high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2022-03-09 13:56:25 UTC; 7s ago
     Docs: https://nginx.org/en/docs/
  Process: 6348 ExecStop=/bin/sh -c /bin/kill -s TERM $(/bin/cat /var/run/nginx.pid) (code=exited, status=0/SUCCESS)
  Process: 6992 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited, status=0/SUCCESS)
 Main PID: 7002 (nginx)
    Tasks: 3 (limit: 2314)
   CGroup: /system.slice/nginx.service
           ├─7002 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
           ├─7003 nginx: worker process
           └─7004 nginx: worker process

Mar 09 13:56:25 ubuntu1804 systemd[1]: Starting nginx - high performance web server...
Mar 09 13:56:25 ubuntu1804 systemd[1]: Started nginx - high performance web server.
```

## Finish

```
nginx -v
```

Output:

```
nginx version: nginx/1.20.2
```

## Reference

https://nginx.org/en/download.html

https://ubuntu.pkgs.org/18.04/nginx-amd64/nginx_1.20.2-1~bionic_amd64.deb.html

https://joshtronic.com/2018/12/17/how-to-install-the-latest-nginx-on-debian-and-ubuntu/
