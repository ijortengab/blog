# Synchronize database MySQL - Gak Pake Lama


## Latar Belakang

Synchronize database MySQL didapat dengan cara dump dan restore. Dump 
menggunakan command `mysqldump > file` sementara restore menggunakan command 
`mysql < file`. 

Untuk memindahkan file hasil dump bisa menggunakan command `scp` atau `rsync` 
yang berjalan menggunakan `ssh` protokol.

## Pertanyaan

Bagaimanakah cara cepat gak pake lama untuk synchronize database antara
remote dan local hanya dengan satu eksekusi command?

## Gerak Cepat

Buat tiga file di dalam satu direktori dan berikan mode execute `chmod u+x`. 
Isi file tersedia pada lampiran.

- mysqldump.sh

- pull-db.sh

- push-db.sh

File dapat di download menggunakan command berikut:

```
wget https://git.io/vAfel -O mysqldump.sh
wget https://git.io/vAfeH -O pull-db.sh && chmod u+x pull-db.sh
wget https://git.io/vAfeQ -O push-db.sh && chmod u+x push-db.sh

```

Pastikan file-file tersebut diedit dan sesuaikan variable dengan kondisi aktual.

Untuk synchronize dari database remote ke local, cukup eksekusi command 
`./pull-db.sh`. 

Untuk synchronize dari database local ke remote, cukup eksekusi command 
`./push-db.sh`.

Untuk kenyamanan, [hindari menggunakan password][1] saat koneksi `ssh`. 

Script telah [mendukung koneksi ssh tunnel][2] dengan menyediakan variable port. 

## Lampiran

Source: https://gist.github.com/ijortengab/c711165abedd91b2da2d59455defca34

File: mysqldump.sh

```
#!/bin/bash
# Filename: mysqldump.sh
# Author: IjorTengab (http://ijortengab.id)
# Last Update: 2018-02-07
#
# Variables. Set by your own value.
HOST=
USER=
PASSWORD=
DATABASE=
DUMPFILENAME=
IGNORED_TABLES_STRING=
echo > ${DUMPFILENAME}
mysqldump --host=${HOST} --replace --skip-set-charset --lock-tables=false --skip-add-locks --skip-add-drop-table --create-options --user=${USER} --password=${PASSWORD} --single-transaction --no-data ${DATABASE} >> ${DUMPFILENAME}
sed -i 's/CREATE TABLE/CREATE TABLE IF NOT EXISTS/g' ${DUMPFILENAME}
mysqldump --host=${HOST} --replace --skip-set-charset --lock-tables=false --skip-add-locks --user=${USER} --password=${PASSWORD} ${DATABASE} --no-create-info ${IGNORED_TABLES_STRING} >> ${DUMPFILENAME}
```

File: pull-db.sh

