---
title: 'HTTP/2: a look into the future of the web'
date: '2017-01-10'
---

This article aims to be theoretical and practical, not only giving an overview about the HTTP/2 protocol, but also giving and explaining how to dig in with some tools.

HTTP/2 is the next version of the HTTP protocol and aims to be more performant in comparison with the HTTP/1.x versions. It was published in 2015 and is based on [SPDY](https://developers.google.com/speed/spdy/), that was created by Google in 2012, which main goal was to reduce latency between client and server communications.

### 1. Main differences and features

The first thing we should consider is that HTTP/2 is a protocol that introduces some changes, despite the fact it remains with the same semantics (see [HTTP/2 Protocol - RFC 7540](https://tools.ietf.org/html/rfc7540) for details). As a consequence, this means that looking into developer tools Network tab will still allow to inspect interactions and applications should work as before.

However, there are some important differences in this protocol and some of the actions we were used to do to improve performance will no longer be needed.

The main difference is the **new Binary Framing Layer**, where exchanges between client and server are performed using a binary format. Messages, which are composed by several frames, are transfered using streams. Streams grant request and response multiplexing because they allow splitting an HTTP message into different frames. Finally, frames are joint taking into account the stream IDs and messages can be processed by the client or the server, depending on who sent the message. As a consequence, HTTP/2 allows more efficient use of TCP connections (only one connection per origin is required) in comparison with HTTP/1.x, where a maximum of 6 connections could be used.

![Connection Streams](https://hpbn.co/assets/diagrams/8e6931bb40fc26c511ad15645e7b6113.svg)

*(image source: https://hpbn.co/http2/ book)*

There are some other features that HTTP/2 gives, such as: (1) **Stream Prioritization**, which allows client (browsers) to prioritize what is more important to be received first (e.g client receiving JavaScript and CSS files is more important than receiving images); (2) **Server Push**, that gives permission to the server to send content (frames) to the client without having a request, if it obeys to the same origin; and (3) **Header Compression** with [HPACK - RFC 7541](https://tools.ietf.org/html/rfc7541), which uses Huffman to create smaller headers and requires server and client to store a list with that information.

To better understand HTTP/2 we recommend reading [High Performance Browser Networking](http://shop.oreilly.com/product/0636920028048.do) and watching Ilya Grigorik's talk [Yesterday's perf best-practices are today's HTTP/2 anti-patterns](https://www.youtube.com/watch?v=yURLTwZ3ehk).

Due to the nature of HTTP/2, there are some features we're used to do to optimize HTTP/1.x that are no longer needed. Some examples include resource inlining, which can be sent more efficiently using server push or concatenation of multiple files to optimize connections used, that are no longer needed because we can send multiple frames. Both operations with HTTP/2 allow efficient resources caching.

### 2. Implementation

The protocol implementation require actions from both the browser vendors (Chrome, Firefox, etc) and the servers we create for our applications.
Most browsers already support HTTP/2 and you can take a look at [caniuse/http2](http://caniuse.com/#feat=http2) list to confirm this information. Moreover, despite the fact that HTTP/2 does not require TLS, all browsers enforced HTTPS for security reasons.

There are already several [implementations](https://github.com/http2/http2-spec/wiki/Implementations) in different languages of the HTTP/2 protocol. For example, [NGINX](https://www.nginx.com/) and [h2o](https://h2o.examp1e.net/) were pioneers doing server implementation of HTTP/2.

Regarding NodeJS, there is an implementation for SPDY algorithm ([github.com/indutny/node-spdy](https://github.com/indutny/node-spdy)) created about two years ago, that also has a fallback for browsers. If we look at the project history, it seems that it is still being worked on, and supports HTTP/2.
Nevertheless, the most recent, popular and work in progress implementation can be found in [github.com/nodejs/http2](https://github.com/nodejs/http2) repository, and it aims to be included in the NodeJS core (still to be decided if it is going to be through an external module or if it's going to be added in the core).

### 3. Considerations

Header compression is done using with HPACK and Google investigated a lot before creating it (in de beginning SPDY used gzip, but it was abandoned due to security issues). Despite the fact the algorithm can efficiently reduce header length, it requires that both server and client to keep the state and be up to date with each other, since connection started, which adds some complexity.

Notwithstanding server push being one of the most interesting topics regarding HTTP/2 implementation, a push stream may be rejected from the client (using RST_STREAM). When this happens, some frames may already have been sent to the client and it wastes bandwidth.

HTTP/2 has its own flow control and prioritization and this also introduces some complexity to the implementations. For instance, different browsers implement prioritization (which adds dependency and weight concepts) in different ways. An incorrect implementation may lead to TCP Head of line blocking by breaking interleaving (for example, if we have a queue of streams that depend on each other, we can't go to the next one without finishing the current one).

There are some small differences in the HTTP responses. In the following image you can see two websites, [https://github.com/](https://github.com/) and [https://http2.golang.org/](https://http2.golang.org/), the first is served using HTTP/1.x and the second using HTTP/2. The IP address and the port (443) unveil a TLS connection.

![Request to github.com on the left and request to golang.org (using HTTP/2) on the right](https://cloud.githubusercontent.com/assets/1150553/21646955/4cbca880-d290-11e6-8d4e-13d9a5bc8519.png)

You can immediately notice that this is a HTTP/2 website if you look at the status code field. In HTTP/1.x it has both the code and the message (200 OK), whereas in HTTP/2 it only has the code (200). This may be an API breaking change for some frameworks we are used to work with. For example, the following line to send custom error messages in [Express](http://expressjs.com/) will no longer work.

```javascript
res.status(500).send('My awesome internal server error') // this may be considered an anti-pattern
```

Although the HTTP/2 working group desperately needs community input on real world application cases, [there aren't many website supporting the protocol yet](https://w3techs.com/technologies/details/ce-http2/all/all). However, is expected that this number grows this year due to browser and server implementations of the HTTP/2 specification. A solution to support this change may be to have applications using both protocol versions, that will allow to migrate incrementally to HTTP/2. We personally think that HTTP/1.x will stay alive for some years because we are going to have some users using older browser versions and websites without maintenance that do not support the new protocol.

### 4. Try it!.. with Wireshark

One of the best ways to learn something is by doing it. So let's try it out using [Wireshark](https://www.wireshark.org)! Wireshark is a tool that lets you inspect what is happening in the network. It provides information similar to what `tcpdump` gives, but with a friendly UI.

#### 4.1 Decrypt TLS

In this example we are going to use [https://http2.golang.org/](https://http2.golang.org/) website because it provides an interesting set of examples (see "Handlers for testing" section in their website) that we could try with Wireshark. Another possible idea could be to implement your own HTTP/2 server and test Wireshark against it.

We tried to `curl` golang's website, but the response indicates that the server only supports access over TLS. Taking this into account, we decided to find another alternative and use the browser to test this. Please follow this [tutorial](https://jimshaver.net/2015/02/11/decrypting-tls-browser-traffic-with-wireshark-the-easy-way/) to log a session key and use the created key in Wireshark SSL preferences. After finishing the tutorial you should be able to see the decrypted SSL data with the handshakes, acknowledgements, and HTTP/2 specific frames (headers, data, and so on):

![Wireshark inspection that shows with protocol is being used in client-server communications and which packets are sent in each stream](https://cloud.githubusercontent.com/assets/1150553/21653548/9205d57e-d2a9-11e6-8476-4f1e99560535.png)

#### 4.2 Inspect

In the first exchanged messages from the last image, you will be able to see the TLS handshake between client and server. It started with Client sending "Client Hello" message, using TLS v1.2 and sending information such as SessionID, ciphers client support, random values and extensions supported (namely, ALPN).

In the following image you can see information about Application-Layer Protocol Negotiation (ALPN) used in HTTP/2: first, it's going to try to communicate using H2 (abbv. for HTTP/2), but if it is not possible it will fallback to SPDY/3.1 or HTTP/1.1.

![Detail on Client Hello message and which protocols can be used and in which order (h2, spdy, http/1.1)](https://cloud.githubusercontent.com/assets/1150553/21677216/15d9f48e-d331-11e6-82e5-c9a4658d92a1.png)

After receiving "Client Hello" message, the server will answer with a "Server Hello" message that has the information about cipher and protocol selected to exchange further messages. Taking into account that golang's website server supports HTTP/2, it was the protocol selected as you may expect from the previous images. Please note that the major key point in using ALPN protocol is that it improves latency, removing one TLS handshake. It's out of the scope of this blogpost to explain in detail how ALPN works, but you can find [more information about ALPN here](https://tools.ietf.org/html/rfc7301).

The first HTTP/2 frames exchanged between client and server were agreements to determine what should be the window and frame maximum allowed sizes (SETTINGS, WINDOW_UPDATE), stream weights and dependencies (PRIORITY), and the first GET request to `/gophertiles?latency=200` (HEADERS, No. 186). If you're really curious about the "Magic" connection preface frame that appears in the image, take a look at the [HTTP/2 Protocol - RFC 7540](https://tools.ietf.org/html/rfc7540#section-3.5) to understand why the working group picked it to guarantee that this is a HTTP/2 connection.

Using [HTTP/2 Wireshark Filters](https://www.wireshark.org/docs/dfref/h/http2.html), we can easily observe particular frames. For the purpose of having an interesting example, we tested [https://http2.golang.org/gophertiles?latency=200](https://http2.golang.org/gophertiles?latency=200) which downloads some images using HTTP/2 and 200ms of latency. In the following image the reader can see that we have done a filter by stream id (`http2.streamid == 15`):

![Detail on stream 15: example of header message](https://cloud.githubusercontent.com/assets/1150553/21689106/37e34e32-d367-11e6-812e-9e71fb7af617.png)

The above example clearly shows that:

- This is a client initiated stream, because 15 is an odd number and in HTTP/2 odd numbers mean client initiated streams whereas a even stream ID means server initiated.
- [*No. 207*] A client initiated request (`source = 192.168.2.18`) with HEADERS and WINDOW_UPDATE frames. HEADERS has information about the flags, request (method, path, etc) and other important headers such as what is expected to be received (in our example, an `image/png`). The WINDOW_UPDATE frame sends information about the window size increment permitted, which means that the server can't send a response with length that exceeds this value.
- [*No. 403*] The first frame (HEADERS) given by the server for this particular stream ID. In HTTP/2, every message starts with one HEADERS or PUSH_STREAM (when we're doing server push) stream. Please figure out that you can see the decompressed header in the following Wireshark capture image, which clearly shows relevant information about the image we're requesting (e.g Content-Type, Content-length, etc).
- [*No. 405*] The DATA frame with the contents. In our example, the image itself.
- In the server HEADERS (No. 403 in the image) you can observe the flags and see that `End stream` is set to `false`, because there's still information (frames) to be sent. If you look at the DATA (No. 405) you will sign that `End stream` is `true` and this stream is finished. However, we can have multiple DATA frames being sent from the server according to the window size set, and this frame would not be the last one in that case.

Looking at the whole Wireshark capture allows to understand better how request and response multiplexing works in HTTP/2. This way is possible to clearly see the interleaved sequence of frames with HEADERS and DATA, for the request we were testing. We challenge and recommend the reader to try this approach in order to learn and understand how HTTP/2 works.

### 5. Conclusion

This article started discussing about the HTTP/2 protocol, which is an extension of HTTP/1.x. A summary about the main differences and features was provided, namely the new binary framing layer. We concluded that there are already several HTTP/2 implementations in place, and noticed some considerations regarding both the protocol and the implementation details. In the last section, we did debugging with Wireshark to demonstrate how to inspect HTTP/2. The captures provided allowed us to take a deeper look into the frames and understand them, along with some conclusions about how the protocol works.

To sum up, HTTP/2 is getting more and more attraction recently, so it is expected to have it in place in a larger number of websites we visit every day. From a developer perspective our applications will need review and adaptation because some tricks we're used to do will no longer be performant as we expect.

_Originally published at [blog.yld.io](https://blog.yld.io/) on January 10, 2017 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
