---
title: "Getting started with React and Node.js"
date: "2015-06-10"
---

While building client-side apps, a team at Facebook reached a conclusion that a lot of web-developers had already noticed: the DOM is slow. They did, however, tackle this problem in an interesting way.

To make it faster, React implements a virtual DOM that is basically a DOM tree representation in Javascript. So when it needs to read or write to the DOM, it will use the virtual representation of it. Then the virtual DOM will try to find the most efficient way to update the browser's DOM.

The rationale for this is that JavaScript is very fast and it's worth keeping a DOM tree in it to speedup its manipulation.

React is not a framework though. Think of it as the "View" in your traditional MVC framework.

Although React was conceived to be used in the browser, because of its design it can also be used in the server with [Node.js](http://nodejs.org/). We will take a peek at how this works, but you should wait for a more in-depth post about that.

## Hello World

To get our feet wet, let's just have React render "Hello World".

> [preview on JSFiddle](https://jsfiddle.net/reactjs/69z2wepo/)

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

React.render(<Hello name='World' />, document.getElementById('container'));
```

Apart from the weird part of mixing HTML with JavaScript, this code is pretty self-explanatory. Notice though how `Hello` is instantiated in the HTML just like the new [Custom Elements](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/) standard and `name` is an attribute that is being used in the React Component as `this.props.name`.

There is one strange part though: the way we are inlining HTML in JavaScript. What's up with that?

## JSX

JSX is a JavaScript syntax extension with the ability to inline HTML. That's basically it. It's not required to use React, but it is recommended because it is "a concise and familiar syntax for defining tree structures with attributes" and "helps make large trees easier to read than function calls or object literals".

It was conceived to be used with transpilers and not as an independent language.  Our **Hello World** example is transpiled into:

> [preview on JSFiddle](https://jsfiddle.net/sergioramos/r3xjhee0/)

```js
var Hello = React.createClass({displayName: "Hello",
  render: function() {
    return React.createElement("div", null, "Hello ", this.props.name);
  }
});

React.render(React.createElement(Hello, {name: "World"}), document.getElementById('container'));
```

You can learn more about JSX by following the [official guide](https://facebook.github.io/react/docs/jsx-in-depth.html) and by trying out the [live transpiler](https://facebook.github.io/react/jsx-compiler.html). Also, it's [supported by Babel](https://babeljs.io/docs/usage/jsx/).

## Components

Let's make it more interesting and create some components:

> [preview on JSFiddle](https://jsfiddle.net/sergioramos/b96g6wmj/2/)

```js
var Books = React.createClass({
  render: function() {
    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          <Book title='Professional Node.js'></Book>
          <Book title='Node.js Patterns'></Book>
        </tbody>
      </table>
    );
  }
});

var Book = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.title}</td>
      </tr>
    );
  }
});

React.render(<Books />, document.getElementById('container'));
```

Here we follow the exact same logic as we did in our **Hello World** example, but this time we composed an element of another element. We even passed a property from the parent element to the child element.

Components are a very useful way to compose and reuse views (and logic).

## Properties

Everything in `this.props` is passed down to you from the parent. That includes the values that were declared in the element attributes, just like in regular HTML where you declare attributes like `class` or `href`. However, in React you can set a JSON blob in the attributes instead of having to declare an attribute for each property:

> [preview on JSFiddle](https://jsfiddle.net/sergioramos/n1wqg2r3/2/)

```js
var data = {
  title: 'Professional Node.js',
  author: 'Pedro Teixeira'
};

var Book = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.data.title}</td>
        <td>{this.props.data.author}</td>
      </tr>
    );
  }
});

React.render(<Book data={data}/>, document.getElementById('container'));
```

## Events

Now we need to add a *read* checkbox to each book that mutates its state. For that, we need to register a listener for the `checked` event:

> [preview on JSFiddle](https://jsfiddle.net/sergioramos/a2puufar/2/)

```js
var Books = React.createClass({
  render: function() {
    return (
      // ...
          <tr>
            <th>Title</th>
            <th>Read</th>
          </tr>
      // ...
    );
  }
});

var state = {
  read: false
};

var Book = React.createClass({
  handleChange: function(ev) {
    console.log('onChange: ', ev);  
  },
  render: function() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td><input type='checkbox' checked={state.read} onChange={this.handleChange} /></td>
      </tr>
    );
  }
});

