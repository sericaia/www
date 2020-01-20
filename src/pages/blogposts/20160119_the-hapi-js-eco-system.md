---
title: 'The HAPI.js eco-system'
date: '2016-11-19'
---

#### Overview

The [hapi.js](hapijs.com) (**H**TTP **API**) framework provides a RESTful API that is a perfect match for projects with large teams working on different parts of the application.

It was created by Walmart back in 2011, and right now it's used by [a large group of companies](http://hapijs.com/community).

hapi.js recommends the use of plugins because they make our applications modular, despite the fact that they are not mandatory. Everything could be considered a plugin: authentication strategies, function handlers (in request lifecyle), routes, and so on. hapi.js reminds that we should focus on writing **reusable** application logic.
It has two main principles:

1. Configuration is better than code;
2. Business logic must be isolated from transport layer.

The first one is concerned about having distinct environments (i.e development, staging, qa, production) highly configurable.
It's also worried about having documentation and code generation in order to reduce errors, preserving validation and consistency.
In the following example we create a hapi.js server where the configuration is passed as an object on server creation.

```js
var Hapi = require('hapi')

var config = {
  dbConnection: 'myDbConnection',
}

var server = new Hapi.Server({
  app: config,
})

server.start()
```

From now on, `dbConnection` is accessible on the server object using `server.settings.app`. You can now use this database connection from inside your registered plugins.

The second one reminds that business logic should be isolated from HTTP requests, which is done through plugins. Plugins are an easy way to write reusable pieces of code. In this case we have a module that exports a plugin, which handles two routes to `/api/website` and `/api/blog`:

```js
// yldApi.js
var register = function(plugin, options, next) {
  plugin.route({
    method: 'GET',
    path: '/api/website',
    handler: function(request, reply) {
      reply('yld.io')
    },
  })

  plugin.route({
    method: 'GET',
    path: '/api/blog',
    handler: function(request, reply) {
      reply('blog.yld.io')
    },
  })

  next()
}

register.attributes = {
  name: 'yldApi',
  version: '1.0.0',
}

module.exports = register
```

From now on we could use this plugin inside our server by registering it:

```js
var Hapi = require('hapi');
var server = new Hapi.Server();
var yldApi = require('./yldApi')

server.register( [ yldApi, (...) ], (err) => {});

server.start();
```

> The `server.register()` call accepts an array of plugins as the first argument. Here we can take the opportunity to also register other plugins we may need.

#### Most commonly used plugins and modules

##### API Documentation

