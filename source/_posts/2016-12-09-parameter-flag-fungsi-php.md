---
title: Membuat function di PHP dengan parameter flag
---
## Pendahuluan

Tulian ini akan membahas pengalaman membuat fungsi dengan menggunakan parameter FLAG. 

## Latar Belakang

Parameter adalah variable yang masuk ke dalam fungsi. Contoh:

```php
function my_custom_function($parameter_a, $parameter_b = null) {
    // Code here.
}
```

Pada contoh diatas ```$parameter_a``` wajib diberikan saat menjalankan fungsi. Sementara ```$parameter_b``` jika tidak diberikan, maka secara default bernilai ```null```.

Argument yang masuk kedalam fungsi bisa melebihi dari parameter itu sendiri. Contoh:

```php
function my_custom_function($parameter_a) {
    // Code here.
    $arguments = func_get_args();
}
my_custom_function('a', 'b', 'c', 'd');
```

Pada contoh diatas, maka value dari ```$arguments``` adalah sebuah array yakni  ```['a', 'b', 'c', 'd']```. Fungsi ```func_get_args()``` dan ```func_get_arg()``` digunakan untuk mengambil argument yang masuk.

Saya sedang iseng-iseng membuat *custom function* yang ternyata membutuhkan banyak argument yang bersifat ```boolean``` alias on/off seperti saklar. Biasanya argument yang terlalu banyak ini diakali dengan satu parameter array. Contoh:

```php
function my_custom_function($parameter_a, $options = []) {
    // Merge default.
    $options += [
        'option_a' => true,
        'option_b' => false,
        'option_c' => false,
        'option_d' => true,
    ];
}
```

Lantas saya teringat dengan parameter ```flag``` pada fungsi bawaan PHP seperti 

```php
error_reporting(E_ALL);
preg_match_all($pattern, $string, $matches, PREG_SET_ORDER);
json_encode($array, JSON_PRETTY_PRINT);
```

Parameter flag ini membuat syntax menjadi lebih efisien dan mudah dibaca/dipahami. 

Parameter flag ini sebenarnya khusus ditujukan bagi input yang bersifat on/off. Menggunakan kode biner yang terdiri dari angka ```1``` sebagai tanda on dan ```0``` sebagai tanda off.

Untuk lebih memahami flag ini saya kembali belajar otodidak dan ditemukan referensi yang cocok yakni ```operator bitwise```. 

> http://php.net/manual/en/language.operators.bitwise.php

## Contoh Kasus

*Custom Function* yang saya maksud diatas adalah ```var_dump``` yang di-improve. Sejak ada fitur ```namespace``` pada PHP, maka kita bisa membuat fungsi yang sama dengan bawaan PHP. 

Fungsi bawaan core PHP, yakni ```var_dump``` adalah fungsi yang sering saya gunakan. Saya ingin memperkaya fungsi tersebut dan beberapa keunggulan yang ada di fungsi ```print_r``` ingin pula saya terapkan pada ```var_dump```. Nanti akan ada implementasi parameter yang bersifat flag.

Code *custom function* tersebut dapat dilihat pada link:

> https://github.com/ijortengab/tools/blob/master/functions/var_dump.php

Contoh penggunaan dengan flag pada ```var_dump``` tersebut adalah sebagai berikut. Misalnya kita punya array sederhana.

```php
$test = [true, false];
```

Penggunaan fungsi ```var_dump``` bawaan PHP hanya menampilkan isi dari value. Contoh: 

```
array(2) {
  [0]=>
  bool(true)
  [1]=>
  bool(false)
}
```

Jika banyak dilakukan ```var_dump``` pada saat developing, maka kita akan **kebingubgan** yang mana yang milik siapa. Improvement yang saya lakukan membuat var_dump kini bisa juga memberi tahu siapa nama variable-nya.

```php
use function IjorTengab\Override\PHP\VarDump\var_dump;
use const IjorTengab\Override\PHP\VarDump\SUBJECT;
var_dump($test, SUBJECT);
```

Hasilnya adalah:

```
var_dump($test):
array(2) {
    [0]=>
    bool(true)
    [1]=>
    bool(false)
}
```

Terdapat pula FLAG lainnya yang dapat digunakan sesuai kebutuhan. Flag ini tentu bersifat on/off. Contoh:
```
var_dump($test, SUBJECT|COMMENT);
$string = var_dump($test, SUBJECT|CAPTURE);
```

## Kesimpulan

Mendapat satu masalah membuat kita rajin belajar dan mencari tahu sehingga bertambah wawasan untuk menyelesaikan masalah tersebut.
