
VERSION HISTORY
-----------------

### 0.5.3 ([browse](http://github.com/bartaz/impress.js/tree/0.5.3), [zip](http://github.com/bartaz/impress.js/zipball/0.5.3), [tar](http://github.com/bartaz/impress.js/tarball/0.5.3))

#### BUGFIX RELEASE

Version 0.5 introduced events including `impress:stepenter`, but this event was not triggered properly in some
specific transition types (for example when only scale was changing between steps). It was caused by the fact that
in such cases expected `transitionend` event was not triggered.

This version fixes this issue. Unfortunately modern `transitionend` event is no longer used to detect when the
transition has finished, but old school (and more reliable) `setTimeout` is used.


### 0.5.2 ([browse](http://github.com/bartaz/impress.js/tree/0.5.2), [zip](http://github.com/bartaz/impress.js/zipball/0.5.2), [tar](http://github.com/bartaz/impress.js/tarball/0.5.2))

#### DOCUMENTATION RELEASE

More descriptive comments added to demo CSS and impress.js source file, so now not only `index.html` is worth reading ;)


### 0.5.1 ([browse](http://github.com/bartaz/impress.js/tree/0.5.1), [zip](http://github.com/bartaz/impress.js/zipball/0.5.1), [tar](http://github.com/bartaz/impress.js/tarball/0.5.1))

#### BUGFIX RELEASE

Changes in version 0.5 introduced a bug (#126) that was preventing clicks on links (or any clickable elements) on
currently active step. This release fixes this issue.


### 0.5 ([browse](http://github.com/bartaz/impress.js/tree/0.5), [zip](http://github.com/bartaz/impress.js/zipball/0.5), [tar](http://github.com/bartaz/impress.js/tarball/0.5))

#### CHANGELOG

* API changed, so that `impress()` function no longer automatically initialize presentation; new method called `init`
  was added to API and it should be used to start the presentation
* event `impress:init` is triggered on root presentation element (`#impress` by default) when presentation is initialized
* new CSS classes were added: `impress-disabled` is added to body element by the impress.js script and it's changed to 
  `impress-enabled` when `init()` function is called
* events added when step is entered and left - custom `impress:stepenter` and `impress:stepleave` events are triggered
  on step elements and can be handled like any other DOM events (with `addEventListener`)
* additional `past`, `present` and `future` classes are added to step elements
    - `future` class appears on steps that were not yet visited
    - `present` class appears on currently visible step - it's different from `active` class as `present` class
       is added when transition finishes (step is entered)
    - `past` class is added to already visited steps (when the step is left)
* and good news, `goto()` API method is back! it seems that `goto` **was** a future reserved word but isn't anymore,
  so we can use this short and pretty name instead of camelCassy `stepTo` - and yes, that means API changed again...
* additionally `goto()` method now supports new types of parameters:
    - you can give it a number of step you want to go to: `impress().goto(7)`
    - or its id: `impress().goto("the-best-slide-ever")`
    - of course DOM element is still acceptable: `impress().goto( document.getElementById("overview") )`
* and if it's not enough, `goto()` also accepts second parameter to define the transition duration in ms, for example
  `impress().goto("make-it-quick", 300)` or `impress().goto("now", 0)`

#### UPGRADING FROM PREVIOUS VERSIONS

In current version calling `impress()` doesn't automatically initialize the presentation. You need to call `init()`
function from the API. So in a place were you called `impress()` to initialize impress.js simply change this call
to `impress().init()`.

Version 0.4 changed `goto` API method into `stepTo`. It turned out that `goto` is not a reserved word anymore, so it
can be used in JavaScript. That's why version 0.5 brings it back and removes `stepTo`.

So if you have been using version 0.4 and have any reference to `stepTo` API method make sure to change it to `goto`.


### 0.4.1 ([browse](http://github.com/bartaz/impress.js/tree/0.4.1), [zip](http://github.com/bartaz/impress.js/zipball/0.4.1), [tar](http://github.com/bartaz/impress.js/tarball/0.4.1))

#### BUGFIX RELEASE

Changes is version 0.4 introduced a bug causing JavaScript errors being thrown all over the place in fallback mode.
This release fixes this issue.

It also adds a flag `impress.supported` that can be used in JavaScript to check if impress.js is supported in the browser.


### 0.4 ([browse](http://github.com/bartaz/impress.js/tree/0.4), [zip](http://github.com/bartaz/impress.js/zipball/0.4), [tar](http://github.com/bartaz/impress.js/tarball/0.4))

#### CHANGELOG

* configuration options on `#impress` element: `data-perspective` (in px, defaults so 1000),
  `data-transition-duration` (in ms, defaults to 1000)
* automatic scaling to fit window size, with configuration options:  `data-width` (in px, defaults to 1024),
  `data-height` (in px, defaults to 768), `max-scale` (defaults to 1), `min-scale` (defaults to 0)
* `goto` API function was renamed to `stepTo` because `goto` is a future reserved work in JavaScript,
  so **please make sure to update your code**
* fallback `impress-not-supported` class is now set on `body` element instead of `#impress` element and it's
  replaced with `impress-supported` when browser supports all required features
* classes `step-ID` used to indicate progress of the presentation are now renamed to `impress-on-ID` and are
  set on `body` element, so **please make sure to update your code**
* basic validation of configuration options
* couple of typos and bugs fixed
* favicon added ;)

