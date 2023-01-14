---
title: Drupal 8 - Membuat Custom Module - part 2 - Redirect
slug: /blog/2018/11/16/drupal-8-custom-module-2/
date: 2018-11-16
---

## Studi Kasus

Domain `biography` dan subdomain wildcard `*.biography.id` menggunakan resource Drupal yang sama.

Buatlah module agar untuk sementara seluruh kunjungan ke subdomain wildcard `*.biography.id` agar diarahkan ke domain utama `biography.id` terlebih dahulu.

## Gerak Cepat

Module kita namakan `biography_subdomain`.

```
mkdir -p modules/biography/biography_subdomain
cd modules/biography/biography_subdomain
```

Di dalam direktori module, buat file dengan path: `biography_subdomain.info.yml`.

```
touch biography_subdomain.info.yml
```

dengan content:

```
name: Subdomain Manager
description: Mengatur subdomain dari domain biography.id.
package: Biography
type: module
core: 8.x   
```

Di dalam direktori module, buat file dengan path: `src/BiographySubdomainRedirect.php`.

```
mkdir -p src
touch src/BiographySubdomainRedirect.php
```

dengan content:

```php
<?php
namespace Drupal\biography_subdomain;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\Core\Routing\TrustedRedirectResponse;
/**
 * Provides a MyModuleSubscriber.
 */
class BiographySubdomainRedirect implements EventSubscriberInterface {
  /**
   * @see Symfony\Component\HttpKernel\KernelEvents for details
   *
   * @param Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   *   The Event to process.
   */
  public function checkRedirectBiographySubdomain(GetResponseEvent $event) {
    if ($event->getRequest()->getHost() !== 'biography.id') {
        $event->setResponse(new TrustedRedirectResponse('https://biography.id/'));
    }
  }
  /**
   * {@inheritdoc}
   */
  static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = array('checkRedirectBiographySubdomain', 2000);
    return $events;
  }
}
```

Di dalam direktori module, buat file dengan path: `biography_subdomain.services.yml`.

```
touch biography_subdomain.services.yml
```

dengan content:

```
services:
  biography_subdomain.redirect_event_subscriber:
    class: Drupal\biography_subdomain\BiographySubdomainRedirect
    tags:
      - { name: 'event_subscriber' }
```

Aktifkan module biography_subdomain:

```
drush en -y biography_subdomain
```

Kunjungi url `apapun.biography.id`, maka akan redirect ke domain utama, yakni: `biography.id`.

## Penjelasan

Pada Drupal 8, `hook_init()` dan `hook_boot()` digantikan oleh Symfony Event.

Buat class yang meng-implements `EventSubscriberInterface` kemudian daftarkan class tersebut pada module services `biography_subdomain.services.yml`.

Fungsi `drupal_goto()` digantikan dengan Symfony ResponseRedirect yang mana untuk URL eksternal, Drupal mengharuskan menggunakan class `TrustedRedirectResponse`.

## Referensi

https://github.com/biography-id/biography_subdomain

[hook_init() removed](https://www.drupal.org/node/2013014)

[hook_boot() has been removed](https://www.drupal.org/node/1909596)

[drupal_goto() has been removed](https://www.drupal.org/node/2023537)