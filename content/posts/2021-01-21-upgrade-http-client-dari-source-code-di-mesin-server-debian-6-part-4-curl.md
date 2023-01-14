---
title: Upgrade HTTP Client dari Source Code di mesin server Debian 6 - Part 4 Curl
slug: /blog/2021/01/21/upgrade-http-client-dari-source-code-di-mesin-server-debian-6-part-4-curl/
date: 2021-01-21
---

## Aplikasi Curl Sebelum Upgrade

Check lokasi dan versi.

```
which curl
```

```
curl --version
```

Output:

```
root@debian6:~# which curl
/usr/bin/curl
```

```
root@debian6:~# curl --version
curl 7.21.0 (x86_64-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.15 libssh2/1.2.6
Protocols: dict file ftp ftps http https imap imaps ldap ldaps pop3 pop3s rtsp scp sftp smtp smtps telnet tftp
Features: GSS-Negotiate IDN IPv6 Largefile NTLM SSL libz
```

Check library dependency dari `/usr/bin/curl`.

```
readelf -d /usr/bin/curl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/bin/curl
```

Output:

```
root@debian6:~# readelf -d /usr/bin/curl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libcurl.so.4
librt.so.1
libz.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/bin/curl
        linux-vdso.so.1 =>  (0x00007ffee9fc0000)
        libcurl.so.4 => /usr/lib/libcurl.so.4 (0x00007f0560d76000)
        librt.so.1 => /lib/librt.so.1 (0x00007f0560b6e000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f0560957000)
        libc.so.6 => /lib/libc.so.6 (0x00007f05605eb000)
        libidn.so.11 => /usr/lib/libidn.so.11 (0x00007f05603b9000)
        libssh2.so.1 => /usr/lib/libssh2.so.1 (0x00007f0560195000)
        liblber-2.4.so.2 => /usr/lib/liblber-2.4.so.2 (0x00007f055ff87000)
        libldap_r-2.4.so.2 => /usr/lib/libldap_r-2.4.so.2 (0x00007f055fd3c000)
        libgssapi_krb5.so.2 => /usr/lib/libgssapi_krb5.so.2 (0x00007f055fb07000)
        libssl.so.0.9.8 => /usr/lib/libssl.so.0.9.8 (0x00007f055f8af000)
        libcrypto.so.0.9.8 => /usr/lib/libcrypto.so.0.9.8 (0x00007f055f50d000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007f055f2f1000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f0560fd7000)
        libgcrypt.so.11 => /usr/lib/libgcrypt.so.11 (0x00007f055f079000)
        libresolv.so.2 => /lib/libresolv.so.2 (0x00007f055ee63000)
        libsasl2.so.2 => /usr/lib/libsasl2.so.2 (0x00007f055ec4a000)
        libgnutls.so.26 => /usr/lib/libgnutls.so.26 (0x00007f055e9a7000)
        libkrb5.so.3 => /usr/lib/libkrb5.so.3 (0x00007f055e6df000)
        libk5crypto.so.3 => /usr/lib/libk5crypto.so.3 (0x00007f055e4b9000)
        libcom_err.so.2 => /lib/libcom_err.so.2 (0x00007f055e2b6000)
        libkrb5support.so.0 => /usr/lib/libkrb5support.so.0 (0x00007f055e0ae000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007f055deaa000)
        libkeyutils.so.1 => /lib/libkeyutils.so.1 (0x00007f055dca8000)
        libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007f055daa5000)
        libtasn1.so.3 => /usr/lib/libtasn1.so.3 (0x00007f055d895000)
```

Check path dari library `libcurl.so.4`.

```
ls -lah /usr/lib/libcurl.so.4*
```

Output:

```
root@debian6:~# ls -lah /usr/lib/libcurl.so.4*
lrwxrwxrwx 1 root root   16 Nov 22 22:11 /usr/lib/libcurl.so.4 -> libcurl.so.4.2.0
-rw-r--r-- 1 root root 389K Apr 30  2015 /usr/lib/libcurl.so.4.2.0
```

Check library dependency dari `libcurl.so.4.2.0`.

```
readelf -d /usr/lib/libcurl.so.4.2.0 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/lib/libcurl.so.4.2.0
```

Output:

