---
title: Menampilkan Isi Dua File Bersisian Secara Command Line
---

## Pendahuluan

Dua file konfigurasi, file yang satu merupakan duplikat dari file yang lain untuk dibuat versi modifikasinya.

Saat bekerja dengan terminal, kita perlu menampilkan kedua file tersebut secara bersisian (*side-by-side*).

Tulisan ini akan membuat cara efektif untuk **manampilkan** dan **membandingkan** dua file bersisian di dalam terminal (*command line interface*).

## Persiapan

Isi file `a.txt`

```
a
b
c
d
e
```

Isi file `b.txt`:

```
a
B
c
D
e
F
g
H
i
J
```

Isi file `c.txt`:

```
1
12
123
1234
12345
123456
1234567
12345678
123456789
```

Isi file `d.txt`:

```
123456789
12345678
1234567
123456
12345
1234
123
12
1
```

## Menampilkan - Versi Sederhana

Cara sederhana adalah dengan command `paste`.

Contoh ke-1:

```
paste a.txt b.txt
```

Output:

```
a       a
b       B
c       c
d       D
e       e
        F
        g
        H
        i
        J
```

Contoh ke-1 (reverse):

```
paste b.txt a.txt
```

Output:

```
a       a
B       b
c       c
D       d
e       e
F
g
H
i
J
```

Contoh ke-2:

```
paste c.txt d.txt
```

Output:

```
1       123456789
12      12345678
123     1234567
1234    123456
12345   12345
123456  1234
1234567 123
12345678        12
123456789       1
```

Contoh ke-2 (reverse):

```
paste d.txt c.txt
```

Output:

```
123456789       1
12345678        12
1234567 123
123456  1234
12345   12345
1234    123456
123     1234567
12      12345678
1       123456789
```

Catatan:

Command `paste` bekerja dengan baik pada contoh ke-1, tapi tidak sesuai ekspektasi pada contoh ke-2.

Command `paste` memisah baris dengan karakter tab yang identik dengan 8 spasi.

## Menampilkan - Versi Paste AWK

Kombinasi `paste` dan `awk` bisa digunakan untuk memperbaiki kelemahan cara sederhana pada `paste` diatas.

Contoh ke-1:

```
paste a.txt b.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {printf ("%-*s || %s\n", max1, col1[i], col2[i])}
}'
```

Output:

```
a || a
b || B
c || c
d || D
e || e
  || F
  || g
  || H
  || i
  || J
```

Contoh ke-1 (reverse):

```
paste b.txt a.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {printf ("%-*s || %s\n", max1, col1[i], col2[i])}
}'
```

Output:

```
a || a
B || b
c || c
D || d
e || e
F ||
g ||
H ||
i ||
J ||
```

Contoh ke-2:

```
paste c.txt d.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {printf ("%-*s%s%s\n", max1, col1[i], "    ||    " ,col2[i])}
}'
```

Output:

```
1            ||    123456789
12           ||    12345678
123          ||    1234567
1234         ||    123456
12345        ||    12345
123456       ||    1234
1234567      ||    123
12345678     ||    12
123456789    ||    1
```

Contoh ke-2 (reverse):

```
paste d.txt c.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {printf ("%-*s%s%s\n", max1, col1[i], "    ||    " ,col2[i])}
}'
```

Output:

```
123456789    ||    1
12345678     ||    12
1234567      ||    123
123456       ||    1234
12345        ||    12345
1234         ||    123456
123          ||    1234567
12           ||    12345678
1            ||    123456789
```

Catatan:

Pemisah antar baris bisa diubah sesuai kebutuhan, misalnya ` || `.

Gunakan contoh ke-2 jika pemisah terdapat lebih dari satu spasi berdempetan.

## Menampilkan - Versi Paste SED

Kombinasi `paste` dan `sed` bisa digunakan untuk menemukan string lalu memberi pemisah yang berbeda.

Contoh ke-1:

```
f1width=$(wc -L <a.txt)
printf -v f1blank "%${f1width}s"
paste a.txt b.txt |
    sed "s/^\(.*\)\t/\1$f1blank\t/;
         /d/{s/^\(.\{$f1width\}\) *\t/\1 | * | /;ba};
             s/^\(.\{$f1width\}\) *\t/\1 |   | /;:a"
```

Output:

```
a |   | a
b |   | B
c |   | c
d | * | D
e |   | e
  |   | F
  |   | g
  |   | H
  |   | i
  |   | J
```

Contoh ke-1 (reverse):

```
f1width=$(wc -L <b.txt)
printf -v f1blank "%${f1width}s"
paste b.txt a.txt |
    sed "s/^\(.*\)\t/\1$f1blank\t/;
         /d/{s/^\(.\{$f1width\}\) *\t/\1 | * | /;ba};
             s/^\(.\{$f1width\}\) *\t/\1 |   | /;:a"
```

Output:

```
a |   | a
B |   | b
c |   | c
D | * | d
e |   | e
F |   |
g |   |
H |   |
i |   |
J |   |
```

