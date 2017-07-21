---
title: Mencari CIDR dari sebuah ISP
---

## Pendahuluan

Perusahaan ISP (Internet Service Provider) umumnya menawarkan jasa space hosting dan layanan internet lainnya seperti **Publisher Game**. Mereka memiliki slot IP Publik dengan rentang tertentu.

Untuk kebutuhan networking, penting untuk mengetahui berapa rentang IP dari suatu ISP yang biasanya ditulis dalam notasi [CIDR].

[CIDR]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation

Contoh ISP dalam tulisan ini adalah `Lytogame`.

## Pertanyaan

Berapakah [CIDR] (Classless Inter-Domain Routing) dari ISP Lytogame?

## Analisis Pertama

Perusahaan Lytogame beralamat di `https://www.lytogame.com/`. Nama domain berarti `lytogame.com`.

Pencarian melalui command `host` mendapatkan hasil sbb:

```bash
ijortengab@server:~$ host lytogame.com
lytogame.com has address 202.93.17.182
lytogame.com mail is handled by 10 mail.lytogame.com.
```

Pencarian melalui `domainwhitepages.com` pada query IP Publik tersebut (`202.93.17.182`) menghasilkan informasi sebagai berikut:

```no-highlight
Network Whois record

Queried whois.apnic.net with "202.93.17.182"...

% Information related to '202.93.17.0 - 202.93.17.255'

inetnum:        202.93.17.0 - 202.93.17.255
netname:        IDNIC-LYTO-ID
descr:          PT Lyto Datarindo Fortuna
descr:          Corporate / Direct Member IDNIC
descr:          Publisher Game
```

Rentang IP terdiri dari `202.93.17.0` sampai `202.93.17.255`.

Berarti Subnet Mask untuk kasus sepert ini mudah sekali yakni `255.255.255.0` alias CIDR notation sama dengan `/24`.

## Analisis Kedua

Coba lagi pada satu level diatas nya dan satu level dibawahnya.

Pencarian melalui `domainwhitepages.com` pada IP `202.93.16.0` dan `202.93.18.0` juga menghasilkan informasi perusahaan yang sama.

Pada akhirnya didapat hasil IP Publik dan Perusahaan sebagai berikut

```
202.93.15.0 ~ 202.93.16.255 = CityLink Corporation, LTD
202.93.16.0 ~ 202.93.16.255 = PT Lyto Datarindo Fortuna
202.93.17.0 ~ 202.93.17.255 = PT Lyto Datarindo Fortuna
202.93.18.0 ~ 202.93.18.255 = PT Lyto Datarindo Fortuna
202.93.19.0 ~ 202.93.19.255 = PT Lyto Datarindo Fortuna
202.93.20.0 ~ 202.93.20.255 = PT Lyto Datarindo Fortuna
202.93.21.0 ~ 202.93.21.255 = PT Lyto Datarindo Fortuna
202.93.22.0 ~ 202.93.22.255 = PT Lyto Datarindo Fortuna
202.93.23.0 ~ 202.93.23.255 = PT Lyto Datarindo Fortuna
202.93.24.0 ~ 202.93.24.255 = PT Thamrin Telekomunikasi Network
```

Berarti rentang IP Publik untuk perusahaan Lytogame (PT Lyto Datarindo Fortuna) adalah `202.93.16.0` ~ `202.93.23.255`.

## Jawab

Saya biasa menggunakan [online IP calculator][1] untuk memastikan notasi CIDR.

[1]: http://jodies.de/ipcalc

Hasil yang didapat diilustrasikan dalam *tree* sebagai berikut: 

```
202.93.16.0 ~ 202.93.16.255 -- /24 --
                                    | -- /23 --
202.93.17.0 ~ 202.93.17.255 -- /24 --         |
                                              | -- /22 --
202.93.18.0 ~ 202.93.18.255 -- /24 --         |         |
                                    | -- /23 --         |
202.93.19.0 ~ 202.93.19.255 -- /24 --                   |
                                                        | -- /21
                                                        |
202.93.20.0 ~ 202.93.20.255 -- /24 --                   |
                                    | -- /23 --         |
202.93.21.0 ~ 202.93.21.255 -- /24 --         |         |
                                              | -- /22 --
202.93.22.0 ~ 202.93.22.255 -- /24 --         |
                                    | -- /23 --
202.93.23.0 ~ 202.93.23.255 -- /24 --
```

Dari tree diatas berarti CIDR untuk ISP Lytogame adalah `202.93.16.0/21`.

Kesimpulan: 

```
PT Lyto Datarindo Fortuna (202.93.16.0/21)

202.93.16.0   = 11001010.01011101.00010000.00000000

255.255.248.0 = 11111111.11111111.11111000.00000000 = /21

202.93.23.255 = 11001010.01011101.00010111.11111111
```

## Kasus Lainnya

Sewaktu meng-query IP `202.93.24.0` pada `domainwhitepages.com`, didapat hasil sebagai berikut:

```no-highlight
Network Whois record

Queried whois.apnic.net with "202.93.24.0"...

% Information related to '202.93.24.0 - 202.93.31.255'

inetnum:        202.93.24.0 - 202.93.31.255
netname:        THAMRIN-ID
descr:          PT Thamrin Telekomunikasi Network
descr:          ISP
descr:          Jakarta
```

[CIDR] (Classless Inter-Domain Routing) dari ISP PT Thamrin Telekomunikasi Network memiliki struktur *tree* yang sama dengan Lytogame, yakni:

```
202.93.24.0 ~ 202.93.24.255 -- /24 --
                                    | -- /23 --
202.93.25.0 ~ 202.93.25.255 -- /24 --         |
                                              | -- /22 --
202.93.26.0 ~ 202.93.26.255 -- /24 --         |         |
                                    | -- /23 --         |
202.93.27.0 ~ 202.93.27.255 -- /24 --                   |
                                                        | -- /21
                                                        |
202.93.28.0 ~ 202.93.28.255 -- /24 --                   |
                                    | -- /23 --         |
202.93.29.0 ~ 202.93.29.255 -- /24 --         |         |
                                              | -- /22 --
202.93.30.0 ~ 202.93.30.255 -- /24 --         |
                                    | -- /23 --
202.93.31.0 ~ 202.93.31.255 -- /24 --
```

Berarti CIDR dari ISP PT Thamrin Telekomunikasi Network adalah `202.93.24.0/21`.

Kesimpulan: 

```
PT Thamrin Telekomunikasi Network (202.93.24.0/21)

202.93.24.0   = 11001010.01011101.00011000.00000000

255.255.248.0 = 11111111.11111111.11111000.00000000 = /21

202.93.31.255 = 11001010.01011101.00011111.11111111
```
