---
title: Install Nginx dari Source Code di mesin Debian
tags:
  - nginx
---

## Pendahulan

Kita memiliki mesin Debian yang menggunakan aplikasi Apache versi 2 sebagai web server yang mendengar port 80.

Kita akan menambahkan aplikasi web server yang lebih ringan yakni `nginx` dan akan berjalan paralel dengan `apache2`.

Nginx akan kita set untuk men-listen port 81.

Nginx versi terbaru saat tulisan ini dibuat adalah versi `1.19.6`.

Sumber: https://github.com/nginx/nginx/releases

## Install

Download source `nginx`.

```
mkdir -p /usr/src/nginx
cd /usr/src/nginx
wget https://github.com/nginx/nginx/archive/release-1.19.6.tar.gz
tar xvfz release-1.19.6.tar.gz
cd nginx-release-1.19.6/
```

Check configure.

```
cd /usr/src/nginx/nginx-release-1.19.6
auto/configure --help
```

Output:

```
root@lib:/usr/src/nginx/nginx-release-1.19.6# auto/configure --help
  --help                             print this message

  --prefix=PATH                      set installation prefix
  --sbin-path=PATH                   set nginx binary pathname
  --modules-path=PATH                set modules path
  --conf-path=PATH                   set nginx.conf pathname
  --error-log-path=PATH              set error log pathname
  --pid-path=PATH                    set nginx.pid pathname
  --lock-path=PATH                   set nginx.lock pathname

  --user=USER                        set non-privileged user for
                                     worker processes
  --group=GROUP                      set non-privileged group for
                                     worker processes

  --build=NAME                       set build name
  --builddir=DIR                     set build directory

  --with-select_module               enable select module
  --without-select_module            disable select module
  --with-poll_module                 enable poll module
  --without-poll_module              disable poll module

  --with-threads                     enable thread pool support

  --with-file-aio                    enable file AIO support

  --with-http_ssl_module             enable ngx_http_ssl_module
  --with-http_v2_module              enable ngx_http_v2_module
  --with-http_realip_module          enable ngx_http_realip_module
  --with-http_addition_module        enable ngx_http_addition_module
  --with-http_xslt_module            enable ngx_http_xslt_module
  --with-http_xslt_module=dynamic    enable dynamic ngx_http_xslt_module
  --with-http_image_filter_module    enable ngx_http_image_filter_module
  --with-http_image_filter_module=dynamic
                                     enable dynamic ngx_http_image_filter_module
  --with-http_geoip_module           enable ngx_http_geoip_module
  --with-http_geoip_module=dynamic   enable dynamic ngx_http_geoip_module
  --with-http_sub_module             enable ngx_http_sub_module
  --with-http_dav_module             enable ngx_http_dav_module
  --with-http_flv_module             enable ngx_http_flv_module
  --with-http_mp4_module             enable ngx_http_mp4_module
  --with-http_gunzip_module          enable ngx_http_gunzip_module
  --with-http_gzip_static_module     enable ngx_http_gzip_static_module
  --with-http_auth_request_module    enable ngx_http_auth_request_module
  --with-http_random_index_module    enable ngx_http_random_index_module
  --with-http_secure_link_module     enable ngx_http_secure_link_module
  --with-http_degradation_module     enable ngx_http_degradation_module
  --with-http_slice_module           enable ngx_http_slice_module
  --with-http_stub_status_module     enable ngx_http_stub_status_module

  --without-http_charset_module      disable ngx_http_charset_module
  --without-http_gzip_module         disable ngx_http_gzip_module
  --without-http_ssi_module          disable ngx_http_ssi_module
  --without-http_userid_module       disable ngx_http_userid_module
  --without-http_access_module       disable ngx_http_access_module
  --without-http_auth_basic_module   disable ngx_http_auth_basic_module
  --without-http_mirror_module       disable ngx_http_mirror_module
  --without-http_autoindex_module    disable ngx_http_autoindex_module
  --without-http_geo_module          disable ngx_http_geo_module
  --without-http_map_module          disable ngx_http_map_module
  --without-http_split_clients_module disable ngx_http_split_clients_module
  --without-http_referer_module      disable ngx_http_referer_module
  --without-http_rewrite_module      disable ngx_http_rewrite_module
  --without-http_proxy_module        disable ngx_http_proxy_module
  --without-http_fastcgi_module      disable ngx_http_fastcgi_module
  --without-http_uwsgi_module        disable ngx_http_uwsgi_module
  --without-http_scgi_module         disable ngx_http_scgi_module
  --without-http_grpc_module         disable ngx_http_grpc_module
  --without-http_memcached_module    disable ngx_http_memcached_module
  --without-http_limit_conn_module   disable ngx_http_limit_conn_module
  --without-http_limit_req_module    disable ngx_http_limit_req_module
  --without-http_empty_gif_module    disable ngx_http_empty_gif_module
  --without-http_browser_module      disable ngx_http_browser_module
  --without-http_upstream_hash_module
                                     disable ngx_http_upstream_hash_module
  --without-http_upstream_ip_hash_module
                                     disable ngx_http_upstream_ip_hash_module
  --without-http_upstream_least_conn_module
                                     disable ngx_http_upstream_least_conn_module
  --without-http_upstream_random_module
                                     disable ngx_http_upstream_random_module
  --without-http_upstream_keepalive_module
                                     disable ngx_http_upstream_keepalive_module
  --without-http_upstream_zone_module
                                     disable ngx_http_upstream_zone_module

  --with-http_perl_module            enable ngx_http_perl_module
  --with-http_perl_module=dynamic    enable dynamic ngx_http_perl_module
  --with-perl_modules_path=PATH      set Perl modules path
  --with-perl=PATH                   set perl binary pathname

  --http-log-path=PATH               set http access log pathname
  --http-client-body-temp-path=PATH  set path to store
                                     http client request body temporary files
  --http-proxy-temp-path=PATH        set path to store
                                     http proxy temporary files
  --http-fastcgi-temp-path=PATH      set path to store
                                     http fastcgi temporary files
  --http-uwsgi-temp-path=PATH        set path to store
                                     http uwsgi temporary files
  --http-scgi-temp-path=PATH         set path to store
                                     http scgi temporary files

  --without-http                     disable HTTP server
  --without-http-cache               disable HTTP cache

  --with-mail                        enable POP3/IMAP4/SMTP proxy module
  --with-mail=dynamic                enable dynamic POP3/IMAP4/SMTP proxy module
  --with-mail_ssl_module             enable ngx_mail_ssl_module
  --without-mail_pop3_module         disable ngx_mail_pop3_module
  --without-mail_imap_module         disable ngx_mail_imap_module
  --without-mail_smtp_module         disable ngx_mail_smtp_module

  --with-stream                      enable TCP/UDP proxy module
  --with-stream=dynamic              enable dynamic TCP/UDP proxy module
  --with-stream_ssl_module           enable ngx_stream_ssl_module
  --with-stream_realip_module        enable ngx_stream_realip_module
  --with-stream_geoip_module         enable ngx_stream_geoip_module
  --with-stream_geoip_module=dynamic enable dynamic ngx_stream_geoip_module
  --with-stream_ssl_preread_module   enable ngx_stream_ssl_preread_module
  --without-stream_limit_conn_module disable ngx_stream_limit_conn_module
  --without-stream_access_module     disable ngx_stream_access_module
  --without-stream_geo_module        disable ngx_stream_geo_module
  --without-stream_map_module        disable ngx_stream_map_module
  --without-stream_split_clients_module
                                     disable ngx_stream_split_clients_module
  --without-stream_return_module     disable ngx_stream_return_module
  --without-stream_set_module        disable ngx_stream_set_module
  --without-stream_upstream_hash_module
                                     disable ngx_stream_upstream_hash_module
  --without-stream_upstream_least_conn_module
                                     disable ngx_stream_upstream_least_conn_module
  --without-stream_upstream_random_module
                                     disable ngx_stream_upstream_random_module
  --without-stream_upstream_zone_module
                                     disable ngx_stream_upstream_zone_module

  --with-google_perftools_module     enable ngx_google_perftools_module
  --with-cpp_test_module             enable ngx_cpp_test_module

  --add-module=PATH                  enable external module
  --add-dynamic-module=PATH          enable dynamic external module

  --with-compat                      dynamic modules compatibility

  --with-cc=PATH                     set C compiler pathname
  --with-cpp=PATH                    set C preprocessor pathname
  --with-cc-opt=OPTIONS              set additional C compiler options
  --with-ld-opt=OPTIONS              set additional linker options
  --with-cpu-opt=CPU                 build for the specified CPU, valid values:
                                     pentium, pentiumpro, pentium3, pentium4,
                                     athlon, opteron, sparc32, sparc64, ppc64

  --without-pcre                     disable PCRE library usage
  --with-pcre                        force PCRE library usage
  --with-pcre=DIR                    set path to PCRE library sources
  --with-pcre-opt=OPTIONS            set additional build options for PCRE
  --with-pcre-jit                    build PCRE with JIT compilation support

  --with-zlib=DIR                    set path to zlib library sources
  --with-zlib-opt=OPTIONS            set additional build options for zlib
  --with-zlib-asm=CPU                use zlib assembler sources optimized
                                     for the specified CPU, valid values:
                                     pentium, pentiumpro

  --with-libatomic                   force libatomic_ops library usage
  --with-libatomic=DIR               set path to libatomic_ops library sources

  --with-openssl=DIR                 set path to OpenSSL library sources
  --with-openssl-opt=OPTIONS         set additional build options for OpenSSL

  --with-debug                       enable debug logging
```

