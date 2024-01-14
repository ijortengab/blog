---
title: Upgrade HTTP Client dari Source Code di mesin server Debian 6 - Part 3 WGet
---

## Aplikasi WGet Sebelum Upgrade

Check lokasi dan versi.

```
which wget
```

```
wget --version
```

Output:

```
root@debian6:~# which wget
/usr/bin/wget
```

```
root@debian6:~# wget --version
GNU Wget 1.12 built on linux-gnu.

+digest +ipv6 +nls +ntlm +opie +md5/openssl +https -gnutls +openssl
-iri

Wgetrc:
    /etc/wgetrc (system)
Locale: /usr/share/locale
Compile: gcc -DHAVE_CONFIG_H -DSYSTEM_WGETRC="/etc/wgetrc"
    -DLOCALEDIR="/usr/share/locale" -I. -I../lib -g -O2
    -D_FILE_OFFSET_BITS=64 -O2 -g -Wall
Link: gcc -g -O2 -D_FILE_OFFSET_BITS=64 -O2 -g -Wall /usr/lib/libssl.so
    /usr/lib/libcrypto.so -ldl -lrt ftp-opie.o openssl.o http-ntlm.o
    gen-md5.o ../lib/libgnu.a

Copyright (C) 2009 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later
<http://www.gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Originally written by Hrvoje Niksic <hniksic@xemacs.org>.
Currently maintained by Micah Cowan <micah@cowan.name>.
Please send bug report
```

Check library dependency dari binary `/usr/bin/wget`.

```
readelf -d /usr/bin/wget | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/bin/wget
```

Output:

```
root@debian6:~# readelf -d /usr/bin/wget | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libssl.so.0.9.8
libcrypto.so.0.9.8
libdl.so.2
librt.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/bin/wget
        linux-vdso.so.1 =>  (0x00007fffd49fb000)
        libssl.so.0.9.8 => /usr/lib/libssl.so.0.9.8 (0x00007fd6f831f000)
        libcrypto.so.0.9.8 => /usr/lib/libcrypto.so.0.9.8 (0x00007fd6f7f7d000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fd6f7d79000)
        librt.so.1 => /lib/librt.so.1 (0x00007fd6f7b71000)
        libc.so.6 => /lib/libc.so.6 (0x00007fd6f7805000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fd6f75ee000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fd6f8577000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007fd6f73d2000)
```

WGet versi 1.12 masih menggunakan library OpenSSL versi 0.9.8 (`libssl.so.0.9.8`).

## Upgrade WGet

Download source `wget`.

```
mkdir -p /usr/src/wget
cd /usr/src/wget
wget http://ftp.gnu.org/gnu/wget/wget-latest.tar.gz
tar -xvf wget-latest.tar.gz
```

Versi terbaru yang didapat adalah versi `1.20.3`.

```
cd wget-1.20.3
```

Baca panduan configure.

```
cd /usr/src/wget/wget-1.20.3
./configure --help
```

Output:

```
root@debian6:/usr/src/wget/wget-1.20.3/$ ./configure --help
`configure' configures wget 1.20.3 to adapt to many kinds of systems.

Usage: ./configure [OPTION]... [VAR=VALUE]...

To assign environment variables (e.g., CC, CFLAGS...), specify them as
VAR=VALUE.  See below for descriptions of some of the useful variables.

Defaults for the options are specified in brackets.

