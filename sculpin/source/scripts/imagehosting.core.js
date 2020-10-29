/**
 * Image Hosting
 *
 * version: 0.1.0
 *
 * by: IjorTengab
 * Created: Jumat, 25 Agustus 2017
 * Last Update: Sabtu, 26 Agustus 2017
 * https://github.com/ijortengab/js
 *
 * Requirements:
 *     jQuery versi 1.0
 *
 * Image Hosting adalah javascript yang akan mengubah fake URL menjadi real URL.
 * Fake URL dibuat untuk memfasilitasi berbagai cloud service tempat
 * penampungan images. Fake URL harus memiliki protokol "image://".
 * Mendukung element <img> dan element <a>.
 *
 * Contoh:
 *
 * ```html
 * <img src="image://2017/08/foto.jpg">
 * ```
 *
 * ```js
 * new imageHosting.setProvider('self').init();
 * ```
 *
 * Provider bernama "self" adalah provider default bawaan library
 * ini yang akan mengubah URL menjadi subdomain "images" dari host anda
 * saat ini.
 *
 * Misalnya host website anda saat ini adalah: http://ijortengab.id, maka
 * element html diatas akan berubah menjadi http://images.ijortengab.id
 *
 * Sebelum:
 *
 * ```html
 * <img src="image://2017/08/foto.jpg">
 * ```
 *
 * Sesudah execute javascript:
 *
 * ```html
 * <img src="http://images.ijortengab.id/2017/08/foto.jpg">
 * ```
 *
 * Anda dapat menentukan sendiri provider dengan mendaftarkan fungsi seperti
 * contoh provider "self" pada code dibawah.
 *
 * Selain element img, library ini juga berfungsi pada element a jika protokol
 * dari property href adalah "image". 
 *
 * Sebelum:
 *
 * ```html
 * <a href="image://2017/08/foto.jpg">
 * ```
 *
 * Sesudah execute javascript:
 *
 * ```html
 * <a href="http://images.ijortengab.id/2017/08/foto.jpg">
 * ```
 *
 */
imageHosting = {}

/**
 * Mengeset Provider Cloud.
 */
imageHosting.setProvider = function (provider) {
    this.provider = provider;
    return this;
}

/**
 * Property penampungan fungsi dari provider.
 */
imageHosting.setProvider.prototype.registerProviderFunction = {}

/**
 * Memulai menge-scan element img dan a yang terdapat link ke protocol
 * "imageHosting".
 */
imageHosting.setProvider.prototype.init = function () {
    var self = this;
    $('a,img').each(function (event) {
        var nodeName = this.nodeName;
        switch (nodeName) {
            case 'A':
                link = this.href;
                break;
            case 'IMG':
                link = this.src;
                break;
        }
        if (link.length == 0) {
            return;
        }
        var parser = document.createElement('a');
        parser.href = link;
        if (parser.protocol != 'image:') {
            return;
        }
        var protocol = parser.protocol+'//';
        var path = parser.href.replace(protocol,'');
        var func = self.registerProviderFunction[self.provider];
        new self.realImage(this, path)
            .setFunction(func)
            .create();
    });
}

/**
 * Object baru real image.
 */
imageHosting.setProvider.prototype.realImage = function (element, path) {
    this.element = element;
    this.path = path;
    return this;
}

/**
 * Copy paste fungsi yang teregister di parent.
 */
imageHosting.setProvider.prototype.realImage.prototype.setFunction = function (func) {
    this.providerFunction = func;
    return this;
}

/**
 * Memulai membuat element yang terdapat image dengan link yang benar.
 */
imageHosting.setProvider.prototype.realImage.prototype.create = function () {
    var newElement = this.providerFunction(this.element, this.path);
    $(newElement).addClass('imagehosting-processed');
}

/**
 * Contoh provider yang secara default ikut bersama library ini adalah
 * "self"
 */
imageHosting.setProvider.prototype.registerProviderFunction['self'] = function (element, path) {
    var protocol = window.location.protocol+'//';
    var hostname = 'images.'+window.location.hostname;
    var link = protocol+hostname+'/'+path;
    var nodeName = element.nodeName;
    switch (nodeName) {
        case 'A':
            $(element).attr('href', link);
            return element;
        case 'IMG':
            $(element).attr('src', link);
            return element;
    }
}
