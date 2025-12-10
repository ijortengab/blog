# Mendapatkan PathInfo dengan Class Request sederhana

---
#draft: true
---

## Pendahuluan

Project HTTP Foundation bawaan Symfony Component [menyediakan cara untuk mendapatkan informasi PathInfo][1] dengan URL mode rewrite maupun non rewrite.

[1]: /blog/2017/05/25/pathinfo-symfony-http-foundation/

Gunakan method `::getPathInfo()`. Contoh:

```php
use Symfony\Component\HttpFoundation\Request;
$request = Request::createFromGlobals();
$path_info = $request->getPathInfo();
```

## Simplifikasi

Untuk kebutuhan sederhana yang hanya memerlukan informasi PathInfo saja, maka class Request dari Symfony dapat kita pangkas sedemikian rupa sehingga menjadi relative lebih sederhana (hanya satu file).

Penyederhanaan Class ini mengakibatkan:

 - tidak ada verifikasi terhadap REVERSEPROXY
 - tidak ada verifikasi terhadap HTTP_HOST
 
Cara penggunaan:

```php
use IjorTengab\Request;
$request = new Request;
$path_info = $request->getPathInfo();
```

## Code
 
Sumber: Symfony Component - [HTTP Foundation] versi 2.8.18

License: MIT License

[HTTP Foundation]: http://symfony.com/components/HttpFoundation

