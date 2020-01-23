---
title: "So, you're thinking about updating your HAPI.js server to v17?"
date: '2018-02-01'
icons: []
---

There are quite some changes with the [latest HAPI.js version](https://github.com/hapijs/hapi/issues/3658) that are worth taking a look at. At YLD we want to be as close as possible to the latest changes and this blogpost aims to unveil a bit of the new HAPI.js version. There's some breaking changes that were created mainly due to the adoption of `async/await`.

### Remember `async/await` ([Async Functions](https://github.com/tc39/ecmascript-asyncawait))?

If we would have to summary `async/await` in a simple sentence it would be something such as "It makes everything prettier by making async code more readable". The following example shows an asynchronous function that is waiting for a promise to be resolved:

```js
async function getById(id) {
  try {
    const item = await db.getById(id)
    return item
  } catch (err) {
    // deal with it (reject the promise)!
  }
}
```

Small things to note:

- `await` always waits for a promise (in this case `db.getById` to be resolved);
- `await` can only be used inside `async` function (hence the declaration `async function getById`);
- you can use try/catch to accomplish error handling, or stick with the `then/catch` that promises provide (there's also nice alternative solutions such as [apr-intercept](https://apr.js.org/#intercept) or [await-to-js](https://github.com/scopsy/await-to-js));
- it is not mentioned in this example, but you should be careful when calling two functions using `await` inside the same `async` function. If you don't handle it properly you may end up with code the is running is series that could be run in parallel (check `Promise.all` for details, or even the utility [apr](https://apr.js.org)).

But this blogpost is not about `async/await`, let's go back to HAPI.js! In order to have more information about `async/await` check out the [ECMAScript spec](https://tc39.github.io/ecma262/#sec-async-functions-abstract-operations) or [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

### Bye `connections`

Doing `server.connection({ port: 3000 })` after creating your HAPI.js server is no longer required to be in a different line. All methods from `server.connection` are now in `server` and you can simply do:

```js
const Hapi = require('hapi')

const server = Hapi.server({
  host: 'localhost',
  port: 3000,
})
```

### Use `async/await` to start your server

Forget the callback function in `server.start`. Start it using async functions:

```js
async function start() {
  try {
    await server.start()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
```

### Forget the `reply` interface

That's it, reply was changed to `h` which stands for hapi. Now you can just return what you want to retrieve to the client or, if your response its a bit more complex you can use `h.response`.

```js
server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hi, YLD!'

    // ----> alternative:
    // const response = h.response('Hi, YLD!');
    // response.code(200);
    // response.header('Content-Type', 'text/plain');
    // return response;
  },
})
```

### `s/config/options`

Quick, quick one. Replace `config` with `options` in your routes. Everything else works as before (e.g. `payload` configuration and `Joi` validation), as you can follow in this code snippet:

```js
server.route({
  method: 'POST',
  path: '/users',
  handler: createUser,
  options: {
    payload: {
      allow: ['application/json'],
    },
    validate: {
      payload: {
        name: Joi.string().required(),
      },
    },
  },
})
```

### Register a plugin

There are changes in the HAPI.js plugin signature. It now stands for an object with the following properties: `{ register, name, version, multiple, dependencies, once, pkg }`. Check out small example here where we create a simple `yld-hapi-plugin.js`.

```js
// inside our plugin (`yld-hapi-plugin.js`)
const plugin = {
  register: (server, options) => {
    server.route({
      method: 'GET',
      path: '/plugin',
      handler: (request, h) => {
        return 'Hi from a plugin'
      },
    })
  },
  name: 'yld-hapi-plugin',
  version: '1.0.0',
}

module.exports = plugin
```

And finally register it in your server file:

```js
// inside my HAPI.js server

const YLDHapiPlugin = require('./plugins/yld-hapi-plugin.js')

/*...*/

await server.register(YLDHapiPlugin)
```

`server.register` now returns a promise but will still receive an array of plugins as argument, so that `await server.register([Inert, Vision, YLDHapiPlugin])` is valid.

### Server methods will still work as expected

Server methods are one of the most interesting features that HAPI.js has and a useful and performant way of sharing functions by attaching them to your server object rather than requiring a common module everywhere it is needed. There's no big differences here, in the following example we just call a server method `add` as before, but using `async/await` notation where no callback is needed as last argument when creating the method!

```js
server.method(
  'add',
  (a, b) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(a + b)
      }, 300)
    })
  },
  {
    cache: {
      expiresIn: 60000,
      generateTimeout: 1000,
    },
  }
)

server.route({
  method: 'POST',
  path: '/add',
  handler: async (request, h) => {
    try {
      const result = await server.methods.add(1, 2)
      return result
    } catch (err) {
      throw err
    }
  },
})
```

### With `async/await` comes [bounce](https://github.com/hapijs/bounce)!

`bounce` is a HAPI.js module that aims to make silent errors visible. Check out the following example where we use `Bounce.rethrow` function. In this case `b.c.d` can be a silent error (due to `try/catch` & `async/await`) if `bounce` is not being used. Bounce allows to filter by `system` and `boom` errors.

```js
server.method('add', (a, b) => {
  return new Promise((resolve, reject) => {
    const a = b.c.d
    reject('The line before should explode: ' + a)
  })
})

server.route({
  method: 'POST',
  path: '/add',
  handler: async (request, h) => {
    let result = null
    try {
      result = await server.methods.add(1, 2)
      return result
    } catch (err) {
      Bounce.rethrow(err, 'system')
    }
    return result
  },
})
```

That's it for now! There's [some more slightly changes](https://github.com/hapijs/hapi/issues/3658), but this blogpost should give you an overview and help you to start migrating to the new version. Ping us on twitter if you have some questions or want to know more.

_Originally published at [blog.yld.io](https://blog.yld.io/) on February 1, 2018 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