Sesuaikan argument configure agar mirip dengan style khas install Nginx via repository Debian, seperti:

```
--sbin-path=/usr/sbin/nginx
--conf-path=/etc/nginx/nginx.conf
```

Configure.

```
cd /usr/src/nginx/nginx-release-1.19.6
auto/configure \
    --with-pcre \
    --prefix=/usr/share/nginx \
    --sbin-path=/usr/sbin/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --http-log-path=/var/log/nginx/access.log \
    --error-log-path=/var/log/nginx/error.log \
    --lock-path=/var/lock/nginx.lock \
    --pid-path=/run/nginx.pid \
    --modules-path=/usr/lib/nginx/modules \
    --http-client-body-temp-path=/var/lib/nginx/body \
    --http-fastcgi-temp-path=/var/lib/nginx/fastcgi \
    --http-proxy-temp-path=/var/lib/nginx/proxy \
    --http-scgi-temp-path=/var/lib/nginx/scgi \
    --http-uwsgi-temp-path=/var/lib/nginx/uwsgi \
    --user=www-data \
    --group=www-data \
    --with-threads \
    --with-file-aio \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_realip_module \
    --with-http_addition_module \
    --with-http_xslt_module=dynamic \
    --with-http_image_filter_module \
    --with-http_geoip_module=dynamic \
    --with-http_sub_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_mp4_module \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_auth_request_module \
    --with-http_random_index_module \
    --with-http_secure_link_module \
    --with-http_degradation_module \
    --with-http_slice_module \
    --with-http_stub_status_module \
    --without-http_charset_module \
    --with-http_perl_module \
    --with-mail=dynamic \
    --with-mail_ssl_module \
    --with-stream=dynamic \
    --with-stream_ssl_module \
    --with-stream_realip_module \
    --with-stream_geoip_module=dynamic \
    --with-stream_ssl_preread_module
```

