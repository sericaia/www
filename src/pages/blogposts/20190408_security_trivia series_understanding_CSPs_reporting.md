---
title: "Security Trivia Series: Understanding CSP's Reporting"
date: "2019-04-08"
---

In our [previous blogpost about Content Security Policy (CSP)](https://medium.com/yld-engineering-blog/security-trivia-series-hints-on-default-src-csp-directive-7044c65db951) we promised to have another one about reporting and mentioned `report-uri`. Turns out that `report-uri` was deprecated in [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/#changes-from-level-2):

> The `report-uri` directive is deprecated in favor of the new `report-to` directive

In this blogpost we will check how `report-to` works and the main differences from `report-uri`. We will also check out the new [Reporting API](https://w3c.github.io/reporting/)!

### Use case

Imagine that we have a page with three iframes that link to Mozilla's website and subdomains, e.g. the following simplified HTML snippet:

```pug
html
  head
    title= title
  body
    iframe(src="https://developer.mozilla.org")
    iframe(src="https://support.mozilla.org")
    iframe(src="https://mozilla.org")
```

#### How can we implement a CSP that allow these iframes to be loaded?

As we have seen [in the previous blogpost](https://medium.com/yld-engineering-blog/security-trivia-series-hints-on-default-src-csp-directive-7044c65db951) we need to set the following CSP header value:

`Content-Security-Policy: "default-src 'self'; frame-src https://mozilla.org https://*.mozilla.org;"`

However, if some errors arise we might want to report them properly so we can act on them. Let's say that we only included Mozilla's subdomains and forgot to add `https://mozilla.org` to the allowed domains:

`Content-Security-Policy: "default-src 'self'; frame-src https://*.mozilla.org;"`

This should create an error. Let's learn how to report it!

### BEFORE: Using report-uri (*DEPRECATED!*)

`report-uri` receives a endpoint, e.g 

`Content-Security-Policy: ... ; report-uri <report-endpoint>`

Let's use a Node [express.js](https://expressjs.com/) server to test this. If we set the CSP header from the use case (where we expect to have an error) and use it on the `/content` route:

```js
const express = require("express");
const app = express();

app.get("/content", (req,res) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; frame-src https://*.mozilla.org; report-uri /report");
  res.render("index");
});

app.listen(3000, () => console.log(`Example app listening on port ${port}!`));
```

Notice that we are telling the browser to send all report errors to `/report` route using `report-uri`. Let's add a `/report` route to check those errors:

```js
app.post("/report", (req,res) => {
  console.log(req.body)
  return res.send('CSP fail: Report received');
});
```

This will fail for the last iframe (https://mozilla.org) as expected and we will get a `POST` on `/report` route with the following details:

```json
{
  "csp-report": {
    "document-uri": "http://localhost:3000/content",
    "referrer": "",
    "violated-directive": "frame-src",
    "effective-directive": "frame-src",
    "original-policy": "default-src 'self'; frame-src https://*.mozilla.org; report-uri /report",
    "disposition": "enforce",
    "blocked-uri": "https://mozilla.org",
    "line-number": 1,
    "source-file": "http://localhost:3000/content",
    "status-code": 200,
    "script-sample": ""
  }
}
```

There is plenty of information here to be processed and used to help to solve browser issues that can appear. We know exactly what was the policy that reported the error and what failed.

[`report-uri` is widely supported in most browsers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri#Browser_compatibility). However, it is not using a consistent reporting framework and that is the main reason why the Reporting API was created and the new CSP key `report-to` was created.

#### Hint

Some browsers request the `Content-Type` as `application/csp-report`, others as `application/json` so in order to use it we have to setup some configurations on our express server:

```js
const bodyParser = require('body-parser');

app.use(bodyParser.json({
  type: ['application/json', 'application/csp-report']
}));

//...
```

### Using **[report-to](https://w3c.github.io/webappsec-csp/#directive-report-to)**

`report-to` will replace `report-uri` soon, but currently [it is only supported on Chrome (> version 70) and Android](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to#Browser_compatibility).

Instead of a URI, it receives a `groupname`:

`Content-Security-Policy: ... ; report-to <groupname>`

and it needs an additional header to be set, `Report-to`:

```js
app.get("/content-report-to", (req, res) => {

  const reportTo = [
    {
      "endpoints": [
        {
          "url": "https://localhost:3000/report" // or your report url
        }
      ],
      "include_subdomains":true,
      "group": "csp-endpoint",
      "max_age": 31536000 // one year
    },
    // ...
  ];
  
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; frame-src https://*.mozilla.org; report-to csp-endpoint;");
  res.setHeader("Report-to", reportTo.map(JSON.stringify).join(', '));

  res.render("index");
});
```

We can set multiple groups with multiple endpoints, which is useful because we can have the CSP group that will report CSP errors, the network group to report network errors, and so on.

Endpoints can have priorities (for failover) and weights (to distribute load) and a caching value (`max_age`) is required to be set.

The body received from `report-to` is also different from what we got with `report-uri`, but it tells essentially the same story:

```json
[{
	"age": 16796,
	"body": {
		"blocked-uri": "https://mozilla.org",
		"disposition": "enforce",
		"document-uri": "https://localhost:3000/content-report-to",
		"effective-directive": "frame-src",
		"line-number": 1,
		"original-policy": "default-src 'self'; frame-src https://*.mozilla.org; report-to csp-endpoint;",
		"referrer": "",
		"script-sample": "",
		"sourceFile": "https://localhost:3000/content-report-to",
		"violated-directive": "frame-src"
	},
	"type": "csp",
	"url": "https://localhost:3000/content-report-to",
	"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
}]
```

Note: In this case `type` is `csp` but if we had a network error it would be `nel` and for a certificate error it would be `hpkp`. Check some examples in the [sample reports from the Reporting API](https://w3c.github.io/reporting/#sample-reports).

#### Hint

In order to use `report-to` the `Content-Type` has to be `application/reports+json`. We also need to setup our express server to serve HTTPS with a valid certificate, otherwise you can't test/use it.


### The New Reporting API

The [working draft](https://w3c.github.io/reporting/) explains it better than me but let's sum up some key points about the Reporting API:
* It catches CSP errors, network errors or browser crashes (not only CSP errors!);
* You can specify the endpoints that are going to receive the report, but it is done in a different way to what we are doing with `report-uri`;
* Multiple endpoints can be specified but only one gets the data.
* Priorities can be set per endpoint. If the one with higher priority fails it tries the next one (failover is supported);
* The browser sends the report when there is nothing with higher priority to be done, so the report information might only be sent when the browser is idle.
---

There are some differences between `report-uri` and `report-to`, mainly related to how to specify it and the extra `Report-to` header but in the end the data received is similar. However, the Reporting API opens a new world of possibilities to grab all kinds of errors in the browser.

Want to know more? We will cover CSP's unsafe dynamic and nonce in another blogpost, follow us and stay tuned!


*Originally published at [blog.yld.io](https://blog.yld.io/) on April 8, 2019 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)*