```
#!/bin/bash
# Filename: pull-db.sh
# Author: IjorTengab (http://ijortengab.id)
# Last Update: 2018-02-07
#
# Variables. Set by your own value.
REMOTE_SSH_HOST=127.0.0.1
REMOTE_SSH_PORT=22
REMOTE_SSH_USER=sirip
REMOTE_MYSQL_HOST=localhost
REMOTE_MYSQL_USER=sirip
REMOTE_MYSQL_PASSWORD=we1Loh0aeP4eeChail3o
REMOTE_MYSQL_DATABASE=sirip
REMOTE_MYSQL_TABLE_PREFIX=systemix_
REMOTE_MYSQL_EXCLUDED_TABLES=(
    sessions
    node
    field_data_body
    field_revision_body
    watchdog
)
LOCAL_MYSQL_HOST=localhost
LOCAL_MYSQL_PASSWORD=meeR7ook
LOCAL_MYSQL_USER=kppri
LOCAL_MYSQL_DATABASE=kppri
# Build Additional Variables
NOW=$(date +%Y%m%d%H%M%S)
DUMPFILENAME=${REMOTE_MYSQL_DATABASE}-${NOW}.sql
SCP_OPTION=Port=${REMOTE_SSH_PORT}
IGNORED_TABLES_STRING=''
for TABLE in "${REMOTE_MYSQL_EXCLUDED_TABLES[@]}"
do :
   IGNORED_TABLES_STRING+=" --ignore-table=${REMOTE_MYSQL_DATABASE}.${REMOTE_MYSQL_TABLE_PREFIX}${TABLE}"
done
if [[ "$(command -v pwgen)" != '' ]]; then
  SHELL_AGENT=$(pwgen -1 25).sh
else
  SHELL_AGENT=${NOW}${NOW}${NOW}.sh
fi
SSH_EXEC=\'./${SHELL_AGENT}\'
# Create script untuk dump database remote.
touch $SHELL_AGENT
chmod u+x $SHELL_AGENT
echo #!/bin/bash >> $SHELL_AGENT
echo echo Mulai dump database remote. >> $SHELL_AGENT
cat mysqldump.sh >> $SHELL_AGENT
sed -i "s/^PASSWORD=/PASSWORD='$REMOTE_MYSQL_PASSWORD'/g" ${SHELL_AGENT}
sed -i "s/^HOST=/HOST='$REMOTE_MYSQL_HOST'/g" ${SHELL_AGENT}
sed -i "s/^USER=/USER='$REMOTE_MYSQL_USER'/g" ${SHELL_AGENT}
sed -i "s/^DATABASE=/DATABASE='$REMOTE_MYSQL_DATABASE'/g" ${SHELL_AGENT}
sed -i "s/^DUMPFILENAME=/DUMPFILENAME='$DUMPFILENAME'/g" ${SHELL_AGENT}
sed -i "s/^IGNORED_TABLES_STRING=/IGNORED_TABLES_STRING='$IGNORED_TABLES_STRING'/g" ${SHELL_AGENT}
echo echo Selesai dump database remote. >> $SHELL_AGENT
scp -q -o $SCP_OPTION ${SHELL_AGENT} ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}:${SHELL_AGENT}
rm $SHELL_AGENT
ssh ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST} -p ${REMOTE_SSH_PORT} $SSH_EXEC
# Pull SQL file.
echo Menarik file SQL dari remote ke local.
scp -o $SCP_OPTION ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}:${DUMPFILENAME} ${DUMPFILENAME}
# Delete SQL file in remote.
touch $SHELL_AGENT
chmod u+x $SHELL_AGENT
echo #!/bin/bash >> $SHELL_AGENT
echo rm ${DUMPFILENAME} >> $SHELL_AGENT
echo rm $SHELL_AGENT >> $SHELL_AGENT
scp -q -o $SCP_OPTION ${SHELL_AGENT} ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}:${SHELL_AGENT}
rm ${SHELL_AGENT}
ssh ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST} -p ${REMOTE_SSH_PORT} $SSH_EXEC
# Restore database ke local.
echo Mulai restore database local.
mysql -u ${LOCAL_MYSQL_USER} -p${LOCAL_MYSQL_PASSWORD} ${LOCAL_MYSQL_DATABASE} < $DUMPFILENAME
echo Selesai restore database local.
rm ${DUMPFILENAME}

```

File: push-db.sh