Sebagian output:

```
checking for OpenSSL library ... not found
checking for OpenSSL library in /usr/local/ ... found
---
Configuration summary
  + using threads
  + using system PCRE library
  + using system OpenSSL library
  + using system zlib library

  nginx path prefix: "/usr/share/nginx"
  nginx binary file: "/usr/sbin/nginx"
  nginx modules path: "/usr/lib/nginx/modules"
  nginx configuration prefix: "/etc/nginx"
  nginx configuration file: "/etc/nginx/nginx.conf"
  nginx pid file: "/run/nginx.pid"
  nginx error log file: "/var/log/nginx/error.log"
  nginx http access log file: "/var/log/nginx/access.log"
  nginx http client request body temporary files: "/var/lib/nginx/body"
  nginx http proxy temporary files: "/var/lib/nginx/proxy"
  nginx http fastcgi temporary files: "/var/lib/nginx/fastcgi"
  nginx http uwsgi temporary files: "/var/lib/nginx/uwsgi"
  nginx http scgi temporary files: "/var/lib/nginx/scgi"
```

Berdasarkan output pada `./configure`, library OpenSSL ditemukan dan menggunakan path `/usr/local` yang berarti Nginx menggunakan OpenSSL versi terbaru `1.1.1h`.

```
find /usr/local -name libssl*
```

