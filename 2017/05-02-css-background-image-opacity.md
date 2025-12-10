# CSS - Background image opacity


## Pendahuluan

Sebuah `div` sederhana mempunyai background gelap dan text diatasnya juga gelap.

Contoh: 

```html
<div id="backdrop">
    <div id="title"><h1>LANDING PAGE</h1></div>
</div>
```

```css
#backdrop {
    background: url("images.jpg") no-repeat center center;
    background-size: contain;
}
#title {
    color: black;
}
```

Preview:

<iframe src="/embed/css-background-image-opacity/index_1.html" style="width:100%; height:400px;"></iframe>

## Tantangan

Agar text lebih terlihat, bagaimana jika backgroundnya dibuat sedikit transparant?

## Trial and Error

Coba kita kasih `opacity` pada `div`:

```css
#backdrop {
    background: url("images.jpg") no-repeat center center;
    background-size: contain;
    opacity:0.5;
}
#title {
    color: black;
}
```

Hasilnya:

<iframe src="/embed/css-background-image-opacity/index_2.html" style="width:100%; height:400px;"></iframe>

Solusi tersebut  **failed**. Karena background dan text sama-sama transparant.

## Solusi

Gunakan pseudo element `div#backdrop::after` dan background image diletakkan pada pseudo element tersebut.

Kemudian set `position` sebagai `absolute` karena pseudo element ini akan *ditimpa* menggunakan directive `z-index`.

```css
#backdrop::after {
    content: "";
    background: url("images.jpg") no-repeat center center;
    background-size: contain;
    opacity:0.5;
    position:absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
}
```

Hasilnya:

<iframe src="/embed/css-background-image-opacity/index_3.html" style="width:100%; height:400px;"></iframe>

Karena psuedo element menggunakan position absolute, maka position absolute-nya relative terhadap parent yang ber-element `position: relative`. 

Untuk itu beri info tambahan pada div#backdrop agar menjadi relative.

```css
#backdrop {
    position:relative;
}
```

Hasilnya:

<iframe src="/embed/css-background-image-opacity/index.html" style="width:100%; height:400px;"></iframe>

## Hasil Akhir

File: `index.html`

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <link rel="stylesheet" href="style.css" media="all" />
    </head>
    <body>
        <div id="backdrop">
            <div id="title"><h1>LANDING PAGE</h1></div>
        </div>
    </body>
</html>
```

File: `style.css`

```css
/**
 * Layout
 */
#backdrop {
    width:100%;
    height:300px;
    position:relative;
}
#backdrop::after {    
    position:absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
}
#title {
    text-align:center;
    padding-top:50px;
    position: relative;
}
/**
 * Style
 */
#backdrop::after {
    content: "";
    background: url("images.jpg") no-repeat center center;
    background-size: contain;
    opacity:0.5;
}
#title {
    color: black;
}
```

## Reference

https://css-tricks.com/snippets/css/transparent-background-images/

http://endlessnow.com/images/opensuse13.2.jpg