{% verbatim %}
```php
namespace IjorTengab;

class Request {

    protected $server;

    protected $requestUri;

    protected $basePath;

    protected $pathInfo;

    protected $baseUrl;

    public function __construct()
    {
        $this->server = $_SERVER;
    }

    public function getPathInfo()
    {
        if (null === $this->pathInfo) {
            $this->pathInfo = $this->preparePathInfo();
        }
        return $this->pathInfo;
    }

    public function getBasePath()
    {
        if (null === $this->basePath) {
            $this->basePath = $this->prepareBasePath();
        }
        return $this->basePath;
    }

    public function getBaseUrl()
    {
        if (null === $this->baseUrl) {
            $this->baseUrl = $this->prepareBaseUrl();
        }
        return $this->baseUrl;
    }

    public function getScheme()
    {
        return $this->isSecure() ? 'https' : 'http';
    }

    public function getPort()
    {
        if (!$host = isset($this->server['HTTP_HOST']) ? $this->server['HTTP_HOST'] : null) {
            return $this->server['SERVER_PORT'];
        }
        if ($host[0] === '[') {
            $pos = strpos($host, ':', strrpos($host, ']'));
        } else {
            $pos = strrpos($host, ':');
        }
        if (false !== $pos) {
            return (int) substr($host, $pos + 1);
        }
        return 'https' === $this->getScheme() ? 443 : 80;
    }

    public function getHttpHost()
    {
        $scheme = $this->getScheme();
        $port = $this->getPort();
        if (('http' == $scheme && $port == 80) || ('https' == $scheme && $port == 443)) {
            return $this->getHost();
        }
        return $this->getHost().':'.$port;
    }

    public function getRequestUri()
    {
        if (null === $this->requestUri) {
            $this->requestUri = $this->prepareRequestUri();
        }
        return $this->requestUri;
    }

    public function getSchemeAndHttpHost()
    {
        return $this->getScheme().'://'.$this->getHttpHost();
    }

    public function isSecure()
    {
        $https = isset($this->server['HTTPS']) ? $this->server['HTTPS'] : null;
        return !empty($https) && 'off' !== strtolower($https);
    }

    public function getHost()
    {
        if (!$host = isset($this->server['HTTP_HOST']) ? $this->server['HTTP_HOST'] : null) {
            if (!$host = isset($this->server['SERVER_NAME']) ? $this->server['SERVER_NAME'] : null) {
                $host = isset($this->server['SERVER_ADDR']) ? $this->server['SERVER_ADDR'] : null;
            }
        }
        // trim and remove port number from host
        // host is lowercase as per RFC 952/2181
        $host = strtolower(preg_replace('/:\d+$/', '', trim($host)));
        // as the host can come from the user (HTTP_HOST and depending on the configuration, SERVER_NAME too can come from the user)
        // check that it does not contain forbidden characters (see RFC 952 and RFC 2181)
        // use preg_replace() instead of preg_match() to prevent DoS attacks with long host names
        if ($host && '' !== preg_replace('/(?:^\[)?[a-zA-Z0-9-:\]_]+\.?/', '', $host)) {
            return '';
        }
        return $host;
    }

    protected function prepareRequestUri()
    {
        $requestUri = '';
        if (isset($this->server['HTTP_X_ORIGINAL_URL'])) {
            // IIS with Microsoft Rewrite Module
            $requestUri = $this->server['HTTP_X_ORIGINAL_URL'];
            unset($this->server['HTTP_X_ORIGINAL_URL']);
            unset($this->server['UNENCODED_URL']);
            unset($this->server['IIS_WasUrlRewritten']);
        } elseif (isset($this->server['HTTP_X_REWRITE_URL'])) {
            // IIS with ISAPI_Rewrite
            $requestUri = $this->server['HTTP_X_REWRITE_URL'];
            unset($this->server['HTTP_X_REWRITE_URL']);
        } elseif (
            isset($this->server['IIS_WasUrlRewritten']) &&
            $this->server['IIS_WasUrlRewritten'] == '1' &&
            isset($this->server['UNENCODED_URL']) &&
            $this->server['UNENCODED_URL'] != ''
        ) {
            // IIS7 with URL Rewrite: make sure we get the unencoded URL (double slash problem)
            $requestUri = $this->server['UNENCODED_URL'];
            unset($this->server['UNENCODED_URL']);
            unset($this->server['IIS_WasUrlRewritten']);
        } elseif (isset($this->server['REQUEST_URI'])) {
            $requestUri = $this->server['REQUEST_URI'];
            // HTTP proxy reqs setup request URI with scheme and host [and port] + the URL path, only use URL path
            $schemeAndHttpHost = $this->getSchemeAndHttpHost();
            if (strpos($requestUri, $schemeAndHttpHost) === 0) {
                $requestUri = substr($requestUri, strlen($schemeAndHttpHost));
            }
        } elseif (isset($this->server['ORIG_PATH_INFO'])) {
            // IIS 5.0, PHP as CGI
            $requestUri = $this->server['ORIG_PATH_INFO'];
            if (isset($this->server['QUERY_STRING']) && '' != $this->server['QUERY_STRING']) {
                $requestUri .= '?'.$this->server['QUERY_STRING'];
            }
            unset($this->server['ORIG_PATH_INFO']);
        }
        // normalize the request URI to ease creating sub-requests from this request
        $this->server['REQUEST_URI'] = $requestUri;

        return $requestUri;
    }

    protected function prepareBaseUrl()
    {
        $filename = basename($this->server['SCRIPT_FILENAME']);

        if (basename($this->server['SCRIPT_NAME']) === $filename) {
            $baseUrl = $this->server['SCRIPT_NAME'];
        } elseif (basename($this->server['PHP_SELF']) === $filename) {
            $baseUrl = $this->server['PHP_SELF'];
        } elseif (basename($this->server['ORIG_SCRIPT_NAME']) === $filename) {
            $baseUrl = $this->server['ORIG_SCRIPT_NAME']; // 1and1 shared hosting compatibility
        } else {
            // Backtrack up the script_filename to find the portion matching
            // php_self
            $path = isset($this->server['PHP_SELF']) ? $this->server['PHP_SELF'] : '';
            $file = isset($this->server['SCRIPT_FILENAME']) ? $this->server['SCRIPT_FILENAME'] : '';
            $segs = explode('/', trim($file, '/'));
            $segs = array_reverse($segs);
            $index = 0;
            $last = count($segs);
            $baseUrl = '';
            do {
                $seg = $segs[$index];
                $baseUrl = '/'.$seg.$baseUrl;
                ++$index;
            } while ($last > $index && (false !== $pos = strpos($path, $baseUrl)) && 0 != $pos);
        }
        // Does the baseUrl have anything in common with the request_uri?
        $requestUri = $this->getRequestUri();

        if ($baseUrl && false !== $prefix = $this->getUrlencodedPrefix($requestUri, $baseUrl)) {
            // full $baseUrl matches
            return $prefix;
        }
        if ($baseUrl && false !== $prefix = $this->getUrlencodedPrefix($requestUri, rtrim(dirname($baseUrl), '/'.DIRECTORY_SEPARATOR).'/')) {
            // directory portion of $baseUrl matches
            return rtrim($prefix, '/'.DIRECTORY_SEPARATOR);
        }
        $truncatedRequestUri = $requestUri;
        if (false !== $pos = strpos($requestUri, '?')) {
            $truncatedRequestUri = substr($requestUri, 0, $pos);
        }
        $basename = basename($baseUrl);
        if (empty($basename) || !strpos(rawurldecode($truncatedRequestUri), $basename)) {
            // no match whatsoever; set it blank
            return '';
        }
        // If using mod_rewrite or ISAPI_Rewrite strip the script filename
        // out of baseUrl. $pos !== 0 makes sure it is not matching a value
        // from PATH_INFO or QUERY_STRING
        if (strlen($requestUri) >= strlen($baseUrl) && (false !== $pos = strpos($requestUri, $baseUrl)) && $pos !== 0) {
            $baseUrl = substr($requestUri, 0, $pos + strlen($baseUrl));
        }
        return rtrim($baseUrl, '/'.DIRECTORY_SEPARATOR);
    }

    protected function prepareBasePath()
    {
        $filename = basename($this->server['SCRIPT_FILENAME']);
        $baseUrl = $this->getBaseUrl();
        if (empty($baseUrl)) {
            return '';
        }
        if (basename($baseUrl) === $filename) {
            $basePath = dirname($baseUrl);
        } else {
            $basePath = $baseUrl;
        }
        if ('\\' === DIRECTORY_SEPARATOR) {
            $basePath = str_replace('\\', '/', $basePath);
        }
        return rtrim($basePath, '/');
    }

    protected function preparePathInfo()
    {
        $baseUrl = $this->getBaseUrl();

        if (null === ($requestUri = $this->getRequestUri())) {
            return '/';
        }
        // Remove the query string from REQUEST_URI
        if ($pos = strpos($requestUri, '?')) {
            $requestUri = substr($requestUri, 0, $pos);
        }
        $pathInfo = substr($requestUri, strlen($baseUrl));
        if (null !== $baseUrl && (false === $pathInfo || '' === $pathInfo)) {
            // If substr() returns false then PATH_INFO is set to an empty string
            return '/';
        } elseif (null === $baseUrl) {
            return $requestUri;
        }
        return (string) $pathInfo;
    }

    private function getUrlencodedPrefix($string, $prefix)
    {
        if (0 !== strpos(rawurldecode($string), $prefix)) {
            return false;
        }
        $len = strlen($prefix);
        if (preg_match(sprintf('#^(%%[[:xdigit:]]{2}|.){%d}#', $len), $string, $match)) {
            return $match[0];
        }
        return false;
    }
}
```
{% endverbatim %}






