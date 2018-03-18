Changelog
=========
0.4.16
-----
  * Fixed an issue with throwing exception within resolver function [#113] (https://github.com/dfilatov/vow/issues/114)

0.4.15
-----
  * Fixed an issue with double emit of PromiseRejectionEvent [#113] (https://github.com/dfilatov/vow/issues/113)

0.4.14
-----
  * Added support of unhandled rejection event [#111] (https://github.com/dfilatov/vow/issues/111)

0.4.13
-----
  * Added workaround to avoid bug with `Array.prototype.push` in Opera 41

0.4.12
-----
  * Wrong propagation of progress state fixed

0.4.11
-----
  * Now global object (`window`, `global`) is passed properly 

0.4.10
-----
  * Now `MutationObserver` is used for internal "next tick" operations

0.4.9
-----
  * `vow.cast` method was fixed to properly work with external promises [#88](https://github.com/dfilatov/vow/issues/88)

0.4.8
-----
  * Detection of ymaps modular system was improved [#82](https://github.com/dfilatov/vow/issues/82)
  
0.4.7
-----
  * `vow.all` had wrong behaviour in case of passing of another promise implementation [#77](https://github.com/dfilatov/vow/issues/77)
  * `vow.timeout` rejects with `vow.TimedOutError` instead of `Error` reason in case of timeout [#76](https://github.com/dfilatov/vow/issues/76)
  
0.4.6
-----
  * `defer.reject` had wrong behaviour in case of already rejected promise was passed [#72](https://github.com/dfilatov/vow/issues/72)
  * CommonJS environment detection became more accurate [#74](https://github.com/dfilatov/vow/issues/74)

0.4.5
-----
  * Throwing exceptions inside `vow.reject` was removed [#69](https://github.com/dfilatov/vow/issues/69)
  * `promise.isFulfilled`/`promise.isRejected` immediately return proper state of promise got from `vow.fulfill(value)`/`reject(value`) [#68](https://github.com/dfilatov/vow/issues/68)
  * Minor optimizations were added

0.4.4
-----
  * ENB sources were added

0.4.3
-----
  * Some optimizations for V8 were added [#60](https://github.com/dfilatov/vow/issues/60). Thanks to [B-Vladi](https://github.com/B-Vladi).

0.4.2
-----
  * Pass progress state from items in all arrays/objects methods [#58](https://github.com/dfilatov/vow/issues/58)

0.4.1
-----
  * Improve detection of vow-compatible promises
  
0.4.0
-----
  * Implement [DOM Promise](http://dom.spec.whatwg.org/#promises) specification
  * Implement [new Promise A+](https://github.com/promises-aplus/promises-spec) specification
  * Remove `promise.fulfill`, `promise.reject`, `promise.notify` methods
  * Add `vow.anyResolved` method [#53](https://github.com/dfilatov/vow/issues/53)
  * Add `vow.cast` method [#53](https://github.com/dfilatov/vow/issues/56)

0.3.12
------
  * Make `Promise` class accessible from outside

0.3.11
------
  * Fix bug with inner timer in `delay` method [#45](https://github.com/dfilatov/jspromise/issues/45)

0.3.10
------
  * Use `setImmediate` instead of `process.nextTick` in Node.js >= 0.10.x [#40](https://github.com/dfilatov/jspromise/issues/40)
  * Up Promises/A+ Compliance Test Suite to 1.3.2

0.3.9
-----
  * Fix for propagation of progress state [#37](https://github.com/dfilatov/jspromise/issues/37)

0.3.8
-----
  * Fix for ignoring callback's context in always method [#35](https://github.com/dfilatov/jspromise/issues/35)
  * Callback in `Vow.invoke` called in global context now
  * bower.json added [#34](https://github.com/dfilatov/jspromise/issues/34)

0.3.7
-----
  * `Vow.allPatiently` method added [#32](https://github.com/dfilatov/jspromise/issues/32)
  
0.3.6
-----
  * Fix for properly work in mocha/phantomjs environment [#31](https://github.com/dfilatov/jspromise/issues/31)

0.3.5
-----
  * Fix for synchronize `onProgress` callback in `promise.sync` method [#30](https://github.com/dfilatov/jspromise/issues/30)

0.3.4
-----
  * Add ability to use multiple modules system simultaneously [#26](https://github.com/dfilatov/jspromise/issues/26)
  * Add callbacks to `promise.done` method [#29](https://github.com/dfilatov/jspromise/issues/29)
  
0.3.3
-----
  * Use `Vow` instead `this` in all static methods
  * Speed up optimizations
  
0.3.2
-----
  * Ability to specify context for callbacks [#28](https://github.com/dfilatov/jspromise/issues/28)

0.3.1
-----
  * Add support for [ym module's system](https://github.com/ymaps/modules) [#24](https://github.com/dfilatov/jspromise/issues/24)
  
0.3.0
-----
  * Add support for `progress/notify` [#23](https://github.com/dfilatov/jspromise/issues/23)

0.2.6
-----
  * `promise.always` doesn't pass the return value of `onResolved` [#19](https://github.com/dfilatov/jspromise/issues/19)
