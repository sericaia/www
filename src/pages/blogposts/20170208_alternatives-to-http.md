---
title: "Alternatives to HTTP/2"
date: "2017-02-08"
---

In one of our latest posts we [introduced and debugged HTTP/2](https://blog.yld.io/2017/01/10/http-2-a-look-into-the-future-of-the-web/). However we'll be exploring some other alternatives to the HTTP protocol in this post. These alternative protocols are quite interesting when we start to investigate them, since it allows us to understand how the Internet is evolving; with this post we also expect to provide a good summary about these protocols along with relevant resources to explore it further.

### WebRTC

WebRTC stands for Web Real-Time Communication and it aims to make it easy to perform a peer-to-peer (P2P) connection, allowing sharing of media (namely, audio and video) and application data. It works with several protocols to achieve this goal, which are mentioned in the right side of the following image:

![image](https://hpbn.co/assets/diagrams/f91164cbbb944d8986c90a1e93afcd82.svg)

*(image source: https://hpbn.co/http2/ book)*


One of the major differences is that WebRTC runs over the User Datagram Protocol (UDP), rather than TCP, which does not guarantee message delivery.

To start a connection is necessary to negotiate parameters between the peers, that is called signaling. This requires a server to be between the peers, and one of the peers starts doing an "offer", which the other is going to "answer", and just after it both peers start talking P2P (see figure below - "Signaling - Basic concept").

![image](https://cloud.githubusercontent.com/assets/1150553/22289556/28cf4a6c-e2f4-11e6-83e4-b51e9002caef.png)

Session Traversal Utilities for NAT (STUN) and Traversal Using Relays around NAT (TURN) take an important role here, because it may not be that easy to find a peer. In summary, STUN gives the ability to find your public IP and TURN acts as a fallback to STUN when a peer cannot be contacted. TURN is a relay server that will receive that data and stream it to the other person. (see figure below - "Signaling - Reality"). This logic is handled by Interactive Connectivity Establishment (ICE).

![image](https://cloud.githubusercontent.com/assets/1150553/22289595/53d04aa4-e2f4-11e6-9176-bdb6e3b21175.png)

WebRTC encrypts all data using Datagram Transport Layer Protocol (DTLS). To sum it up it is like TLS but for Datagrams (UDP). It does something similar to a TLS handshake, where peers have they're own certificates and exchange keys. After the handshake, all application data is encrypted when sent to the other peer. The DTLS handshake has to guarantee in-order delivery of packets as well as TCP, but after it, the packets do not need to be ordered.

There are two protocols to deliver packets in WebRTC: Secure Real-time Transport Protocol (SRTP) and Stream Control Transport Protocol (SCTP). SRTP is the protocol that is used to deliver audio and video and SCTP is used for application data. SCTP is worthy of node since it is similar to HTTP/2 framing layer: data messages are sent over streams and just like HTTP/2, they may be split in different chunks and reordered and assembled in the other peer. It's over the developer to implement which delivery method to pick, because in SRTP the chunks could be send in-order or out-of-order and in a reliable or partially reliable way.

The DataChannel allows two peers to communicate in a bidirectional way, after a RTCPeerConnection is created. The RTCPeerConnection receives ICE configurations when created and they are used when signaling is set up. Multiple messages can be exchanged through the DataChannel.

[talky.io](https://talky.io/), [jitsi](https://meet.jit.si/) and [Google Hangouts](https://hangouts.google.com) are examples of services built using WebRTC. However, [not all browsers support it](http://iswebrtcreadyyet.com/).
If you want to have a deep understanding on how WebRTC works and test it, use one of the mentioned services and check out [chrome://webrtc-internals/](chrome://webrtc-internals/).


### QUIC

Quick UDP Internet Connections (QUIC) is a protocol **very similar to HTTP/2 (with TLS and TCP), but created on top of UDP**. The goal of QUIC is the same as HTTP/2 to reduce latency. However it also tries to solve some issues that HTTP/2 has. We will take a look at the following [Wireshark](https://www.wireshark.org) capture to understand how does connection establishment works in QUIC:

![image](https://cloud.githubusercontent.com/assets/1150553/22156875/1ca2ba3c-df2d-11e6-8b82-5fe510c04298.png)

- [*No. 215*] The client starts with a Client Hello message (CHLO), which is going to be the first of (at least) two Client Hello messages for the first connection. In this first message the client creates a connection ID (CID in the image) and sends it to the client, along with some other relevant information such as supported version of the protocol or connection and stream window maximum sizes.
- [*No. 218*] Taking into account that this is the first interaction between server and client, the server sends a Rejection (REJ). The Rejection message has server configuration information (which has a server public value), a token (source-address token, that will be used in future requests) along with a proof of authenticity of the server and duration of the server config.
- [*No. 222*] Client sends a second Client Hello message, which has the acknowledge and server config information (namely, server config ID). If everything is correct, both ends can exchange data, otherwise server may send another REJ and a new Client Hello has to be sent until everything is configured as desired. Using both server config and client public value allows the client to obtain the initial keys to do the following requests. If the client already has server config, it could surpass parts of the handshake process and just send this Client Hello, achieving 0-RTT (zero round trip time), which is one of the core features of QUIC.
- [*No. 228*] This message is probably the Server Hello message (SHLO), which is now encrypted with the initial keys. It also sends another public key that will be used to create the definitive forward secure keys, that are going to be used by both sides in further requests, as soon as the client receives the SHLO. Please take into account that Wireshark is not yet able to decrypt QUIC payload messages.

The [draft RFC for QUIC](https://tools.ietf.org/html/draft-tsvwg-quic-protocol-02) and the QUIC [Crypto file](https://docs.google.com/document/d/1g5nIXAIkN_Y-7XJW5K45IblHd_L2f5LTaDUDwvZ5L6g/edit) may give us more details about the protocol, which is only supported by Google Chrome for Google web applications (e.g. Gmail).

Both QUIC and HTTP/2 protocols were created by Google. However, there are some differences between QUIC and a TCP+TLS+HTTP/2 approach:

- QUIC uses UDP instead of TCP;
- QUIC achieves 0-RTT reusing keys. QUIC does not use STCP over DTLS (such as WebRTC) because it would be too expensive: 4-RTT would be required to establish a connection, which is far away from QUIC objectives.
- Both use odd numbers for client initiated streams and even for server initiated, despite that QUIC reserves stream 1 (for the initial handshake) and 3 (to stream headers) for specific purposes.
- QUIC eliminates TCP head-of-line blocking. It's important to mention that stream multiplexing in QUIC works in a different way: **if a packet from a stream is lost, only that stream is affected and not the entire connection** (see figure below - "QUIC Streams over connection"). However, it may still have head-of-line blocking in stream 3, where headers packages are sent.

![image](https://cloud.githubusercontent.com/assets/1150553/22290151/4341ea6e-e2f7-11e6-8bfb-f4dbdd7d583e.png)

- Headers are compressed in QUIC as well as in HTTP/2 (using HPACK);
- QUIC uses a connection ID (CID) which is a random value generated by the client. This value can be reused if it did not expire. This is a huge improvement over TCP where connections are IP dependent. Moreover, using QUIC the connection ID will be the same whether the user is using WIFI or mobile data.
- QUIC implements Forward Error Correction (FEC) packets, which allow to determine contents of a packet without retransmission of a lost packet.


### IPFS

InterPlanetary File System (IPFS) is a completely new protocol (created in 2014), which uses some mature concepts. The hypothesis behind IPFS is that **HTTP its too centralized** and the way the web works today is mainly with client-server connections, in which servers are a probable point of failure. Moreover, in situations with poor access to internet we may not even get access to the contents we need.

![image](https://cloud.githubusercontent.com/assets/1150553/22425086/5a042732-e6f1-11e6-8b1d-7c5129267e1a.png)

*(image source: https://speakerdeck.com/jbenet/ipfs-hands-on-intro, on the left side it shows an centralized example - one server and many clients; in the middle, a decentralized example - multiple sources providing data; and on the right side, a distributed example - multiple peers give and receive data)*


IPFS aims to create a distributed P2P web where the web works like Git! Namely, this means that there are commits and trees for each object and everything is organized like it is in Git: using a Merkle DAG (Directed Acyclic Graph). **Every object has an hash, and obviously different objects have different hashes** (objects are content-addressed).

IPFS has a routing system where peers find another peers' network addresses using a Distributed Hash Table (DHT). One important property is that you can trade objects over IPFS without requiring the peer to be verified. This happens because **object hashes may be signed using the public key of the owner and, under these circumstances, you can confirm identity**. Whenever a connection is established correctly (and trustworthy) between two peers, each peer sends information about what data he wants (`want_list`). Once any block is received, the receiver verifies its authenticity and acknowledges. The protocol responsible for handling exchanges between peers is called BitSwap.

In terms of network, IPFS is not restricted to TCP or QUIC, it's up to the implementation to decide it. [IPFS paper](https://www.google.pt/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwj7g6Ks4unRAhXBNxQKHaLrCYgQFggbMAA&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X1o4k7zrJa3LX%2Fipfs.draft3.pdf&usg=AFQjCNHK98DmEICO3ZuTowSg6FKbQ0mw1Q&sig2=n4Z8nvhJxsPfvQaGRfZMOA) mentions that it is recommended to be used over WebRTC DataChannels. Regarding connectivity, IPFS also uses ICE NAT traversal mentioned before in this blogpost.

You can find more information about the IPFS protocol in the [IPFS website](https://ipfs.io/) or it's [github repo](https://github.com/ipfs). There are three server implementations of IPFS protocol, [go-ipfs](https://github.com/ipfs/go-ipfs) is the more stable, but you can also contribute to the [JavaScript: js-ipfs](https://github.com/ipfs/js-ipfs) one. IPFS helps us to take another look into the web and how it is today, and that's the main reason why some projects are being created on top of IPFS.


### Conclusions

This article was about:

- exploring alternatives to HTTP;
- understand that the web we have today may change and it may require some effort on our side;
- think about P2P importance in the future, as more and more people get internet access and low latency rates are not guaranteed;
- rethink some notions about the transport and session layers, because TCP+TLS may not be the holy grail.

*Originally published at [blog.yld.io](https://blog.yld.io/) on February 8, 2017 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)*
