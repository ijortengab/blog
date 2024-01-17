---
title: Migrasi Static Generator Blog dari Sculpin ke Gatsby
tags:
  - sculpin
  - gatsby
---

## Pendahulan

Tulisan ini mencatat tahapan migrasi penggunaaan static generator dari `Sculpin` menjadi
`Gatsby`.

## Persiapan Repository

Melalui Github, alamat repository blog di-rename dari `ijortengab/ijortengab.id` menjadi `ijortengab/blog`.

Clone remote repository ke local machine.

```
mkdir -p ~/github.com/ijortengab
cd ~/github.com/ijortengab
git clone git@github.com:ijortengab/blog
cd blog
```

Kondisi commit saat ini berada pada:

```
git log --oneline | head -1
```

```
2e97d38 Update content 2022-06-16.
```

Rename branch saat ini dari `master` ke `sculpin`.

```
git branch -M master sculpin
```

Buat branch baru `master`, dan hapus semua file kecuali post content.

```
git switch -c master
rm -rf *
git restore sculpin/source/_posts/
git restore sculpin/source/embed/
git restore log/
```

Commit perubahan penghapusan massal dan update ke `origin`.

```
git add .
git commit -m "Delete all except content."
git push origin master
```

## Persiapan Gatsby

Clone starter gatsby.

```
cd /tmp
gatsby new blog https://github.com/LekoArts/gatsby-starter-minimal-blog
cd blog
```

Hapus content blog sample.

```
rm -rf content/posts/*
```

## Inject metadata slug dan date.

Kita buat script PHP `gak-pake-lama.php` untuk menginject informasi `slug` dan `date`.

{% verbatim %}
```
#!/usr/bin/env php
<?php
// @filename: gak-pake-lama.php
// @date: 2023-01-08 06:07:22
$current_dir = $_SERVER['PWD'];
$list = array_diff(scandir($current_dir), ['.','..']);
foreach ($list as $file) {
    if (preg_match('/\.md$/', $file)) {
        preg_match('/(\d+)-(\d+)-(\d+)-(.*)\.md/', $file, $matches);
        if (isset($matches['4'])) {
            $string_date = $matches['1'].'-'.$matches['2'].'-'.$matches['3'];
            $string_slug = '/blog/'.$matches['1'].'/'.$matches['2'].'/'.$matches['3'].'/'.$matches['4'].'/';
            $lines = file($file, FILE_IGNORE_NEW_LINES);
            $two_first = array_slice($lines, 0, 2);
            $third_until_end = array_slice($lines, 2);
            $lines_new = array_merge(
                $two_first,
                [
                    'slug: '. $string_slug,
                    'date: '. $string_date,
                ],
                $third_until_end,
            );
            file_put_contents($current_dir.'/'.$file, implode("\n", $lines_new));
            echo $file." (Success)\n";
        }
        else {
            echo $file." (Skipped)\n";
        }
    }
    else {
        echo $file." (Skipped)\n";
    }
}
```
{% endverbatim %}

Taruh file di PATH, dan pastikan dapat di execute:

```
sudo su
```

```
touch /usr/local/bin/gak-pake-lama.php
chmod a+x /usr/local/bin/gak-pake-lama.php
vi /usr/local/bin/gak-pake-lama.php
```

```
exit
```

Eksekusi.

```
cd ~/github.com/ijortengab/blog/sculpin/source/_posts/
gak-pake-lama.php
```

## Develop dan Troubleshooting

Start gatsby develop.

```
cd /tmp/blog
gatsby develop --verbose
```

Kita cicil satu per satu tiap file blog, apakah terjadi error atau tidak.

```
cd ~/github.com/ijortengab/blog/sculpin/source/_posts/
mv $(ls | head -1) -t /tmp/blog/content/posts
```

atau gunakan watch:

```
cd ~/github.com/ijortengab/blog/sculpin/source/_posts/
watch -n 5 'mv $(ls | head -1) -t /tmp/blog/content/posts'
```

Jika ditemukan error, kembalikan file pada direktori asal.

```
cd ~/github.com/ijortengab/blog/sculpin/source/_posts/
mv /tmp/blog/content/posts/$(ls /tmp/blog/content/posts | tail -1) -t .
```

## Error dan Solusinya

Terdapat error pada file `2017-01-28-windows-rasa-linux-cygwin-openssh-server.md`.

```
Expected a closing tag for `<hostname>` (97:39-97:49) before the end of `paragraph`
```

Perlu kita jadikan sebagai code block. Preview:

{% verbatim %}
```
sed -e '107i ```' -e '88i ```' 2017-01-28-windows-rasa-linux-cygwin-openssh-server.md
```
{% endverbatim %}

Eksekusi:

{% verbatim %}
```
sed -e '107i ```' -e '88i ```' -i 2017-01-28-windows-rasa-linux-cygwin-openssh-server.md
```
{% endverbatim %}

Terdapat metadata `date` yang double:

{% verbatim %}
```
grep -rn -E '^date: ....-..-.. ..:..'
```
{% endverbatim %}

Preview hasil pada satu file.

{% verbatim %}
```
sed -e "/date: ....-..-.. ..:../d" 2015-04-19-path-cli.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l -E 'date: ....-..-.. ..:..' | while IFS= read line; do \
    sed -e "/date: ....-..-.. ..:../d" -i "$line"
done
```
{% endverbatim %}

Terdapat karakter Twig yang bentrok dengan JSX.

{% verbatim %}
```
grep -rn '%\s.*verbatim\s%'
```
{% endverbatim %}

Preview hasil pada satu file.

