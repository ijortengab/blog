---
title: Drupal 8 - Page Alter
---

## Pendahuluan

Path `/user/register` digunakan untuk formulir pendaftaran, sementara path `/user/password` digunakan untuk formulir lupa password. Contoh: `https://www.drupal.org/user/password`.

Bagaimana caranya agar kedua path tersebut tidak bisa diakses umum?

## Gerak Cepat

Buat module dengan nama `page_alter`. Pastikan tidak ada module tersebut di drupal.org agar tidak bentrok. 

```
ijortengab@server:~$ curl -s --head https://www.drupal.org/project/page_alter | grep HTTP
HTTP/1.1 404 Not Found
ijortengab@server:~$
```

Masuk ke direktori Drupal dan buat folder `page_alter`.

```
cd ~/public_html
cd modules
mkdir page_alter
cd page_alter
```

Buat file `page_alter.info.yml`.

```yml
name: Page Alter
type: module
description: 'Mengganti informasi Page.'
package: Custom
core: 8.x
```

Gunakan drush untuk meng-enable module tersebut.

```
drush en page_alter
```

Buat method `\Drupal\page_alter\Routing\RouteSubscriber::alterRoutes` dengan membuat file berlokasi:

```
src/Routing/RouteSubscriber.php
```

Isi file tersebut:

```php
<?php

namespace Drupal\page_alter\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

    /**
    * {@inheritdoc}
    */
    protected function alterRoutes(RouteCollection $collection) {        
        if ($route = $collection->get('user.register')) {            
            $route->setRequirement('_access', 'FALSE');
        }
        if ($route = $collection->get('user.pass')) {            
            $route->setRequirement('_access', 'FALSE');
        }
    }
}
```

Jalankan method tersebut dengan mendaftarkannya pada file `page_alter.services.yml`.

Isi file tersebut:

```yml
services:
  page_alter.route_subscriber:
    class: Drupal\page_alter\Routing\RouteSubscriber
    tags:
      - { name: event_subscriber }
```

Clear cache dengan menggunakan drush.

```
drush cr
```

Finish. 

## Reference

<https://www.drupal.org/docs/8/converting-drupal-7-modules-to-drupal-8/d7-to-d8-upgrade-tutorial-convert-hook_menu-and-hook>

<https://www.drupal.org/node/2187643>
