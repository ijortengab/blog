---
title: Mencari Image Hosting - Cloudinary dot com
#draft: true
---

## Pendahulan

[Blog ini][1] di-*design* dengan prinsip *low resource*. Untuk itu perlu pemilihan program dan service yang sesuai.

 - Software [Sculpin][2] dipilih sebagai [Static Generator][3] alih-alih menggunakan CMS. 
 
 - Software Git untuk menyimpan revisi dan [Github][4] sebagai repository-nya.

 - Web service [CDNJS dot com][5] dipilih sebagai CDN library Javascript alih-alih self-hosting.

 - Web service [Google Analytics][6] dipilih untuk analisis dan statistik pengunjung.
 
 - Web service [Disqus][7] dipilih untuk engine diskusi/komentar.

Sampai dengan tulisan ini dibuat, blog ini belum memiliki artikel yang terdapat gambar didalamnya. 

Alih-alih menyimpan image di server sendiri, akan lebih baik jika image di-host oleh pihak ketiga. 

Sesuai dengan prinsip *low resource*. Pencarian web service untuk image hosting pun dimulai.

## Mengapa Cloudinary dot com

Berawal dari keinginan untuk "mengupload gambar ke Image Hosting secara programming". 

Googling dengan query "image hosting with upload api" didapat hasil dua teratas:

 - [http://stackoverflow.com/q/2642570/][8]

 - [http://cloudinary.com/][9]
 
Cloudinary dot com akhirnya menjadi pilihan untuk Image Hosting setelah menyimak diskusi di [stackoverflow][8] dan membedah [API Cloudinary][10] yang dihost di Github.

Kebutuhan akan upload API ini penting untuk bisnis pengembangan software dan web development kedepannya.

Bagaimana dengan harga?

Sampai tulisan ini dibuat, Cloudinary terdapat skema [free][11] untuk 75.000 files, 2 GB Managed Storage, dan 5 GB Monthly Banditwh.

Ini sudah lebih dari cukup untuk kebutuhan personal.

Storage yang dapat dimanage membuat kita bisa membuat subdirektori dan memanage file sesuai kebutuhan.

## Integrasi dengan Sculpin

Saya mengupload gambar di Cloudinary didalam folder `ijortengab.id` bernama `screenshot.509.png`. 

Setelah meng-upload terdapat keterangan diantaranya URL dan fungsi dalam beberapa bahasa pemrograman.

Yang menarik ternyata juga ada fungsi jQuery yakni `$.cloudinary.image("ijortengab.id/screenshot.509.png")`

Setelah membaca dokumentasi [Cloudinary - jQuery integration][12], saya melakukan sedikit *hacking* agar dapat memasukkan gambar didalam article dengan cara yang berbeda.

Alih-alih menggunakan syntax Markdown, saya menciptakan sendiri tag `<cloudinary>`. Javascript (jQuery) yang akan menggenerate image berdasarkan informasi dari attribute tag tersebut.

Edit file `sculpin_site.yml` dan tambahkan informasi cloudinary sebagai berikut:

```yml
cloudinary:
  cloud_name: ijortengab
  api_key: 675184379558338
```

Pada layout utama (default.html), saya menambahkan baris code sebagai berikut:

{% verbatim %}
```twig
{% if site.cloudinary %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/cloudinary-jquery-file-upload/2.1.9/cloudinary-jquery-file-upload.min.js"></script>
<script>
$.cloudinary.config({ cloud_name: '{{site.cloudinary.cloud_name}}', api_key: '{{site.cloudinary.api_key}}'})
$('cloudinary').each(function () {
    var $this = $(this);
    var src = $this.attr('src');
    var image = $.cloudinary.image(src)
    $this.replaceWith(image);
});
</script>
{% endif %}
```
{% endverbatim %}

Untuk setiap artikel, memasukkan gambar cukup dengan pola sebagai berikut:

```
<cloudinary src="$path_internal">$alt_image</cloudinary>
```

## Contoh Hasil

Hasil dari code ini:

```
<cloudinary src="ijortengab.id/screenshot.509.png">Screenshot hasil googling dengan query "image hosting with upload api"</cloudinary>
```

adalah gambar dibawah ini: 

<cloudinary src="ijortengab.id/screenshot.509.png">Screenshot hasil googling dengan query "image hosting with upload api"</cloudinary>

## Penutup

Cloudinary dot com adalah pilihan yang tepat (setidaknya untuk saat ini) untuk image hosting dengan fitur *upload image programatically*.

[1]: http://ijortengab.id/
[2]: https://sculpin.io/
[3]: http://www.staticgen.com/
[4]: https://github.com/ijortengab/ijortengab.id/
[5]: https://cdnjs.com/
[6]: https://www.google.com/analytics/
[7]: https://disqus.com/
[8]: http://stackoverflow.com/q/2642570/
[9]: https://cloudinary.com/
[10]: https://github.com/cloudinary/
[11]: http://cloudinary.com/pricing
[12]: http://cloudinary.com/documentation/jquery_integration

*[CMS]: Content Management System
*[CDN]: Content Delivery Network
*[W3C]:  World Wide Web Consortium
