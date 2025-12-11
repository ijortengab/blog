---
tags:
  - nginx
---

# Upgrade nginx di mesin Debian 9 Stretch

## Pendahuluan

Mesin server kita menggunakan Debian versi 9.

```
root@deb9:~# cat /etc/debian_version
9.7
```

Versi nginx default adalah versi `1.10`.

```
root@deb9:~# nginx -v
nginx version: nginx/1.10.3
```

Pada saat tulisan ini dibuat, nginx terbaru adalah versi `1.21.4`.

Untuk mesin Debian 9, nginx binary terbaru yang tersedia adalah versi `1.18.0`.

https://debian.pkgs.org/9/nginx-amd64/nginx_1.18.0-1~stretch_amd64.deb.html

## Pertanyaan

Bagaimanakah mengupgrade nginx versi terbaru?

## Gerak Cepat

Tambahkan repository:

```
cat <<EOF >> /etc/apt/sources.list.d/nginx.list
deb http://nginx.org/packages/debian/ stretch nginx
deb-src http://nginx.org/packages/debian/ stretch nginx
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
root@deb9:~# apt list --upgradable 2>/dev/null | grep nginx
nginx/stable 1.18.0-2~stretch all [upgradable from: 1.10.3-1+deb9u7]
```

Memulai upgrade khusus nginx.

```
apt upgrade nginx
```

Output:

```
root@deb9:~# apt upgrade nginx
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
 nginx : Conflicts: nginx-common but 1.10.3-1+deb9u7 is to be installed
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
root@deb9:~# apt remove --purge nginx-common
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following packages will be REMOVED:
  libnginx-mod-http-auth-pam* libnginx-mod-http-dav-ext* libnginx-mod-http-echo*
  libnginx-mod-http-geoip* libnginx-mod-http-image-filter* libnginx-mod-http-subs-filter*
  libnginx-mod-http-upstream-fair* libnginx-mod-http-xslt-filter* libnginx-mod-mail*
  libnginx-mod-stream* nginx* nginx-common* nginx-full*
0 upgraded, 0 newly installed, 13 to remove and 155 not upgraded.
After this operation, 2883 kB disk space will be freed.
Do you want to continue? [Y/n] y
(Reading database ... 30040 files and directories currently installed.)
Removing nginx (1.10.3-1+deb9u7) ...
Removing nginx-full (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-auth-pam (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-dav-ext (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-echo (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-geoip (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-image-filter (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-subs-filter (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-upstream-fair (1.10.3-1+deb9u7) ...
Removing libnginx-mod-http-xslt-filter (1.10.3-1+deb9u7) ...
Removing libnginx-mod-mail (1.10.3-1+deb9u7) ...
Removing libnginx-mod-stream (1.10.3-1+deb9u7) ...
Removing nginx-common (1.10.3-1+deb9u7) ...
Processing triggers for man-db (2.7.6.1-2) ...
(Reading database ... 29944 files and directories currently installed.)
Purging configuration files for libnginx-mod-stream (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-echo (1.10.3-1+deb9u7) ...
Purging configuration files for nginx-common (1.10.3-1+deb9u7) ...
dpkg: warning: while removing nginx-common, directory '/var/www/html' not empty so not removed
Purging configuration files for libnginx-mod-http-image-filter (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-subs-filter (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-auth-pam (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-dav-ext (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-mail (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-xslt-filter (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-upstream-fair (1.10.3-1+deb9u7) ...
Purging configuration files for libnginx-mod-http-geoip (1.10.3-1+deb9u7) ...
Processing triggers for systemd (232-25+deb9u13) ...
```

Install nginx terbaru.

```
apt install nginx
```

Output:

```
root@deb9:~# apt install nginx
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following NEW packages will be installed:
  nginx
0 upgraded, 1 newly installed, 0 to remove and 155 not upgraded.
Need to get 849 kB of archives.
After this operation, 3021 kB of additional disk space will be used.
Get:1 http://nginx.org/packages/debian stretch/nginx amd64 nginx amd64 1.18.0-2~stretch [849 kB]
Fetched 849 kB in 1s (648 kB/s)
Selecting previously unselected package nginx.
(Reading database ... 29918 files and directories currently installed.)
Preparing to unpack .../nginx_1.18.0-2~stretch_amd64.deb ...
----------------------------------------------------------------------

Thanks for using nginx!

Please find the official documentation for nginx here:
* http://nginx.org/en/docs/

Please subscribe to nginx-announce mailing list to get
the most important news about nginx:
* http://nginx.org/en/support.html

Commercial subscriptions for nginx are available on:
* http://nginx.com/products/

----------------------------------------------------------------------
Unpacking nginx (1.18.0-2~stretch) ...
Setting up nginx (1.18.0-2~stretch) ...
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service -> /lib/systemd/system/nginx.service.
Processing triggers for systemd (232-25+deb9u13) ...
Processing triggers for man-db (2.7.6.1-2) ...
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

Output:

```
root@deb9:~# systemctl enable nginx --now
Synchronizing state of nginx.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable nginx
```

Verifikasi:

```
root@deb9:~# systemctl status nginx
* nginx.service - nginx - high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2021-11-19 01:12:12 WIB; 11s ago
     Docs: http://nginx.org/en/docs/
  Process: 46442 ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf (code=exited, status=0/SUCCESS)
 Main PID: 46443 (nginx)
    Tasks: 2 (limit: 8601)
   CGroup: /system.slice/nginx.service
           |-46443 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
           `-46444 nginx: worker process

Nov 19 01:12:12 deb9 systemd[1]: nginx.service: Failed to reset devices.list: Operation not permitted
Nov 19 01:12:12 deb9 systemd[1]: nginx.service: Failed to set invocation ID on control group /system.s
Nov 19 01:12:12 deb9 systemd[1]: Starting nginx - high performance web server...
Nov 19 01:12:12 deb9 systemd[1]: Started nginx - high performance web server.
```

Verifikasi process dan port 80.

```
ps aux | grep nginx
netstat -tapn | grep 80
```

Output:

```
root@deb9:~# ps aux | grep nginx
root     46443  0.0  0.0  32664   832 ?        Ss   01:12   0:00 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
nginx    46444  0.0  0.1  33116  2484 ?        S    01:12   0:00 nginx: worker process
root     46457  0.0  0.0  11112   984 pts/3    S+   01:16   0:00 grep nginx
root@deb9:~# netstat -tapn | grep 80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      46443/nginx: master
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

## Finish

```
nginx -v
```

Output:

```
nginx version: nginx/1.18.0
```

## Reference

https://nginx.org/en/download.html

https://debian.pkgs.org/9/nginx-amd64/nginx_1.18.0-1~stretch_amd64.deb.html

https://joshtronic.com/2018/12/17/how-to-install-the-latest-nginx-on-debian-and-ubuntu/

https://www.linode.com/docs/guides/install-nginx-debian/
