---
title: Update Drupal 8 secara manual melalui CLI
slug: /blog/2018/11/06/update-drupal-8-manual-cli/
date: 2018-11-06
---

## Gerak Cepat

Download Drupal 8 terbaru.

```
wget https://ftp.drupal.org/files/projects/drupal-8.6.2.tar.gz
```

Extract.

```
tar xvfz drupal-8.6.2.tar.gz
```

Copy ke root Drupal.

```
cd drupal-8.6.2/
find . -maxdepth 1 -exec sh -c 'cp -rf $0 -t /var/www/drupal8' {} \;
```

Delete.

```
cd ..
rm -rf drupal-8.6.2
```

## Finish

Drupal berhasil diupdate secara manual. Selanjutnya jalankan script ```update.php``` melalui browser.