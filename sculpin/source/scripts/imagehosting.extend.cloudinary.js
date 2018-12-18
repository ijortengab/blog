/**
 * 
 * Image Hosting extent provider Cloudinary
 *
 * version: 0.1.0
 * 
 * Contoh provider cloud image bernama Cloudinary.
 *
 * Requirement dan Cara Penggunaan:
 *  - <script src="{{ site.cdnjs.host }}/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
 *  - <script src="{{ site.cdnjs.host }}/ajax/libs/cloudinary-jquery-file-upload/2.1.9/cloudinary-jquery-file-upload.min.js"></script>
 *  - <script src="{{ site.url }}/scripts/imagehosting.core.js"></script>
 *  - <script src="{{ site.url }}/scripts/imagehosting.extend.cloudinary.js"></script>
 *  - <script>$.cloudinary.config({ cloud_name: '{{site.cloudinary.cloud_name}}', api_key: '{{site.cloudinary.api_key}}'})</script>
 *  - <script>new imageHosting.setProvider('cloudinary').init();</script>
 */
imageHosting.setProvider.prototype.registerProviderFunction['cloudinary'] = function (element, path) {
    var nodeName = element.nodeName;
    var options = {}
    if (typeof element.attributes.width !=  'undefined') {
        options.width = element.attributes.width.value;
        options.crop = 'scale';
    }
    switch (nodeName) {
        case 'A':
            var link = $.cloudinary.url(path, options);
            $(element).attr('href', link);
            return element;

        case 'IMG':
            var link = $.cloudinary.url(path, options);
            $(element).attr('src', link);
            return element;
    }
}
