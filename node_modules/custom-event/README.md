custom-event
============
### Cross-browser `CustomEvent` constructor

[![Sauce Test Status](https://saucelabs.com/browser-matrix/custom-event.svg)](https://saucelabs.com/u/custom-event)

[![Build Status](https://travis-ci.org/webmodules/custom-event.svg?branch=master)](https://travis-ci.org/webmodules/custom-event)

https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent


Installation
------------

``` bash
$ npm install custom-event
```


Example
-------

``` js
var CustomEvent = require('custom-event');

// add an appropriate event listener
target.addEventListener('cat', function(e) { process(e.detail) });

// create and dispatch the event
var event = new CustomEvent('cat', {
  detail: {
    hazcheeseburger: true
  }
});
target.dispatchEvent(event);
```
