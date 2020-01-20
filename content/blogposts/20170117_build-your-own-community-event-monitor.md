---
title: 'Build your own community event monitor'
date: '2017-01-17'
---

### Events, events... and more events!

YLD team members help to organize community meetups, both in Lisbon ([require-lx](http://www.meetup.com/require-lx)) and London ([#LTM - London TensorFlow](https://www.meetup.com/London-TensorFlow-Meetup/)):

- [require-lx](http://www.meetup.com/require-lx) is a JavaScript meetup, with two types of events: nodeschool, where we help people to learn JavaScript and NodeJS (using https://nodeschool.io/ workshops), and require-lx, where we have two or three speakers talking about a relevant JS related topic.
- [#LTM - London TensorFlow](https://www.meetup.com/London-TensorFlow-Meetup/) is a meetup about [TensorFlow](https://www.tensorflow.org) open-source library, where machine learning experiences are shared. For instance, the last meetup was about Image Recognition.

Regarding require-lx, we have a few different sources of information:

1. Github, where people can add issues (e.g. talks they want to give);
2. Meetup, that has the events' calendar as well as information about who is interested in attending and the sponsors;
3. Twitter, which is used to spread news, share talks' information or pictures about the event;
4. Gitter, that provides a chat tool where the community can talk and share ideas as well as relevant projects or events.

### How to keep up to date?

Well... I am too lazy to have every tab or app that gives me information open and thus, sometimes, it's difficult to get up to date with all these different providers. One possible solution could be to hack on the mentioned providers' APIs and bring the relevant data to a single source of truth, where we could manage everything in a better way. Let's then try to create an app that solves this problem.

For the purpose of this blogpost we will use the [require-lx](http://www.meetup.com/require-lx) use case with three different providers: [Github](http://github.com/require-lx), [Meetup](http://www.meetup.com/require-lx) and [Twitter](http://twitter.com/requirelx).

### Let's build it

#### Handling requests

[Hapi](https://hapijs.com), which is one of the most well-known NodeJS frameworks, will help us to create an API that serves as a bridge between multiple providers. Our application will consume this bridge API and present it to the users.

We decided to use [request](https://www.npmjs.com/package/request) to do the HTTP calls, but you could use any other that you're more comfortable with ([wreck](https://www.npmjs.com/package/request), [axios](https://www.npmjs.com/package/axios), [got](https://www.npmjs.com/package/got), etc).

`Request` is callback-based and really easy to work with:

```javascript
request(url, function(err, response, body) {
  if (err || response.statusCode !== 200) {
    // handle error
  } else {
    // do something with body content
  }
})
```

The first argument is the url (or an object if you want to send more information such as method, payload or headers) and the second is the callback function. We're going to use it to request information from Github, Meetup and Twitter APIs.

Let's start creating a Hapi server that will pick `port` and `host` from environment variables or set defaults to some configuration we defined (e.g. port `8080` and host `127.0.0.1`).

```javascript
// index.js
const server = require('./server')
server.start(function() {
  console.log('Server running at:', server.info.uri)
})
```

```javascript
// server/index.js
const Hapi = require('hapi')
const config = require('../config')
const server = (module.exports = new Hapi.Server())
const routes = require('../routes')

server.connection({
  port: process.env.PORT || config.server.connection.port,
  host: process.env.HOST || config.server.connection.host,
})

server.route(routes)
```

In the following example we used `server.route` to add our routes from another file. We will need at least three routes (one for each provider), that will call the correspondent handler function. For example:

```javascript
const AggregatorHandler = require('../handlers/aggregator')

const readGithub = {
  method: 'GET',
  path: '/github',
  handler: AggregatorHandler.readGithubDetails,
}

// ...

module.exports = [readGithub, readMeetup, readTwitter]
```

#### Providers!

[Github](https://developer.github.com/v3/) and [Meetup](https://www.meetup.com/meetup_api/) APIs are quite easy to work with because you can do some queries without having to use OAuth, if the content you're trying to request is public. However, [Twitter API](https://dev.twitter.com/rest/public/search) requires OAuth to perform some search queries.

##### Github and Meetup handlers

Taking a look at what information the APIs provide helped to understand what kind of data we may need for our application. For instance, `https://api.github.com/repos/require-lx/community/issues?per_page=5` query gives a lot of information, but we probably just need to render information about the issue "title" and direct link to it ("url"), and maybe also who was the user that created it ("user"). Regarding Meetup, we can take a look at the next 5 events scheduled (`https://api.meetup.com/2/events?group_urlname=require-lx&page=5`) and bring information about the event "name", the direct link to it ("event_url") and how many people already RSVP ("yes_rsvp_count").

We decided to create the code generically as we could, and add a configuration file that handles all these differences:

```javascript
// assets/apiData.json

{
  "github":
  {
    "apiUrl": "https://api.github.com",
    "contentUrl":  "${api}/repos/${roomId}/issues?per_page=${limit}",
    "roomId": "require-lx/community",
    "limit": 5,
    "fields": ["user.login", "url", "title"],
    "resultsField": null
  },
  "meetup": {
    "apiUrl": "https://api.meetup.com",
    "contentUrl": "${api}/2/events?group_urlname=${roomId}&page=${limit}",
    "roomId": "require-lx",
    "limit": 5,
    "fields": ["event_url", "yes_rsvp_count", "name"],
    "resultsField": "results"
  }
}

```

Configuration helped these handlers to share almost the same code:

```javascript
exports.readGithubDetails = function(req, reply) {
  const url = createUrl(apiData.github)

  request(
    {
      url,
      json: true,
      headers: {
        'User-Agent': apiData.github.roomId,
      },
    },
    function(err, response, body) {
      if (err || response.statusCode !== 200) {
        return reply(Boom.wrap(err, response.statusCode))
      } else {
        return reply(filterData(body, apiData.github.fields))
      }
    }
  )
}
```

Although [Github requires 'User-Agent' header](https://developer.github.com/v3/#user-agent-required), everything else is pretty similar between the two APIs. `createUrl` and `filterData` functions are auxiliary functions. The former will generate the url that is going to be requested based on `apiUrl`, `contentUrl` and parameters defined in the configuration file. The latter is used to filter output data according to the fields defined in configuration.

##### Twitter handler

As we mentioned before, the Twitter Search API requires OAuth authentication. Fortunately, they have the possibility to create an application there, avoiding the need of having user context. Take a look at the [application-only authentication](https://dev.twitter.com/oauth/application-only) details to set up a new application on Twitter.

The following image explains what we need to do next: (1) get the bearer token and (2) start doing requests with it!

![image](https://g.twimg.com/dev/documentation/image/appauth_0.png)

_(image source: [Twitter application-only authentication documentation](https://dev.twitter.com/oauth/application-only) )_

After having your application, you need to get your consumer key and secret and create a Base64 encoded bearer token (replace it with `YOUR_APP_ENCODED_BEARER_TOKEN`). You can test it using cURL:

```
curl -X POST \
    --data 'grant_type=client_credentials' \
    -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" \
    -H "Authorization: YOUR_APP_ENCODED_BEARER_TOKEN \
    'https://api.twitter.com/oauth2/token'
```

This returns a token_type and access_token. The `access_token` is the only thing we need to use in further requests to be authenticated. To test this, you just need to replace your `access_token` with `BEARER_ACCESS_TOKEN` in the following example:

```
curl -X GET \
    -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" \
    -H "Authorization: Bearer BEARER_ACCESS_TOKEN" \
    'https://api.twitter.com/1.1/statuses/user_timeline.json?count=5&screen_name=requirelx'
```

This gives information about that last five posts `requirelx` Twitter user did. Now that you know the basics to implement this solution, we are going to leave the implementation as an exercise for the reader.

Some interesting use cases using Twitter API could be to search for specific hashtags or usernames. For example, despite the fact we could have information about our user ('requirelx'), the application could suggest you to take a look at someone that is going to give a talk in one event.

#### Additional stats

The API we created may be useful to get some statistics that these websites usually don't provide or cross stats between APIs. For example, we may answer questions such as "Who is the person that created more issues?", "Does the person that creates more Github issues usually attends to the meetups?", "How many different venues we had in the past year?", and so on.

#### The App

The app creation is out of the scope of this blogpost but an interesting solution could be to create a React Native application that stays up to date and gives push notifications whenever a new event or issue is created.

#### Deployment

Deployment it's an important part of the development process. In this pet project we decided to give a try to [Cloud 66](http://www.cloud66.com/), which recently added NodeJS support. The main idea is to make DevOps easy and they do this by analyzing your code and help you to manage your different cloud providers (AWS, Digital Ocean, etc).

We concluded that despite the fact they're just started supporting NodeJS, it's really easy to deploy and clone your stacks to another providers and environments. For example, it's very simple to add a new environment (QA, Staging, Production, etc) or set up an SSL certificate in your Production machine. We also noticed that they do not support autoscaling for now.

In our pet project this could be interesting mainly to test all different environments in isolation before sending them to production as well as managing if our servers are up and running!

### Conclusions

This article gives a quick introduction to events that YLD team members are involved with, and gives a simple solution to hack on application API's we use nearly every day: a community event monitor. An application like this could be interesting for every strong and evolving community, and we tried to make the solution as configurable as possible, so many use cases could apply. However, lots of additions could still be added to this small project, for instance, to follow specific podcasts, youtube channels, or facebook groups.

See you in the next meetup!

_Originally published at [blog.yld.io](https://blog.yld.io/) on January 17, 2017 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
