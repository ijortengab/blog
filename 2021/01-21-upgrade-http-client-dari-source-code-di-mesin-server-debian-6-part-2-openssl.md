---
title: Upgrade HTTP Client dari Source Code di mesin server Debian 6 - Part 2 OpenSSL
tags:
  - debian6
---

## Aplikasi OpenSSL Sebelum Upgrade

Check lokasi dan versi.

```
which openssl
```

```
openssl version -a
```

Output:

```
root@debian6:~# which openssl
/usr/bin/openssl
```

```
root@debian6:~# openssl version -a
OpenSSL 0.9.8o 01 Jun 2010
built on: Sat Feb 20 12:12:19 UTC 2016
platform: debian-amd64
options:  bn(64,64) md2(int) rc4(ptr,char) des(idx,cisc,16,int) blowfish(ptr2)
compiler: gcc -fPIC -DOPENSSL_PIC -DZLIB -DOPENSSL_THREADS -D_REENTRANT -DDSO_DLFCN -DHAVE_DLFCN_H -m64 -DL_ENDIAN -DTERMIO -O3 -Wa,--noexecstack -g -Wall -DMD32_REG_T=int -DOPENSSL_BN_ASM_MONT -DSHA1_ASM -DSHA256_ASM -DSHA512_ASM -DMD5_ASM -DAES_ASM
OPENSSLDIR: "/usr/lib/ssl"
```

OpenSSL direktori berada pada path `/usr/lib/ssl`.

Check library dependency dari binary `/usr/bin/openssl`.

```
readelf -d /usr/bin/openssl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/bin/openssl
```

Output:

```
root@debian6:~# readelf -d /usr/bin/openssl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libssl.so.0.9.8
libcrypto.so.0.9.8
libdl.so.2
libz.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/bin/openssl
        linux-vdso.so.1 =>  (0x00007fff12e89000)
        libssl.so.0.9.8 => /usr/lib/libssl.so.0.9.8 (0x00007fcba6ae6000)
        libcrypto.so.0.9.8 => /usr/lib/libcrypto.so.0.9.8 (0x00007fcba6744000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fcba6540000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fcba6329000)
        libc.so.6 => /lib/libc.so.6 (0x00007fcba5fbd000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fcba6d3e000)
```

Binary `/usr/bin/openssl` membutuhkan library `libssl.so.0.9.8` dan `libcrypto.so.0.9.8`.

Check path dari library `libssl.so.0.9.8`.

```
ls -lah /usr/lib/libssl.so*
```

Output:

```
root@debian6:~# ls -lah /usr/lib/libssl.so*
lrwxrwxrwx 1 root root   15 Nov 22 22:11 /usr/lib/libssl.so -> libssl.so.0.9.8
-rw-r--r-- 1 root root 353K Feb 20  2016 /usr/lib/libssl.so.0.9.8
```

Check path dari library `libcrypto.so.0.9.8`.

```
ls -lah /usr/lib/libcrypto.so*
```

Output:

```
root@debian6:~# ls -lah /usr/lib/libcrypto.so*
lrwxrwxrwx 1 root root   18 Nov 22 22:11 /usr/lib/libcrypto.so -> libcrypto.so.0.9.8
-rw-r--r-- 1 root root 1.7M Feb 20  2016 /usr/lib/libcrypto.so.0.9.8
```

Check library dependency dari `libssl.so.0.9.8`.

```
readelf -d /usr/lib/libssl.so.0.9.8 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/lib/libssl.so.0.9.8
```

Output:

```
root@debian6:~# readelf -d /usr/lib/libssl.so.0.9.8 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libcrypto.so.0.9.8
libdl.so.2
libz.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/lib/libssl.so.0.9.8
        linux-vdso.so.1 =>  (0x00007ffeca36b000)
        libcrypto.so.0.9.8 => /usr/lib/libcrypto.so.0.9.8 (0x00007fab41923000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fab4171f000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fab41508000)
        libc.so.6 => /lib/libc.so.6 (0x00007fab4119c000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fab41f1d000)
```

Check library dependency dari `libcrypto.so.0.9.8`.

```
readelf -d /usr/lib/libcrypto.so.0.9.8 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/lib/libcrypto.so.0.9.8
```

Output:

```
root@debian6:~# readelf -d /usr/lib/libcrypto.so.0.9.8 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libdl.so.2
libz.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/lib/libcrypto.so.0.9.8
        linux-vdso.so.1 =>  (0x00007fff363a0000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fd807d91000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fd807b7a000)
        libc.so.6 => /lib/libc.so.6 (0x00007fd80780e000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fd808337000)
```

