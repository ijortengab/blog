---
title: PHP - Array ke Excel
slug: /blog/2017/10/15/array-excel/
date: 2017-10-15
---

## Pendahuluan

Misalnya kita memiliki data yang tidak lengkap seperti contoh dibawah ini.

```php
$data1 = array(
    'Nama Lengkap' => 'Budi',
    'Usia' => '12 tahun',
    'Jenis Kelamin' => 'Laki-laki',
);
$data2 = array(
    'Nama Lengkap' => 'Ani',
    'Usia' => '13 tahun',
    'Jenis Kelamin' => 'Perempuan',
    'Hobby' => 'Menggambar',
);
$data3 = array(
    'Nama Lengkap' => 'Rika',
    'Usia' => '11 tahun',
    'Alamat' => 'Condet',
);
```

## Pertanyaan

Bagaimana caranya agar data diatas bisa tampil di Excel seperti dibawah ini:

| Nama Lengkap | Usia     | Jenis Kelamin | Hobby      | Alamat |
|--------------|----------|---------------|------------|--------|
| Budi         | 12 tahun | Laki-laki     |            |        |
| Ani          | 13 tahun | Perempuan     | Menggambar |        |
| Rika         | 11 tahun |               |            | Condet |

## Gerak Cepat

Download PHPExcel menggunakan [Composer][1].

```
composer require phpoffice/phpexcel
```

Jalankan code dibawah ini pada browser. Finish.

```php

// Load Class.
require ('vendor/autoload.php');

// Create new object.
$objPHPExcel = new PHPExcel();

// Ambil semua data.
$data1 = array(
    'Nama Lengkap' => 'Budi',
    'Usia' => '12 tahun',
    'Jenis Kelamin' => 'Laki-laki',
);
$data2 = array(
    'Nama Lengkap' => 'Ani',
    'Usia' => '13 tahun',
    'Jenis Kelamin' => 'Perempuan',
    'Hobby' => 'Menggambar',
);
$data3 = array(
    'Nama Lengkap' => 'Rika',
    'Usia' => '11 tahun',
    'Alamat' => 'Condet',
);
$data = array($data1, $data2, $data3);

// Ambil semua key informasi sebagai header dari table di Excel.
// $fields = array("Nama Lengkap", "Usia", "Jenis Kelamin", "Hobby", "Alamat");
$fields = array();
foreach ($data as $each) {
    $fields += array_flip(array_keys($each));
}
$fields = array_keys($fields);

// Set header table Excel pada baris pertama.
$row_num = 1;
foreach ($fields as $key => $value) {    
    $col_alp = PHPExcel_Cell::stringFromColumnIndex($key);
    $cell = $col_alp.$row_num;
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue($cell, $value);
}

// Set data table Excel pada baris kedua dan seterusnya.
$row_num = 2;
foreach ($data as $each) {
    $_fields = array_keys($each);
    while ($_field = array_shift($_fields)) {
        $key = array_search($_field, $fields);        
        $col_alp = PHPExcel_Cell::stringFromColumnIndex($key);
        $cell = $col_alp.$row_num;
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($cell, $each[$_field]);
    }
    $row_num++;
}

// Download.
header('Content-Type: application/vnd.ms-excel');
$filename = 'Download';
header('Content-Disposition: attachment;filename="'.$filename.'.xls"');
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('php://output');
```

[1]: /blog/2017/04/09/composer-adalah/