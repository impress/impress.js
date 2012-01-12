impress.js
============

It's a presentation framework based on the power of CSS3 transforms and 
transitions in modern browsers and inspired by the idea behind prezi.com.

**WARNING**

impress.js may not help you if you have nothing interesting to say ;)


ABOUT THE NAME
----------------

impress.js name in [courtesy of @skuzniak](http://twitter.com/skuzniak/status/143627215165333504).

It's an (un)fortunate coincidence that a Open/LibreOffice presentation tool is called Impress ;)


VERSION HISTORY
-----------------

### master (in development)

**CONTAINS UNRELEASED CHANGES, MAY BE UNSTABLE**

* added mousewheel support (thx @OpenGrid)
* couple of small bug-fixes


### 0.1 ([browse](https://github.com/bartaz/impress.js/tree/0.1), [zip](https://github.com/bartaz/impress.js/zipball/0.1), [tar](https://github.com/bartaz/impress.js/tarball/0.1))

First release.

Contains basic functionality for step placement and transitions between them
with simple fallback for non-supporting browsers.


DEMO
------

[impress.js demo](http://bartaz.github.com/impress.js) by @bartaz

[What the Heck is Responsive Web Design](http://johnpolacek.github.com/WhatTheHeckIsResponsiveWebDesign-impressjs/) by John Polacek [@johnpolacek](http://twitter.com/johnpolacek)

[lioshi.com](http://lioshi.com) by @lioshi

[12412.org presentation to Digibury](http://extra.12412.org/digibury/) by Stephen Fulljames [@fulljames](http://twitter.com/fulljames)

If you have used impress.js in your presentation and would like to have it listed here,
please contact me via GitHub or send me a pull request to updated `README.md` file.



BROWSER SUPPORT
-----------------

### TL;DR;

Currently impress.js works fine in latest Chrome/Chromium browser, Safari 5.1 and Firefox 10
(to be released in January 2012). IE10 support is currently unknown, so let's assume it doesn't
work there. It also doesn't work in Opera.

As it was not developed with mobile browsers in mind, it currently doesn't work on 
any mobile devices, including tablets.

### Still interested? Read more...

Additionally for the animations to run smoothly it's required to have hardware
acceleration support in your browser. This depends on the browser, your operating
system and even kind of graphic hardware you have in your machine.

For browsers not supporting CSS3 3D transforms impress.js adds `impress-not-supported`
class on `#impress` element, so fallback styles can be applied to make all the content accessible.


### Even more explanation and technical stuff

Let's put this straight -- wide browser support was (and is) not on top of my priority list for
impress.js. It's built on top of fresh technologies that just start to appear in the browsers
and I'd like to rather look forward and develop for the future than being slowed down by the past.

But it's not "hard-coded" for any particular browser or engine. If any browser in future will
support features required to run impress.js, it will just begin to work there without changes in
the code.

From technical point of view all the positioning of presentation elements in 3D requires CSS 3D
transforms support. Transitions between presentation steps are based on CSS transitions.
So these two features are required by impress.js to display presentation correctly.

Unfortunately the support for CSS 3D transforms and transitions is not enough for animations to
run smoothly. If the browser doesn't support hardware acceleration or the graphic card is not 
good enough the transitions will be laggy.

Additionally the code of impress.js relies on APIs proposed in HTML5 specification, including
`classList` and `dataset` APIs. If they are not available in the browser, impress.js will not work.

Fortunately, as these are JavaScript APIs there are polyfill libraries that patch older browsers
with these APIs.

For example IE10 is said to support CSS 3D transforms and transitions, but it doesn't have `classList`
not `dataset` APIs implemented at the moment. So including polyfill libraries *should* help IE10
with running impress.js.


### And few more details about mobile support

Mobile browsers are currently not supported. Even iOS and Android browsers that support
CSS 3D transforms are forced into fallback view at this point.

Anyway, I'm really curious to see how modern mobile devices such as iPhone or iPad can
handle such animations, so future mobile support is considered.

iOS supports `classList` and `dataset` APIs starting with version 5, so iOS 4.X and older is not
likely to be supported (without polyfill code).


LICENSE
---------

Copyright 2011-2012 Bartek Szopka. Released under MIT License.

