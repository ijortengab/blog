---
title: Hosting Mail Server di DigitalOcean dan GMail Auto SPAM Label
---

## Pendahuluan

Kita berlangganan VPS (Virtual Private Server) di DigitalOcean untuk dijadikan mail server.

Setelah [port 25 dibuka][link_1], kendala berikutnya adalah kemungkinan IP Public yang kita dapat termasuk dalam blacklist dari Free Mail Services.

Solusi yang bisa ditempuh adalah melakukan manual request unlisting kepada Penyedia Mail Service yang akan dituju.

[link_1]: /blog/2021/07/07/hosting-mail-server-di-digitalocean-dan-block-port-25/

## Gmail

Kendala mengirim ke Gmail adalah <strike>seluruh</strike> hampir semua email dari Server DigitalOcean masuk ke folder SPAM.

Ditest dengan Droplet sebagai berikut:

 - IP `206.189.94.130` Data Center Singapore 1
 - IP `128.199.94.150` Data Center Singapore 1
 - IP `167.71.160.59` Data Center New York 3
 - IP  `188.166.172.218` Data Center London 1

Best practice sudah kita lakukan dengan memperhatikan:

 - `PTR Record`
 - `SPF`
 - `DKIM`
 - `DMARC`

Hasil tester dengan online service `https://www.mail-tester.com/` memberikan score `10/10`.

Kesimpulan:

> Gmail melakukan greylist terhadap IP DigitalOcean.

## Solusi

Solusi adalah dengan mengirim request ke Google melalui formulir online:

```
https://support.google.com/mail/contact/bulk_send_new
```

Please select the option that best describes the issue when you send emails to Gmail users:

> Your messages are incorrectly classified as Spam or Phishing

Short summary of your issue:

> Mail from our server always mark as a spam.

Detailed description of your issue:

> ...
>
> We have buy VPS from DigitalOcean located in Singapore.
>
> Our IP is 206.189.94.130. We using our mail server for triggered email only, not for advertising.
>
> ...

screenshot.2021-07-09_22.12.44

Tidak ada jawaban apapun via email, tapi dalam dua pekan, greylist sudah dihapus.

Request dilakukan pada tangal 9 Juli 2021 dan sejak tanggal 21 Juli 2021, seluruh email ke `@gmail.com` masuk ke Inbox. Alhamdulillah.
