IjorTengab dot id
=====================

This repository is source code of ijortengab dot id. 

Backup of `/var/www/ijortengab.id`.

Static Generator by [Sculpin][1].

[1]: https://sculpin.io

## Cara Kerja

1. Offline dulu Online kemudian.

- Bikin blog offline via localhost.
- Generate.
- Lihat hasil secara offline.
- Git pull, git push dari localhost.
- Rsync file static dari localhost.

2. Online dulu offline kemudian.

- Bikin blog online via server.
- Generate.
- Lihat hasil secara online.
- Git pull, git push dari server.
- Rsync file static dari localhost.

## Catatan

- Github berfungsi untuk backup.
- File static tidak perlu dibackup ke Github. Oper dengan rsync.
- File static berlokasi di `/static`, `/tools`, `/log`.
