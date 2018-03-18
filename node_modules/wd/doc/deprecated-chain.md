## Chain Api

A chain api is also available. Code sample is [here](https://github.com/admc/wd/blob/master/examples/example.chain.chrome.js).

### Injecting command to the chain

As [queue](https://github.com/caolan/async#queue) implementation that we're using has some limitations, a special helper method *next* was added. It allows you to inject new calls to the execution chain inside callbacks.

#### Example 1 - the problem

```javascript
browser
  .chain()
  // ...
  .elementById('i am a link', function(err, el) {
    // following call will be executed apart from the current execution chain
    // you won't be able to pass results further in chain
    // and it may cause racing conditions in your script
    browser.clickElement(el, function() {
      console.log("did the click!");
    });
  })
  // ...
```

#### Example 2 - solution, use *next*

```javascript
browser
  .chain()
  // ...
  .elementById('i am a link', function(err, el) {
    // call to clickElement will be injected to the queue
    // and will be executed sequentially after current function finishes
    browser.next('clickElement', el, function() {
      console.log("did the click!");
    });
  })
  // ...
```

### Inserting async code with *queueAddAsync*

```javascript
browser
  .chain()
  // ...
  .elementById('i am a link', function(err, el) {
    // following call will be executed apart from the current execution chain
    // you won't be able to pass results further in chain
    // and it may cause racing conditions in your script
  })
  .queueAddAsync( function(cb) {
    // your code here
    cb(null);
  })
  .clickElement(el, function() {
    console.log("did the click!");
  })
  // ...
```
