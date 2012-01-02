impress.js
============

It's a presentation framework based on the power of CSS3 transforms and 
transitions in modern browsers and inspired by the idea behind prezi.com.

*WARNING*

impress.js may not help you if you have nothing interesting to say ;)


ABOUT THE NAME
----------------

impress.js name in courtesy of @skuzniak (http://twitter.com/skuzniak/status/143627215165333504).

It's an (un)fortunate coincidence that a Open/LibreOffice presentation tool is called Impress ;)



DEMO
------

impress.js demo: [http://bartaz.github.com/impress.js]


If you have used impress.js in your presentation and would like to have it listed here,
please contact me via GitHub or send me a pull request to updated `README.md` file.



BROWSER SUPPORT
-----------------

Impress.js is developed with current webkit-based browsers in mind (Chrome,
Safari), but *should* work also in other browsers supporting CSS3 3D transforms
and transitions (Firefox, IE10).

Additionally for the animations to run smoothly it's required to have hardware
acceleration support in your browser. This depends on the browser, your operating
system and even kind of graphic hardware you have in your machine.

It's actively developed with newest Chromium and tested in Firefox Aurora.

I don't really expect it to run smoothly in non-webkit-based browser.
If it does, just let me know, I'll glad to hear that!

For browsers not supporting CSS3 3D transforms impress.js adds `impress-not-supported`
class on `#impress` element, so fallback styles can be applied.


### Mobile

Mobile browsers are currently not supported. Even iOS and Android browsers that support
CSS 3D transforms are forced into fallback view at this point.

Anyway, I'm really curious to see how modern mobile devices such as iPhone or iPad can
handle such animations, so future mobile support is considered.



LICENSE
---------

Copyright 2011 Bartek Szopka. Released under MIT License.