#### UPGRADING FROM PREVIOUS VERSIONS

If in your custom JavaScript code you were using `goto()` function from impress.js API make sure to change it
to `stepTo()`.

If in your CSS you were using classes based on currently active step with `step-` prefix, such as `step-bored`
(where `bored` is the id of the step element) make sure to change it to `impress-on-` prefix
(for example `impress-on-bored`). Also in previous versions these classes were assigned to `#impress` element
and now they are added to `body` element, so if your CSS code depends on this, it also should be updated.

Same happened to `impress-not-supported` class name - it was moved from `#impress` element to `body`, so update
your CSS if it's needed.

#### NOTE ON BLACKBERRY PLAYBOOK

Changes and fixes added in this version have broken the experience on Blackberry Playbook with OS in version 1.0.
It happened due to a bug in the Playbook browser in this version. Fortunately in version 2.0 of Playbook OS this
bug was fixed and impress.js works fine.

So currently, on Blackberry Playbook, impress.js work only with latest OS. Fortunately, [it seems that most of the
users](http://twitter.com/n_adam_stanley/status/178188611827679233) [are quite quick with updating their devices]
(http://twitter.com/brcewane/status/178230406196379648)


### 0.3 ([browse](http://github.com/bartaz/impress.js/tree/0.3), [zip](http://github.com/bartaz/impress.js/zipball/0.3), [tar](http://github.com/bartaz/impress.js/tarball/0.3))

#### CHANGELOG

* minor CSS 3D fixes
* basic API to control the presentation flow from JavaScript
* touch event support
* basic support for iPad (iOS 5 and iOS 4 with polyfills) and Blackberry Playbook

#### UPGRADING FROM PREVIOUS VERSIONS

Because API was introduced the way impress.js script is initialized was changed a bit. You not only have to include
`impress.js` script file, but also call `impress()` function.

See the source of `index.html` for example and more details.


### 0.2 ([browse](http://github.com/bartaz/impress.js/tree/0.2), [zip](http://github.com/bartaz/impress.js/zipball/0.2), [tar](http://github.com/bartaz/impress.js/tarball/0.2))

* tutorial/documentation added to `index.html` source file
* being even more strict with strict mode
* code clean-up
* couple of small bug-fixes


### 0.1 ([browse](http://github.com/bartaz/impress.js/tree/0.1), [zip](http://github.com/bartaz/impress.js/zipball/0.1), [tar](http://github.com/bartaz/impress.js/tarball/0.1))

First release.

Contains basic functionality for step placement and transitions between them
with simple fallback for non-supporting browsers.