Output:

```
root@lib:/usr/src/nginx/nginx-release-1.19.6# find /usr/local -name libssl*
/usr/local/lib/libssl.a
/usr/local/lib/libssl.so.1.1
/usr/local/lib/pkgconfig/libssl.pc
/usr/local/lib/libssl.so
```

Compile dan Install.

```
make
make install
```

Verifikasi.

```
/usr/sbin/nginx -v
```

Output:

```
cd ~
root@lib:~# /usr/sbin/nginx -v
nginx version: nginx/1.19.6
```

Nginx versi `1.19.6` berhasil diinstall.

## Post Install

Lihat direktori konfigurasi.

```
root@lib:~# find /etc/nginx/
/etc/nginx/
/etc/nginx/win-utf
/etc/nginx/uwsgi_params.default
/etc/nginx/nginx.conf.default
/etc/nginx/koi-win
/etc/nginx/fastcgi.conf.default
/etc/nginx/uwsgi_params
/etc/nginx/mime.types
/etc/nginx/scgi_params.default
/etc/nginx/fastcgi.conf
/etc/nginx/mime.types.default
/etc/nginx/fastcgi_params
/etc/nginx/scgi_params
/etc/nginx/koi-utf
/etc/nginx/nginx.conf
/etc/nginx/fastcgi_params.default
```

Check file utama `/etc/nginx/nginx.conf`.

```
cat /etc/nginx/nginx.conf
```

Output:

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

Buat direktori khas style `nginx` di Debian sesuai dengan configuration diatas.

```
mkdir -p /var/lib/nginx
mkdir -p /etc/nginx/modules-available
mkdir -p /etc/nginx/modules-enabled
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled
mkdir -p /etc/nginx/conf.d
mkdir -p /etc/nginx/snippets
```

Edit file `/etc/nginx/nginx.conf`.

```
vi /etc/nginx/nginx.conf
```

Tambahkan line berikut pada directive `http`.

```
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

Preview:

```
http {
    ...
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
    ...
}
```

Disable semua directive `server`. Preview:

```
# server {
#     ...
#     listen 80;
#     ...
# }
```

Semua virtual host berada pada direktori `sites-enabled`, khas Debian.

Buat default virtual host agar melisten port 81.

```
touch /etc/nginx/sites-available/default
cd /etc/nginx/sites-enabled
ln -s ../sites-available/default default
cat > default <<- 'EOM'
server {
    listen 81;
    listen [::]:81;
    root html;
    index index.html;
    server_name _;
    location / {
        try_files $uri $uri/ =404;
    }
}
EOM
```

Tambahkan PHP Snippets.

```
cat > /etc/nginx/snippets/fastcgi-php.conf <<- 'EOM'
# regex to split $uri to $fastcgi_script_name and $fastcgi_path
fastcgi_split_path_info ^(.+\.php)(/.+)$;

# Check that the PHP script exists before passing it
try_files $fastcgi_script_name =404;

# Bypass the fact that try_files resets $fastcgi_path_info
# see: http://trac.nginx.org/nginx/ticket/321
set $path_info $fastcgi_path_info;
fastcgi_param PATH_INFO $path_info;