Configuration:
  -h, --help              display this help and exit
      --help=short        display options specific to this package
      --help=recursive    display the short help of all the included packages
  -V, --version           display version information and exit
  -q, --quiet, --silent   do not print `checking ...' messages
      --cache-file=FILE   cache test results in FILE [disabled]
  -C, --config-cache      alias for `--cache-file=config.cache'
  -n, --no-create         do not create output files
      --srcdir=DIR        find the sources in DIR [configure dir or `..']

Installation directories:
  --prefix=PREFIX         install architecture-independent files in PREFIX
                          [/usr/local]
  --exec-prefix=EPREFIX   install architecture-dependent files in EPREFIX
                          [PREFIX]

By default, `make install' will install all the files in
`/usr/local/bin', `/usr/local/lib' etc.  You can specify
an installation prefix other than `/usr/local' using `--prefix',
for instance `--prefix=$HOME'.

For better control, use the options below.

Fine tuning of the installation directories:
  --bindir=DIR            user executables [EPREFIX/bin]
  --sbindir=DIR           system admin executables [EPREFIX/sbin]
  --libexecdir=DIR        program executables [EPREFIX/libexec]
  --sysconfdir=DIR        read-only single-machine data [PREFIX/etc]
  --sharedstatedir=DIR    modifiable architecture-independent data [PREFIX/com]
  --localstatedir=DIR     modifiable single-machine data [PREFIX/var]
  --libdir=DIR            object code libraries [EPREFIX/lib]
  --includedir=DIR        C header files [PREFIX/include]
  --oldincludedir=DIR     C header files for non-gcc [/usr/include]
  --datarootdir=DIR       read-only arch.-independent data root [PREFIX/share]
  --datadir=DIR           read-only architecture-independent data [DATAROOTDIR]
  --infodir=DIR           info documentation [DATAROOTDIR/info]
  --localedir=DIR         locale-dependent data [DATAROOTDIR/locale]
  --mandir=DIR            man documentation [DATAROOTDIR/man]
  --docdir=DIR            documentation root [DATAROOTDIR/doc/wget]
  --htmldir=DIR           html documentation [DOCDIR]
  --dvidir=DIR            dvi documentation [DOCDIR]
  --pdfdir=DIR            pdf documentation [DOCDIR]
  --psdir=DIR             ps documentation [DOCDIR]

Program names:
  --program-prefix=PREFIX            prepend PREFIX to installed program names
  --program-suffix=SUFFIX            append SUFFIX to installed program names
  --program-transform-name=PROGRAM   run sed PROGRAM on installed program names

System types:
  --build=BUILD     configure for building on BUILD [guessed]
  --host=HOST       cross-compile to build programs to run on HOST [BUILD]

Optional Features:
  --disable-option-checking  ignore unrecognized --enable/--with options
  --disable-FEATURE       do not include FEATURE (same as --enable-FEATURE=no)
  --enable-FEATURE[=ARG]  include FEATURE [ARG=yes]
  --enable-silent-rules   less verbose build output (undo: "make V=1")
  --disable-silent-rules  verbose build output (undo: "make V=0")
  --enable-fuzzing        Turn on fuzzing build (for developers)
  --enable-dependency-tracking
                          do not reject slow dependency extractors
  --disable-dependency-tracking
                          speeds up one-time build
  --disable-opie          disable support for opie or s/key FTP login
  --disable-digest        disable support for HTTP digest authorization
  --disable-ntlm          disable support for NTLM authorization
  --disable-debug         disable support for debugging output
  --enable-valgrind-tests enable using Valgrind for tests
  --enable-assert         enable assertions in code base
  --disable-largefile     omit support for large files
  --enable-threads={posix|solaris|pth|windows}
                          specify multithreading API
  --disable-threads       build without multithread safety
  --disable-nls           do not use Native Language Support
  --disable-rpath         do not hardcode runtime library paths
  --disable-ipv6          disable IPv6 support
  --disable-iri           disable IDN/IRIs support
  --disable-pcre2         Disable PCRE2 style regular expressions
  --disable-pcre          Disable PCRE style regular expressions
  --disable-xattr         disable support for POSIX Extended Attributes

Optional Packages:
  --with-PACKAGE[=ARG]    use PACKAGE [ARG=yes]
  --without-PACKAGE       do not use PACKAGE (same as --with-PACKAGE=no)
  --without-libpsl        disable support for libpsl cookie checking.
  --with-ssl={gnutls,openssl}
                          specify SSL backend. GNU TLS is the default.
  --without-zlib          disable zlib.
  --with-metalink         enable support for metalinks.
  --with-cares            enable support for C-Ares DNS lookup.
  --with-gnu-ld           assume the C compiler uses GNU ld [default=no]
  --with-libiconv-prefix[=DIR]  search for libiconv in DIR/include and DIR/lib
  --without-libiconv-prefix     don't search for libiconv in includedir and libdir
  --with-libintl-prefix[=DIR]  search for libintl in DIR/include and DIR/lib
  --without-libintl-prefix     don't search for libintl in includedir and libdir
  --with-linux-crypto     use Linux kernel cryptographic API (if available)
  --with-openssl          use libcrypto hash routines. Valid ARGs are: 'yes',
                          'no', 'auto' => use if available, 'optional' => use
                          if available and warn if not available; default is
                          'no'. Note also --with-linux-crypto, which will
                          enable use of kernel crypto routines, which have
                          precedence
  --with-included-libunistring  use the libunistring parts included here
  --with-libunistring-prefix[=DIR]  search for libunistring in DIR/include and DIR/lib
  --without-libunistring-prefix     don't search for libunistring in includedir and libdir
  --with-libpth-prefix[=DIR]  search for libpth in DIR/include and DIR/lib
  --without-libpth-prefix     don't search for libpth in includedir and libdir
  --without-included-regex
                          don't compile regex; this is the default on systems
                          with recent-enough versions of the GNU C Library
                          (use with caution on other systems).
  --with-libssl-prefix[=DIR]  search for libssl in DIR/include and DIR/lib
  --without-libssl-prefix     don't search for libssl in includedir and libdir
  --with-libgnutls-prefix[=DIR]  search for libgnutls in DIR/include and DIR/lib
  --without-libgnutls-prefix     don't search for libgnutls in includedir and libdir
  --with-libidn=DIR       Support IDN2008/IRIs (needs GNU libidn2 +
                          libunicode)
  --without-libuuid       Generate UUIDs for WARC files via libuuid
  --with-gpgme-prefix=PFX prefix where GPGME is installed (optional)

Some influential environment variables:
  CC          C compiler command
  CFLAGS      C compiler flags
  LDFLAGS     linker flags, e.g. -L<lib dir> if you have libraries in a
              nonstandard directory <lib dir>
  LIBS        libraries to pass to the linker, e.g. -l<library>
  CPPFLAGS    (Objective) C/C++ preprocessor flags, e.g. -I<include dir> if
              you have headers in a nonstandard directory <include dir>
  CPP         C preprocessor
  PYTHON      the Python interpreter
  PKG_CONFIG  path to pkg-config utility
  PKG_CONFIG_PATH
              directories to add to pkg-config's search path
  PKG_CONFIG_LIBDIR
              path overriding pkg-config's built-in search path
  LIBPSL_CFLAGS
              C compiler flags for LIBPSL, overriding pkg-config
  LIBPSL_LIBS linker flags for LIBPSL, overriding pkg-config
  ZLIB_CFLAGS C compiler flags for ZLIB, overriding pkg-config
  ZLIB_LIBS   linker flags for ZLIB, overriding pkg-config
  OPENSSL_CFLAGS
              C compiler flags for OPENSSL, overriding pkg-config
  OPENSSL_LIBS
              linker flags for OPENSSL, overriding pkg-config
  GNUTLS_CFLAGS
              C compiler flags for GNUTLS, overriding pkg-config
  GNUTLS_LIBS linker flags for GNUTLS, overriding pkg-config
  UUID_CFLAGS C compiler flags for UUID, overriding pkg-config
  UUID_LIBS   linker flags for UUID, overriding pkg-config
  PCRE2_CFLAGS
              C compiler flags for PCRE2, overriding pkg-config
  PCRE2_LIBS  linker flags for PCRE2, overriding pkg-config
  PCRE_CFLAGS C compiler flags for PCRE, overriding pkg-config
  PCRE_LIBS   linker flags for PCRE, overriding pkg-config
  CARES_CFLAGS
              C compiler flags for CARES, overriding pkg-config
  CARES_LIBS  linker flags for CARES, overriding pkg-config
  METALINK_CFLAGS
              C compiler flags for METALINK, overriding pkg-config
  METALINK_LIBS
              linker flags for METALINK, overriding pkg-config

Use these variables to override the choices made by `configure' or to help
it to find libraries and programs with nonstandard names/locations.

Report bugs to <bug-wget@gnu.org>.
```

Configure.

```
cd /usr/src/wget/wget-1.20.3/
./configure
```

Muncul error.

```
configure: error: Package requirements (gnutls) were not met:

No package 'gnutls' found
```

Check configure.

Error karena secara default pilihan SSL adalah GNU TLS yang ternyata tidak ada di mesin.

> wget needs to have some type of SSL support GNUTLS is most probably
> not available on your OS X system – if so use OpenSSL in the configure
> as an alternative use so re-run the configure with an SSL flag:

Sumber: https://coolestguidesontheplanet.com/install-and-configure-wget-macos/

Configure ulang dengan pilihan SSL dari OpenSSL dengan argument `--with-ssl=openssl`.

Karena sebelumnya kita sudah mengupgrade OpenSSL dan library OpenSSL versi terbaru (1.1) yang berada pada path `/usr/local/lib/libssl.so`, maka sesuai dengan panduan pada `./configure --help`:

>  --with-libssl-prefix[=DIR]  search for libssl in DIR/include and DIR/lib

kita tambahkan argument `--with-libssl-prefix=/usr/local`.

```
cd /usr/src/wget/wget-1.20.3/
./configure --with-ssl=openssl --with-libssl-prefix=/usr/local
```

Error tidak lagi muncul. Sebagian output:

```
configure: Summary of build options:

  Version:           1.20.3
  Host OS:           linux-gnu
  Install prefix:    /usr/local
  Compiler:          gcc -std=gnu99
  CFlags:                -DNDEBUG -g -O2
  LDFlags:
  Libs:              -lpcre   /usr/local/lib/libssl.so /usr/local/lib/libcrypto.so -Wl,-rpath -Wl,/usr/local/lib -ldl -lz
  SSL:               openssl
  Zlib:              yes
  PSL:               no
  PCRE:              yes, via libpcre
  Digest:            yes
  NTLM:              yes
  OPIE:              yes
  POSIX xattr:       yes
  Debugging:         yes
  Assertions:        no
  Valgrind:          Valgrind testing not enabled
  Metalink:          no
  Resolver:          libc, --bind-dns-address and --dns-servers not available
  GPGME:             no
  IRI:               no
  Fuzzing build:     no,
```

Compile dan Install.

```
make
make install
```

Pastikan aplikasi merupakan versi terbaru atau buka ulang terminal.

```
which wget
```

```
wget --version
```

Output:

```
root@debian6:~# which wget
/usr/local/bin/wget
```

```
root@debian6:~# wget --version
GNU Wget 1.20.3 built on linux-gnu.

-cares +digest -gpgme +https +ipv6 -iri +large-file -metalink +nls
+ntlm +opie -psl +ssl/openssl

Wgetrc:
    /usr/local/etc/wgetrc (system)
Locale:
    /usr/local/share/locale
Compile:
    gcc -std=gnu99 -DHAVE_CONFIG_H
    -DSYSTEM_WGETRC="/usr/local/etc/wgetrc"
    -DLOCALEDIR="/usr/local/share/locale" -I. -I../lib -I../lib
    -DHAVE_LIBSSL -DNDEBUG -g -O2
Link:
    gcc -std=gnu99 -DHAVE_LIBSSL -DNDEBUG -g -O2 -lpcre -lssl -lcrypto
    -lz ftp-opie.o openssl.o http-ntlm.o ../lib/libgnu.a -lrt

Copyright (C) 2015 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later
<http://www.gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Originally written by Hrvoje Niksic <hniksic@xemacs.org>.
Please send bug reports and questions to <bug-wget@gnu.org>.
```

## Aplikasi WGet Sesudah Upgrade

Check library dependency dari binary `/usr/local/bin/wget`.

```
readelf -d /usr/local/bin/wget | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/local/bin/wget
```

Output:

```
root@debian6:~# readelf -d /usr/local/bin/wget | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
librt.so.1
libpcre.so.3
libssl.so.1.1
libcrypto.so.1.1
libdl.so.2
libz.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/local/bin/wget
        linux-vdso.so.1 =>  (0x00007ffd10bbe000)
        librt.so.1 => /lib/librt.so.1 (0x00007f029e014000)
        libpcre.so.3 => /lib/libpcre.so.3 (0x00007f029dde4000)
        libssl.so.1.1 => /usr/local/lib/libssl.so.1.1 (0x00007f029db54000)
        libcrypto.so.1.1 => /usr/local/lib/libcrypto.so.1.1 (0x00007f029d68b000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007f029d487000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f029d270000)
        libc.so.6 => /lib/libc.so.6 (0x00007f029cf04000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007f029cce8000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f029e21c000)
```

WGet versi terbaru menggunakan library OpenSSL versi 1.1 (`libssl.so.1.1`).

Test koneksi ke Github.

```
wget --server-response --spider https://github.com/
```

Muncul error yang lain sebagai berikut:

Output:

```
root@debian6:~# wget --server-response --spider https://github.com/
Spider mode enabled. Check if remote file exists.
--2020-11-25 07:43:27--  https://github.com/
Resolving github.com... 192.30.255.113
Connecting to github.com|192.30.255.113|:443... connected.
ERROR: cannot verify github.com's certificate, issued by 'CN=DigiCert SHA2 High Assurance Server CA,OU=www.digicert.com,O=DigiCert Inc,C=US':
  Unable to locally verify the issuer's authority.
To connect to github.com insecurely, use `--no-check-certificate'.
```

Error bisa diselesaikan dengan dua alternative solusi.

 1. Menambahkan informasi file bundle certificates atau direktori certificates.
 2. Symbolic link direktori certificates OpenSSL

**Alternative 1**. Menambahkan informasi file bundle certificates atau direktori certificates.

> The answer turns out to depend on which SSL library wget is linked with.
> It might also depend on the version, but between wget 1.13 and 1.15 the
> behavior hasn't changed.
>
> If wget is linked with GnuTLS (e.g. Debian)
>
> Wget can read certificates from a file or from the files in a directory. To
> turn off all default trusted CAs (in /etc/ssl/certs), pass both
> `--ca-certificate` and `--ca-directory`.

Sumber: https://unix.stackexchange.com/a/200058

Cari tahu lokasi file `ca-certificates.crt`.

```
locate ca-certificates.crt
```

Output:

```
root@debian6:~# locate ca-certificates.crt
/etc/ssl/certs/ca-certificates.crt
```

Full path file `ca-certificates.crt` adalah `/etc/ssl/certs/ca-certificates.crt`. Jadikan sebagai value dari argument `--ca-certificate`.

Full path direktori certificates adalah `/etc/ssl/certs`. Jadikan sebagai value dari argument `--ca-directory`.

Test lagi koneksi ke Github.com.

```
wget --server-response --spider https://github.com/ --ca-certificate=/etc/ssl/certs/ca-certificates.crt 2>&1 | grep '  HTTP/'
```

```
wget --server-response --spider https://github.com/ --ca-directory=/etc/ssl/certs 2>&1 | grep '  HTTP/'
```

Output:

```
root@debian6:~# wget --server-response --spider https://github.com/ --ca-certificate=/etc/ssl/certs/ca-certificates.crt 2>&1 | grep '  HTTP/'
  HTTP/1.1 200 OK
```

```
root@debian6:~# wget --server-response --spider https://github.com/ --ca-directory=/etc/ssl/certs 2>&1 | grep '  HTTP/'
  HTTP/1.1 200 OK
```

Koneksi berhasil.

Argument `--ca-certificate` dan `--ca-directory` dapat diganti dengan menambahkan pada file `wgetrc` atau environment variable.

Cari tahu lokasi file `wgetrc` yang digunakan oleh `wget`.

```
wget --version | grep wgetrc
```

Output:

```
root@debian6:~# wget --version | grep wgetrc
    /usr/local/etc/wgetrc (system)
    -DSYSTEM_WGETRC="/usr/local/etc/wgetrc"
```

Lokasi file `wgetrc` yang digunakan oleh `wget` terbaru berada pada path `/usr/local/etc/wgetrc`.

Tambahkan informasi key `ca_certificate` dan atau `ca_directory` sebagai berikut:

```
echo >> /usr/local/etc/wgetrc
echo ca_certificate=/etc/ssl/certs/ca-certificates.crt >> /usr/local/etc/wgetrc
```

dan atau

```
echo >> /usr/local/etc/wgetrc
echo ca_directory=/etc/ssl/certs >> /usr/local/etc/wgetrc
```

Verifikasi.

```
grep -i ca_ /usr/local/etc/wgetrc
```

Output:

```
root@debian6:~# grep -i ca_ /usr/local/etc/wgetrc
ca_directory=/etc/ssl/certs
ca_certificate=/etc/ssl/certs/ca-certificates.crt
```

Sedangkan untuk memberi informasi pada environment, dengan meng-export variable pada terminal.

```
export SSL_CERT_DIR=/etc/ssl/certs
```

dan atau

```
export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
```

Agar variable tersebut selalu hadir setiap masuk terminal, tambahkan pada `~/.bashrc`.

```
echo >> ~/.bashrc
echo 'export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt' >> ~/.bashrc
```

dan atau

```
echo >> ~/.bashrc
echo 'export SSL_CERT_DIR=/etc/ssl/certs' >> ~/.bashrc
```

Selain `.bashrc`, variable tersebut juga dapat disetting pada `/etc/environment`.

```
echo >> /etc/environment
echo 'SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt' >> /etc/environment
```

dan atau

```
echo >> /etc/environment
echo 'SSL_CERT_DIR=/etc/ssl/certs' >> /etc/environment
```

**Alternative 2**. Symbolic link direktori certificates OpenSSL.

**Cara ini yang kita pilih.**

OpenSSL yang sudah diinstall versi terbaru memiliki direktori di `/usr/local/ssl`.

Wget menggunakan direktori certificate dari OpenSSL yakni `certs` didalam direktori OpenSSL `/usr/local/ssl`.

Direktori tersebut yang dijadikan link ke direktori cetificates default di `/etc/ssl/certs`.

```
rmdir /usr/local/ssl/certs
ln -s /etc/ssl/certs /usr/local/ssl/certs
```

## Kesimpulan

Aplikasi `wget` berhasil di-upgrade dari versi `1.12` ke versi `1.20.3`.

Koneksi **berhasil** ke website yang menggunakan TLS versi >= 1.2 seperti github.com dan packagist.com jika menggunakan `wget` terbaru.

## Referensi

https://serverfault.com/questions/896082/fixing-wget-certificates

https://superuser.com/questions/664169/what-is-the-difference-between-etc-environment-and-etc-profile

https://coolestguidesontheplanet.com/install-and-configure-wget-macos/

https://serverfault.com/questions/896082/fixing-wget-certificates/896088#896088

https://serverfault.com/questions/896082/fixing-wget-certificates