## Upgrade OpenSSL

Download source `openssl`.

```
mkdir -p /usr/src/openssl
cd /usr/src/openssl
wget http://www.openssl.org/source/openssl-1.1.1h.tar.gz
tar xvfz openssl-1.1.1h.tar.gz
cd openssl-1.1.1h
```

Baca panduan configure.

```
cd /usr/src/openssl/openssl-1.1.1h
vi INSTALL
```

Berdasarkan informasi pada file `INSTALL`, berikut ini informasi path default:

```
--prefix=/usr/local --openssldir=/usr/local/ssl
```

Configure.

```
cd /usr/src/openssl/openssl-1.1.1h
./config
```

Output:

```
root@debian6:/usr/src/openssl/openssl-1.1.1h# ./config
Operating system: x86_64-whatever-linux2
Configuring OpenSSL version 1.1.1h (0x1010108fL) for linux-x86_64
Using os-specific seed configuration
Creating configdata.pm
Creating Makefile

**********************************************************************
***                                                                ***
***   OpenSSL has been successfully configured                     ***
***                                                                ***
***   If you encounter a problem while building, please open an    ***
***   issue on GitHub <https://github.com/openssl/openssl/issues>  ***
***   and include the output from the following command:           ***
***                                                                ***
***       perl configdata.pm --dump                                ***
***                                                                ***
***   (If you are new to OpenSSL, you might want to consult the    ***
***   'Troubleshooting' section in the INSTALL file first)         ***
***                                                                ***
**********************************************************************
```

Compile dan Install.

```
make
make install
```

Sebagian Output:

```
*** Installing runtime libraries
install libcrypto.so.1.1 -> /usr/local/lib/libcrypto.so.1.1
install libssl.so.1.1 -> /usr/local/lib/libssl.so.1.1
*** Installing development files
created directory `/usr/local/include/openssl'
---
install libcrypto.a -> /usr/local/lib/libcrypto.a
install libssl.a -> /usr/local/lib/libssl.a
link /usr/local/lib/libcrypto.so -> /usr/local/lib/libcrypto.so.1.1
link /usr/local/lib/libssl.so -> /usr/local/lib/libssl.so.1.1
install libcrypto.pc -> /usr/local/lib/pkgconfig/libcrypto.pc
install libssl.pc -> /usr/local/lib/pkgconfig/libssl.pc
install openssl.pc -> /usr/local/lib/pkgconfig/openssl.pc
---
created directory `/usr/local/lib/engines-1.1'
---
*** Installing runtime programs
install apps/openssl -> /usr/local/bin/openssl
install ./tools/c_rehash -> /usr/local/bin/c_rehash
created directory `/usr/local/ssl'
created directory `/usr/local/ssl/certs'
created directory `/usr/local/ssl/private'
created directory `/usr/local/ssl/misc'
install ./apps/CA.pl -> /usr/local/ssl/misc/CA.pl
install ./apps/tsget.pl -> /usr/local/ssl/misc/tsget.pl
```

Pastikan aplikasi merupakan versi terbaru atau buka ulang terminal.

```
which openssl
```

```
openssl version -a
```

Output:

```
root@debian6:~# which openssl
/usr/local/bin/openssl
```

```
root@debian6:~# openssl version -a
OpenSSL 1.1.1h  22 Sep 2020
built on: Fri Nov 27 11:23:25 2020 UTC
platform: linux-x86_64
options:  bn(64,64) rc4(16x,int) des(int) idea(int) blowfish(ptr)
compiler: gcc -fPIC -pthread -m64 -Wa,--noexecstack -Wall -O3 -DOPENSSL_USE_NODELETE -DL_ENDIAN -DOPENSSL_PIC -DOPENSSL_CPUID_OBJ -DOPENSSL_IA32_SSE2 -DOPENSSL_BN_ASM_MONT -DOPENSSL_BN_ASM_MONT5 -DOPENSSL_BN_ASM_GF2m -DSHA1_ASM -DSHA256_ASM -DSHA512_ASM -DKECCAK1600_ASM -DRC4_ASM -DMD5_ASM -DAESNI_ASM -DVPAES_ASM -DGHASH_ASM -DECP_NISTZ256_ASM -DX25519_ASM -DPOLY1305_ASM -DZLIB -DNDEBUG
OPENSSLDIR: "/usr/local/ssl"
ENGINESDIR: "/usr/local/lib/engines-1.1"
Seeding source: os-specific
```