{% verbatim %}
```
sed -e "/%\s.*verbatim\s%/d" 2017-05-26-pathinfo-class-request-sederhana.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l '%\s.*verbatim\s%' | while IFS= read line; do \
    sed -e "/%\s.*verbatim\s%/d" -i "$line"
done
```
{% endverbatim %}

Terdapat kesalahan pada link.

```
grep -rn -E '<http[^>]+>'
```

Preview hasil pada satu file.

{% verbatim %}
```
sed -E 's|<http([^>]+)>|http\1|g' 2017-04-11-install-drupal-8-vps.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l -E '<http[^>]+>' | while IFS= read line; do \
    sed -E 's|<http([^>]+)>|http\1|g' -i "$line"
done
```
{% endverbatim %}

Attribute HTML `cloudinary` yang dimanipulasi dengan javascript, untuk sementara diubah menjadi absolute path.

```
grep -rn -E 'cloudinary="([^"]+)"'
```

Preview hasil pada satu file.

{% verbatim %}
```
sed -E 's|cloudinary="([^"]+)"|src="https://res.cloudinary.com/ijortengab/image/upload/v1/\1"|g' \
    2017-07-21-hapus-password-windos-7.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l -E 'cloudinary="([^"]+)"' | while IFS= read line; do \
    sed -E 's|cloudinary="([^"]+)"|src="https://res.cloudinary.com/ijortengab/image/upload/v1/\1"|g' -i "$line"
done
```
{% endverbatim %}

Link screenshot yang juga dimanipulasi dengan javascript, untuk sementara dikembalikan menjadi absolute path.

{% verbatim %}
```
grep -rn -E '\(image://ijortengab\.id/[^)]+\)'
```
{% endverbatim %}

Preview hasil pada satu file.

{% verbatim %}
```
sed -E "s|\(image://ijortengab\.id/([^)]+)\)|(https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/\1)|g" \
    2017-08-25-vm-install-ubuntu-server-16-04.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l -E '\(image://ijortengab\.id/[^)]+\)' | while IFS= read line; do \
    sed -E "s|\(image://ijortengab\.id/([^)]+)\)|(https://res.cloudinary.com/ijortengab/image/upload/v1/ijortengab.id/\1)|g" -i "$line"
done
```
{% endverbatim %}

Tag HTML `<img>` memerlukan penutup.

{% verbatim %}
```
grep -rn -E '<img[^>]+>'
```
{% endverbatim %}

Preview hasil pada satu file.

{% verbatim %}
```
sed -E 's|<img([^>]+)>|<img\1></img>|g' 2017-05-03-putty-keepalive.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l -E '<img[^>]+>' | while IFS= read line; do \
    sed -E 's|<img([^>]+)>|<img\1></img>|g' -i "$line"
done
```
{% endverbatim %}

Attribute `style` pada tag `img` mengakibatkan error sbb:

{% verbatim %}
```
The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.
```
{% endverbatim %}

Kita hapus saja.

{% verbatim %}
```
grep -E -rn ' style="[^"]+"'
```
{% endverbatim %}

Preview hasil pada satu file.

{% verbatim %}
```
sed -E 's| style="[^"]+"||g' 2017-08-12-recovery-data-hdd-testdisk.md
```
{% endverbatim %}

Eksekusi massal.

{% verbatim %}
```
grep -r -l -E ' style="[^"]+"' | while IFS= read line; do \
    sed -E 's| style="[^"]+"||g' -i "$line"
done
```
{% endverbatim %}

Hapus character Carriage Return (CR).

```
cat -v 2015-04-09-thinkpad-x220.md
```

Preview hasil pada satu file.

```
cat 2015-04-09-thinkpad-x220.md | sed 's/\r$//' | cat
```

Eksekusi massal.

{% verbatim %}
```
ls | while IFS= read line; do
    sed 's/\r$//' -i "$line"
done
```
{% endverbatim %}

## Commit content

Direktori local repository berada pada path:

```
~/github.com/ijortengab/blog
```

Direktori repository Gatsby temporary berada pada path:

```
/tmp/blog
```

Kita kembalikan seluruh file static generator dari temporary ke local repository.

```
cp -f /tmp/blog/.gitignore -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/.npmrc -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/.nvmrc -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/CHANGELOG.md -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/LICENSE -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/README.md -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/gatsby-config.ts -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/gatsby-ssr.tsx -t ~/github.com/ijortengab/blog
cp -f /tmp/blog/package.json -t ~/github.com/ijortengab/blog
cp -rf /tmp/blog/content -t ~/github.com/ijortengab/blog
cp -rf /tmp/blog/src -t ~/github.com/ijortengab/blog
cp -rf /tmp/blog/static -t ~/github.com/ijortengab/blog
```

Pindahkan `embed` dan `log` ke `static`.

```
cd ~/github.com/ijortengab/blog
mv sculpin/source/embed/ -t static/
mv log/ -t static/
```

Build.

```
cd ~/github.com/ijortengab/blog
npm install
gatsby build --verbose
```

Commit pada content.

```
git add content/posts/
git add sculpin/source/_posts
git add log/
git add static/log/
git add sculpin/source/embed
git add static/embed/
git commit -m "Move and edit content."
```

Commit file lainnya.

```
git add .
git commit -m "Copy file from LekoArts/gatsby-starter-minimal-blog."
```

Push ke https://github.com/ijortengab/blog

```
git push origin master
```

## Publish ke server

Preview.

```
rsync -n -avr \
    ~/github.com/ijortengab/blog/public/ \
    server:/var/www/project/ijortengab.my.id/web/
```

Upload.

```
rsync -avr \
    ~/github.com/ijortengab/blog/public/ \
    server:/var/www/project/ijortengab.my.id/web/
```
