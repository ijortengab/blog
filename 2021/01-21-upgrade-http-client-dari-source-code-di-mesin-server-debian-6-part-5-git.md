---
tags:
  - debian6
---

# Upgrade HTTP Client dari Source Code di mesin server Debian 6 - Part 5 Git

Git membutuhkan akses `https` untuk melakukan cloning repository termasuk akses ke Github.com yang hanya mendukung protocol TLS versi >= 1.2.

## Aplikasi Git Sebelum Upgrade

Check lokasi dan versi.

```
which git
```

```
git --version
```

Output:

```
root@debian6:~# which git
/usr/bin/git
```

```
root@debian6:~# git --version
git version 1.7.2.5
```

Cek binary untuk eksekusi http di git.

```
echo "$(git --exec-path)"/git-http-push
```

Output:

```
root@debian6:~# echo "$(git --exec-path)"/git-http-push
/usr/lib/git-core/git-http-push
```

Check library dependency dari `/usr/lib/git-core/git-http-push`.

```
readelf -d /usr/lib/git-core/git-http-push | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/lib/git-core/git-http-push
```

Output:

```
root@debian6:~# readelf -d /usr/lib/git-core/git-http-push | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libz.so.1
libpthread.so.0
libcurl-gnutls.so.4
libexpat.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/lib/git-core/git-http-push
        linux-vdso.so.1 =>  (0x00007ffcebbd5000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fc2baff6000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007fc2badda000)
        libcurl-gnutls.so.4 => /usr/lib/libcurl-gnutls.so.4 (0x00007fc2bab85000)
        libexpat.so.1 => /usr/lib/libexpat.so.1 (0x00007fc2ba95d000)
        libc.so.6 => /lib/libc.so.6 (0x00007fc2ba5f1000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fc2bb20d000)
        libidn.so.11 => /usr/lib/libidn.so.11 (0x00007fc2ba3bf000)
        liblber-2.4.so.2 => /usr/lib/liblber-2.4.so.2 (0x00007fc2ba1b1000)
        libldap_r-2.4.so.2 => /usr/lib/libldap_r-2.4.so.2 (0x00007fc2b9f66000)
        librt.so.1 => /lib/librt.so.1 (0x00007fc2b9d5e000)
        libgssapi_krb5.so.2 => /usr/lib/libgssapi_krb5.so.2 (0x00007fc2b9b29000)
        libgnutls.so.26 => /usr/lib/libgnutls.so.26 (0x00007fc2b9886000)
        libgcrypt.so.11 => /usr/lib/libgcrypt.so.11 (0x00007fc2b960e000)
        libresolv.so.2 => /lib/libresolv.so.2 (0x00007fc2b93f8000)
        libsasl2.so.2 => /usr/lib/libsasl2.so.2 (0x00007fc2b91df000)
        libkrb5.so.3 => /usr/lib/libkrb5.so.3 (0x00007fc2b8f17000)
        libk5crypto.so.3 => /usr/lib/libk5crypto.so.3 (0x00007fc2b8cf1000)
        libcom_err.so.2 => /lib/libcom_err.so.2 (0x00007fc2b8aee000)
        libkrb5support.so.0 => /usr/lib/libkrb5support.so.0 (0x00007fc2b88e6000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fc2b86e2000)
        libkeyutils.so.1 => /lib/libkeyutils.so.1 (0x00007fc2b84e0000)
        libtasn1.so.3 => /usr/lib/libtasn1.so.3 (0x00007fc2b82d0000)
        libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007fc2b80cd000)
```

Git client menggunakan `libcurl-gnutls.so.4` untuk melakukan koneksi https.

Cek path dari `libcurl-gnutls.so.4`.

```
ls -lah /usr/lib/libcurl-gnutls.so*
```

Output:

```
root@debian6:~# ls -lah /usr/lib/libcurl-gnutls.so*
lrwxrwxrwx 1 root root   19 Nov 14  2019 /usr/lib/libcurl-gnutls.so.3 -> libcurl-gnutls.so.4
lrwxrwxrwx 1 root root   23 Nov 14  2019 /usr/lib/libcurl-gnutls.so.4 -> libcurl-gnutls.so.4.2.0
-rw-r--r-- 1 root root 341K Apr 10  2014 /usr/lib/libcurl-gnutls.so.4.2.0
```

Check library dependency dari `/usr/lib/libcurl-gnutls.so.4.2.0`.

```
readelf -d /usr/lib/libcurl-gnutls.so.4.2.0 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/lib/libcurl-gnutls.so.4.2.0
```

Output:

```
root@debian6:~# readelf -d /usr/lib/libcurl-gnutls.so.4.2.0 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libidn.so.11
liblber-2.4.so.2
libldap_r-2.4.so.2
librt.so.1
libgssapi_krb5.so.2
libz.so.1
libgnutls.so.26
libgcrypt.so.11
libc.so.6
```

