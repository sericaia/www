---
title: 'React Component Profiling'
date: '2016-11-25'
---

The React library is still evolving and Facebook's React team is working on a set of features to improve it, both internally (e.g the new reconciler algorithm) and to upgrade developer experience. In this quick blogpost we're going to take a look at a feature that was presented
in the latest released version ([v15.4.0](https://facebook.github.io/react/blog/2016/11/16/react-v15.4.0.html)): Component Profiling, which clearly could help developers to debug their code.

Component Profiling allows components to be analyzed using browser developer tools. The idea is to record interactions for a period of time and then understand when components were mounted, updated or unmounted. This is great both for beginners and advanced developers to find out what's going on.

#### How to use it

This is really simple to use once you have React v15.4.0 in your project. We kindly copied the guide for Google Chrome from [v15.4.0 release notes](https://facebook.github.io/react/blog/2016/11/16/react-v15.4.0.html):

```
1. Load your app with `?react_perf` in the query string (for example, http://localhost:3000/?react_perf).

2. Open the Chrome DevTools Timeline tab and press Record.

3. Perform the actions you want to profile. Don't record more than 20 seconds or Chrome might hang.

4. Stop recording.

5. React events will be grouped under the User Timing label.
```

#### Let's try it!

Let's just create an example with three components, where a parent (`Test`) renders two other components (`TestOne` and `TestTwo`).

```js
import React from 'react'

class Test extends React.Component {
  render() {
    return (
      <ul>
        <TestOne />
        <TestTwo />
      </ul>
    )
  }
}

class TestOne extends React.Component {
  render() {
    return <li>TestOne</li>
  }
}

class TestTwo extends React.Component {
  render() {
    return <li>TestTwo</li>
  }
}
```

This is a really simple example where we expect three components to be mounted. As you can see in the screenshot bellow, we can observe User Timing and spot that `Test` being mounted and `TestOne` and `TestTwo` mounted during `Test` mount lifecycle hook.

<img src="https://cloud.githubusercontent.com/assets/1150553/26068442/723ae60a-3995-11e7-9bd7-e7e4705b2c94.png" />

Another thing we should consider when looking at Component Profiling results is to relate it with React components' lifecycle events. Let's then induce some state changes to `TestOne` in order to observe some more interesting results:

```js
class TestOne extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
    }

    this.links = ['http://www.yld.io', 'http://blog.yld.io']
  }

  tick() {
    this.setState({
      url: this.links[Math.floor(Math.random() * 2)],
    })
  }

  componentDidMount() {
    setInterval(this.tick.bind(this), 50)
  }

  render() {
    return <li>{this.state.url}</li>
  }
}
```

Basically we are repeatedly changing the url state value each 50 milliseconds using a `setInterval()`. As a consequence, `setState()` is called, which is going to trigger `render()` to be called eventualy.

The following image shows what happens in this case. If you look at the User Timing label you will see that (1) components are being mounted as before, that (2) `componentDidMount()` lifecycle event we defined on `TestOne` component is called and that (3) consecutive updates on `TestOne` component are performed after it. You can also notice that `render()` for `TestOne` is only triggered when a new rendering cycle occurs (React doesn't necessarily render every single time there is a state change, it has its own independent rendering schedule).

<img src="https://media.giphy.com/media/xUA7aW3zyTnohYU5LG/giphy.gif" />

#### Limitations

1. Component profiling is **not working for every browser** yet - it should be in place for more browsers soon, but so far it's just in Google Chrome, Microsoft's Edge and IE.

2) Limited to **20 seconds** - React team mentioned that it may create some issues in Chrome if the record is longer than 20 seconds. We tested with Chrome in a real-world application using a MacBook Pro with 2,9 GHz Intel Core i5 and 16GB RAM, and for 100 milliseconds the buffer was not full and it did not crash. We believe that for most applications 20 seconds is not a real threat. Moreover, we consider that more that 20 seconds allow us to perform more operations and test more components, but most of the time you want to do it individualy. This experiment with real-world application helped to perceive what is consuming more time, take a deeper look into components lifecycle and to understand if they can be optimized somehow.

#### Future Considerations

We think this feature will be particularly interesting to be used when React announces [Fiber](https://facebook.github.io/react/contributing/codebase-overview.html#fiber-reconciler). Fiber is an experiment that aims to be the next version of React reconciler. If the success of Fiber is confirmed, this new version will more efficiently update UI components. Fiber's main difference is that it is able to pause and resume work that needs to be done in a cycle, and postpone what is not a priority.

Fiber acts behind the scenes, and developers should not be extremely worried about it. However, one thing that may give problems is expectations of the time when a component gets to be mounted, updated or unmounted. With Fiber, this may not happen when we're expecting and Component Profiling tools may help debugging these cases.

#### Quick Hint!

<img src="https://cloud.githubusercontent.com/assets/1150553/26068544/c8a0c960-3995-11e7-943a-00d0c14aa48a.png" />

Don't be afraid if you have a graph like the one above, where something seems to happen for 16 seconds and then profiling data is not getting updated each 50 milliseconds like before. If you change tabs while profiling, the profiler data gets more sparse, as you can see in the image above. To prevent this, refrain from switching tabs while profiling!

_Originally published at [blog.yld.io](https://blog.yld.io/) on November 25, 2016 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
