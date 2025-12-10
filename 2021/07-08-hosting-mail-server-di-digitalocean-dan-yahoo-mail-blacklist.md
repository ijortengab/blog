---
title: Hosting Mail Server di DigitalOcean dan Yahoo Mail Blacklist
tags:
  - mail-server
  - digitalocean
---

## Pendahuluan

Kita berlangganan VPS (Virtual Private Server) di DigitalOcean untuk dijadikan mail server.

Setelah [port 25 dibuka][link_1], kendala berikutnya adalah kemungkinan IP Public yang kita dapat termasuk dalam blacklist dari Free Mail Services.

Solusi yang bisa ditempuh adalah melakukan manual request unlisting kepada Penyedia Mail Service yang akan dituju.

[link_1]: /blog/2021/07/07/hosting-mail-server-di-digitalocean-dan-block-port-25/

## Spamhaus

Mengirim email ke tujuan `@yahoo.com` mengalami kendala.

Misalkan IP Public yang didapat adalah `206.189.94.130`.

Perhatikan log `/var/log/mail.log`.

```
2513:Jul  2 00:06:52 server postfix/smtp[479415]: C6C64FC024: to=<******@yahoo.com>,
relay=mta5.am0.yahoodns.net[67.195.204.72]:25, delay=2.2, delays=0.05/0.03/1.9/0.26,
dsn=5.7.1, status=bounced (host mta5.am0.yahoodns.net[67.195.204.72] said:
553 5.7.1 [TSS07] Connections will not be accepted from 206.189.94.130, because
the ip is in Spamhaus's list; see https://postmaster.verizonmedia.com/error-codes
(in reply to MAIL FROM command))
```

IP Public kita termasuk dalam blacklist Spamhaus.

![Screenshot.](/images/2021/screenshot.2021-07-04_14.27.24.jpg)

Solusi adalah dengan mengirim request ke Spamhaus melalui formulir online:

```
https://check.spamhaus.org/verification/
```

Pada input email, masukkan alamat email yang berasal dari mail server kita (bukan dari provider lain seperti Gmail).

Jawaban yang muncul hanya verifikasi:

```
Thank you for contacting Spamhaus removals,
The email address info@****** has submitted a request
for removal of 206.189.94.130 from a Spamhaus list.
This request was received from 182.0.***.*** at 2021-07-04 7:27:56 UTC.
If this was you, please verify your email address by clicking the following link:
https://check.spamhaus.org/verifying_email/?a=***&b=******.
Best wishes,
The Spamhaus Project Team
```

Dalam 24 jam, blacklist terhapus dari Spamhaus.

## Temporarily Deferred

Setelah berhasil lepas dari blacklist Spamhaus, mengirim email ke tujuan `@yahoo.com` tetap mengalami kendala.

Misalkan IP Public yang didapat adalah `206.189.94.130`.

Catatan pada `/var/log/mail.log` adalah sbb:

```
Jul  7 03:53:26 server1 postfix/smtp[359694]: ADC4A3F0EA: to=<******@yahoo.com>,
relay=mta7.am0.yahoodns.net[98.136.96.74]:25, delay=105044, delays=105040/0.04/4.1/0.24, dsn=4.7.0,
status=deferred (host mta7.am0.yahoodns.net[98.136.96.74] said:
421 4.7.0 [TSS04] Messages from 206.189.94.130 temporarily deferred due to unexpected
volume or user complaints - 4.16.55.1; see
https://postmaster.verizonmedia.com/error-codes (in reply to MAIL FROM command))
```

Solusi adalah dengan mengirim request ke Yahoo melalui formulir online:

`https://postmaster.verizonmedia.com/sender-request`

Lalu klik link `Yahoo Sender Support Request`.

![Screenshot.](/images/2021/screenshot.2021-07-25_15.40.42.jpg)

Jalan lain menuju formulir online adalah:

 - Link: https://io.help.yahoo.com/contact/index?page=home
 - Choose your product: `Postmaster`.
 - Choose support option: `Contact Yahoo Specialist`.
 - Choose topic: `Postmaster basic`
 - Choose subtopic: `Submit new IPs for review`

Pada input email, masukkan alamat email yang berasal dari mail server kita (bukan dari provider lain seperti Gmail).

![Screenshot.](/images/2021/screenshot.2021-07-05_19.59.01.jpg)

**Jawaban via Email**

From Yahoo Customer Care on 2021-07-06 21:19:

```
Hi ******,

Thank you for contacting Yahoo. I understand you are getting a TSS04 error.

I'll get this over to our engineering team so they can get this fixed as soon as possible for you. If you have any other issues, definitely let me know.

Have a good day!

Regards,

Jennifer

Yahoo Customer Care
```

From Yahoo Customer Care on 2021-07-07 18:12

```
Hi ******,

Thank you for contacting Yahoo. I'm sorry for the trouble this has caused.

I appreciate your patience. Engineering has reported the issue as resolved.

If you have any other issues, definitely let me know.

Have a good day!

Regards,

Jennifer

Yahoo Customer Care
```
