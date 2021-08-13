---
title: Hosting Mail Server di DigitalOcean dan Block Port 25
---

## Pendahuluan

Bagi pelanggan baru DigitalOcean, Droplet (sebutan instance VPS) yang didapat akan otomatis terblokir port 25.

## Penjelasan Resmi

Penjelasan Resmi baru muncul di tahun 2021:

> Why is SMTP blocked?
>
> Validated on 11 January 2021 • Posted on 11 January 2021
>
> SMTP port 25 is blocked on all Droplets for some new accounts to prevent spam and other abuses of our platform. To send mail on these accounts, use a dedicated email deliverability platform (such as Sendgrid and Mailgun), which are better at handling deliverability factors like IP reputation.
> Even on accounts where SMTP is available, we recommend against running your own mail server in favor of using a dedicated email deliverability platform.
>

Sumber: https://www.digitalocean.com/support/articles/smtp-block/

## Penjelasan Sebelum tahun 2021

Sebelum penjelasan resmi muncul, pelanggan tidak mendapat pemberitahuan tentang pemblokiran ini, sehingga harus bertanya melalui Forum Komunitas atau Contact Support.

Contoh melalui Forum Komunitas

`https://www.digitalocean.com/community/questions/postfix-smtp-issues`

lucas325720 February 21, 2014:

> Postfix & SMTP Issues
>
> Feb 21 08:17:24 elusive postfix/smtp[15684]: connect to ASPMX.L.GOOGLE.com[2607:f8b0:400d:c01::1a]:25: Network is unreachable
>
> Feb 21 08:17:54 elusive postfix/smtp[15684]: connect to ASPMX.L.GOOGLE.com[173.194.76.27]:25: Connection timed out

kamaln7 (Site moderator) February 22, 2014:

> Can you open up a support ticket so we can look into it? Thanks!

nitin6 August 17, 2017:

> By default, port 25 is disabled on all Cloud Servers for the first 40 days of a server contract due to spam issue.
>
> We have to open manually on our end.
>
> I just opened the port.
>
> It usually updates within the hour.
>
> I would recommend testing again in about 30-40 minutes

## Contact Support

Pastikan sudah menjadi pelanggan DigitalOcean selama 40 atau 60 hari, kemudian open ticket ke email support:

IjorTengab (Friday, March 02, 2018 4:51 PM):

> Hai, i've been using DO since Nov 2016 for my blog ijortengab.id
>
> ... bla bla bla ... (text cutted)
>
> Could you enable me to outgoing port 25.

DigitalOcean Support (Friday, March 02, 2018 7:38 PM):

> Hello,
>
> Thank you for reaching out to us. I am passing this ticket over to our Trust and Safety team for further review. Please note that each request is manually reviewed, so we appreciate your patience during this process.
>
> If you have any other questions, please let us know, we are always here to help.
>
> Thank you,
>
> Platform Support Specialist

DigitalOcean Trust & Safety Team (Saturday, March 03, 2018 3:51 AM):

> Hi there,
>
> Thank you for the information you have provided.
>
> We've reviewed the information and have removed the SMTP block from your account.
>
> If you have any further questions regarding this matter, please let us know.
>
> Regards,
>
> Trust & Safety,
> DigitalOcean Support

IjorTengab (Saturday, March 03, 2018 3:34 PM):

> Thanks so much... Issue closed (fix).
>
> Nice services from DO.

## Test Port 25

Misalnya IP kita adalah `206.189.94.130`, maka eksekusi command sbb:

```
telnet 206.189.94.130 25
```

Jika berhasil, maka akan muncul output sebagai berikut:

```
Trying 206.189.94.130...
Connected to 206.189.94.130.
Escape character is '^]'.
220 server1.systemix.id ESMTP Postfix (Ubuntu)
```

Keluar dengan command `quit`. Output:

```
quit
221 2.0.0 Bye
Connection closed by foreign host.
```
