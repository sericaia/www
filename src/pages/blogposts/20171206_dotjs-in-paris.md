---
title: 'Dot.js in Paris'
date: '2017-12-06'
---

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/97226415@N08/25001894608/in/album-72157689274484261/" title="dotJS 2017"><img src="https://farm5.staticflickr.com/4580/25001894608_36443a8f21_z.jpg" width="640" height="428" alt="dotJS 2017" /></a>

I went to [Dot.js](https://www.dotjs.io/) last week and it had quite a lot of interesting talks this year and some big names in technology. Dot.js was also a conference full of people, with almost 1400 participants, who came from everywhere in the world. It was the first Dot.js I attended.

I would like to pick some of the most relevant talks (in my humble opinion!).

In the morning we had [Trent Willis](https://twitter.com/trentmwillis) from Netflix, who not only spoke about the QUnit-In-Browser project, but mentioned how we can get better tools based on the public APIs and protocols we have available. He mentioned some of his recent inspirations such as [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome), that allow to use Chrome through the command line, and the open [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/), which allow us to call and debug the functions we already know from DevTools.

<a data-flickr-embed="true" href="https://www.flickr.com/photos/97226415@N08/37986609285/in/album-72157689274484261/" title="dotJS 2017"><img src="https://farm5.staticflickr.com/4532/37986609285_5c9c3a6db8_z.jpg" width="640" height="428" alt="dotJS 2017" /></a>

Accessibility concerns were also present in his talk and he mentioned [axe-core project](https://www.axe-core.org/), which helps not only to validate if your page supports A11Y primitives, but also to add some rules such as color contrast validation. He concluded that now we have quite a lot of tools and we have to decide what tests we can effectively do and act against, and what tools can be created with all this ideas in order to create an accessible future.

[Feross Aboukhadijeh](https://twitter.com/feross) and [Thomas Watson](https://twitter.com/wa7son) both gave talks that made the audience laugh and clap. The former was about breaking all the security rules of the web and, even though the web is much more safer now, it is still possible to hack the web and play around with the public APIs. The latter brought some hardware into the conference and showed how to do some hacking on flights information with a simple antenna, and the output of the demo of his talk was a live display of air traffic overlaid on google maps.

One of the talks that is worth to checking out is the one from [Sean Larkin](https://twitter.com/TheLarkInn), webpack maintainer, who explained the current webpack architecture and how everything is related to each other. His drawings were very informative and explicit and it helped me a lot to understand it better. He also showed the recent news in webpack 4, and how it is helping to move the web forward. The best one is that it will be possible in the new version to import WASM (Web Assembly) or Rust code and load it and use it directly in your code.

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/97226415@N08/37986564105/in/album-72157689274484261/" title="dotJS 2017"><img src="https://farm5.staticflickr.com/4515/37986564105_6ae02cce90_z.jpg" width="640" height="428" alt="dotJS 2017" /></a>

One of the last talks was given by [Tom Dale](https://twitter.com/tomdale), creator of Ember.js. The engaging thing about Tom's talk was the performance considerations mentioned: how to get instant templates, optimised updates and guarantee 60 frames per second. He explained how he translated his considerations into [Glimmer.js](https://glimmerjs.com/). Although I'm not a Ember.js fan, I think the talk is worth seeing to understand the solutions proposed from a performance side of things:

- compile templates into bytecode to achieve smaller file sizes;
- take advantage of [ArrayBuffer](https://mdn.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) to reduce time spent by the browser doing parsing operations;
- create chuncks of work instead of having it synchronous using [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback), which allows smooth incremental rendering.
- etc.

The conference ended with a talk from [Brendan Eich](https://twitter.com/BrendanEich) about JS and ECMA history and some notes about the new shiny things the language is going to have.

In the end it was a nice conference with a nice venue in a awesome city. I couldn't leave without eating some macarons and crepes!

_Originally published at [blog.yld.io](https://blog.yld.io/) on December 6, 2017 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
