# Ultron

[![Made by unshift](https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square)](http://unshift.io)[![Version npm](http://img.shields.io/npm/v/ultron.svg?style=flat-square)](http://browsenpm.org/package/ultron)[![Build Status](http://img.shields.io/travis/unshiftio/ultron/master.svg?style=flat-square)](https://travis-ci.org/unshiftio/ultron)[![Dependencies](https://img.shields.io/david/unshiftio/ultron.svg?style=flat-square)](https://david-dm.org/unshiftio/ultron)[![Coverage Status](http://img.shields.io/coveralls/unshiftio/ultron/master.svg?style=flat-square)](https://coveralls.io/r/unshiftio/ultron?branch=master)[![IRC channel](http://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square)](http://webchat.freenode.net/?channels=unshift)

Ultron is a high-intelligence robot. It gathers intelligence so it can start
improving upon his rudimentary design. It will learn your event emitting
patterns and find ways to exterminate them. Allowing you to remove only the
event emitters that **you** assigned and not the ones that your users or
developers assigned. This can prevent race conditions, memory leaks and even file
descriptor leaks from ever happening as you won't remove clean up processes.

## Installation

The module is designed to be used in browsers using browserify and in Node.js.
You can install the module through the public npm registry by running the
following command in CLI:

```
npm install --save ultron
```

## Usage

In all examples we assume that you've required the library as following:

```js
'use strict';

var Ultron = require('ultron');
```

Now that we've required the library we can construct our first `Ultron` instance.
The constructor requires one argument which should be the `EventEmitter`
instance that we need to operate upon. This can be the `EventEmitter` module
that ships with Node.js or `EventEmitter3` or anything else as long as it
follow the same API and internal structure as these 2. So with that in mind we
can create the instance:

```js
//
// For the sake of this example we're going to construct an empty EventEmitter
//
var EventEmitter = require('events').EventEmitter; // or require('eventmitter3');
var events = new EventEmitter();

var ultron = new Ultron(events);
```

You can now use the following API's from the Ultron instance:

### Ultron.on

Register a new event listener for the given event. It follows the exact same API
as `EventEmitter.on` but it will return itself instead of returning the
EventEmitter instance. If you are using EventEmitter3 it also supports the
context param:

```js
ultron.on('event-name', handler, { custom: 'function context' });
```

### Ultron.once

Exactly the same as the [Ultron.on](#ultronon) but it only allows the execution
once.

### Ultron.remove

This is where all the magic happens and the safe removal starts. This function
accepts different argument styles:

- No arguments, assume that all events need to be removed so it will work as
  `removeAllListeners()` API.
- 1 argument, when it's a string it will be split on ` ` and `,` to create a
  list of events that need to be cleared.
- Multiple arguments, we assume that they are all names of events that need to
  be cleared.

```js
ultron.remove('foo, bar baz');        // Removes foo, bar and baz.
ultron.remove('foo', 'bar', 'baz');   // Removes foo, bar and baz.
ultron.remove();                      // Removes everything.
```

If you just want to remove a single event listener using a function reference
you can still use the EventEmitter's `removeListener(event, fn)` API:

```js
function foo() {}

ulton.on('foo', foo);
events.removeListener('foo', foo);
```

## License

MIT
