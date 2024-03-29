---
title: 'Security Trivia Series: Hints on default-src CSP directive'
date: '2019-02-25'
icons: []
---

[Content-Security-Policy (CSP) header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/) is well-known to help to guarantee security on your website by setting allowed trusted origins in a declarative way.

`Content-Security-Policy: <directive> <source>;`

Directives could be source-src, img-src, font-src, [and many others](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) and source (or sources) will have the allowed URL you trust. For example, if you want to list all image URL using a img-src directive you would have the following:

`Content-Security-Policy: img-src https://http.cat/200;`

This will allow only `https://http.cat/200` to be fetch, whereas if we try to have an HTML `img` tag that links to `https://some-other-image.jpg` it will not initiate the request and will give the error:

![An image is not being rendered in browser because it fails CSP](https://user-images.githubusercontent.com/1150553/52958954-165b5380-338d-11e9-950f-1e36ff3c149c.png)

### But what about `default-src`?

`default-src` is a directive that sets the default for other directives. It means that if you set it to

`Content-Security-Policy: default-src https://some-link-in-my-website.com;`

only the URL to https://some-link-in-my-website.com will be allowed (for fonts, scripts, or other).

If you already have everything working and you just want to add CSP directives it could be a good idea to set

`Content-Security-Policy: default-src 'none';`

It will disallow every request and log all warnings in console, so you will be able to check which ones you need to add to the list.

![default-src: 'none' can help to identify CSP violations](https://user-images.githubusercontent.com/1150553/52959059-4dca0000-338d-11e9-8409-58b6c078081e.png)

Looking at these errors we can figure out that we have two images, one iframe and one script and it also hints about the directives you should be using to grant permission to these sources. A possible solution is the following:

```
Content-Security-Policy:
  default-src 'self';
  img-src https://http.cat/200 https://some-other-image.jpg;
  frame-src https://some-ad.com;
  script-src https://some-external-script.js;
```

Note that we set `default-src` to `'self'` (single quotes are required!) which means everything not specified will default to the current origin.

### What if we do `Content-Security-Policy: default-src https:;`?

`Content-Security-Policy: default-src https:;` is a good trick to default every possible request to use HTTPS. It disallows the use of HTTP resources. If all network connections your website points to are using HTTPS, you should use this. If not, you should update all your resources to use HTTPS and then change it.

![Use HTTP everywhere](https://user-images.githubusercontent.com/1150553/52959932-75ba6300-338f-11e9-9871-d44b82ffd153.png)

CSP allows us to introduce an extra interesting level of security and helps fight Cross-Site Scripting (XSS) attacks. It gives some work to set up, but it makes it worth. We explored CSP `default-src` directive and we gave some interesting hints in this blogpost, but checkout [MDN docs on default-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src) if you want to check out all options.

Want to know more? We will cover `report-uri` directive in another blogpost, follow us and stay tuned!

_Originally published at [blog.yld.io](https://blog.yld.io/) on February 25, 2019 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