## Aplikasi OpenSSL Sesudah Upgrade

OpenSSL direktori sebelumnya berada pada path `/usr/lib/ssl`. OpenSSL direktori versi terbaru berada pada path `/usr/local/ssl`.

Check library dependency dari binary `/usr/local/bin/openssl`.

```
readelf -d /usr/local/bin/openssl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/local/bin/openssl
```

Output:

```
root@debian6:~# readelf -d /usr/local/bin/openssl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libssl.so.1.1
libcrypto.so.1.1
libz.so.1
libdl.so.2
libpthread.so.0
libc.so.6
```

```
root@debian6:~# ldd /usr/local/bin/openssl
        linux-vdso.so.1 =>  (0x00007ffc77751000)
        libssl.so.1.1 => /usr/local/lib/libssl.so.1.1 (0x00007f445a6a0000)
        libcrypto.so.1.1 => /usr/local/lib/libcrypto.so.1.1 (0x00007f445a1d7000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f4459fc0000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007f4459dbc000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007f4459ba0000)
        libc.so.6 => /lib/libc.so.6 (0x00007f4459834000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f445a930000)
```

Binary `/usr/local/bin/openssl` membutuhkan library `libssl.so.1.1` dan `libcrypto.so.1.1`.

Check path dari library `libssl.so.1.1`.

```
ls -lah /usr/local/lib/libssl.so*
```

Output:

```
root@debian6:~# ls -lah /usr/local/lib/libssl.so*
lrwxrwxrwx 1 root staff   13 Nov 27 18:25 /usr/local/lib/libssl.so -> libssl.so.1.1
-rwxr-xr-x 1 root staff 664K Nov 27 18:25 /usr/local/lib/libssl.so.1.1
```

Check path dari library `libcrypto.so.1.1`.

```
ls -lah /usr/local/lib/libcrypto.so*
```

Output:

```
root@debian6:~# ls -lah /usr/local/lib/libcrypto.so*
lrwxrwxrwx 1 root staff   16 Nov 27 18:25 /usr/local/lib/libcrypto.so -> libcrypto.so.1.1
-rwxr-xr-x 1 root staff 3.2M Nov 27 18:25 /usr/local/lib/libcrypto.so.1.1
```

Check library dependency dari `libssl.so.1.1`.

```
readelf -d /usr/local/lib/libssl.so.1.1 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/local/lib/libssl.so.1.1
```

Output:

```
root@debian6:~# readelf -d /usr/local/lib/libssl.so.1.1 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libcrypto.so.1.1
libz.so.1
libdl.so.2
libpthread.so.0
libc.so.6
```

```
root@debian6:~# ldd /usr/local/lib/libssl.so.1.1
        linux-vdso.so.1 =>  (0x00007ffe587d4000)
        libcrypto.so.1.1 => /usr/local/lib/libcrypto.so.1.1 (0x00007fb0fd44d000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fb0fd236000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fb0fd032000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007fb0fce16000)
        libc.so.6 => /lib/libc.so.6 (0x00007fb0fcaaa000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fb0fdba6000)
```

Check library dependency dari `libcrypto.so.1.1`.

```
readelf -d /usr/local/lib/libcrypto.so.1.1 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/local/lib/libcrypto.so.1.1
```

Output:

```
root@debian6:~# readelf -d /usr/local/lib/libcrypto.so.1.1 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libz.so.1
libdl.so.2
libpthread.so.0
libc.so.6
```

```
root@debian6:~# ldd /usr/local/lib/libcrypto.so.1.1
        linux-vdso.so.1 =>  (0x00007ffc94dc6000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f2487974000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007f2487770000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007f2487554000)
        libc.so.6 => /lib/libc.so.6 (0x00007f24871e8000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f2488054000)
```

## Kesimpulan

Aplikasi `openssl` berhasil di-upgrade dari versi `0.9.8` ke versi `1.1.1h`.

## Referensi:

https://wiki.openssl.org/index.php/TLS1.3

https://www.howtoforge.com/tutorial/how-to-install-openssl-from-source-on-linux/

https://stackoverflow.com/questions/42828083/error-while-loading-shared-libraries-usr-local-lib64-libssl-so-1-1/47805278#47805278

https://www.howtoforge.com/tutorial/how-to-install-openssl-from-source-on-linux/