fastcgi_index index.php;
include fastcgi.conf;
EOM
```

Jalankan nginx.

```
nginx
```

Verifikasi.

```
curl http://localhost:81
```

## Autostart dengan System V

Agar daemon nginx auto run saat mesin hidup, kita aktifkan service nginx.

Download script init untuk Nginx.

```
mkdir -p /usr/src/github.com/Fleshgrinder/nginx-sysvinit-script
cd /usr/src/github.com/Fleshgrinder/nginx-sysvinit-script
wget -O nginx-sysvinit-script.zip https://github.com/Fleshgrinder/nginx-sysvinit-script/archive/master.zip
unzip nginx-sysvinit-script.zip
cd nginx-sysvinit-script-master/
```

Preview seluruh file tersebut sebelum eksekusi:

```
cat makefile
cat defaults
cat init
```

Isi content file `makefile`:

```
#!/bin/sh

SHELL = /bin/sh
.SUFFIXES:

DAEMON  := nginx
INIT    := /etc/init.d/$(DAEMON)
DEFAULT := /etc/default/$(DAEMON)

install:
	install -D --mode=0644 --owner=root --group=root -- ./defaults $(DEFAULT)
	install -D --mode=0755 --owner=root --group=root -- ./init $(INIT)
	update-rc.d $(DAEMON) defaults

uninstall:
	update-rc.d -f $(DAEMON) remove
	rm --force -- $(INIT) $(DEFAULT)

```

Isi content file `defaults`:

```
#!/bin/sh

# Canonical absolute path to the PID file.
#
# DEFAULT: /run/nginx.pid
#PIDFILE=/var/run/nginx.pid

# Arguments that should be passed to the daemon.
#
# DEFAULT: ''
#DAEMON_ARGS=''

# Override verbosity environment variable.
#
# DEFAULT: no
#VERBOSE=yes
```

Isi content file `init`:

```
#!/bin/sh

### BEGIN INIT INFO
# Provides:           nginx
# Required-Start:     $local_fs $remote_fs $network $syslog $named
# Required-Stop:      $local_fs $remote_fs $network $syslog $named
# Default-Start:      2 3 4 5
# Default-Stop:       0 1 6
# Short-Description:  nginx LSB init script
# Description:        nginx Linux Standards Base compliant init script.
### END INIT INFO

# ----------------------------------------------------------------------------------------------------------------------
#                                                                                                              Variables
# ----------------------------------------------------------------------------------------------------------------------

# The name of the daemon.
readonly NAME=nginx

# Arguments that should be passed to the executable.
DAEMON_ARGS=

# The path in which to search for the daemon.
readonly PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Absolute path to the PID file.
PIDFILE=$(printf -- '%s/run/%s.pid' "$([ -d /run ] || printf -- /var)" "${NAME}")

# Will be set by /lib/init/vars.sh
VERBOSE=no

# ----------------------------------------------------------------------------------------------------------------------
#                                                                                                            Error Codes
# ----------------------------------------------------------------------------------------------------------------------

readonly EC_INVALID_ARGUMENT=2
readonly EC_SUPER_USER_ONLY=4
readonly EC_DAEMON_NOT_FOUND=5
readonly EC_RELOADING_FAILED=150
readonly EC_RESTART_STOP_FAILED=151
readonly EC_RESTART_START_FAILED=152
readonly EC_START_FAILED=153
readonly EC_STOP_FAILED=154

# ----------------------------------------------------------------------------------------------------------------------
#                                                                                                              Functions
# ----------------------------------------------------------------------------------------------------------------------

# Exit the script with an error code.
die()
{
        log_end_msg $1
        exit $1
}

# End the script.
end()
{
        [ "${VERBOSE}" != no ] && log_end_msg 0
        exit 0
}

# Display failure message.
fail()
{
        log_failure_msg "${NAME}" "$1"
}

# Display informational message.
info()
{
        [ "${VERBOSE}" != no ] && log_daemon_msg "${NAME}" "$1"
}

# Display success message.
ok()
{
        [ "${VERBOSE}" != no ] && log_success_msg "${NAME}" "$1"
}

# Display warning message.
warn()
{
        log_warning_msg "${NAME}" "$1"
}

# Print usage string.
usage()
{
        printf 'Usage: %s {start|stop|restart|try-restart|reload|force-reload|status}\n' "$0"
}