Contoh ke-2:

```
f1width=$(wc -L <c.txt)
printf -v f1blank "%${f1width}s"
paste c.txt d.txt |
    sed "s/^\(.*\)\t/\1$f1blank\t/;
         /45678/{s/^\(.\{$f1width\}\) *\t/\1 [ v ] /;ba};
                 s/^\(.\{$f1width\}\) *\t/\1 [   ] /;:a"
```

Output:

```
1         [ v ] 123456789
12        [ v ] 12345678
123       [   ] 1234567
1234      [   ] 123456
12345     [   ] 12345
123456    [   ] 1234
1234567   [   ] 123
12345678  [ v ] 12
123456789 [ v ] 1
```

Contoh ke-2 (reverse):

```
f1width=$(wc -L <d.txt)
printf -v f1blank "%${f1width}s"
paste d.txt c.txt |
    sed "s/^\(.*\)\t/\1$f1blank\t/;
         /45678/{s/^\(.\{$f1width\}\) *\t/\1 [ v ] /;ba};
                 s/^\(.\{$f1width\}\) *\t/\1 [   ] /;:a"
```

Output:

```
123456789 [ v ] 1
12345678  [ v ] 12
1234567   [   ] 123
123456    [   ] 1234
12345     [   ] 12345
1234      [   ] 123456
123       [   ] 1234567
12        [ v ] 12345678
1         [ v ] 123456789
```

Catatan:

Command `paste` dan `sed` selain bisa untuk mengubah pemisah baris, juga bisa untuk menandai baris yang terdapat string tertentu.

Pada contoh ke-1, kita gunakan string ` |   | ` sebagai pemisah dan jika terdapat karakter `d` pada baris, kita gunakan string ` | * | ` sebagai pemisah.

Pada contoh ke-2, kita gunakan string ` [   ] ` sebagai pemisah dan jika terdapat karakter `45678` pada baris, kita gunakan string ` [ v ] ` sebagai pemisah.

## Membandingkan - Versi Sederhana

Cara sederhana adalah dengan command `diff`.

Contoh ke-1:

```
width=$(wc -L <a.txt)
(( width *=2 ))
(( width +=3 ))
[[ $width -lt 5 ]] && width=5
diff -y -t -W $width a.txt b.txt
```

Output:

```
a   a
b | B
c   c
d | D
e   e
  > F
  > g
  > H
  > i
  > J
```

Contoh ke-1 (reverse):

```
width=$(wc -L <b.txt)
(( width *=2 ))
(( width +=3 ))
[[ $width -lt 5 ]] && width=5
diff -y -t -W $width b.txt a.txt
```

Output:

```
a   a
B | b
c   c
D | d
e   e
F <
g <
H <
i <
J <
```

Contoh ke-2:

```
width=$(wc -L <c.txt)
(( width *=2 ))
(( width +=3 ))
[[ $width -lt 5 ]] && width=5
diff -y -t -W $width c.txt d.txt
```

Output:

```
1         <
12        <
123       <
1234      <
12345     <
123456    <
1234567   <
12345678  <
123456789   123456789
          > 12345678
          > 1234567
          > 123456
          > 12345
          > 1234
          > 123
          > 12
          > 1
```

Contoh ke-2 (reverse):

```
width=$(wc -L <d.txt)
(( width *=2 ))
(( width +=3 ))
[[ $width -lt 5 ]] && width=5
diff -y -t -W $width d.txt c.txt
```

Output:

```
123456789 <
12345678  <
1234567   <
123456    <
12345     <
1234      <
123       <
12        <
1           1
          > 12
          > 123
          > 1234
          > 12345
          > 123456
          > 1234567
          > 12345678
          > 123456789
```

Catatan:

Command `diff` bekerja dengan baik pada contoh ke-1, tapi tidak sesuai ekspektasi pada contoh ke-2.

## Membandingkan - Versi Paste AWK

Kombinasi `paste` dan `awk` bisa digunakan untuk memperbaiki kelemahan cara sederhana pada `diff` diatas.

Contoh ke-1:

```
paste a.txt b.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {
        if (col1[i] == col2[i]) {
            printf ("%-*s == %s\n", max1, col1[i], col2[i])
        }
        else {
            printf ("%-*s <> %s\n", max1, col1[i], col2[i])
        }
    }
}'
```

Output:

```
a == a
b <> B
c == c
d <> D
e == e
  <> F
  <> g
  <> H
  <> i
  <> J
```

Contoh ke-1 (reverse):

```
paste b.txt a.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {
        if (col1[i] == col2[i]) {
            printf ("%-*s == %s\n", max1, col1[i], col2[i])
        }
        else {
            printf ("%-*s <> %s\n", max1, col1[i], col2[i])
        }
    }
}'
```

Output:

```
a == a
B <> b
c == c
D <> d
e == e
F <>
g <>
H <>
i <>
J <>
```

Contoh ke-2:

