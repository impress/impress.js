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

* minor CSS 3D fixes

### 0.2 ([browse](http://github.com/bartaz/impress.js/tree/0.2), [zip](http://github.com/bartaz/impress.js/zipball/0.2), [tar](http://github.com/bartaz/impress.js/tarball/0.2))

* tutorial/documentation added to `index.html` source file
* being even more strict with strict mode
* code clean-up
* couple of small bug-fixes


### 0.1 ([browse](http://github.com/bartaz/impress.js/tree/0.1), [zip](http://github.com/bartaz/impress.js/zipball/0.1), [tar](http://github.com/bartaz/impress.js/tarball/0.1))

First release.

Contains basic functionality for step placement and transitions between them
with simple fallback for non-supporting browsers.



HOW TO USE IT
---------------

[Use the source](http://github.com/bartaz/impress.js/blob/master/index.html), Luke ;)

If you have no idea what I mean by that, or you just clicked that link above and got 
very confused by all these strange characters that got displayed on your screen,
it's a sign, that impress.js is not for you.

Sorry.

Fortunately there are some guys on GitHub that got quite excited with the idea of building
editing tool for impress.js. Let's hope they will manage to do it.


EXAMPLES AND DEMOS
--------------------

### Official demo

[impress.js demo](http://bartaz.github.com/impress.js) by [@bartaz](http://twitter.com/bartaz)

### Presentations

[CSS 3D transforms](http://bartaz.github.com/meetjs/css3d-summit) from [meet.js summit](http://summit.meetjs.pl) by [@bartaz](http://twitter.com/bartaz)

[What the Heck is Responsive Web Design](http://johnpolacek.github.com/WhatTheHeckIsResponsiveWebDesign-impressjs/) by John Polacek [@johnpolacek](http://twitter.com/johnpolacek)

[12412.org presentation to Digibury](http://extra.12412.org/digibury/) by Stephen Fulljames [@fulljames](http://twitter.com/fulljames)

[Data center virtualization with Wakame-VDC](http://wakame.jp/wiki/materials/20120114_TLUG/) by Andreas Kieckens [@Metallion98](https://twitter.com/#!/Metallion98)

[Asynchronous JavaScript](http://www.medikoo.com/asynchronous-javascript/3d/) by Mariusz Nowak [@medikoo](http://twitter.com/medikoo)

[Introduction to Responsive Design](http://www.alecrust.com/factory/rd-presentation/) by Alec Rust [@alecrust] (http://twitter.com/alecrust)

[Bonne année 2012](http://duael.fr/voeux/2012/) by Edouard Cunibil [@DuaelFr](http://twitter.com/DuaelFr)

[Careers in Free and Open Source Software](http://exequiel09.github.com/symposium-presentation/) by Exequiel Ceasar Navarrete [@ichigo1411](http://twitter.com/ichigo1411)

### Websites and portfolios

[lioshi.com](http://lioshi.com) by @lioshi

[alingham.com](http://www.alingham.com) by Al Ingham [@alingham](http://twitter.com/alingham)

[nice-shots.de](http://nice-shots.de) by [@NiceShots](http://twitter.com/NiceShots)

[museum140](http://www.youtube.com/watch?v=ObLiikJEt94) Shorty Award promo video [entirely made with ImpressJS](http://thingsinjars.com/post/446/museum140-shorty/) by [@thingsinjars](http://twitter.com/thingsinjars)


If you have used impress.js in your presentation (or website) and would like to have it listed here,
please contact me via GitHub or send me a pull request to updated `README.md` file.



BROWSER SUPPORT
-----------------

### TL;DR;

Currently impress.js works fine in latest Chrome/Chromium browser, Safari 5.1 and Firefox 10
(to be released in January 2012). IE is currently not supported (IE10 is close, but not there
yet - see below for details). It also doesn't work in Opera.

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