###
# Check privileges of caller. This will automatically exit if the caller has insufficient privileges.
#
# RETURN:
#   0 - sufficient privileges
###
check_privileges()
{
        if [ $(id -u) -ne 0 ]
        then
                fail 'super user only!'
                die ${EC_SUPER_USER_ONLY}
        fi
}

###
# Reloads the service.
#
# RETURN:
#   0 - successfully reloaded
#   1 - reloading failed
###
reload_service()
{
        start-stop-daemon --stop --signal HUP ${SSD_OPTIONS}
}

###
# Starts the service.
#
# RETURN:
#   0 - successfully started
#   1 - starting failed
###
start_service()
{
        start-stop-daemon --start ${SSD_OPTIONS} -- ${DAEMON_ARGS}
}

###
# Stops the service.
#
# RETURN:
#   0 - successfully stopped
#   1 - stopping failed
###
stop_service()
{
        start-stop-daemon --stop --signal QUIT --retry=TERM/30/KILL/5 ${SSD_OPTIONS}
}

# ----------------------------------------------------------------------------------------------------------------------
#                                                                                                               Includes
# ----------------------------------------------------------------------------------------------------------------------

# Load the VERBOSE setting and other rcS variables plus any script defaults.
for INCLUDE in /lib/init/vars.sh /etc/default/${NAME}
        do [ -r "${INCLUDE}" ] && . "${INCLUDE}"
done

# Make all variables which are allowed to be altered by the defaults file as read-only.
readonly DAEMON_ARGS
readonly PIDFILE

# ----------------------------------------------------------------------------------------------------------------------
#                                                                                                              Bootstrap
# ----------------------------------------------------------------------------------------------------------------------

# Load the LSB log_* functions.
INCLUDE=/lib/lsb/init-functions
if [ -r "${INCLUDE}" ]
then
        . "${INCLUDE}"
else
        printf '%s: unable to load LSB functions, cannot start service.\n' "${NAME}" 1>&2
        exit ${EC_DAEMON_NOT_FOUND}
fi

# Make sure only one argument was passed to the script.
if [ $# -ne 1 ]
then
        if [ $# -lt 1 -o "$1" = '' ]
                then fail 'action not specified.'
                else fail 'too many arguments.'
        fi
        usage 1>&2
        die ${EC_INVALID_ARGUMENT}
fi
readonly ACTION="$1"

# Check if daemon is a recognized program and get absolute path.
readonly DAEMON=$(command -v "${NAME}")
if [ ! -x "${DAEMON}" ]
then
        if [ "${ACTION}" = 'stop' ]
        then
                warn 'executable not found: stop request ignored'
                end
        else
                fail "executable not found: cannot ${ACTION} service"
                die ${EC_DAEMON_NOT_FOUND}
        fi
fi

# Default options for start-stop-daemon command.
readonly SSD_OPTIONS="--quiet --oknodo --pidfile "${PIDFILE}" --exec "${DAEMON}" --name "${NAME}""

# Determine the service's status.
#
#   0 = Program is running
#   1 = Program is not running and the PID file exists.
#   2 = Program is not running and a LOCK file exists.
#   3 = Program is not running.
#   4 = Unable to determine status.
start-stop-daemon --status ${SSD_OPTIONS} 2>/dev/null 1>/dev/null
readonly STATUS=$?

# ----------------------------------------------------------------------------------------------------------------------
#                                                                                                           Handle Input
# ----------------------------------------------------------------------------------------------------------------------

case "$1" in

        # Reload the configuration, if the service is running, otherwise do nothing.
        force-reload|reload)
                if [ ${STATUS} -eq 0 ]
                then
                        info 'reloading configuration ...'
                        reload_service || die ${EC_RELOADING_FAILED}
                else
                        info 'service not running, nothing to be done.'
                fi
        ;;

        # Restart the service, if the service is already running, otherwise start the service.
        restart)
                if [ ${STATUS} -eq 0 ]
                then
                        info 'restarting service ...'
                        stop_service || die ${EC_RESTART_STOP_FAILED}
                        sleep 0.1
                fi
                start_service || die ${EC_RESTART_START_FAILED}
        ;;

        # Start the service, do nothing if it is already running.
        start)
                if [ ${STATUS} -eq 0 ]
                then
                        ok 'already started.'
                else
                        info 'starting ...'
                        start_service || die ${EC_START_FAILED}
                fi
        ;;

        # Print service status.
        #
        # This can be invoked by any user and has different exit codes:
        #   0 - running and OK
        #   1 - dead and /var/run PID file exists
        #   2 - dead and /var/lock lock file exists
        #   3 - not running
        #   4 - unknown
        status)
                status_of_proc "${DAEMON}" "${NAME}" || exit $?
        ;;

        # Stop the service, do nothing if it is already stopped.
        stop)
                if [ ${STATUS} -eq 0 ]
                then
                        info 'stopping ...'
                        stop_service || die ${EC_STOP_FAILED}
                else
                        info 'already stopped.'
                fi
        ;;

        # Restart the service, if the service is already running, otherwise do nothing.
        try-restart)
                check_privileges
                if [ ${STATUS} -eq 0 ]
                then
                        info 'restarting service ...'
                        stop_service || die ${EC_RESTART_STOP_FAILED}
                        sleep 0.1
                        start_service || die ${EC_RESTART_START_FAILED}
                else
                        info 'service not running, nothing to be done.'
                fi
        ;;

        -h|--help)
                usage
        ;;

        *)
                fail "action '${ACTION}' not recognized."
                usage 1>&2
                exit ${EC_INVALID_ARGUMENT}
        ;;