```
root@debian6:~# readelf -d /usr/lib/libcurl.so.4.2.0 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libidn.so.11
libssh2.so.1
liblber-2.4.so.2
libldap_r-2.4.so.2
librt.so.1
libgssapi_krb5.so.2
libssl.so.0.9.8
libcrypto.so.0.9.8
libz.so.1
libc.so.6
```

```
root@debian6:~# ldd /usr/lib/libcurl.so.4.2.0
        linux-vdso.so.1 =>  (0x00007ffc59d3c000)
        libidn.so.11 => /usr/lib/libidn.so.11 (0x00007fe93c0c0000)
        libssh2.so.1 => /usr/lib/libssh2.so.1 (0x00007fe93be9c000)
        liblber-2.4.so.2 => /usr/lib/liblber-2.4.so.2 (0x00007fe93bc8e000)
        libldap_r-2.4.so.2 => /usr/lib/libldap_r-2.4.so.2 (0x00007fe93ba43000)
        librt.so.1 => /lib/librt.so.1 (0x00007fe93b83b000)
        libgssapi_krb5.so.2 => /usr/lib/libgssapi_krb5.so.2 (0x00007fe93b606000)
        libssl.so.0.9.8 => /usr/lib/libssl.so.0.9.8 (0x00007fe93b3ae000)
        libcrypto.so.0.9.8 => /usr/lib/libcrypto.so.0.9.8 (0x00007fe93b00c000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fe93adf5000)
        libc.so.6 => /lib/libc.so.6 (0x00007fe93aa89000)
        libgcrypt.so.11 => /usr/lib/libgcrypt.so.11 (0x00007fe93a811000)
        libresolv.so.2 => /lib/libresolv.so.2 (0x00007fe93a5fb000)
        libsasl2.so.2 => /usr/lib/libsasl2.so.2 (0x00007fe93a3e2000)
        libgnutls.so.26 => /usr/lib/libgnutls.so.26 (0x00007fe93a13f000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007fe939f23000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fe93c553000)
        libkrb5.so.3 => /usr/lib/libkrb5.so.3 (0x00007fe939c5b000)
        libk5crypto.so.3 => /usr/lib/libk5crypto.so.3 (0x00007fe939a35000)
        libcom_err.so.2 => /lib/libcom_err.so.2 (0x00007fe939832000)
        libkrb5support.so.0 => /usr/lib/libkrb5support.so.0 (0x00007fe93962a000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fe939426000)
        libkeyutils.so.1 => /lib/libkeyutils.so.1 (0x00007fe939224000)
        libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007fe939021000)
        libtasn1.so.3 => /usr/lib/libtasn1.so.3 (0x00007fe938e11000)
```

Curl versi 7.21 menggunakan library Curl versi 4.2.0 (`libcurl.so.4.2.0`) dan library OpenSSL versi 0.9.8 (`libssl.so.0.9.8`).

## Upgrade Curl

Download source `curl`.

```
mkdir -p /usr/src/curl
cd /usr/src/curl
wget https://github.com/curl/curl/releases/download/curl-7_73_0/curl-7.73.0.tar.gz
tar xvfz curl-7.73.0.tar.gz
cd curl-7.73.0
```

Baca panduan configure.

```
./configure --help
```

Output:

```
root@debian6:/usr/src/curl/curl-7.73.0# ./configure --help
`configure' configures curl - to adapt to many kinds of systems.

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
  --runstatedir=DIR       modifiable per-process data [LOCALSTATEDIR/run]
  --libdir=DIR            object code libraries [EPREFIX/lib]
  --includedir=DIR        C header files [PREFIX/include]
  --oldincludedir=DIR     C header files for non-gcc [/usr/include]
  --datarootdir=DIR       read-only arch.-independent data root [PREFIX/share]
  --datadir=DIR           read-only architecture-independent data [DATAROOTDIR]
  --infodir=DIR           info documentation [DATAROOTDIR/info]
  --localedir=DIR         locale-dependent data [DATAROOTDIR/locale]
  --mandir=DIR            man documentation [DATAROOTDIR/man]
  --docdir=DIR            documentation root [DATAROOTDIR/doc/curl]
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
  --enable-maintainer-mode
                          enable make rules and dependencies not useful (and
                          sometimes confusing) to the casual installer
  --enable-silent-rules   less verbose build output (undo: "make V=1")
  --disable-silent-rules  verbose build output (undo: "make V=0")
  --enable-debug          Enable debug build options
  --disable-debug         Disable debug build options
  --enable-optimize       Enable compiler optimizations
  --disable-optimize      Disable compiler optimizations
  --enable-warnings       Enable strict compiler warnings
  --disable-warnings      Disable strict compiler warnings
  --enable-werror         Enable compiler warnings as errors
  --disable-werror        Disable compiler warnings as errors
  --enable-curldebug      Enable curl debug memory tracking
  --disable-curldebug     Disable curl debug memory tracking
  --enable-symbol-hiding  Enable hiding of library internal symbols
  --disable-symbol-hiding Disable hiding of library internal symbols
  --enable-hidden-symbols To be deprecated, use --enable-symbol-hiding
  --disable-hidden-symbols
                          To be deprecated, use --disable-symbol-hiding
  --enable-ares[=PATH]    Enable c-ares for DNS lookups
  --disable-ares          Disable c-ares for DNS lookups
  --disable-rt            disable dependency on -lrt
  --enable-ech            Enable ECH support
  --disable-ech           Disable ECH support
  --enable-code-coverage  Provide code coverage
  --enable-dependency-tracking
                          do not reject slow dependency extractors
  --disable-dependency-tracking
                          speeds up one-time build
  --disable-largefile     omit support for large files
  --enable-shared[=PKGS]  build shared libraries [default=yes]
  --enable-static[=PKGS]  build static libraries [default=yes]
  --enable-fast-install[=PKGS]
                          optimize for fast installation [default=yes]
  --disable-libtool-lock  avoid locking (might break parallel builds)
  --enable-http           Enable HTTP support
  --disable-http          Disable HTTP support
  --enable-ftp            Enable FTP support
  --disable-ftp           Disable FTP support
  --enable-file           Enable FILE support
  --disable-file          Disable FILE support
  --enable-ldap           Enable LDAP support
  --disable-ldap          Disable LDAP support
  --enable-ldaps          Enable LDAPS support
  --disable-ldaps         Disable LDAPS support
  --enable-rtsp           Enable RTSP support
  --disable-rtsp          Disable RTSP support
  --enable-proxy          Enable proxy support
  --disable-proxy         Disable proxy support
  --enable-dict           Enable DICT support
  --disable-dict          Disable DICT support
  --enable-telnet         Enable TELNET support
  --disable-telnet        Disable TELNET support
  --enable-tftp           Enable TFTP support
  --disable-tftp          Disable TFTP support
  --enable-pop3           Enable POP3 support
  --disable-pop3          Disable POP3 support
  --enable-imap           Enable IMAP support
  --disable-imap          Disable IMAP support
  --enable-smb            Enable SMB/CIFS support
  --disable-smb           Disable SMB/CIFS support
  --enable-smtp           Enable SMTP support
  --disable-smtp          Disable SMTP support
  --enable-gopher         Enable Gopher support
  --disable-gopher        Disable Gopher support
  --enable-mqtt           Enable MQTT support
  --disable-mqtt          Disable MQTT support
  --enable-manual         Enable built-in manual
  --disable-manual        Disable built-in manual
  --enable-libcurl-option Enable --libcurl C code generation support
  --disable-libcurl-option
                          Disable --libcurl C code generation support
  --enable-libgcc         use libgcc when linking
  --enable-ipv6           Enable IPv6 (with IPv4) support
  --disable-ipv6          Disable IPv6 support
  --enable-openssl-auto-load-config
                          Enable automatic loading of OpenSSL configuration
  --disable-openssl-auto-load-config
                          Disable automatic loading of OpenSSL configuration
  --enable-versioned-symbols
                          Enable versioned symbols in shared library
  --disable-versioned-symbols
                          Disable versioned symbols in shared library
  --enable-threaded-resolver
                          Enable threaded resolver
  --disable-threaded-resolver
                          Disable threaded resolver
  --enable-pthreads       Enable POSIX threads (default for threaded resolver)
  --disable-pthreads      Disable POSIX threads
  --enable-verbose        Enable verbose strings
  --disable-verbose       Disable verbose strings
  --enable-sspi           Enable SSPI
  --disable-sspi          Disable SSPI
  --enable-crypto-auth    Enable cryptographic authentication
  --disable-crypto-auth   Disable cryptographic authentication
  --enable-ntlm-wb[=FILE] Enable NTLM delegation to winbind's ntlm_auth
                          helper, where FILE is ntlm_auth's absolute filename
                          (default: /usr/bin/ntlm_auth)
  --disable-ntlm-wb       Disable NTLM delegation to winbind's ntlm_auth
                          helper
  --enable-tls-srp        Enable TLS-SRP authentication
  --disable-tls-srp       Disable TLS-SRP authentication
  --enable-unix-sockets   Enable Unix domain sockets
  --disable-unix-sockets  Disable Unix domain sockets
  --enable-cookies        Enable cookies support
  --disable-cookies       Disable cookies support
  --enable-socketpair     Enable socketpair support
  --disable-socketpair    Disable socketpair support
  --enable-http-auth      Enable HTTP authentication support
  --disable-http-auth     Disable HTTP authentication support
  --enable-doh            Enable DoH support
  --disable-doh           Disable DoH support
  --enable-mime           Enable mime API support
  --disable-mime          Disable mime API support
  --enable-dateparse      Enable date parsing
  --disable-dateparse     Disable date parsing
  --enable-netrc          Enable netrc parsing
  --disable-netrc         Disable netrc parsing
  --enable-progress-meter Enable progress-meter
  --disable-progress-meter
                          Disable progress-meter
  --enable-dnsshuffle     Enable DNS shuffling
  --disable-dnsshuffle    Disable DNS shuffling
  --enable-get-easy-options
                          Enable curl_easy_options
  --disable-get-easy-options
                          Disable curl_easy_options
  --enable-alt-svc        Enable alt-svc support
  --disable-alt-svc       Disable alt-svc support