```
paste c.txt d.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {
        if (col1[i] == col2[i]) {
            printf ("%-*s%s%s\n", max1, col1[i], " |   | ", col2[i])
        }
        else {
            printf ("%-*s%s%s\n", max1, col1[i], " | * | ", col2[i])
        }
    }
}'
```

Output:

```
1         | * | 123456789
12        | * | 12345678
123       | * | 1234567
1234      | * | 123456
12345     |   | 12345
123456    | * | 1234
1234567   | * | 123
12345678  | * | 12
123456789 | * | 1
```

Contoh ke-2 (reverse):

```
paste d.txt c.txt | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {
        if (col1[i] == col2[i]) {
            printf ("%-*s%s%s\n", max1, col1[i], " |   | ", col2[i])
        }
        else {
            printf ("%-*s%s%s\n", max1, col1[i], " | * | ", col2[i])
        }
    }
}'
```

Output:

```
123456789 | * | 1
12345678  | * | 12
1234567   | * | 123
123456    | * | 1234
12345     |   | 12345
1234      | * | 123456
123       | * | 1234567
12        | * | 12345678
1         | * | 123456789
```

Catatan:

Pemisah antar baris bisa diubah sesuai kebutuhan, misalnya ` | * | `.

Gunakan contoh ke-2 jika pemisah terdapat lebih dari satu spasi berdempetan.

## Kesimpulan

Berdasarkan contoh diatas, maka cara efektif untuk menampilkan, membandingkan, dan menemukan adalah menggunakan command `paste | awk`, dan `paste | sed`.

Kita buat bash shell untuk memudahkan:

**Menampilkan**

Buat file `paste2files.sh`, dengan content:

```
#!/bin/bash
file_left="$1"
file_right="$2"
glue="$3"
find="$4"
glue_found="$5"
glue_notfound="$6"
if [ -z "$glue" ];then
    glue=" |   | "
fi
if [ -z "$glue_found" ];then
    glue_found=" | * | "
fi
if [ -z "$glue_notfound" ];then
    glue_notfound="$glue"
fi
if [ -z "$find" ];then
    paste "$file_left" "$file_right" | awk -F'\t' '{
        if (length($1)>max1) {max1=length($1)};
        col1[NR] = $1; col2[NR] = $2 }
        END {for (i = 1; i<=NR; i++) {printf ("%-*s%s%s\n", max1, col1[i], "'"$glue"'" ,col2[i])}
    }'
else
    f1width=$(wc -L <"$1")
    printf -v f1blank "%${f1width}s"
    paste "$1" "$2" |
    sed "s/^\(.*\)\t/\1$f1blank\t/;
         /$find/{s/^\(.\{$f1width\}\) *\t/\1$glue_found/;ba};
             s/^\(.\{$f1width\}\) *\t/\1$glue_notfound/;:a"
fi
```

Cara pakai:

```
paste2files.sh file_left file_right [glue] [find] [glue_found] [glue_notfound]
```

**Membandingkan**

Buat file `diff2files.sh`, dengan content:

```
#!/bin/bash
file_left="$1"
file_right="$2"
glue_equals="$3"
glue_notequals="$4"
if [ -z "$glue_equals" ];then
    glue_equals=" |   | "
fi
if [ -z "$glue_notequals" ];then
    glue_notequals=" | * | "
fi
paste "$file_left" "$file_right" | awk -F'\t' '{
    if (length($1)>max1) {max1=length($1)};
    col1[NR] = $1; col2[NR] = $2 }
    END {for (i = 1; i<=NR; i++) {
        if (col1[i] == col2[i]) {
            printf ("%-*s%s%s\n", max1, col1[i], "'"$glue_equals"'", col2[i])
        }
        else {
            printf ("%-*s%s%s\n", max1, col1[i], "'"$glue_notequals"'", col2[i])
        }
    }
}'
```

Cara pakai:

```
diff2files.sh file_left file_right [glue_equals] [glue_notequals]
```

Penerapan command `diff2files.sh` terdapat pada tulisan:

 - [Konfigurasi OpenVPN Server - Part 2 Skenario Flexible Route Traffic][link_1]
 - [Konfigurasi OpenVPN Server - Part 3 Skenario LAN & IP Static][link_2]
 - [Konfigurasi OpenVPN Server - Part 4 Skenario Split Pool IP Static & DHCP][link_3]
 - [Konfigurasi OpenVPN Server - Part 5 Skenario Multiple Daemons TCP & UDP][link_4]

[link_1]: /blog/2021/06/21/konfigurasi-openvpn-server-part-2-skenario-flexible-route-traffic/
[link_2]: /blog/2021/06/22/konfigurasi-openvpn-server-part-3-skenario-lan-ip-static/
[link_3]: /blog/2021/06/23/konfigurasi-openvpn-server-part-4-skenario-split-pool-ip-static-dhcp/
[link_4]: /blog/2021/06/24/konfigurasi-openvpn-server-part-5-multiple-daemons-tcp-udp/

## Reference

https://stackoverflow.com/questions/13341832/display-two-files-side-by-side

https://www.gnu.org/software/diffutils/manual/html_node/Side-by-Side-Format.html