esac

end

```

Eksekusi script:

```
cd /usr/src/github.com/Fleshgrinder/nginx-sysvinit-script/nginx-sysvinit-script-master
make
```

Output:

```
root@lib:/usr/src/github.com/Fleshgrinder/nginx-sysvinit-script/nginx-sysvinit-script-master# make
install -D --mode=0644 --owner=root --group=root -- ./defaults /etc/default/nginx
install -D --mode=0755 --owner=root --group=root -- ./init /etc/init.d/nginx
update-rc.d nginx defaults
update-rc.d: using dependency based boot sequencing
```

Verifikasi:

```
ls -lah /etc/rc*.d | grep nginx
```

Output:

```
root@lib:~# ls -lah /etc/rc*.d | grep nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:15 K01nginx -> ../init.d/nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:15 K01nginx -> ../init.d/nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:19 S03nginx -> ../init.d/nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:19 S03nginx -> ../init.d/nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:19 S03nginx -> ../init.d/nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:19 S03nginx -> ../init.d/nginx
lrwxrwxrwx  1 root root   15 Nov 23 12:15 K01nginx -> ../init.d/nginx
```

Test dengan reboot.

```
init 6
```

Setelah reboot, verifikasi daemon nginx.

```
ps aux | grep nginx
```

Output:

```
root@lib:~# ps aux | grep nginx
root       558  0.0  0.0  68592  1636 ?        Ss    2021   0:00 nginx: master process /usr/sbin/nginx
www-data   559  0.0  0.0  69032  4804 ?        S     2021   0:00 nginx: worker process
root      1225  0.0  0.0   6128   396 pts/4    S+    2021   0:00 grep nginx
```

## Kesimpulan

Aplikasi `nginx` versi `1.19.6`. berhasil di-install dan service berhasil dibuat.

Nginx **berhasil** mendengar port 81.

## Reference

Google Query: "install nginx from source debian", "nginx-sysvinit-script",

http://nginx.org/en/docs/configure.html

https://tylersguides.com/guides/installing-nginx-from-source-on-debian-stretch/

https://www.nginx.com/resources/wiki/start/topics/examples/initscripts/

https://github.com/Fleshgrinder/nginx-sysvinit-script

https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#prebuilt_debian

https://www.digitalocean.com/community/tutorials/how-to-configure-a-linux-service-to-start-automatically-after-a-crash-or-reboot-part-1-practical-examples

https://geekflare.com/how-to-auto-start-services-on-boot-in-linux/