```
root@debian6:~# ldd /usr/lib/libcurl-gnutls.so.4.2.0
        linux-vdso.so.1 =>  (0x00007fffe3862000)
        libidn.so.11 => /usr/lib/libidn.so.11 (0x00007f95f1d8b000)
        liblber-2.4.so.2 => /usr/lib/liblber-2.4.so.2 (0x00007f95f1b7d000)
        libldap_r-2.4.so.2 => /usr/lib/libldap_r-2.4.so.2 (0x00007f95f1932000)
        librt.so.1 => /lib/librt.so.1 (0x00007f95f172a000)
        libgssapi_krb5.so.2 => /usr/lib/libgssapi_krb5.so.2 (0x00007f95f14f5000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f95f12de000)
        libgnutls.so.26 => /usr/lib/libgnutls.so.26 (0x00007f95f103b000)
        libgcrypt.so.11 => /usr/lib/libgcrypt.so.11 (0x00007f95f0dc3000)
        libc.so.6 => /lib/libc.so.6 (0x00007f95f0a57000)
        libresolv.so.2 => /lib/libresolv.so.2 (0x00007f95f0841000)
        libsasl2.so.2 => /usr/lib/libsasl2.so.2 (0x00007f95f0628000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007f95f040c000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f95f2212000)
        libkrb5.so.3 => /usr/lib/libkrb5.so.3 (0x00007f95f0144000)
        libk5crypto.so.3 => /usr/lib/libk5crypto.so.3 (0x00007f95eff1e000)
        libcom_err.so.2 => /lib/libcom_err.so.2 (0x00007f95efd1b000)
        libkrb5support.so.0 => /usr/lib/libkrb5support.so.0 (0x00007f95efb13000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007f95ef90f000)
        libkeyutils.so.1 => /lib/libkeyutils.so.1 (0x00007f95ef70d000)
        libtasn1.so.3 => /usr/lib/libtasn1.so.3 (0x00007f95ef4fd000)
        libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007f95ef2fa000)
```

Library `libcurl-gnutls.so.4.2.0` membutuhkan library `libgnutls.so.26`.

Cek path dari library `libgnutls.so.26`.

```
ls -lah /usr/lib/libgnutls.so*
```

Output:

```
root@debian6:~# ls -lah /usr/lib/libgnutls.so*
lrwxrwxrwx 1 root root   21 Nov 30 13:46 /usr/lib/libgnutls.so -> libgnutls.so.26.14.12
lrwxrwxrwx 1 root root   21 Nov 25 06:54 /usr/lib/libgnutls.so.26 -> libgnutls.so.26.14.12
-rw-r--r-- 1 root root 654K Dec  8  2015 /usr/lib/libgnutls.so.26.14.12
```

Cek version dari libgnutls.

```
dpkg --list | grep libgnutls
```

Output:

```
root@debian6:~# dpkg --list | grep libgnutls
ii  libgnutls-dev                                          2.8.6-1+squeeze6             the GNU TLS library - development files
ii  libgnutls26                                            2.8.6-1+squeeze6             the GNU TLS library - runtime library
```

> If the output contains something that says "libgnutls", then you're using GnuTLS, and you'll need GnuTLS 2.12.24 or newer for proper TLS 1.2 support.

Sumber: https://stackoverflow.com/a/53604947

## Upgrade Git

Install prerequisite Git melalui repository.

```
apt-get install \
	dh-autoreconf \
	libcurl4-gnutls-dev \
	libexpat1-dev gettext \
	libz-dev \
	libssl-dev \
	asciidoc xmlto \
	docbook2x  \
	install-info
```

Sebagian output:

```
install-info is already the newest version.
zlib1g-dev is already the newest version.
libexpat1-dev is already the newest version.
libexpat1-dev set to manually installed.
libssl-dev is already the newest version.
The following packages will be upgraded:
  libcurl3-gnutls libgcrypt11 libtasn1-3
3 upgraded, 120 newly installed, 1 to remove and 99 not upgraded.
Need to get 491 MB of archives.
After this operation, 878 MB of additional disk space will be used.
```

Muncul warning sebagai berikut:

> Install these packages without verification [y/N]?

Balas dialog dengan `yes`/`y` dengan asumsi koneksi ke repository berjalan normal tanpa *interception*.

Download source `git`.

```
mkdir -p /usr/src/git
cd /usr/src/git
wget https://github.com/git/git/archive/v2.29.2.tar.gz
tar xvfz v2.29.2.tar.gz
cd git-2.29.2
```

Baca panduan install.

```
cd /usr/src/git/git-2.29.2
vi INSTALL
```

Perlu build file configure terlebih dahulu.

```
make configure
```

File configure terbentuk.

Baca panduan configure.

```
./configure --help
```

```
root@debian6:/usr/src/git/git-2.29.2# ./configure --help
`configure' configures git 2.29.2 to adapt to many kinds of systems.

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
  --docdir=DIR            documentation root [DATAROOTDIR/doc/git]
  --htmldir=DIR           html documentation [DOCDIR]
  --dvidir=DIR            dvi documentation [DOCDIR]
  --pdfdir=DIR            pdf documentation [DOCDIR]
  --psdir=DIR             ps documentation [DOCDIR]

