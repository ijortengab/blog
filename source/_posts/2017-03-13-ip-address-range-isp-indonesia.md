---
title: IP Address Range dari berbagai ISP di Indonesia
---

## Pendahuluan

Tulisan ini bersifat *reference*, dan akan diupdate jika ditemukan informasi baru/terkini. 

## Panduan Teknis

Untuk mencari tahu IP Public yang saat ini sedang saya gunakan, saya biasa menggunakan:

 - https://www.cekip.com/
 - https://www.whatismyip.com/

Untuk menggali lebih dalam informasi tentang IP yang telah didapat, saya biasa menggunakan:

 - http://www.domainwhitepages.com/
 - http://whois.domaintools.com/
 
Untuk mencari tahu range IP, saya menggunakan informasi `inetnum` dari whois. 

Untuk mencari tahu subnet mask, saya menggunakan informasi `route` dari whois. Jika tidak ada, maka dicari dengan hitung manual, seperti contoh berikut:

IP Public yang didapat dari ISP Bolt adalah: `202.62.17.51`. Dari whois didapat informasi `inetnum` yakni: 
`202.62.16.0 - 202.62.31.255`. Dari range ini, kemudian dicari subnet mask.

IP Start 202.062.016.000 = `11001010.00111110.00010000.00000000`

IP End 202.062.031.255 = `11001010.00111110.00011111.11111111`

Subnet Mask berdasarkan range diatas, yakni:
```
11001010.00111110.00010000.00000000 (start)
11111111.11111111.11110000.00000000 (mask)
-----------------------------------
11001010.00111110.00011111.11111111 (end)
```
 alias `255.255.255.240.0 ` alias `/20`.
 
## Nah.. Ini dia

| IP Range                      | CIDR             | Corporate                                        | Product   |
|-------------------------------|------------------|--------------------------------------------------|-----------|
| 202.62.16.0~202.62.31.255     | 202.62.16.0/20   | PT Internux                                      | Bolt      |
| 114.120.0.0~114.126.255.255   | 114.120.0.0/13   | PT. Telekomunikasi Selular (Telkomsel) Indonesia | Telkomsel |
| 112.215.153.0~112.215.178.0   | 112.215.0.0/16   | PT Excelcomindo Pratama                          | XL        |
| 152.118.0.0~152.118.255.255   | 152.118.0.0/16   | University of Indonesia                          |           |
| 103.247.8.0~103.247.11.255    | 103.247.8.0/22   | CV Rumahweb Indonesia                            | VPS       |
| 115.178.160.0~115.178.191.255 | 115.178.160.0/19 | PT. Wireless Indonesia                           | Smartfren |
| 115.178.192.0~115.178.223.255 | 115.178.192.0/19 | PT. Wireless Indonesia                           | Smartfren |
| 115.178.224.0~115.178.255.255 | 115.178.224.0/19 | PT. Wireless Indonesia                           | Smartfren |
| 120.160.0.0~120.191.255.255   | 120.160.0.0/11   | PT Indosat                                       | IM3 3G    |
| 114.0.0.0~114.15.255.255      | 114.0.0.0/12     | PT Indosat                                       | Indosat   |
| 202.80.208.0~202.80.223.255   | 202.80.208.0/20  | PT Dunia Informasi Teknologi                     | MNC Play  |

## Lampiran

```
IP Range,CIDR,Corporate,Product
202.62.16.0~202.62.31.255,202.62.16.0/20,PT Internux,Bolt
114.120.0.0~114.126.255.255,114.120.0.0/13,PT. Telekomunikasi Selular (Telkomsel) Indonesia,Telkomsel
112.215.153.0~112.215.178.0,112.215.0.0/16,PT Excelcomindo Pratama,XL
152.118.0.0~152.118.255.255,152.118.0.0/16,University of Indonesia,
103.247.8.0~103.247.11.255,103.247.8.0/22,CV Rumahweb Indonesia,VPS
115.178.160.0~115.178.191.255,115.178.160.0/19,PT. Wireless Indonesia,Smartfren
115.178.192.0~115.178.223.255,115.178.192.0/19,PT. Wireless Indonesia,Smartfren
115.178.224.0~115.178.255.255,115.178.224.0/19,PT. Wireless Indonesia,Smartfren
120.160.0.0~120.191.255.255,120.160.0.0/11,PT Indosat,IM3 3G
114.0.0.0~114.15.255.255,114.0.0.0/12,PT Indosat,Indosat
202.80.208.0~202.80.223.255,202.80.208.0/20,PT Dunia Informasi Teknologi,MNC Play
```

## Reference

http://www.tablesgenerator.com/markdown_tables