```
#!/bin/bash
# Filename: push-db.sh
# Author: IjorTengab (http://ijortengab.id)
# Last Update: 2018-02-07
#
# Variables. Set by your own value.
REMOTE_SSH_HOST=127.0.0.1
REMOTE_SSH_PORT=22
REMOTE_SSH_USER=sirip
REMOTE_MYSQL_HOST=localhost
REMOTE_MYSQL_USER=sirip
REMOTE_MYSQL_PASSWORD=we1Loh0aeP4eeChail3o
REMOTE_MYSQL_DATABASE=sirip
LOCAL_MYSQL_HOST=localhost
LOCAL_MYSQL_PASSWORD=meeR7ook
LOCAL_MYSQL_USER=kppri
LOCAL_MYSQL_DATABASE=kppri
LOCAL_MYSQL_TABLE_PREFIX=systemix_
LOCAL_MYSQL_EXCLUDED_TABLES=(
    sessions
    node
    field_data_body
    field_revision_body
    watchdog
)
# Build Additional Variables
NOW=$(date +%Y%m%d%H%M%S)
DUMPFILENAME=${LOCAL_MYSQL_DATABASE}-${NOW}.sql
SCP_OPTION=Port=${REMOTE_SSH_PORT}
IGNORED_TABLES_STRING=''
for TABLE in "${LOCAL_MYSQL_EXCLUDED_TABLES}[@]"
do :
   IGNORED_TABLES_STRING+=" --ignore-table=${LOCAL_MYSQL_DATABASE}.${LOCAL_MYSQL_TABLE_PREFIX}${TABLE}"
done
if [[ "$(command -v pwgen)" != '' ]]; then
  SHELL_AGENT=$(pwgen -1 25).sh
else  
  SHELL_AGENT=${NOW}${NOW}${NOW}.sh
fi
SSH_EXEC=\'./${SHELL_AGENT}\'
# Create script untuk dump database local.
touch $SHELL_AGENT
chmod u+x $SHELL_AGENT
echo #!/bin/bash >> $SHELL_AGENT
echo echo Mulai dump database local. >> $SHELL_AGENT
cat mysqldump.sh >> $SHELL_AGENT
sed -i "s/^PASSWORD=/PASSWORD='$LOCAL_MYSQL_PASSWORD'/g" ${SHELL_AGENT}
sed -i "s/^HOST=/HOST='$LOCAL_MYSQL_HOST'/g" ${SHELL_AGENT}
sed -i "s/^USER=/USER='$LOCAL_MYSQL_USER'/g" ${SHELL_AGENT}
sed -i "s/^DATABASE=/DATABASE='$LOCAL_MYSQL_DATABASE'/g" ${SHELL_AGENT}
sed -i "s/^DUMPFILENAME=/DUMPFILENAME='$DUMPFILENAME'/g" ${SHELL_AGENT}
sed -i "s/^IGNORED_TABLES_STRING=/IGNORED_TABLES_STRING='$IGNORED_TABLES_STRING'/g" ${SHELL_AGENT}
echo echo Selesai dump database local. >> $SHELL_AGENT
./$SHELL_AGENT
# Push SQL file.
echo Mendorong file SQL dari local ke remote.
scp -o $SCP_OPTION ${DUMPFILENAME} ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}:${DUMPFILENAME}
# Delete SQL file in local.
rm ${DUMPFILENAME}
# Restore database ke remote.
rm $SHELL_AGENT
touch $SHELL_AGENT
chmod u+x $SHELL_AGENT
echo #!/bin/bash >> $SHELL_AGENT
echo echo Mulai restore database remote. >> $SHELL_AGENT
echo mysql -u ${REMOTE_MYSQL_USER} -p${REMOTE_MYSQL_PASSWORD} ${REMOTE_MYSQL_DATABASE} \< $DUMPFILENAME >> $SHELL_AGENT
echo echo Selesai restore database remote. >> $SHELL_AGENT
echo rm ${DUMPFILENAME} >> $SHELL_AGENT
echo rm $SHELL_AGENT >> $SHELL_AGENT
scp -q -o $SCP_OPTION ${SHELL_AGENT} ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST}:${SHELL_AGENT}
rm ${SHELL_AGENT}
ssh ${REMOTE_SSH_USER}@${REMOTE_SSH_HOST} -p ${REMOTE_SSH_PORT} $SSH_EXEC

```

## Reference

[1]: /blog/2017/09/14/ssh-key-server-2/

[2]: /blog/2018/01/26/mengirim-file-ke-server-di-balik-reverse-proxy-dengan-ssh-tunnel/

<https://stackoverflow.com/questions/425158/skip-certain-tables-with-mysqldump>
