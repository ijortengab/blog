/**
 * a2img
 *
 * version: 0.1.0
 *
 * by: IjorTengab
 * Created: Sabtu, 26 Agustus 2017
 * Last Update: Sabtu, 26 Agustus 2017
 * https://github.com/ijortengab/js
 *
 * Requirements:
 *     jQuery versi 1.0
 *
 * a2img adalah fungsi javascript yang memudahkan untuk mengubah link gambar
 * dengan element ber-tag a langsung diubah menjadi tag berlement img
 * sehingga gambar langsung tayang di document current tanpa direct untuk load
 * halaman baru ke arah link awal.
 *
 * Contoh:
 * <a href="http://ijortengab.id/images/foto.jpg">
 *
 * Setelah element tersebut d klik, element akan berubah menjadi:
 *
 * <img src="http://ijortengab.id/images/foto.jpg">
 *
 * dan gambar pun tayang pada document yang sama.
 *
 * Cara Penggunaan:
 *
 * 1. Cara cepat. Sebagai fungsi untuk keseluruhan element 'a'. Recommended.
 *    <script>a2img.init()</script>
 *
 * 2. Khusus untuk element selain tag a, gunakan sebagai method jQuery.
 *    Cara ini akan langsung mengubah menjadi elemet img tanpa perlu menunggu
 *    event click fire.
 *    <script>$('span[src]').a2img('src')</script>
 *    Khusus jika membutuhkan berubah menjadi image jika terjadi event click,
 *    maka, bungkus dengan fungsi on click. Contoh:
 *    <script>$('span[src]').click(function (){$(this).a2img('src')})</script>
 *
 * 3. Tambahan fungsi untuk bulk.
 *    <button onclick="javascript:a2img.showAll();">Show All</button>
 */
a2img = {}

/**
 *
 */
a2img.init = function () {
    $('a').click(function (event) {
        var link = $(this).attr('href');
        var file_ext = link.split('.').pop().toLowerCase();
        console.log(file_ext);
        if ($.inArray( file_ext, [ "jpg", "jpeg", "gif", "png" ] ) > -1) {
            $(this).a2img('href');
            event.preventDefault();
        }
    });
}

a2img.showAll = function () {
    $('a').each(function () {
        var link = $(this).attr('href');
        var file_ext = link.split('.').pop().toLowerCase();
        if ($.inArray( file_ext, [ "jpg", "jpeg", "gif", "png" ] ) > -1) {
            $(this).a2img('href');
        }
    })
}

$.fn.a2img = function (attr) {
    if (typeof attr !== 'string') {
        return;
    }
    this.each(function () {
        var link = $(this).attr(attr);
        var $newImage = $('<img>');
        $newImage.attr('src', link);
        var text = $(this).text();
        if (text.length) {
            $newImage.attr('alt', text);
            $newImage.attr('title', text);
        }
        // Copy attributes.
        $.each(this.attributes, function() {
            if (this.specified) {
                if (this.name != 'src') {
                    $newImage.attr(this.name, this.value);
                }
            }
        });
        // Replace.
        $(this).replaceWith($newImage);
    });


}