// ...
```

Registering an event listener is as simple as passing a function to the attribute in the HTML. You can see all the supported events in the [official documentation](https://facebook.github.io/react/docs/events.html).

Notice, though, that when we click the checkbox the state doesn't change. This is because the variable `state` is not changed, therefore the view doesn't change.

## State

In order for each `Book` to have a state that we can mutate and see the change reflected in the view, we need to add a `getInitialState` function that defines the initial state of the component and assigns it to `this.state`.

```js
var Book = React.createClass({
  getInitialState: function() {
    return {
      read: false
    };
  },
  handleChange: function(ev) {
    console.log('onChange: ', ev);  
  },
  render: function() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td><input type='checkbox' checked={this.state.read} onChange={this.handleChange} /></td>
      </tr>
    );
  }
});
```

Now we need to update `handleChange` to mutate the state every time the checkbox changes:

> [preview on JSFiddle](https://jsfiddle.net/sergioramos/j8ngk2j6/1/)

```js
handleChange: function(ev) {
  this.state.read = !this.state.read;
  console.log(this.state.read);
}
```

Now, if we try again we should see the checkbox changing, right? Not really, although we can see in the logs that `this.state.read` is getting changed every time we click in the checkbox.

What is missing then? Changing the value of the state is not enough, we need to trigger the UI updates. To do that we can call `setState` which will merge the current state with the next state being applied to the view.

> [preview on JSFiddle](https://jsfiddle.net/sergioramos/v6cexzz8/1/)

```js
handleChange: function(ev) {
  this.setState({
    read: !this.state.read
  });
}
```

And *voilà*! Now we are properly mutating the state and seeing the change reflected in our UI.

## Property Validation
Properties that are passed in the element attributes can take multiple forms. React provides a way to validate the property types that are passed to the components by declaring them in `propTypes`.

In our example, we could validate the book title:

```js
var Book = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired
  }
  // ...
});
```

Now if we don't pass a `title` attribute to the `Book` Component, we will see a warning in the logs:

> Warning: Failed propType: Required prop `title` was not specified in `Book`. Check the render method of `Books`.


You can review more types and validations in the [official documentation](https://facebook.github.io/react/docs/reusable-components.html#prop-validation).

## Putting it all Together

To finish our Book Library, we should implement a form to add new books and a button to remove existing ones. Does that sound like a plan?

To write the form, we can do it in a new Component:

> section of [./views/index.jsx](https://github.com/yldio/react-example/blob/master/express/views/index.jsx#L3-L53)

```js
var BookForm = React.createClass({
  propTypes: {
    onBook: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      title: '',
      read: false
    };
  },
  changeTitle: function(ev) {
    this.setState({
      title: ev.target.value
    });
  },
  changeRead: function() {
    this.setState({
      read: !this.state.read
    });
  },
  addBook: function(ev) {
    ev.preventDefault();

    this.props.onBook({
      title: this.state.title,
      read: this.state.read
    });

    this.setState({
      title: '',
      read: false
    });
  },
  render: function() {
    return (
      <form onSubmit={this.addBook}>
        <div>
          <label htmlFor='title'>Title</label>
          <div><input type='text' id='title' value={this.state.title} onChange={this.changeTitle} placeholder='Title' /></div>
        </div>
        <div>
          <label htmlFor='title'>Read</label>
          <div><input type='checkbox' id='read' checked={this.state.read} onChange={this.changeRead} /></div>
        </div>
        <div>
          <button type='submit'>Add Book</button>
        </div>
      </form>
    );
  }
});
```

In the `BookForm` component we are changing its internal `title` and `read` values once they're changed in the view. Then, when the form is submitted, we pass its values to the `onBook` function that it received. After that we reset its state so that it can get new books.

Now, let's implement our `Books` component based on what we had before:

> section of [./views/index.jsx](https://github.com/yldio/react-example/blob/master/express/views/index.jsx#L55-L91)

```js
var Books = React.createClass({
  propTypes: {
    books: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      books: (this.props.books || [])
    };
  },
  onBook: function(book) {
    this.state.books.push(book);

    this.setState({
      books: this.state.books
    });
  },
  render: function() {
    var books = this.state.books.map(function(book) {
      return <Book title={book.title} read={book.read}></Book>;
    });

    return (
      <div>
        <BookForm onBook={this.onBook}></BookForm>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Read</th>
            </tr>
          </thead>
          <tbody>{books}</tbody>
        </table>
      </div>
    );
  }
});
```

Here we instantiate `BookForm` and pass `onBook` to it so that it can get new books once they're submitted. Once a book is received on `onBook`, we add it to the component state and propagate the book list.

To generate the list of books, we just map through every book it knows and instantiate a `Book` on each one.

Now, let's take a look at our `Book` component:

> section of [./views/index.jsx](https://github.com/yldio/react-example/blob/master/express/views/index.jsx#L93-L117)

```js
var Book = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    read: React.PropTypes.bool.isRequired
  },
  getInitialState: function() {
    return {
      title: this.props.title,
      read: this.props.read
    };
  },
  handleChange: function(ev) {
    this.setState({
      read: !this.state.read
    });
  },
  render: function() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td><input type='checkbox' checked={this.state.read} onChange={this.handleChange} /></td>
      </tr>
    );
  }
});
```

The `Book` componet stayed almost unchanged: it gets the `title` and `read` from the parent component and renders a `<tr>` with that data. Once `onChange` is triggered, it mutates the state and triggers a UI update.

You can checkout a [working version](https://jsfiddle.net/sergioramos/ju5qqqy5/1/) of our example.

## Server

To render React in the server we can use [Node.js](https://nodejs.org). You can install it using the [pre-compiled binaries](https://nodejs.org/download/). We will not dive into how Node.js works and expect that you already know the basics. If you want to learn how to use Node.js we recomend [NodeTuts](http://nodetuts.com) and [Node Patterns](http://nodepatternsbooks.com) from our great [Pedro Teixeira](https://www.yld.io/team/pedro+teixeira).

The idea is to render a React view in the server and allow that view to still be interactive in the client.

What we are going to do is have a view file with our React code - just like we saw before - and render it on the server. However, the HTML we are sending will include a script tag for a `browserify` bundle that includes our React view without being rendered. Once that bundle is interpreted in the client it will replace the static view and make it dynamic.

This assumes some previous knowledge of either Express or Hapi.

### Express

[Express](http://expressjs.com) is a web framework for Node.js. It is the first successful Node.js framework and still the most used. It is very minimalist and can be extended using its middleware system. We have used the version [4.12.4](http://expressjs.com/4x/api.html) of the Express framework in this example.

First, we need to require our dependencies:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/express/index.js#L1-L5)

```js
var express = require('express');
var browserify = require('browserify');
var React = require('react');
var jsx = require('node-jsx');
var app = express();
```

Then we need to make `jsx` files *requirable*:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/express/index.js#L7)

```js
jsx.install();
```

Now we just need to serve our routes. But first, we should require our view:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/express/index.js#L10)

```js
var Books = require('./views/index.jsx');
```

> section of [./index.js](https://github.com/yldio/react-example/blob/master/express/index.js#L22-L53)

```js
app.use('/', function(req, res) {
  var books = [{
    title: 'Professional Node.js',
    read: false
  }, {
    title: 'Node.js Patterns',
    read: false
  }];

  res.setHeader('Content-Type', 'text/html');
  res.end(React.renderToStaticMarkup(
    React.DOM.body(
      null,
      React.DOM.div({
        id: 'app',
        dangerouslySetInnerHTML: {
          __html: React.renderToString(React.createElement(TodoBox, {
            data: data
          }))
        }
      }),
      React.DOM.script({
        'id': 'initial-data',
        'type': 'text/plain',
        'data-json': JSON.stringify(data)
      }),
      React.DOM.script({
        src: '/bundle.js'
      })
    )
  ));
});
```

What this is doing is rendering our Books AND a script with our initial data AND a script with our browserify bundle. This way the first load has a fully rendered static view and the user doesn't have to wait for the client to render it.

> rendered HTML

```html
<body>
  <div id="container">
  <!-- ... -->
  </div>
  <script id="initial-data" type="text/plain" data-json="[{&quot;title&quot;:&quot;Professional Node.js&quot;,&quot;read&quot;:false},{&quot;title&quot;:&quot;Node.js Patterns&quot;,&quot;read&quot;:false}]"></script>
  <script src="/bundle.js"></script>