Optional Packages:
  --with-PACKAGE[=ARG]    use PACKAGE [ARG=yes]
  --without-PACKAGE       do not use PACKAGE (same as --with-PACKAGE=no)
  --with-pic[=PKGS]       try to use only PIC/non-PIC objects [default=use
                          both]
  --with-aix-soname=aix|svr4|both
                          shared library versioning (aka "SONAME") variant to
                          provide on AIX, [default=aix].
  --with-gnu-ld           assume the C compiler uses GNU ld [default=no]
  --with-sysroot[=DIR]    Search for dependent libraries within DIR (or the
                          compiler's sysroot if not specified).
  --with-zlib=PATH        search for zlib in PATH
  --without-zlib          disable use of zlib
  --with-brotli=PATH      Where to look for brotli, PATH points to the BROTLI
                          installation; when possible, set the PKG_CONFIG_PATH
                          environment variable instead of using this option
  --without-brotli        disable BROTLI
  --with-zstd=PATH        Where to look for libzstd, PATH points to the
                          libzstd installation; when possible, set the
                          PKG_CONFIG_PATH environment variable instead of
                          using this option
  --without-zstd          disable libzstd
  --with-ldap-lib=libname Specify name of ldap lib file
  --with-lber-lib=libname Specify name of lber lib file
  --with-gssapi-includes=DIR
                          Specify location of GSS-API headers
  --with-gssapi-libs=DIR  Specify location of GSS-API libs
  --with-gssapi=DIR       Where to look for GSS-API
  --with-default-ssl-backend=NAME
                          Use NAME as default SSL backend
  --without-default-ssl-backend
                          Use implicit default SSL backend
  --with-winssl           enable Windows native SSL/TLS
  --without-winssl        disable Windows native SSL/TLS
  --with-schannel         enable Windows native SSL/TLS
  --without-schannel      disable Windows native SSL/TLS
  --with-darwinssl        enable Apple OS native SSL/TLS
  --without-darwinssl     disable Apple OS native SSL/TLS
  --with-secure-transport enable Apple OS native SSL/TLS
  --without-secure-transport
                          disable Apple OS native SSL/TLS
  --with-amissl           enable Amiga native SSL/TLS (AmiSSL)
  --without-amissl        disable Amiga native SSL/TLS (AmiSSL)
  --with-ssl=PATH         Where to look for OpenSSL, PATH points to the SSL
                          installation (default: /usr/local/ssl); when
                          possible, set the PKG_CONFIG_PATH environment
                          variable instead of using this option
  --without-ssl           disable OpenSSL
  --with-egd-socket=FILE  Entropy Gathering Daemon socket pathname
  --with-random=FILE      read randomness from FILE (default=/dev/urandom)
  --with-gnutls=PATH      where to look for GnuTLS, PATH points to the
                          installation root
  --without-gnutls        disable GnuTLS detection
  --with-mbedtls=PATH     where to look for mbedTLS, PATH points to the
                          installation root
  --without-mbedtls       disable mbedTLS detection
  --with-wolfssl=PATH     where to look for WolfSSL, PATH points to the
                          installation root (default: system lib default)
  --without-wolfssl       disable WolfSSL detection
  --with-mesalink=PATH    where to look for MesaLink, PATH points to the
                          installation root
  --without-mesalink      disable MesaLink detection
  --with-bearssl=PATH     where to look for BearSSL, PATH points to the
                          installation root
  --without-bearssl       disable BearSSL detection
  --with-nss=PATH         where to look for NSS, PATH points to the
                          installation root
  --without-nss           disable NSS detection
  --with-ca-bundle=FILE   Path to a file containing CA certificates (example:
                          /etc/ca-bundle.crt)
  --without-ca-bundle     Don't use a default CA bundle
  --with-ca-path=DIRECTORY
                          Path to a directory containing CA certificates
                          stored individually, with their filenames in a hash
                          format. This option can be used with the OpenSSL,
                          GnuTLS and mbedTLS backends. Refer to OpenSSL
                          c_rehash for details. (example: /etc/certificates)
  --without-ca-path       Don't use a default CA path
  --with-ca-fallback      Use the built in CA store of the SSL library
  --without-ca-fallback   Don't use the built in CA store of the SSL library
  --without-libpsl        disable support for libpsl cookie checking
  --with-libmetalink=PATH where to look for libmetalink, PATH points to the
                          installation root
  --without-libmetalink   disable libmetalink detection
  --with-libssh2=PATH     Where to look for libssh2, PATH points to the
                          libssh2 installation; when possible, set the
                          PKG_CONFIG_PATH environment variable instead of
                          using this option
  --with-libssh2          enable libssh2
  --with-libssh=PATH      Where to look for libssh, PATH points to the libssh
                          installation; when possible, set the PKG_CONFIG_PATH
                          environment variable instead of using this option
  --with-libssh           enable libssh
  --with-wolfssh=PATH     Where to look for wolfssh, PATH points to the
                          wolfSSH installation; when possible, set the
                          PKG_CONFIG_PATH environment variable instead of
                          using this option
  --with-wolfssh          enable wolfssh
  --with-librtmp=PATH     Where to look for librtmp, PATH points to the
                          LIBRTMP installation; when possible, set the
                          PKG_CONFIG_PATH environment variable instead of
                          using this option
  --without-librtmp       disable LIBRTMP
  --with-winidn=PATH      enable Windows native IDN
  --without-winidn        disable Windows native IDN
  --with-libidn2=PATH     Enable libidn2 usage
  --without-libidn2       Disable libidn2 usage
  --with-nghttp2=PATH     Enable nghttp2 usage
  --without-nghttp2       Disable nghttp2 usage
  --with-ngtcp2=PATH      Enable ngtcp2 usage
  --without-ngtcp2        Disable ngtcp2 usage
  --with-nghttp3=PATH     Enable nghttp3 usage
  --without-nghttp3       Disable nghttp3 usage
  --with-quiche=PATH      Enable quiche usage
  --without-quiche        Disable quiche usage
  --with-zsh-functions-dir=PATH
                          Install zsh completions to PATH
  --without-zsh-functions-dir
                          Do not install zsh completions
  --with-fish-functions-dir=PATH
                          Install fish completions to PATH
  --without-fish-functions-dir
                          Do not install fish completions

Some influential environment variables:
  CC          C compiler command
  CFLAGS      C compiler flags
  LDFLAGS     linker flags, e.g. -L<lib dir> if you have libraries in a
              nonstandard directory <lib dir>
  LIBS        libraries to pass to the linker, e.g. -l<library>
  CPPFLAGS    (Objective) C/C++ preprocessor flags, e.g. -I<include dir> if
              you have headers in a nonstandard directory <include dir>
  CPP         C preprocessor
  LT_SYS_LIBRARY_PATH
              User-defined run-time library search path.

Use these variables to override the choices made by `configure' or to help
it to find libraries and programs with nonstandard names/locations.

Report bugs to <a suitable curl mailing list: https://curl.haxx.se/mail/>.

```

Sesuai panduan, maka kita perlu menambahan argument `--with-ssl` karena kita akan menggunakan OpenSSL versi terbaru yang support TLS >= 1.2.

> The configure script always tries to find a working SSL library unless explicitly told not to. If you have OpenSSL installed in the default search path for your compiler/linker, you don't need to do anything special. If you have OpenSSL installed in /usr/local/ssl, you can run configure like:
>
> ./configure --with-ssl

Sumber: https://curl.se/docs/install.html

Configure.

```
cd /usr/src/curl/curl-7.73.0
./configure --with-ssl
```

Sebagian output:

```
root@debian6:/usr/src/curl/curl-7.73.0# ./configure --with-ssl
---
checking for OpenSSL_version... yes
checking for BoringSSL... no
checking for libressl... no
checking for OpenSSL >= v3... no
configure: Added /usr/local/lib to CURL_LIBRARY_PATH
checking for OpenSSL headers version... 1.1.1 - 0x1010108fL
checking for OpenSSL library version... 1.1.1
checking for OpenSSL headers and library versions matching... yes
checking for "/dev/urandom"... yes
checking for SRP_Calc_client_key in -lcrypto... yes
configure: built with one SSL backend
checking default CA cert bundle/path... /etc/ssl/certs/ca-certificates.crt
checking whether to use builtin CA store of SSL library... no
---
configure: Configured to build curl/libcurl:

  Host setup:       x86_64-pc-linux-gnu
  Install prefix:   /usr/local
  Compiler:         gcc
   CFLAGS:          -Werror-implicit-function-declaration -O2 -Wno-system-headers -pthread
   CPPFLAGS:
   LDFLAGS:
   LIBS:            -lssl -lcrypto -lssl -lcrypto -lldap -lz -lrt

  curl version:     7.73.0
  SSL:              enabled (OpenSSL)
  SSH:              no      (--with-{libssh,libssh2})
  zlib:             enabled
  brotli:           no      (--with-brotli)
  zstd:             no      (--with-zstd)
  GSS-API:          no      (--with-gssapi)
  TLS-SRP:          no      (--enable-tls-srp)
  resolver:         POSIX threaded
  IPv6:             enabled
  Unix sockets:     enabled
  IDN:              no      (--with-{libidn2,winidn})
  Build libcurl:    Shared=yes, Static=yes
  Built-in manual:  enabled
  --libcurl option: enabled (--disable-libcurl-option)
  Verbose errors:   enabled (--disable-verbose)
  Code coverage:    disabled
  SSPI:             no      (--enable-sspi)
  ca cert bundle:   /etc/ssl/certs/ca-certificates.crt
  ca cert path:     no
  ca fallback:      no
  LDAP:             enabled (OpenLDAP)
  LDAPS:            enabled
  RTSP:             enabled
  RTMP:             no      (--with-librtmp)
  Metalink:         no      (--with-libmetalink)
  PSL:              no      (libpsl not found)
  Alt-svc:          no      (--enable-alt-svc)
  HTTP2:            no      (--with-nghttp2)
  HTTP3:            no      (--with-ngtcp2, --with-quiche)
  ECH:              no      (--enable-ech)
  Protocols:        DICT FILE FTP FTPS GOPHER HTTP HTTPS IMAP IMAPS LDAP LDAPS MQTT POP3 POP3S RTSP SMB SMBS SMTP SMTPS TELNET TFTP
  Features:         AsynchDNS HTTPS-proxy IPv6 NTLM NTLM_WB SSL UnixSockets libz
```

Compile dan Install.

```
make
make install
```

Pastikan aplikasi merupakan versi terbaru atau buka ulang terminal.

```
which curl
```

```
curl --version
```

Output:

```
root@debian6:~# which curl
/usr/local/bin/curl
```

```
root@debian6:~# /usr/local/bin/curl --version
curl 7.73.0 (x86_64-pc-linux-gnu) libcurl/7.73.0 OpenSSL/1.1.1h zlib/1.2.3.4
Release-Date: 2020-10-14
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps mqtt pop3 pop3s rtsp smb smbs smtp smtps telnet tftp
Features: AsynchDNS HTTPS-proxy IPv6 Largefile libz NTLM NTLM_WB SSL TLS-SRP UnixSockets
```

## Aplikasi Curl Sesudah Upgrade

Check library dependency dari `/usr/local/bin/curl`.

```
readelf -d /usr/local/bin/curl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/local/bin/curl
```

Output:

```
root@debian6:~# readelf -d /usr/local/bin/curl | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libcurl.so.4
libssl.so.1.1
libcrypto.so.1.1
libz.so.1
librt.so.1
libpthread.so.0
libc.so.6
```

```
root@debian6:~# ldd /usr/local/bin/curl
        linux-vdso.so.1 =>  (0x00007ffd53f76000)
        libcurl.so.4 => /usr/local/lib/libcurl.so.4 (0x00007fc4f0db9000)
        libssl.so.1.1 => /usr/local/lib/libssl.so.1.1 (0x00007fc4f0b29000)
        libcrypto.so.1.1 => /usr/local/lib/libcrypto.so.1.1 (0x00007fc4f0660000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007fc4f0449000)
        librt.so.1 => /lib/librt.so.1 (0x00007fc4f0241000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007fc4f0025000)
        libc.so.6 => /lib/libc.so.6 (0x00007fc4efcb9000)
        libldap_r-2.4.so.2 => /usr/lib/libldap_r-2.4.so.2 (0x00007fc4efa6e000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007fc4ef86a000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fc4f1035000)
        liblber-2.4.so.2 => /usr/lib/liblber-2.4.so.2 (0x00007fc4ef65c000)
        libresolv.so.2 => /lib/libresolv.so.2 (0x00007fc4ef446000)
        libsasl2.so.2 => /usr/lib/libsasl2.so.2 (0x00007fc4ef22d000)
        libgnutls.so.26 => /usr/lib/libgnutls.so.26 (0x00007fc4eef8a000)
        libtasn1.so.3 => /usr/lib/libtasn1.so.3 (0x00007fc4eed7a000)
        libgcrypt.so.11 => /usr/lib/libgcrypt.so.11 (0x00007fc4eeb02000)
        libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007fc4ee8ff000)
```

Check path dari library `libcurl.so.4`.

```
ls -lah /usr/local/lib/libcurl.so.4*
```

Output:

```
root@debian6:~# ls -lah /usr/local/lib/libcurl.so.4*
lrwxrwxrwx 1 root staff   16 Nov 28 08:47 /usr/local/lib/libcurl.so.4 -> libcurl.so.4.7.0
-rwxr-xr-x 1 root staff 562K Nov 28 08:47 /usr/local/lib/libcurl.so.4.7.0
```

Check library dependency dari `libcurl.so.4.7.0`.

```
readelf -d /usr/local/lib/libcurl.so.4.7.0 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
```

```
ldd /usr/local/lib/libcurl.so.4.7.0
```

Output:

```
root@debian6:~# readelf -d /usr/local/lib/libcurl.so.4.7.0 | grep NEEDED | awk '{print $5}' | sed "s/\[//g" | sed "s/\]//g"
libssl.so.1.1
libcrypto.so.1.1
libldap_r-2.4.so.2
libz.so.1
librt.so.1
libpthread.so.0
libc.so.6
```

```
root@debian6:~# ldd /usr/local/lib/libcurl.so.4.7.0
        linux-vdso.so.1 =>  (0x00007ffd021d2000)
        libssl.so.1.1 => /usr/local/lib/libssl.so.1.1 (0x00007f028e811000)
        libcrypto.so.1.1 => /usr/local/lib/libcrypto.so.1.1 (0x00007f028e348000)
        libldap_r-2.4.so.2 => /usr/lib/libldap_r-2.4.so.2 (0x00007f028e0fd000)
        libz.so.1 => /usr/lib/libz.so.1 (0x00007f028dee6000)
        librt.so.1 => /lib/librt.so.1 (0x00007f028dcde000)
        libpthread.so.0 => /lib/libpthread.so.0 (0x00007f028dac2000)
        libc.so.6 => /lib/libc.so.6 (0x00007f028d756000)
        libdl.so.2 => /lib/libdl.so.2 (0x00007f028d552000)
        liblber-2.4.so.2 => /usr/lib/liblber-2.4.so.2 (0x00007f028d344000)
        libresolv.so.2 => /lib/libresolv.so.2 (0x00007f028d12e000)
        libsasl2.so.2 => /usr/lib/libsasl2.so.2 (0x00007f028cf15000)
        libgnutls.so.26 => /usr/lib/libgnutls.so.26 (0x00007f028cc72000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f028ed1d000)
        libtasn1.so.3 => /usr/lib/libtasn1.so.3 (0x00007f028ca62000)
        libgcrypt.so.11 => /usr/lib/libgcrypt.so.11 (0x00007f028c7ea000)
        libgpg-error.so.0 => /usr/lib/libgpg-error.so.0 (0x00007f028c5e7000)
```

Curl versi terbaru (`7.73`) menggunakan library Curl versi 4.7.0 (`libcurl.so.4.7.0`) dan library OpenSSL versi 1.1 (`libssl.so.1.1`).

Sesuai informasi pada saat `./configure`, Curl ini sudah detect bundle certificate authority di path `/etc/ssl/certs/ca-certificates.crt`.

Test koneksi ke Github.com.

```
curl -sS -D - https://github.com/ -o /dev/null | grep HTTP/
```

Output:

```
root@debian6:~# curl -sS -D - https://github.com/ -o /dev/null | grep HTTP/
HTTP/1.1 200 OK
```

Koneksi berhasil.

## Catatan Error

Berikut ini dua peluang error yang terjadi saat install melalui source.

 1. curl and libcurl versions do not match
 2. Masih gagal akses website dengan TLS versi >= 1.2

Error 1: curl and libcurl versions do not match

```
root@debian6:/usr/local/bin# ./curl -V
curl 7.73.0 (x86_64-pc-linux-gnu) libcurl/7.21.0 OpenSSL/0.9.8o zlib/1.2.3.4 libidn/1.15 libssh2/1.2.6
Release-Date: 2020-10-14
Protocols: dict file ftp ftps http https imap imaps ldap ldaps pop3 pop3s rtsp scp sftp smtp smtps telnet tftp
Features: IDN IPv6 Largefile libz NTLM SSL
WARNING: curl and libcurl versions do not match. Functionality may be affected.
./curl: symbol lookup error: ./curl: undefined symbol: curl_mime_free
```

Debug saat masih error.

```
root@debian6:~# ldd /usr/local/bin/curl | grep libcurl
        libcurl.so.4 => /usr/lib/libcurl.so.4 (0x00007f83f9b0d000)
```

Library yang digunakan adalah versi lama `/usr/lib/libcurl.so.4`.

Solusi sementara, tambahkan `LD_LIBRARY_PATH`.

```
root@debian6:~# LD_LIBRARY_PATH=/usr/local/lib /usr/local/bin/curl -V
curl 7.73.0 (x86_64-pc-linux-gnu) libcurl/7.73.0 OpenSSL/0.9.8o zlib/1.2.3.4
Release-Date: 2020-10-14
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps mqtt pop3 pop3s rtsp smb smbs smtp smtps telnet tftp
Features: AsynchDNS HTTPS-proxy IPv6 Largefile libz NTLM NTLM_WB SSL UnixSockets
```

Solusi yang permanent yakni perbaiki lokasi library dengan cara:

 - Cek path library yang digunakan pada file `/etc/ld.so.conf` atau direktori `/etc/ld.so.conf.d`.
 - Rebuild ulang path library dengan command `ldconfig -v` dan cek output pada verbose.

Debug setelah solusi error ditemukan.

```
root@debian6:~# ldd /usr/local/bin/curl | grep libcurl
        libcurl.so.4 => /usr/local/lib/libcurl.so.4 (0x00007fbbbc841000)
```

Error 2: Masih gagal akses website dengan TLS versi >= 1.2

Debug saat masih error.

```
root@debian6:~# ldd /usr/local/bin/curl | grep -E '(ssl|crypto)'
        libssl.so.0.9.8 => /usr/lib/libssl.so.0.9.8 (0x00007f83f98b5000)
        libcrypto.so.0.9.8 => /usr/lib/libcrypto.so.0.9.8 (0x00007f83f9513000)
```

Library OpenSSL yang digunakan masih versi lama yakni `0.9.8`, upgrade OpenSSL ke versi terbaru yang mendukung TLS versi >= 1.2.

Debug setelah solusi error ditemukan.

```
root@debian6:~# ldd /usr/local/bin/curl | grep -E '(ssl|crypto)'
        libssl.so.1.1 => /usr/local/lib/libssl.so.1.1 (0x00007fe949b78000)
        libcrypto.so.1.1 => /usr/local/lib/libcrypto.so.1.1 (0x00007fe9496af000)
```

## Kesimpulan

Aplikasi `curl` berhasil di-upgrade dari versi `7.21.0` ke versi `7.73.0`.

Koneksi **berhasil** ke website yang menggunakan TLS versi >= 1.2 seperti github.com dan packagist.com jika menggunakan `curl` terbaru.

## Referensi

https://curl.se/docs/install.html

https://github.com/curl/curl/issues/4448
