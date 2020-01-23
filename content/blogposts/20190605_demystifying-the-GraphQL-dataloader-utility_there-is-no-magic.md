---
title: 'Demystifying the GraphQL dataloader utility: there is no magic!'
date: '2019-06-05'
icons: ['star']
---

> "DataLoader is a generic **utility** to be used as part of your application's **data fetching** layer to provide a consistent API over various backends and reduce requests to those backends via **batching** and **caching**." ([source](https://github.com/facebook/dataloader))

**Batching** is dataloader's primary job.

- The batch function receives an array of keys;
- Returns a promise for an array of values.

Whaaat? how?

```js
const DataLoader = require('dataloader')

const myLoader = new DataLoader(
  keys =>
    new Promise((resolve, reject) => {
      // ...
    })
)
```

There are a few options you can add to the dataloader, [check them in the docs](https://github.com/facebook/dataloader#new-dataloaderbatchloadfn--options).

We can later load data from the dataloader we created:

`myLoader.load(key)`

To better understand the dataloader and where its "magic" lies check the [enqueuePostPromiseJob function](https://github.com/facebook/dataloader/blob/master/src/index.js#L187-L221), where the Node.js [`process.nextTick(fn)`](https://nodejs.org/api/process.html#process_process_nexttick_callback_args) is called.
To sum up, the batching is done by grabbing all load operations that need to finish before the next event loop (and before any I/O operation). Using `process.nextTick` it will dispatch the job in the right place (right before the next event loop!) and batch them together.

Note that most databases support batch loading and there are few examples on how to do it in [facebook/dataloader examples](https://github.com/facebook/dataloader/blob/master/examples).

**Caching**

If we call the `load` function twice with the same key, the result will be the same because the data is cached (it will only not be cached if you explicitly set `{ cache: false }` in the options). Here are some characteristics of the caching functionality:

- The dataloader does in-memory caching
- The cache will only be deleted when the data is garbage collected
- ...but you can clear the cache calling `clear(key)` or `clearAll()`! This is useful when you have mutations and you want to invalidate the existing cache

### Football use case!

Imagine that we have a football team with all the great players! A football team has players, coaches, games, etc. There is a relationship between Player and Coach:

```graphql
type Player {
  id: ID!
  name: String!
  position: String
  shirtNumber: Int
  coach: Coach
}

type Coach {
  id: ID!
  name: String!
}

type Query {
  player(id: ID!): Player
  players: [Player]
}
```

Let's say for the purpose of our example that the team has a main Coach, but each Player position may have an assistant Coach: goalkeepers have its own assistant Coach, forwards have its own, and so on. Taking that into consideration our data could be the following:

```json
{
  "players": [
    {
      "id": "1",
      "name": "Cristiano Ronaldo",
      "position": "forward",
      "shirtNumber": 7,
      "coach": {
        "id": "40",
        "name": "Forwards assistant Coach"
      }
    },
    {
      "id": "2",
      "name": "Lionel Messi",
      "position": "forward",
      "shirtNumber": 10,
      "coach": {
        "id": "40",
        "name": "Forwards assistant Coach"
      }
    },
    {
      "id": "3",
      "name": "Gianluigi Buffon",
      "position": "goalkeeper",
      "shirtNumber": 1,
      "coach": {
        "id": "41",
        "name": "Goalkeepers assistant Coach"
      }
    },
    {
      "id": "4",
      "name": "Rui Patrício",
      "position": "goalkeeper",
      "shirtNumber": 2,
      "coach": {
        "id": "41",
        "name": "Goalkeepers assistant Coach"
      }
    }
    // ...
  ]
}
```

What a team we have! As you can see the coach might get duplicated, and this is a reason to use DataLoader and avoid doing duplicate requests. If our DataLoader keys are the `id`s, the coach requests would be the following:

```js
coachLoader.load(40)
coachLoader.load(40) // will load from cache, no request is made
coachLoader.load(41)
coachLoader.load(41) // will load from cache, no request is made
```

DataLoader's batch function could also be invoked if we're querying all `players` because we are (probably) requesting them from the same database table. Let's use SQL as an example:

- we would do a `SELECT * FROM PLAYERS` to have all players;
- to have a specific set of players, lets say the lineup team for a game, we would do `SELECT * FROM players WHERE id IN (id1, id2, ..., idn)` - yay! batch really works in SQL!
- **Please note that there is no magic, your database has to support batch in order to do it ;)**

### Adding DataLoader to GraphQL

In order to use the DataLoader in GraphQL you need to pass it through the GraphQL `context`. Let's use the `coachLoader` example we just mentioned earlier:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    coachLoader: coachLoader(), // adds the loader!
  }),
})
```

It can now be used in the resolvers:

```js
const resolvers = {
  Query: {
    coach: ({ coachId }, _, { coachLoader }) => coachLoader.load(coachId) // do something with the loader
  },
```

And the `coachLoader.js` implementation:

```js
const DataLoader = require('dataloader')
const db = require('./db') // some db, could be using a ORM such as sequelize

// aux function that will format the result to be ordered by the given ids,
// otherwise dataloader throws an error
const formatResult = (coaches, ids) => {
  const coachMap = {}
  coaches.forEach(coach => {
    coachMap[coach.id] = coach
  })

  return ids.map(id => coachMap[id])
}

const batchCoaches = async ids => {
  try {
    const coaches = await db.findCoachesByIds(ids)
    return formatResult(coaches, ids)
  } catch (err) {
    throw new Error('There was an error getting the coaches.')
  }
}

module.exports = () => new DataLoader(batchCoaches)
```

`batchCoaches` is the function passed to the dataloader that receives and array of keys (ids) and returns an array of values. `db.findCoachesByIds` is the function that demystifies most of the magic: it only calls the database batch query. If we are using [Sequelize ORM](http://docs.sequelizejs.com) it should be the following:

```js
  // coachModel.js
  static findCoachesByIds(ids) {
    return this.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: ids
        }
      },
      raw: true
    });
  }
```

That's all! There's really no magic! Node.js's `process.nextTick` and a database that supports batch does the trick!

### Resources

- [Facebook/dataloader github](https://github.com/facebook/dataloader)
- [Video: DataLoader - Source code walkthrough by Lee Byron](https://www.youtube.com/watch?v=OQTnXNCDywA&feature=youtu.be)
- [DataLoader and caching in Apollo](https://www.apollographql.com/docs/graphql-tools/connectors.html#dataloader)
- [Using DataLoader in a RESTDataSource in Apollo](https://www.apollographql.com/docs/apollo-server/features/data-sources.html#What-about-DataLoader)

### Want to know more?

YLD provides training tailored to your needs. It could be React.js, Node.js, DevOps and more. Check out the [YLD training page](https://www.yld.io/training/) and [get in touch](https://www.yld.io/contact/) to learn more.

_Originally published at [blog.yld.io](https://blog.yld.io/) on June 5, 2019 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
