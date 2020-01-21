---
title: 'Optimize with HTTP/2 Server Push and Service Workers!'
date: '2017-03-01'
---

HTTP/2 is being used in ~12% of the websites in the World Wide Web, but certainly the number is higher in the websites we visit the most. If you want to understand better how HTTP/2 works and how to debug it, take a look at our latest blogposts: [HTTP/2: a look into the future of the web](https://blog.yld.io/2017/01/10/http-2-a-look-into-the-future-of-the-web/) and [Alternatives do HTTP/2!](https://blog.yld.io/2017/02/08/alternatives-to-http/).

In this blogpost we are going to use one of the coolest features of HTTP/2: Server Push. In summary, server push allows the server to send data to the client right after the handshake, without the client requesting it (sending a PUSH_STREAM). The client still has the possibility to reject messages (sending a RST_STREAM) if it already has recent cached resources that can be used.

Service Workers are not new and there is plenty of information about them all over the web. To sum up, they have a specific lifecycle (installing, waiting, active, etc.) and allow, among other things, to intercept fetch requests and cache resources that will be used when the user goes offline. If you're new to Service Workers, you can find more information about Service Workers at [W3C - Service Workers Specification](https://w3c.github.io/ServiceWorker/), [Google - "Service Workers: an Introduction"](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) or [Mozilla - "Using Service Workers"](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

Please take into consideration that not only Service Workers need HTTPS, but also HTTP/2 requires HTTPS to work on browsers.

You can find the code examples at this [Github repo](https://github.com/yldio/serverpush-serviceworkers-example).

## Adding HTTP/2

In the following examples we used the [node-spdy](https://github.com/spdy-http2/node-spdy) module. There are some HTTP/2 solutions already for Node.js and, in general, the API is quite similar. The initial request (index) is the best opportunity to push resources from the server to the client, because after connection establishment, the server knows what resources the client will need.

In our example two files will be pushed along with the HTML response, `style.css` and `app.js`, which will respectively [add styles](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/assets/style.css) to the page and [register the service worker](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/public/app.js).

In the following example we added the index route and push `styles.css` to the response. We also added a validation to understand if we're using SPDY or not (basically it validates if we are using HTTP/2, see [our blogpost about it for details](https://blog.yld.io/2017/01/10/http-2-a-look-into-the-future-of-the-web/)). If we are not using HTTP/2, we can't use server push and have to find alternatives and a fallback to HTTP/1.x.

```js
const styles = fs.readFileSync('assets/style.css');

app.get('/', function (request, response) {

  if (!request.isSpdy) {
    return response.end('SPDY is off. We cannot use Server Push :(')
  }

  response.push('/style.css', {
    response: {
      'Content-Type': 'text/css'
    }
  }, function(err, stream){
    if (err) {
      return;
    }
    stream.end(styles);
  });

  // ...
```

Another consideration when using HTTP/2 is the importance of having a certificate, because modern browsers only support HTTPS. We generated our certificates for testing and added them to server creation, as follows:

```js
const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt'),
  ca: fs.readFileSync('keys/server.csr'),
}

const server = spdy.createServer(options, app)

server.listen(3000, () => {
  console.log(`Server started on port ${server.address().port}`)
})
```

![Initial requests received in Chrome Dev tools Network tab](https://cloud.githubusercontent.com/assets/1150553/23161534/7aa54d94-f822-11e6-9c70-b1302e75b701.png)

_(Image: Initial load - take a look into the Initiator column where you can find the pushed resources. Because `style.css` was pushed, 'Hello, World!' message has a aquamarine background.)_

More routes can be found in [index.js file](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/index.js), namely for the Service Worker and support for other assets required. Take into account that we only served static files (e.g. `app.use(express.static('public'))`) after the declaration of the index route, because otherwise pushed resources wouldn't be pushed, but retrieved by Express.js first.

## Adding Service Workers black magic

As we mentioned before, [app.js](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/public/app.js) registers the Service Worker in our page. We decided to cache some resources and intercept all fetches as you can observe in [sw.js](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/sw.js).

The install hook basically caches every URL we add to `addAll` function. In this case our list of URLs is as follows:

```js
let urls = ['/', 'app.js', 'favicon.ico', 'picture.png', 'style.css']
```

You can add every URL you want to that list, but you have to be careful, because the more URLs you have, the higher the probability that one of them may fail. In the case of one failing request, the cache will not store anything.
Having more than one cache may help to diminish this issue and it may also be the desired behaviour because, for example, you may want to separate images cache from other URL cache. Moreover, as a developer you should also be aware of user storage limits and limited mobile data plans (and do not cache everything!).

![Cache storage shows resources being cached with service worker](https://cloud.githubusercontent.com/assets/1150553/23161145/d66e981c-f820-11e6-9782-78cc3e6ca96e.png)

_(Image: Cached resources - taking a look into Developer tools > Application > Cache Storage allows to understand what was stored in the cache and how many caches we have.)_

We mentioned that Service Workers allow the interception of fetch events, and an example of it can be found in the following code:

```js
this.addEventListener('fetch', function(event) {
  var response
  event.respondWith(
    caches
      .match(event.request)
      .catch(function() {
        return fetch(event.request)
      })
      .then(function(r) {
        response = r
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, response)
        })
        return response.clone()
      })
      .catch(function() {
        return caches.match('picture.png')
      })
  )
})
```

When the client tries to fetch a resource, the Service Worker will try to see if there's a match inside any of the caches. If a match is found, it is going to be retrieved. Otherwise, the fetch is initiated and the server is contacted. If everything goes well and server can be contacted, the requested URL is going to be added to the cache (`cache.put(event.request, response)`). If the server can't be contacted due to some network issue, the Service Worker provides a fallback to `picture.png`.

You can test this behaviour turning off WIFI or setting offline mode in developer tools (Open developer tools > Application > Service Workers > Toggle Offline mode). `old-picture.png` is not being added to Service Worker cache and when we try to request the page again without connection to the internet, `picture.png` is retrieved instead:

![Service workers loaded in page](https://cloud.githubusercontent.com/assets/1150553/23161166/ea8c6266-f820-11e6-8713-be5f37e0423e.png)

_(Image: Offline load - `picture.png` is used as a fallback to `old-picture.png`, which was not stored in the cache.)_

![Developer Tools shows resources loaded from service worker](https://cloud.githubusercontent.com/assets/1150553/23256228/88b8e37e-f9b6-11e6-8e41-04fbb87cd350.png)

_(Image: Offline load - All files were retrieved from the Service Worker.)_

## FAQ and Hints

### 1. These certificates don't allow me to play with Service Workers

If you're receiving the following message, it means that you don't have a valid certificate.

![Failed to register the service worker: An SSL certificate error occurred when fetching the script](https://cloud.githubusercontent.com/assets/1150553/23176752/5bc870c4-f85c-11e6-8f49-0dd8a0292106.png)

_(Image: Invalid certificate error.)_

Quoting [Mozilla documentation](https://developer.mozilla.org/en-US/docs/Web/Security/Weak_Signature_Algorithm), "SHA-1 certificates will no longer be treated as secure by major browser manufacturers beginning in 2017.". A solution to this is adding a valid and authorized certificate given by a Certificate Authority (CA).

For example, for Firefox, you can easily find a [list of legitimate CA for Firefox](https://mozillacaprogram.secure.force.com/CA/CACertificatesInFirefoxReport). If you take a look at that list, you will see [Let's Encrypt](https://letsencrypt.org/) there, which is a free and legitimate CA. There are several [hosting providers that support Let's Encrypt](https://community.letsencrypt.org/t/web-hosting-who-support-lets-encrypt/6920).

However, in the context of our blogpost and as example we did not want to setup a certificate. Our workaround to test this example was to open Google Chrome with `--ignore-certificate-errors` flag and set up our Service Worker with `insecure` flag. Please make sure you never use this in production.

```js
navigator.serviceWorker.register('/sw.js', { insecure: true }) // don't do this
```

### 2. When I request the files for the first time and the Service Worker installs, it requests the files twice...

In our example, both `style.css` and `app.js` were pushed when index page is retrieved. But `app.js` registers the Service Worker and the Service Worker tries to cache some files using `cache.addAll` function. However, these files are requested again. We tried to add Cache-Control headers, but without success.

We observed that connection Id is different in the first request (the index page) and the rest of the files (that Service Worker requests). This is an important detail that should be documented because, by default in Chrome, two different connections are created in HTTP/2 for credentialed and non-credentialed requests. Both initial requested and pushed resources by/to the client are credentialed (e.g. the pushed `app.js` file), but `picture.png` or `app.js` in the Service Worker cache were not credentialed by default. An important note to take into account is that HTTP cache and HTTP/2 cache work in a different ways.

With Jake Archibald's help, we added `{ credentials: 'include' }` to our [install hook](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/sw.js#L3) in the Service Worker, which guaranteed that fetch requests were credentialed and same connection is used. For further details, please see [this explanation](https://github.com/whatwg/fetch/issues/354#issuecomment-281351847).

There was also something else making our implementation retrieving the resources twice. The problem was related to the first hint, because when we open Chrome with `--ignore-certificate-errors` it won't put requested URL in the cache. Generating valid certificates and launching Chrome without that flag make everything work as expected.

The problem was that index was requested by window (first request), and `style.css` was pushed into HTTP/2 cache. So far so good!... but `style.css` is included in the index file and when it is going to be requested (by window) it should use the HTTP/2 cache. It didn't happen because the certificate was not legitimate. When `style.css` is fetched by the Service Worker, the file is no longer in the HTTP/2 cache nor HTTP cache. That's why it resulted in a new fetch. With a valid certificate, `{ insecure: true }` removed from Service Worker registration, `{ credentials: 'include' }` in the Service Worker install hook and [caching headers to correspondent resources](https://github.com/yldio/serverpush-serviceworkers-example/blob/master/index.js#L27), everything works fine.

![Pushed resources in Network tab](https://cloud.githubusercontent.com/assets/1150553/23367424/1742049c-fd02-11e6-92ce-df17814bdca5.png)

_(Image: Working example with a valid certificate and cached resources - The two pushed resources are cached and later retrieved from disk cache, when Service Worker tries to request them.)_

### 3. Why we decided to use [Express.js](http://expressjs.com) instead of [Hapi.js](https://hapijs.com) in this example

For the purpose of this demonstration, we decided to use Express.js framework. The reason behind it is because Express `request` and `response` are exactly the same HTTP objects provided by Node.js. In the examples we decided to use [node-spdy](https://github.com/spdy-http2/node-spdy) module.
On the other hand, if you are using Hapi.js, which we strongly recommend for large projects and teams, there are already solutions for it ([follow HTTP/2 thread on Hapi.js community](https://github.com/hapijs/hapi/issues/2510)).

## Final thoughts

**Try it out!**

Using HTTP/2 Server Push and Service Workers together may help you to optimize your website load and figure out how to deliver the best possible content to your clients. Don't forget to checkout and play with our [code example at Github](https://github.com/yldio/serverpush-serviceworkers-example) and contact us if you need help.

**Acknowledgments:**

Thanks to Jake Archibald ([@jaffathecake](https://twitter.com/jaffathecake) on Twitter) for helping debugging.

_Originally published at [blog.yld.io](https://blog.yld.io/) on March 1, 2017 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