[Lout](https://github.com/hapijs/lout) is a simple API documentation generator that helps to have an idea on how routes are structured. In order to use it you just need to register the plugin (as we have done in the previous example) and access to `/docs` through browser. If you're used to [swagger](http://swagger.io/), there is also an alternative unofficial plugin [hapi-swagger](https://github.com/glennjones/hapi-swagger) that you could use.

##### Authentication

Authentication allows route permissions verification and payload authentication. There are several plugins that implement authentication strategies in hapi.js, depending on the authentication mechanism you want.

If you just need a user-password authentication (we really doubt that), you just need [hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic). The most used ones are [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie) and [Bell](https://github.com/hapijs/bell). The former
allows authentication through cookie session and the later grants 3rd party integration (Github, Google, Facebook, Twitter, and so on). There is also an [unofficial implementation](https://github.com/ryanfitz/hapi-auth-jwt) that uses JSON Web Tokens.

##### Validation

[Joi](https://github.com/hapijs/joi) is a library that allows language and validation of an object schema description. For instance, we could have the following schema:

```js
var companySchema = {
 name: Joi.string().required(),
 email: Joi.string().email(),
 website:  Joi.uri()
};

var yld = {
 name: 'YLD!',
 website: 'www.yld.io'
};

Joi.validate(yld, companySchema, => (err, value) { });
```

`Joi.validate()` will return an Error if the first argument `yld` is not valid according to companySchema. Joi has an important role in hapi.js because it allows validation of query and payload parameters.

```js
plugin.route({
  method: 'GET',
  path: '/welcome/{name}',
  handler: function(request, reply) {
    var welcomeMsg = 'Welcome to YLD! blog, ' + request.params.name + '!\n'
    welcomeMsg += 'Are you ' + request.query.mood + '?'

    reply(welcomeMsg)
  },
  config: {
    validate: {
      params: {
        name: Joi.string().required(),
      },
      query: {
        mood: Joi.string()
          .valid(['happy', 'sad'])
          .default('happy'),
      },
    },
  },
})
```

Accessing `/welcome/daniela?mood=happy` will return an available URL and function handler will be called afterwards. However, if we're trying to access `/welcome/daniela?mood=` it will throw an Error saying that "['mood' is not allowed to be empty]". If you don't specify a 'mood', no error is thrown and the default value is used.

##### Error Handling

There are two modules related to errors: Boom and Poop. [Boom](https://github.com/hapijs/boom) is used for error handling for well-known HTTP errors. For example, 500 - Internal Server Error. [See error codes here](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).

A simple use case is user-password validation. In the example below, we have an imaginary function `validate` and, if user has an incorrect password, permissions should not be granted and an unauthorized error must be handled.

```js
var Boom = require('Boom')

var validateUser = function(userId, password, callback) {
  validate(userId, password, function(err, user) {
    if (err) {
      return callback(Boom.unauthorized('invalid password'))
    }
    // do something
  })
}
```

On the other hand, [Poop](https://github.com/hapijs/poop) is used when you want to handle uncaught exceptions.

##### Tests

[Lab](https://github.com/hapijs/) is a test utility that was created as an alternative to the [mocha](http://mochajs.org/) test framework. A simple test with Lab could have the following syntax:

```js
var Code = require('code')
var Lab = require('lab')
var lab = (exports.lab = Lab.script())
var contact = require('../../src/contact')

lab.experiment('Contact Utils', () => {
  lab.before(done => {
    // perform async stuff
    done()
  })

  lab.beforeEach(done => {
    done()
  })

  lab.test('add new contact', done => {
    contact.addContact({ id: 'contact1' }, (err, contact) => {
      Code.expect(err).to.be.null()
      Code.expect(contact.contact1.id).to.equal('contact1')
      done()
    })
  })
})
```

An experiment is a describe equivalent used to group tests. In this case we have only one test, that tests the "addContact()" function. We used [Code](https://github.com/hapijs/code) assertion library to expect some outputs of the desired behaviour. Please note that Lab has `before, after, beforeEach and afterEach` auxiliary functions: the first two are used for asynchronous operations, whereas the last ones occur before or after each test done inside the experiment. `done()` must be called after a test is completed, otherwise it will not be considered.
Despite the fact you're using hapi.js or not, Lab could be an option to test your project.

[`server.inject()`](http://hapijs.com/api#serverinjectoptions-callback) is helpful to perform integration tests because it gives a way to use the server object directly instead of using HTTP to test a specific route. This is a simpler and faster approach to simulate a HTTP request.

##### WebSockets

One of the most recent hapi.js plugins is [Nes](https://github.com/hapijs/nes), which is an WebSockets adapter implementation. We just need to register Nes, as we have done before with other plugins and then, one main advantage is that server and WebSocket routes could be shared:

```js
// registered route to '/helloworld' with an id 'hello'
server.route({
  method: 'GET',
  path: '/helloworld',
  config: {
    id: 'hello',
    handler: function(request, reply) {
      return reply('Hello, YLD followers!')
    },
  },
})
```

Our client implementation could call the route `/helloworld` using

```js
var Nes = require('nes')
var nesClient = new Nes.Client('ws://localhost:3000')

nesClient.connect(function(err) {
  nesClient.request('hello', function(err, payload) {
    // do something with payload
  })
})
```

Doing the request by ID (`hello`) or requesting `/helloworld` has the same output.

> Note: Take a look at a [Simple chat example using Nes](https://github.com/sericaia/nes-chat).

#### Request Lifecycle

[Request lifecycle](http://hapijs.com/api#request-lifecycle) is what differentiate hapi.js framework from the others. Its main goal is to have a highly defined process where the request object can be changed. The request object is created for each incoming request and is slightly different from the HTTP server original request option, because it has access to request information, domain, headers, method, params, payload, plugins and so on. Request lifecycle is useful to understand what’s going on and what is the order of some actions in the server: we may need request lifecycle to implement authentication or validation, or just to encrypt some data.

> Note: The original request object is still accessible through `request.raw.req`, but it's not recommended to use it.

The request lifecycle has some steps called **extension points** where we could intercept our request and adapt it accordingly.
We can modify each extension point using [`server.ext(extension_point_event, method, [options])`](http://hapijs.com/api#serverextevents).

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1150553/12224988/26d82e0a-b7f7-11e5-9f6f-bfdcd47e8312.png"/>
</p>

The first extension point is `onRequest` and occurs immediately after the request is made to the hapi.js server. At this step we could change the url and methods that are being called, intercepting the request. Between `onPreAuth` and `onPostAuth` we have the **authentication** step. Using one of the [strategies we talked before](#authentication), we can authenticate the request being done, read, parse and authenticate payload. After it, between `onPostAuth` and `onPreHandler` we have the [**validation**](#validation) step where we could validate path parameters, query and payload.
Some of these extension points are not mandatory.

As you can expect, the next step is the one that finally invokes our handler function. However, immediately before it you could add some route pre-requisites that are actions that you may want to do before (e.g load relevant data from database). These actions could be executed in parallel or series. You should take into account that between `onPreHandler` and `onPostHandler` we can change the response sent back to client (the `request.response` object).

After `onPostHandler` we could also validate response payload and modify the `request.response` object (but we can't assign it to a new value). Finally, the last lifecycle extension point is `onPreResponse` that occurs immediately before sending the response to the client (which could be data or an error).

After all these steps, hapi.js has request tails that have the opposite analogy of pre-requisites. Tails are actions that can be completed after the response has been sent. An use case could be saving an error log (if any). Note that this action is completely independent from the response that was already given to user, but it could be dependent from this particular request (e.g a tail could append to a log file the cookies or headers used in the request).

#### Summary

We've taken a quick look at hapi.js framework and eco-system. Hapi encorages two main principles: the use of configuration over code and creating reusable transport-independent logic. It also encorages the use of plugins as a way of creating reusable modules and packages that you can configure according to your app needs.

This last fact enables projects to use existing plugins for different types of functions like authentication, error handling, logging, monitoring and others, while also allowing a teams to develop their own. hapi.js exposes the request lifecycle so that plugins can be developed independently of each other. This way, developers in a project can coordinate work more effectively, thus enabling faster development cycles and more maintainable code.

#### Other useful resources

- [makemehapi nodeschool.io Tutorial](https://github.com/hapijs/makemehapi)
- [hapi.js Tutorials](http://hapijs.com/tutorials)
- [hapi.js Style guide](http://hapijs.com/styleguide)
- [hapi.js mentors program](http://hapijs.com/help)

_Originally published at [blog.yld.io](https://blog.yld.io/) on January 19, 2016 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