Optional Features:
  --disable-option-checking  ignore unrecognized --enable/--with options
  --disable-FEATURE       do not include FEATURE (same as --enable-FEATURE=no)
  --enable-FEATURE[=ARG]  include FEATURE [ARG=yes]
  --enable-pthreads=FLAGS FLAGS is the value to pass to the compiler to enable
                          POSIX Threads. The default if FLAGS is not specified
                          is to try first -pthread and then -lpthread.
                          --disable-pthreads will disable threading.
  --enable-jsmin=PATH     PATH is the name of a JavaScript minifier or the
                          absolute path to one.
  --enable-cssmin=PATH    PATH is the name of a CSS minifier or the absolute
                          path to one.

Optional Packages:
  --with-PACKAGE[=ARG]    use PACKAGE [ARG=yes]
  --without-PACKAGE       do not use PACKAGE (same as --with-PACKAGE=no)
  --with-sane-tool-path=DIR-1[:DIR-2...:DIR-n]
                          Directories to prepend to PATH in build system and
                          generated scripts
  --with-lib=ARG          ARG specifies alternative name for lib directory
  --with-openssl          use OpenSSL library (default is YES)
                          ARG can be prefix for openssl library and headers
  --with-libpcre          synonym for --with-libpcre2
  --with-libpcre1         support Perl-compatible regexes via libpcre1
                          (default is NO)
                          ARG can be also prefix for libpcre library and
                          headers
  --with-libpcre2         support Perl-compatible regexes via libpcre2
                          (default is NO)
                          ARG can be also prefix for libpcre library and
                          headers
  --with-curl             support http(s):// transports (default is YES)
                          ARG can be also prefix for curl library and headers
  --with-expat            support git-push using http:// and https://
                          transports via WebDAV (default is YES)
                          ARG can be also prefix for expat library and headers
  --without-iconv         if your architecture doesn't properly support iconv
  --with-iconv=PATH       PATH is prefix for libiconv library and headers
                          used only if you need linking with libiconv
  --with-gitconfig=VALUE  Use VALUE instead of /etc/gitconfig as the global
                          git configuration file. If VALUE is not fully
                          qualified it will be interpreted as a path relative
                          to the computed prefix at runtime.
  --with-gitattributes=VALUE
                          Use VALUE instead of /etc/gitattributes as the
                          global git attributes file. If VALUE is not fully
                          qualified it will be interpreted as a path relative
                          to the computed prefix at runtime.
  --with-pager=VALUE      Use VALUE as the fall-back pager instead of 'less'.
                          This is used by things like 'git log' when the user
                          does not specify a pager to use through alternate
                          methods. eg: /usr/bin/pager
  --with-editor=VALUE     Use VALUE as the fall-back editor instead of 'vi'.
                          This is used by things like 'git commit' when the
                          user does not specify a preferred editor through
                          other methods. eg: /usr/bin/editor
  --with-shell=PATH       provide PATH to shell
  --with-perl=PATH        provide PATH to perl
  --with-python=PATH      provide PATH to python
  --with-zlib=PATH        provide PATH to zlib
  --with-tcltk            use Tcl/Tk GUI (default is YES)
                          ARG is the full path to the Tcl/Tk interpreter.
                          Bare --with-tcltk will make the GUI part only if
                          Tcl/Tk interpreter will be found in a system.

Some influential environment variables:
  CC          C compiler command
  CFLAGS      C compiler flags
  LDFLAGS     linker flags, e.g. -L<lib dir> if you have libraries in a
              nonstandard directory <lib dir>
  LIBS        libraries to pass to the linker, e.g. -l<library>
  CPPFLAGS    (Objective) C/C++ preprocessor flags, e.g. -I<include dir> if
              you have headers in a nonstandard directory <include dir>
  CPP         C preprocessor

Use these variables to override the choices made by `configure' or to help
it to find libraries and programs with nonstandard names/locations.

Report bugs to <git@vger.kernel.org>.
```

>   --with-openssl          use OpenSSL library (default is YES)
>   --with-curl

Secara default, git versi terbaru ini akan menggunakan OpenSSL.

Configure.

```
./configure
```

Compile dan Install.

```
make all doc info
make install install-doc install-html install-info
```

Pastikan aplikasi merupakan versi terbaru atau buka ulang terminal.

```
which git
```

```
git --version
```

Output:

```
root@debian6:~# which git
/usr/local/bin/git
```

```
root@debian6:~# git --version
git version 2.29.2
```

## Kesimpulan

Aplikasi `git` berhasil di-upgrade dari versi `1.7.2.5` ke versi `2.29.2`.

Koneksi **berhasil** ke website yang menggunakan TLS versi >= 1.2 seperti github.com dan packagist.com jika menggunakan `git` terbaru.

## Referensi

https://stackoverflow.com/questions/53594412/what-version-of-git-supports-tls-1-2/53604947#53604947

https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

