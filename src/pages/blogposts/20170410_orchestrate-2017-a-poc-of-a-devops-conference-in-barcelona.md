---
title: 'Orchestrate 2017 - a PoC of a DevOps conference in Barcelona'
date: '2017-04-10'
---

I went to Barcelona for just the second time to attend to Orchestrate 2017 and speak at NodeConf Barcelona. It was really nice to be in such an amazing city again with all this mix of tech content, great environment, nice “tapas” food and beach nearby.

[Orchestrate](https://ti.to/blended/orchestrate-2017/en) is a 1-day conference about DevOps and as such, some fancy topics like as Containers, Docker, Kubernetes, Microservices, TensorFlow were mentioned. I'm kind of an outsider on these topics (I'm a developer), so, for me, the conference had some interesting news and I found some learning opportunities.

**Luke Bond** kicked off with a talk about [Kubernetes Operators](https://coreos.com/blog/introducing-operators.html). He started to talk about the difference between Kubernetes primitives and operators and explained that operators do application specific stuff that Kubernetes can’t do (they extend the functionality to increase automation!). Some of the examples that may need operators are integrations with databases.

[Etcd Operator](https://coreos.com/blog/introducing-the-etcd-operator.html) was also mentioned and used through the demos. This operator has some important features such as create, destroy, resize, backup or upgrade for the etcd distributed key-value store. Installing an operator is as easy as creating a deployment and Luke showed how to use an operator to upgrade the [cluster size](https://github.com/lukebond/orchestrate-barcelona-operators-20170406/blob/master/demo.txt).

**Andrew Martin** gave a talk about security. He started defining what security is and analysing some vulnerabilities from the previous years. Some tricks about how reduce these vulnerabilities were given: (a) have specs, robust design and improved build; (2) deploy often! (3) measure your tests (4) Upskill your team (YLD can help with that with training!).

Andrew gave some tips how to enforce security policies in containers, after talking about the good and the bad parts of it. Finally, he talked about how some tools help to scan and analyse containers and apps.

After a nice lunch and a quick visit to the Barcelona beach, **Samuel Cozannet** talked about the work Canonial is doing to help DevOps. He mentioned some tools that they created to deploy complex applications, manage servers and to get an API for physical machines. The most interesting part was the demo with a nice dashboard using [Juju](https://www.ubuntu.com/cloud/juju) where we can clearly see the models, the Kubernetes integration, all the workers and machines being used.

**Sandeep Dinesh** started with the Kubernetes basics: he explained what pods, deployments, and services are, but soon he started with a large amount of great demos. He explained the work Google is doing to have multi-region and multi-cloud data servers and how [Cluster Federation](https://kubernetes.io/docs/tutorials/federation/set-up-cluster-federation-kubefed/) helps with that. His [blogpost about load balancing in Kubernetes](https://medium.com/google-cloud/planet-scale-microservices-with-cluster-federation-and-global-load-balancing-on-kubernetes-and-a8e7ef5efa5e) is also worth reading.

**Guillem Hernandez** talked about Jenkins Pipeline from code to prod deployment. The most interesting part of the presentation was the integration with SauceLabs using Souce onDemand Report (iframe with SauceLabs build information).

To end up the day **Jon Nordby** played around using a [RabbitMQ](https://www.rabbitmq.com) example, and how to use [Msgflo](https://msgflo.org/) and [GuvScale](https://devcenter.heroku.com/articles/guvscale). He explained why message queues are useful and how Msgflo helps to integrate nodes and how can you autoscale and monitor with GuvScale heroku plugin. His demo about how to do image processing (e.g. of what can be a CPU intensive task) is available on [Github](https://github.com/msgflo/msgflo-example-imageresize).

It was my first DevOps conference and, despite the fact being a DevOps engineer is far away from being my dream job, I wanted to understand both the concepts and how a DevOps thinks. This was one of the main reasons that motivated me to try Kubernetes for the first time about one month ago and made me interested in this conference.

P.s Right after the conference I had a couple of interesting conversations with people from the conference (that’s the cool thing about attending!), had some beers and I got ready to go to the NodeConf speakers dinner!

We will update this blogpost with videos from the talks as soon as possible!

_Originally published at [blog.yld.io](https://blog.yld.io/) on April 10, 2017 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
