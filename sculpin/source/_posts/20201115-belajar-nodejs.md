---
title: Install NodeJS di mesin Ubuntu 20.04
---

## Sekilas tentang Node JS

Node.js adalah platform untuk menjalankan bahasa pemrograman Javascript di mesin server alih-alih di browser (mesin client).

Pengembang website yang pernah mengoprek Javascript di browser, umumnya mengenal keunggulan Javascript yakni event based process (onload, onclick, onmouseover) dan trigger callback dari event tersebut yang asynchronize.

Keunggulan tersebut yang dibawa ke mesin server, sehingga pemrograman bisa berjalan tanpa blocking proses dari program lain (asynchronize) seperti File Reading/Writing.

## Persiapan Environment

Kita akan menggunakan Node.js yang berjalan diatas Sistem Operasi Ubuntu 20.04.

Update sistem terlebih dahulu.

```sh
sudo apt update
sudo apt -y upgrade
```

## Node Version Manager

`nvm` adalah tools untuk memudahkan mengelola berbagai versi Node.js.

Install `nvm` versi `0.35.1` menggunakan bash script.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```

Install atau update `nvm` ke versi terbaru `0.37.0` saat tulisan ini dibuat.

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
```

Test.

```
nvm --version
```

Output:

```
$ nvm --version
0.37.0
```

## Install Node.js

Kita akan menginstall Node.js versi 10 menggunakan `nvm`.

```
nvm install 10
```

Output:

```
ijortengab@NetworkAdmin:~$ nvm install 10
Downloading and installing node v10.22.1...
Downloading https://nodejs.org/dist/v10.22.1/node-v10.22.1-linux-x64.tar.xz...
############################################################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v10.22.1 (npm v6.14.6)
Creating default alias: default -> 10 (-> v10.22.1)
```

Gunakan Node JS versi 10 sebagai default.

```
nvm use 10
node --version
```

Output:

```
ijortengab@NetworkAdmin:~$ nvm use 10
Now using node v10.22.1 (npm v6.14.6)
ijortengab@NetworkAdmin:~$ node --version
v10.22.1
```

## Reference

https://nodejs.org/en/

https://www.w3schools.com/nodejs/

https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/

https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/

https://heynode.com/tutorial/install-nodejs-locally-nvm

https://www.gatsbyjs.com/tutorial/part-zero/#install-nodejs-for-your-appropriate-operating-system

