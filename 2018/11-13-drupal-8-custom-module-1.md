# Drupal 8 - Membuat Custom Module - part 1 - Custom Page


## Target

Membuat module dengan machine_name `ijortengab`.

Membuat custom page dengan route `/ijortengab` bertuliskan `Halo Dunia!`.

## Gerak Cepat

Di dalam direktori DRUPAL_ROOT, buat direktori module dengan path: `modules/ijortengab`.

```
mkdir -p modules/ijortengab
cd modules/ijortengab
```

Di dalam direktori module, buat file dengan path: `ijortengab.info.yml`.

```
touch ijortengab.info.yml
```

dengan content:

```yml
name: IjorTengab Module
description: Belajar bikin module.
package: Custom
type: module
core: 8.x   
```

Di dalam direktori module, buat file dengan path: src/Controller/IjorTengabController.php.

```
mkdir -p src/Controller
touch src/Controller/IjorTengabController.php
```

dengan content:

```php
<?php

namespace Drupal\ijortengab\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Defines HelloController class.
 */
class IjorTengabController extends ControllerBase {

  /**
   * Display the markup.
   *
   * @return array
   *   Return markup array.
   */
  public function content() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Halo dunia!'),
    ];
  }
}
```

Di dalam direktori module, buat file dengan path: ijortengab.routing.yml.

```
touch ijortengab.routing.yml
```

dengan content:

```yml
ijortengab.content:
  path: '/ijortengab'
  defaults:
    _controller: '\Drupal\ijortengab\Controller\IjorTengabController::content'
    _title: 'Halo Dunia!'
  requirements:
    _permission: 'access content'
```

Aktifkan module ijortengab:

```
drush en -y ijortengab
```


Kunjungi path `/ijortengab` pada browser dan hasilnya sukses.

## Referensi

https://www.drupal.org/developing/modules/8

https://www.drupal.org/docs/8/api

