---
title: Kembali ke Sculpin dari Gatsby
tags:
  - sculpin
  - gatsby
---

## Pendahulan

Mempelajari Gatsby membutuhkan effort yang besar. Akhirnya kembali ke `Sculpin`.

Gatsby yang dianggap menjadi masa depan SSG (Static Site Generator) pun
mengalami pegembangan yang stagnan.

[Is Gatsby discontinued? Please upvote for clarification](https://github.com/gatsbyjs/gatsby/issues/38696)

Terlalu berat juga complicated untuk sebuah website sederhana.

Tulisan ini mencatat tahapan migrasi penggunaaan static generator dari `Gatsby`
kembali menjadi `Sculpin`.

## Persiapan Repository

Repository berada pada URL: `https://github.com/ijortengab/blog`.

Local workstation berada pada path: `~/github.com/ijortengab/blog`.

Kondisi commit saat ini berada pada:

```sh
git log --oneline
```

```plaintext
36d5536 (HEAD -> master, origin/master, origin/HEAD) Merge pull request #6 from ijortengab/dependabot/npm_and_yarn/gatsby-5.9.1
...
2e97d38 (origin/sculpin, sculpin) Update content 2022-06-16.
```

Rename branch saat ini dari `master` ke `gatsby`.

```sh
git branch -M master gatsby
```

Buat branch baru `master`.

```sh
git switch -c master
```

Hapus semua file kecuali post content.

```sh
rm -rf *
git restore content/posts/
```

Preview sebelum commit.

```sh
git add .
git status
```

Commit perubahan penghapusan massal dan update ke `origin`.

```sh
git commit -m "Delete all except content."
git push origin master
```

Checkout ke commit ketika masih masih menggunakan sculpin.

```sh
git checkout 2e97d38
```

Check isi direktori.

```sh
git ls-files
```

Kita selamatkan content lama sebelum modifikasi gatsby.

```sh
mkdir tmp
cp -r sculpin/source/_posts/* tmp/
```

Kembali ke HEAD.

```sh
git switch -
```

Move force postingan format lama Sculpin.

```sh
mv -f tmp/* -t content/posts/
rmdir tmp/
```

Commit.

```sh
git add .
git commit -m "Revert content to Sculpin format."
```

Kita jadikan repository ini khusus content dengan format direktori Tahun sebagai
container post:

```plaintext
/YYYY/MM-DD-title.md
```

Nantinya repostory ini akan menjadi submodule dari repository utama.

Persiapan moving:

```sh
find content/posts/ -type f
```

```sh
while read line; do echo "$line"; done <<< `find content/posts/ -type f`
```

```sh
while read line; do
    basename=$(basename "$line")
    echo "$basename";
done <<< `find content/posts/ -type f`
```

```sh
while read line; do
    basename=$(basename "$line")
    year=$(cut -d- -f1 <<< "$basename")
    echo "$year";
    other=$(grep -o -P ^"$year"'-\K(.*)' <<< "$basename")
    echo "$other";
done <<< `find content/posts/ -type f`
```

Code hampir berhasil, bersiap eksekusi:

```sh
while read line; do
    basename=$(basename "$line")
    year=$(cut -d- -f1 <<< "$basename")
    other=$(grep -o -P ^"$year"'-\K(.*)' <<< "$basename")
    echo mkdir -p "$year"
    echo mv "$line" "$year"/"$other"
done <<< `find content/posts/ -type f`
```

Eksekusi:

```sh
while read line; do
    basename=$(basename "$line")
    year=$(cut -d- -f1 <<< "$basename")
    other=$(grep -o -P ^"$year"'-\K(.*)' <<< "$basename")
    mkdir -p "$year"
    mv "$line" "$year"/"$other"
done <<< `find content/posts/ -type f`
```

Cleaning.

```sh
find -type d -empty -delete
```

Preview sebelum commit.

```sh
git add .
git status
```

Commit perubahan struktur direktori.

```sh
git commit -m "Ubah format direktori post agar lebih rapih dan bisa dibaca Sculpin."
git push origin master
```

## Persiapan Repository Tambahan

Kunjungi https://github.com/sculpin/sculpin-blog-skeleton.

Fork.

Kita memiliki repository baru:

```plaintext
https://github.com/ijortengab/sculpin-blog-skeleton
```

Clone ke local.

```sh
cd
mkdir -p github.com/ijortengab
cd github.com/ijortengab
git clone git@github.com:ijortengab/sculpin-blog-skeleton
cd sculpin-blog-skeleton
```

Kita perlu kembali ke era-nya Bootstrap 3.

Setelah diperiksa, berada di commit `417c995` (417c99524b700073d5cc90188fff3e710583b6cd).

Kita reset saja.

```sh
git reset 417c995 --hard
```

Kita test development.

```sh
rm composer.lock
composer update
php vendor/bin/sculpin generate --server --watch
```

Buka browser http://localhost:8000/ dan hasilnya berantakan. Terminate dan ulangi.

Kita perbaiki:

```sh
cd source
ln -s ../vendor/components/
cd ..
php vendor/bin/sculpin generate --server --watch
```

Buka browser http://localhost:8000/ dan hasilnya berhasil.

Kita test dengan settingan lama dari repository `blog` saat branch sculpin.

Kita kembali ke repository blog.

```sh
cd ~/github.com/ijortengab/blog
git checkout 2e97d38
```

Copy seluruh isi direktori sculpin.

```sh
cp -rf sculpin/* ~/github.com/ijortengab/sculpin-blog-skeleton/
```

Kembali.

```sh
git switch -
```

Kembali ke repository sculpin.

```sh
cd ~/github.com/ijortengab/sculpin-blog-skeleton
```

Test prod.

```sh
php vendor/bin/sculpin generate --server --watch --env=prod
```

Buka browser http://localhost:8000/ dan hasilnya berhasil.

Terminate.

Kita hapus Folder post.

```sh
rm -rf source/_posts/
```

Preview sebelum commit.

```sh
git add .
git status
```

Commit.

```sh
git commit -m "Update 2024. Hapus direktori source/_posts"
```

## Git Submodule

Kembali ke repository `sculpin-blog-skeleton`.

```sh
cd ~/github.com/ijortengab/sculpin-blog-skeleton
```

Tambahkan git submodule.

git submodule add git@github.com:ijortengab/blog source/_posts

Preview sebelum commit.

```sh
git status
```

Commit.

```sh
git commit -m "Menambah module di direktori source/_posts."
```

Push.

```sh
git push origin master
```

Gagal. Sebelumnya kita sudah reset hard. Ulangi.

```sh
git push origin master -f
```

Test lagi.

```sh
php vendor/bin/sculpin generate --server --watch --env=prod
```

Ada error pada file `01-14-migrasi-static-generator-blog-dari-sculpin-ke-gatsby.md`

Kita kasih tag `verbatim` ke seluruh code agar Twig tidk perlu memproses code.

Test lagi.

```sh
php vendor/bin/sculpin generate --server --watch --env=prod
```

Output:

```plaintext
Detected new or updated files
Generating: 100% (421 sources / 0.04 seconds)
Converting: 100% (461 sources / 0.69 seconds)
Formatting: 100% (461 sources / 0.14 seconds)
Processing completed in 1.27 seconds
Starting Sculpin server for the prod environment with debug false
Development server is running at http://localhost:8000
Quit the server with CONTROL-C.
```

Berhasil.

## Penutup

Blog sudah kita kembalikan ke Sculpin.

Repository kita pisah jadi dua: `blog`, dan `sculpin-blog-skeleton`.
