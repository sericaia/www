---
title: 'Query by 2 or more fields on GraphQL'
date: '2019-01-18'
---

We at [YLD](https://www.yld.io/) are using Slack together with [missions.ai](https://missions.ai/), allowing our employees to get some relevant information about them or about other people in the company and removing TOIL so our operations staff have more time to do other things. It helps to answer questions such as "How much hardware budget do I still have?" or "Is the person X on holidays?", or simply to request business cards.

We are grabbing some data about the person from different data sources such as [BambooHR](https://www.bamboohr.com/api/documentation/), [Slack](https://api.slack.com/) and also some master spreadsheets with other metadata. We decided to go with a [GraphQL](https://graphql.org/) + [Apollo](https://www.apollographql.com/) solution for the API and our schema is similar to the following:

```graphql
type Query {
  employee(email: String!): Employee
  employees(filter: String): [Employee]
}

type Employee {
  id: String
  birthday: String
  displayName: String
  hireDate: String
  slack: Slack
  workEmail: String
}

type Slack {
  id: String
  handle: String
}
```

### Problem

We are currently adding more missions to our list and we saw that querying `employee` by `email` is not sufficient for our requirements. What if we want to get an employee information by a field other than email (e.g. slackId)?

What we want is something such as the following:

```graphql
type Query {
  employee(email: String!): Employee
  employee(slackId: String!): Employee
  employees(filter: String): [Employee]
}
```

Unfortunately this is not possible in GraphQL! What exactly do we want?

- query by employee email or slackId
- email or slackId are required

### 1st Solution

One possible solution is to add two different queries and resolvers:

```graphql
type Query {
  getEmployeeByByEmail(email: String!): Employee
  getEmployeeBySlackId(slackId: String!): Employee
  employees(filter: String): [Employee]
}
```

This works and it is an **explicit** solution: everyone that reads this piece of code understands exactly what it does. However, if we have 10 other fields we might want to query (e.g Github handle or Twitter handle, which are both unique values) we can end up with a messy solution that is **not scalable**.

### 2nd Solution

Another solution we can think of is having both fields for the same resolver as follows:

```graphql
type Query {
  employee(email: String, slackId: String): Employee
  employees(filter: String): [Employee]
}
```

In this case we **miss the required (!)** field filter in the query and that validation has to be done inside the resolver:

```js
// resolver code
employee: async (root, { email, slackId }, { dataSources }) => {
  // at least one of the parameters is required
  if (!email && !slackId) {
    return new Error('Email or SlackId are required.');
  }
  // ...
```

This could also be **confusing if you just look at the `Query`** defined in the GraphQL schema. Moreover, if we have multiple parameters to filter from we would have the same issue for all of them. This solution is also confusing and **not scalable**.

### 3rd Solution

We ended up using another solution: [GraphQL Input Types](https://graphql.org/graphql-js/mutations-and-input-types/). With `input` types you can specify [types of inputs ("fields")](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) that can be used in your query.
We created a new `input` type:

```graphql
input EmployeeSearch {
  email: String,
  slackId: String
}
```

We use `EmployeeSearch` in our query referring it as a required field (!). This way we are specifying that at least one of the fields should be used to perform the query.

```graphql
type Query {
  employee(
    where: EmployeeSearch!
  ): Employee
  employees(filter: String): [Employee]
}
```

![GraphiQL showing up and executing a query that searches for an employee](https://user-images.githubusercontent.com/1150553/51124170-8ff3a500-1815-11e9-9ddb-dc18a63fcc7c.gif)

This is a solution that is **more declarative and clear** when we look at the schema. Furthermore, it is **widely used** in projects like [Gatsby](https://www.gatsbyjs.org/) (check [GraphQLInputObjectType used in Gatsby](https://github.com/gatsbyjs/gatsby/blob/master/packages%2Fgatsby%2Fsrc%2Fschema%2Finfer-graphql-input-fields-from-fields.js#L4) for details).
In comparison with the former solutions presented, using **Input Types is more scalable** but has the **disadvantage of having to filter by field inside the resolver**. Also, we should not forget that the **resolver must give an Error** if either email or slackId are not sent to query employee:

```js
// resolver code
employee: async (root, { where: { email, slackId } }, { dataSources }) => {
  if (!email && !slackId) {
    return new Error('Email or SlackId are required.');
  }

  if (email) {
    return getEmployeeFromEmail(email, dataSources);
  }
  if (slackId) {
    return getEmployeeFromSlackId(slackId, dataSources);
  }
  return null;
},
// ...
```

We ended up using input types and making our schema clean and mean. In order to make it even prettier we followed some [open-crud](https://github.com/opencrud/opencrud) specification ideas, which is used by interesting projects like [Prisma](https://www.prisma.io/) or [GraphCMS](https://graphcms.com).

Enjoy input types!

_Originally published at [blog.yld.io](https://blog.yld.io/) on January 18, 2019 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
