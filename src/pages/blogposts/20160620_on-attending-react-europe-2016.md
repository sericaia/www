---
title: 'On attending React-Europe 2016'
date: '2016-06-20'
---

React-Europe was an amazing 2-day conference held in Paris on June, 2 and 3. On this second edition, there were a lot of talks about React, React Native, Redux, performance optimisations, and data fetching using GraphQL or Falcor.

The conference started with **Dan Abramov** explaining how [Redux](http://redux.js.org/) has grown in a year and what combination of facts made it a success. He tried to set boundaries on how to evaluate a library, e.g what features and APIs it provides. Dan Abramov thinks that the success with Redux is not only related with features and APIs, but with the contracts and constraints that Redux has. He explained that constraints - library limitations - and contracts - APIs that users implement (reducers, middlewares) are what made Redux what it is now.

Dan also showed and explained a simple example with a basic redux core implementation and highlighted some relevant modules created with Redux in mind, such as [tappleby/redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe), [raisemarketplace/redux-loop](https://github.com/raisemarketplace/redux-loop) and [zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension). Finally, Dan published his new [free course about Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux).

**Eric Vicenti** talked about the [necolas/react-native-web](https://github.com/necolas/react-native-web) project and how it is evolving and mentioned that NavigationExperimental is making progress and will be soon fully available for all platforms. Moreover, React will soon extend to Windows.

**Lin Clark** from Mozilla talked about some interesting performance tips such as (1) using key properties for list items, in order to create real time savings; (2) do measures (e.g use React perf tools) to profile our apps and see the wasted time; (3) efficient use of _shouldComponentUpdate_ lifecycle step: compare state by deep equality check is heavy and could result in the opposite of what we want. Immutable data could be the rescue solution, but if the change happens in a child component, we can reduce the amount of work done here by calling _setState()_ only for the child component. In Redux it could be easily done by adding _connect()_ in items lower in the tree.

**Krzysztof Magiera** spoke about animations in React and explained which threads are actually doing work at some point. He explained that layout animations only work for layout properties, and that [animated.js library](https://github.com/animatedjs/interactive-docs) could be a solution for many other cases. He also mentioned that offloading animations, that send a JS graph to the UI native thread with the animation, are already in place for Android using the flag `useNativeDriver`.

![image](https://cloud.githubusercontent.com/assets/1150553/16098280/2507cf6c-334a-11e6-95ca-c37c7b6cb394.png)

**Christopher Chedeau** gave some tips about how to have success at Open Source. For example, how can we educate our users to use production and development environments (e.g turn different warnings on in different contexts) and how important demos are in Facebook meeting notes.

**We had several talks about [GraphQL](https://facebook.github.io/react/blog/2015/05/01/graphql-introduction.html).** The first one was given by Dan Schafer about the Facebook GraphQL stack and the questions that emerged out of that: (1) how can we handle authorisation; (2) how to make GraphQL efficient and (3) how to cache results.

Relevant tools were also mentioned by Jeff Morrison and Mihail Diordiev. Jeff talked about how [Flow project](https://flowtype.org/) is being useful and that everyone at Facebook is using it. He also explained in detail how Flow generates an AST that is used as the base of everything it does. The most important part in this talk was when he mentioned that flow graphs can help to identify spaghetti code and dead code.

Mihail Diordiev showed a set of tools that he created to debug code, such as the powerful [zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) and [zalmoxisus/remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools). It now allows to import/export JSON with done actions (really relevant to reproduce bugs) and create automatic tests. If we don't use Redux, he also showed [zalmoxisus/remotedev](https://github.com/zalmoxisus/remotedev), [zalmoxisus/remotedev-server](https://github.com/zalmoxisus/remotedev-server) and [zalmoxisus/remotedev-app](https://github.com/zalmoxisus/remotedev-app).

**Cheng Lou** delivered one of the best talks of this conference and you should watch [his talk](https://www.youtube.com/watch?v=mVVNJKv9esE) if you want to understand and learn how to explain the different levels of abstraction that a project can have and where you want to be before start coding. Using his framework, he explained abstraction contracts that we create when picking inline or CSS styles, frameworks or libraries, grunt vs gulp, and so on. It's impossible to cover every use case and we should pick the best approach for our problem.

Bertrand Karerangabo and Evan Schultz presented an analytics solution for React using Redux ([rangle/redux-segment](https://github.com/rangle/redux-segment)).

To finish the first day, we had some interesting lightning talks such as "Going from 0 to full-time software engineer in 6 months" by Preethi Kasireddy, which remembered that we, as developers, should be more inclusive to help others that want to be part of our world and Mike Grabowsk talking about the [React Native Package Manager](https://github.com/rnpm/rnpm).

The second conference day started with **Jonas Gebhardt** challenging everyone to think about different programming environments and how can we visualise, understand and manipulate data. Because every community is really focused on their own frameworks and libraries, Jonas asked everyone to figure out how to integrate different codebases and programming languages so that we can learn together to solve real world problems.

![image](https://cloud.githubusercontent.com/assets/1150553/16098545/8116f7be-334b-11e6-9ec2-aebae0bcf4af.png)

**Bonnie Eisenman** is the author of one of the most popular [React Native books](http://shop.oreilly.com/product/0636920041511.do) and explained the React evolution over the last few years, specifically after Facebook published it. She started quoting that in 2014 was a big shift because time that people spent on mobile got larger than time spent on browser. React Native appeared to make real difference for companies that have at least three versions (Android, iOS, Windows) and code was duplicated and not reused, teams have different priorities and deadlines.

![image](https://cloud.githubusercontent.com/assets/1150553/16098460/ff691d50-334a-11e6-9a42-5437fb04534a.png)

"Learn once, write everywhere" with native performance and code reuse was the promise provided by Facebook in React Conference 2015 (January). In March 2015, React Native had the public release and, despite the fact that not everything was perfect (and isn't yet), people believe in this approach and started using it. The most relevant shift mentioned by Bonnie was that native mobile developers also started to move into React Native — conquering these developers is really important for the future of React.

Today React has evolved a lot, documentation was improved and new environments are being conquered too.

Max Stoiber and Nik Graf spoke about their project [carteb/carte-blanche](https://github.com/carteb/carte-blanche). It provides a development space where we can test our components by using random data. For instance, if we have an application like Facebook we can test long names, larger pictures, an so on.

After some lightning talks **Andrew Clark** talked about how High Order Components (HOC) are important and how we can create decorators than enhance our React Components. Some of the most well known and used HOCs by the community are _connect_ (in Redux) and withRouter (in React Router). Andrew Clark presented [acdlite/recompose](https://github.com/acdlite/recompose), an utility for HOCs. He also talked about some performance optimisations where recompose could help us.

**Jafar Husain**, who works at Netflix, presented an interesting [comparison between GraphQL and Falcor](https://www.youtube.com/watch?v=nxQweyTUj5s). Both approaches are similar but we need to pick the appropriate for the job we want to do. He argued that [Falcor](http://netflix.github.io/falcor/) has fewer concepts, it's smaller and less prescriptive, and GraphQL introduces a query syntax whereas Falcor is JSON all the way. Moreover, he explained that Facebook has ~3k entities and Netflix with Falcor has around 20 entities and our challenge must be to identify which one is the best choice.

![image](https://cloud.githubusercontent.com/assets/1150553/16098797/c1d521e4-334c-11e6-9581-65fe43388aa8.png)

As expected, **Tadeu Zagallo** did a talk about performance. He talked about the work he is doing right now and the challenges we have now with hybrid apps. He stated two main performance goals: reduce memory and reduce startup initialisation time. One of the best solutions proposed to reduce this last one was to load modules on demand.

![image](https://cloud.githubusercontent.com/assets/1150553/16098847/055be8c6-334d-11e6-8625-b0d37f3b1892.png)

He also mentioned that batching is getting better and right now they are using multiple cores to do processing in parallel. Inline dependences, dead code elimination (using `__DEV__` or target platform specific needs), and creation of random access bundles to diminish JS bundle size are some of the things his team have done so far.

**Brent Vatne** gave tips on how can we efficiently build incremental lists with lazy loading by rendering small chunks. The most practical advice given was to have a render-ahead distance.

![image](https://cloud.githubusercontent.com/assets/1150553/16099022/f8698938-334d-11e6-918b-2f89cf093a1e.png)

When user scrolls down in a page, we continue to render-ahead. As a consequence, when the viewport is moved down, data is already there. Despite that approach has some tradeoffs with space, there are already some solutions to minimise it such as having a pool on what is being displayed or offload animations. Brent also mentioned some issues in Android such as navigation ([see exponentjs solution](https://github.com/exponentjs/ex-navigator)), user input, and touch and gestures.

**Laney Kuenzel and Lee Byron** gave the last talk about GraphQL Future. They started by doing a quick retrospective on how Facebook got here and how important is the ecosystem that was created. Time to gather important data and real time data updates were the main areas of improvement that Facebook identified and Laney and Lee revealed some approaches and tests that Facebook is doing to solve them. The most interesting proposal was using event based subscriptions (publish-subscribe system) to solve live updates, because they analysed and concluded that using web sockets or message queue such as [0MQ](http://zeromq.org/) were not performant enough.

The last talk of the event was given by Martijn Walraven and it was about Apollo project. After it there was time for some questions and some quick talks were given by people attending to the conference.

Unlike last year, there were no major announcements, but overall the content was extremely helpful for people with different levels of knowledge with React and related technologies. The conference was able to connect newbies with people that are using React in production for some time.

_Originally published at [blog.yld.io](https://blog.yld.io/) on June 20, 2016 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