</body>
```

We also need to listen for the `/bundle.js` request:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/express/index.js#L12-L20)

```js
app.use('/bundle.js', function(req, res) {
  res.setHeader('content-type', 'application/javascript');
  browserify('./app.js', {
    debug: true
  })
  .transform('reactify')
  .bundle()
  .pipe(res);
});
```

You might be asking: what does `app.js` have? Basically it's just a jsx script that requires our view and attaches it to the `container` so that it becomes dynamic in the client.

> [./app.js](https://github.com/yldio/react-example/blob/master/express/app.js)

```js
var React = require('react');
var Books = require('./views/index.jsx');

var books = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
React.render(<Books books={books} />, document.getElementById('container'));
```

To finish, we just need to listen for incoming connections:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/express/index.js#L55-L58)

```js
var server = app.listen(3333, function() {
  var addr = server.address();
  console.log('Listening @ http://%s:%d', addr.address, addr.port);
});
```

Most of this is a very standard Express app, but you shouldn't be doing this in production. You should use a proper view engine (like [express-react-views](https://github.com/reactjs/express-react-views)) and you shouldn't bundle your static assets on every request. This is just a proof of concept.

We have a repository with this code so that you can try it: [check it out](https://github.com/yldio/react-example/tree/master/express). Don't forget to install the dependencies by running `npm install` in your shell before running the app.

### Hapi

Hapi is also a web framework for Node.js. It advocates that configuration is better than code and business logic must be isolated from transport layer, providing a great solution for large teams.

Our Hapi example uses almost the same code as the Express one. The framework version used was the [8.6.1](http://hapijs.com/api/8.6.1).

First we need to require our dependencies:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L1-L6)

```js
var Hapi = require('hapi');
var browserify = require('browserify');
var map = require('through2-map');
var fs = require('fs');
var React = require('react');
var jsx = require('node-jsx');
```

Then we need to make `jsx` files *requirable*:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L8)

```js
jsx.install();
```

And create our Hapi server:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L12)

```js
var server = new Hapi.Server();
```

Now we just need to serve our routes. But first, we should require our view:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L10)

```js
var Books = require('./views/index.jsx');
```

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L33-L67)

```js
server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    var books = [{
      title: 'Professional Node.js',
      read: false
    }, {
      title: 'Node.js Patterns',
      read: false
    }];

    reply(React.renderToStaticMarkup(
      React.DOM.body(
        null,
        React.DOM.div({
          id: 'app',
          dangerouslySetInnerHTML: {
            __html: React.renderToString(React.createElement(TodoBox, {
              data: data
            }))
          }
        }),
        React.DOM.script({
          'id': 'initial-data',
          'type': 'text/plain',
          'data-json': JSON.stringify(data)
        }),
        React.DOM.script({
          src: '/bundle.js'
        })
      )
    )).header('Content-Type', 'text/html');
  }
});
```

Almost the same logic as our Express example. Rendering a static view of our view and sending the initial data with a bundled script to make the site dynamic after being loaded in the client.

We also need to listen for the `/bundle.js` request:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L19-L31)

```js
server.route({
  method: 'GET',
  path:'/bundle.js',
  handler: function (request, reply) {
    reply(null, browserify('./app.js')
    .transform('reactify')
    .bundle().pipe(map({
      objectMode: false
    }, function(chunk) {
      return chunk;
    })));
  }
});
```

We will be using the same [`./app.js`](https://github.com/yldio/react-example/blob/master/hapi/app.js) as in the Express example.

To finish, we just need to set the connection:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L13-L16)

```js
server.connection({
  host: 'localhost',
  port: (process.argv[2] || 3333)
});
```

And start the server:

> section of [./index.js](https://github.com/yldio/react-example/blob/master/hapi/index.js#L69-L71)

```js
server.start(function () {
  console.info("Listening @", server.info.uri);
});
```

Just as I said about our Express app: don't use this in production. You should use a proper view engine (like [hapijs-react-views](https://www.npmjs.com/package/hapijs-react-views)) and you shouldn't bundle your static assets on every request. This is just a proof of concept.

We have a repository with this code so that you can try it: [check it out](https://github.com/yldio/react-example/tree/master/hapi). Also don't forget to install the dependencies by running `npm install` in your shell before running the app.

## Next Steps

Now that you've built your first React app, you should jump into the [official React website](http://facebook.github.io/react/docs/getting-started.html) and go through their guides.

Then try to build your own proof-of-concepts with different constraints and features.

If you have questions/suggestions, you can reach out to [@ramitos](https://twitter.com/ramitos) and [@sericaia](https://twitter.com/sericaia) and we'll do our best to help!

*Originally published at [blog.yld.io](https://blog.yld.io/) on June 10, 2015 by Sérgio Ramos (@ramitos on Twitter/Github) and Daniela Matos de Carvalho (@sericaia on Twitter/Github)*
