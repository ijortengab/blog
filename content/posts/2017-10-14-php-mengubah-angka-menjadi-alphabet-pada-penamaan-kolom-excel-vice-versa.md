---
title: PHP - Mengubah Angka menjadi Alphabet pada penamaan kolom Excel (vice versa)
slug: /blog/2017/10/14/php-mengubah-angka-menjadi-alphabet-pada-penamaan-kolom-excel-vice-versa/
date: 2017-10-14
---

## Pendahuluan

Dalam program Excel, penomoran kolom menggunakan alphabet, dari huruf A ke huruf Z.

 - Kolom ke-1 diberi nama huruf A.
 - Kolom ke-26 diberi nama huruf Z.
 - Kolom ke-27 diberi nama huruf AA.

## Pertanyaan

Pertanyaan sederhana:

 - Bagimana dengan kolom `411`? Berapakah alphabetnya?
 - Bagimana dengan kolom `212`? Berapakah alphabetnya?
 - Bagimana dengan kolom `313`? Berapakah alphabetnya?

Sebaliknya:

 - Kolom AAA berada pada urutan keberapa?
 - Kolom ZZZ berada pada urutan keberapa?
 - Kolom `ANIES` berada pada urutan keberapa?
 - Kolom `SANDI` berada pada urutan keberapa?

## Mari berfikir (Brainstorming)

 - Setelah urutan ke 26, maka kembali menggunakan alphabet A.
 - Berarti ini adalah bilangan berbasis 26 karakter. Membersamai bilangan popular lainnya: biner, decimal, hexadecimal, dan octal.

## Mari membuat fungsi

Untuk menjawab pertanyaan diatas, dibuatlah 2 (dua) fungsi untuk mengakomodir 
kebutuhan convert angka ke alphabet dan sebaliknya (vice versa) pada penamaan
kolom di Excel.

Fungsi `number_to_alphabet` untuk mengubah angka menjadi alphabet.

Fungsi `alphabet_to_number` untuk mengubah alphabet menjadi angka.

Code fungsi terdapat pada lampiran.

Untuk mengetestnya, run code dibawah ini:

```php
for ($x=1; $x<=1000; $x++) {
    echo 'number_to_alphabet('.$x.') = ',$y = number_to_alphabet($x),'; ';
    echo 'alphabet_to_number('.$y.') = '.alphabet_to_number($y).'; ';
    echo PHP_EOL;
}
```

Contoh output hasil code diatas adalah sbb:

```
...
number_to_alphabet(1) = A; alphabet_to_number(A) = 1;
number_to_alphabet(2) = B; alphabet_to_number(B) = 2;
...
number_to_alphabet(15) = O; alphabet_to_number(O) = 15;
number_to_alphabet(16) = P; alphabet_to_number(P) = 16;
...
number_to_alphabet(999) = ALK; alphabet_to_number(ALK) = 999;
number_to_alphabet(1000) = ALL; alphabet_to_number(ALL) = 1000;
```

Dengan fungsi tersebut, maka pertanyaan diatas dapat kita jawab sbb:

```
foreach (array(411,212,313) as $x) {    
    echo 'number_to_alphabet('.$x.') = ',$y = number_to_alphabet($x),'; ';    
    echo PHP_EOL;
}
foreach (array('Anies', 'Sandi') as $y) {        
    echo 'alphabet_to_number('.$y.') = '.alphabet_to_number($y).'; ';
    echo PHP_EOL;
}
```

Hasilnya adalah sbb:

```
number_to_alphabet(411) = OU;
number_to_alphabet(212) = HD;
number_to_alphabet(313) = LA;
alphabet_to_number(Anies) = 709273;
alphabet_to_number(Sandi) = 8709697;
```


## Lampiran

```php

/**
 * Sumber: https://icesquare.com/wordpress/example-code-to-convert-a-number-to-excel-column-letter/
 */
function number_to_alphabet($number) {
    $number = intval($number);
    if ($number <= 0) {
        return '';
    }
    $alphabet = '';
    while($number != 0) {
        $p = ($number - 1) % 26;
        $number = intval(($number - $p) / 26);
        $alphabet = chr(65 + $p) . $alphabet;
    }
    return $alphabet;
}

/**
 * Fungsi ini membutuhkan PHP versi 5.6 karena membutuhkan Exponentiation.
 * @see: http://php.net/manual/en/language.operators.arithmetic.php
 * Sumber: @self.
 */
function alphabet_to_number($string) {
    $string = strtoupper($string);
    $length = strlen($string);
    $number = 0;
    $level = 1;
    while ($length >= $level ) {
        $char = $string[$length - $level];
        $c = ord($char) - 64;        
        $number += $c * (26 ** ($level-1));
        $level++;
    }
    return $number;
}
```

## Reference

https://ryanstutorials.net/binary-tutorial/binary-conversions.php

https://icesquare.com/wordpress/example-code-to-convert-a-number-to-excel-column-letter/

Google: excel convert column alphabet to number php