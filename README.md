impress.js
============

[![CircleCI](https://circleci.com/gh/impress/impress.js.svg?style=svg)](https://circleci.com/gh/impress/impress.js)

It's a presentation framework based on the power of CSS3 transforms and
transitions in modern browsers and inspired by the idea behind prezi.com.

**WARNING**

impress.js may not help you if you have nothing interesting to say ;)


HOW TO USE IT
---------------

[Use the source](http://github.com/impress/impress.js/blob/master/index.html), Luke ;)

Please note that impress.js was created for developers. Some basic knowledge of html, css and
javascript is a prerequisite to install and use its features.

If you are a designer or novice developer that want to use impress.js,
[there are some projects](https://github.com/impress/impress.js/wiki/Examples-and-demos/5d887507caa5cf534eab6713d9adb3a5e7662459#authoring-tools) that aim to provide an editing tool for impress.js. They might be still in
development, but we hope they will manage to make impress.js more accessible to everyone.



EXAMPLES AND OTHER LEARNING RESOURCES
---------------------------------------

### Official demo

[impress.js demo](http://impress.github.io/impress.js/) by [@bartaz](http://twitter.com/bartaz)

### Examples and demos

More examples and demos can be found on [Examples and demos wiki page](http://github.com/impress/impress.js/wiki/Examples-and-demos).

Feel free to add your own example presentations (or websites) there.

### Other tutorials and learning resources

If you want to learn even more there is a [list of tutorials and other learning resources](https://github.com/impress/impress.js/wiki/impress.js-tutorials-and-other-learning-resources)
on the wiki, too.

There is also a book available about [Building impressive presentations with impress.js](http://www.packtpub.com/building-impressive-presentations-with-impressjs/book) by Rakhitha Nimesh Ratnayake.


WANT TO CONTRIBUTE?
---------------------

Please, read the [contributing guidelines](.github/CONTRIBUTING.md) on how to create [Issues](.github/CONTRIBUTING.md#issues) and [Pull Requests](.github/CONTRIBUTING.md#pull-requests).

**Note:** The team has changed, so there will be many changes in the upcoming versions.
If you need informations about versions, check the [changelog](CHANGELOG.md).


ABOUT THE NAME
----------------

impress.js name in [courtesy of @skuzniak](http://twitter.com/skuzniak/status/143627215165333504).

It's an (un)fortunate coincidence that a Open/LibreOffice presentation tool is called Impress ;)

Reference API
-----------------

### HTML

#### Root Element

impress.js requires a Root Element with id "impress". All the content of the presentation will be created inside that element. It is not recommended to manipulate any of the styles, attributes or classes that are created by impress.js inside the Root Element after initialization.

**Example:**

```html
<div id="impress"></div>
```

#### Step Element

A Step Element is an element that contains metadata that defines how it is going to be presented
in the screen.
A Step Element should contain a `.step` class and a unique `id` attribute.
The content represents an html fragment that will be initially positioned at the center of the camera point of view.
In the Step Element, you can define a specific set of default attributes and positioning, that are documented below.

**Example:**

```html
<div id="bored" class="step" data-x="-1000">
    <q>Aren’t you just <b>bored</b> with all those slides-based presentations?</q>
</div>
```

##### 2D Coordinates Positioning (data-x, data-y)

Define the pixel based position in which the **center** of the Step Element will be positioned relative to the infinite canvas in the first and second dimensions.

**Example:**

```html
<div id="bored" class="step" data-x="-1000" data-y="-1500">
    <q>Aren’t you just <b>bored</b> with all those slides-based presentations?</q>
</div>
```

##### 2D Scaling (data-scale)

Defines the scaling multiplier of the Step Element relative to the other Step Elements. For example,
`data-scale="4"` means that the element will appear to be 4 times larger than the others. From presentation and transitions point of view, it means that it will have to be scaled down (4 times) to make it back to its correct size.

**Example:**

```html
<div id="title" class="step" data-x="0" data-y="0" data-scale="4">
    <span class="try">then you should try</span>
    <h1>impress.js<sup>*</sup></h1>
    <span class="footnote"><sup>*</sup> no rhyme intended</span>
</div>
```

##### 2D Rotation (data-rotate)

Represents the amount of clockwise rotation of the element relative to 360 degrees.

**Example:**

```html
<div id="its" class="step" data-x="850" data-y="3000" data-rotate="90" data-scale="5">
    <p>
      It’s a <strong>presentation tool</strong> <br>
      inspired by the idea behind <a href="http://prezi.com">prezi.com</a> <br>
      and based on the <strong>power of CSS3 transforms and transitions</strong> in modern browsers.
    </p>
</div>
```


##### 3D Coordinates Positioning (data-z)

Define the pixel based position in which the **center** of the Step Element will be positioned relative to the infinite canvas in the third dimension (Z axis). For example, if we use `data-z="-3000"`, it means that the Step Element will be positioned far away from the camera (by 3000px).

**Example:**

```html
<div id="tiny" class="step" data-x="2825" data-y="2325" data-z="-3000" data-rotate="300" data-scale="1">
    <p>and <b>tiny</b> ideas</p>
</div>
```

##### 3D Rotation (data-rotate-x, data-rotate-y, data-rotate-z)

You can not only position element in 3D, but also rotate it around any axis.

**Example:**

The example below will get rotated by -40 degrees (40 degrees anticlockwise) around X axis and 10 degrees (clockwise) around Y axis.

You can of course rotate it around Z axis with `data-rotate-z` - it has exactly the same effect as `data-rotate` (these two are basically aliases).

```HTML
<div id="its-in-3d" class="step" data-x="6200" data-y="4300" data-z="-100" data-rotate-x="-40" data-rotate-y="10" data-scale="2">
    <p>
      <span class="have">have</span>
      <span class="you">you</span>
      <span class="noticed">noticed</span>
      <span class="its">it’s</span>
      <span class="in">in</span>
      <b>3D<sup>*</sup></b>?
    </p>
    <span class="footnote">* beat that, prezi ;)</span>
</div>
```

### CSS

#### .future class

The `.future` class is added to all Step Elements that haven't been visited yet.

**Example:**

```CSS
.future {
  display: none;
}
```

#### .present class

The `.present` class is added to the Step Element that is currently in the center of the camera perspective. This is useful to create animations inside the step once the camera navigates to it.

**Example:**

```CSS
.present .rotating {
  transform: rotate(-10deg);
  transition-delay: 0.25s;
}
```

#### .past class

The `.past` class is added to all Step Elements that have been visited at least once.

**Example:**

```CSS
.past {
  display: none;
}
```

#### .impress-not-supported class

This class is added to the `body` element if the browser doesn't support features required by impress.js, it is useful to apply some fallback styles in the CSS.

It's not necessary to add it manually on the `body` element. If the script detects that browser is not good enough it will add this class.

It is recommended to add the class manually to the `body` element though, because that means that users without JavaScript will also get fallback styles. When impress.js script detects that browser supports all required features, the `.impress-not-support` class will be removed from the `body` element.

**Example:**

```CSS
.impress-not-supported .step {
  display: inline-block;
}
```

### JavaScript

#### impress().init()

Initializes impress.js globally in the page. Only one instance of impress.js is supported per document.

**Example:**

```JavaScript
impress().init();
```

#### impress().next()

Navigates to the next step of the presentation.

**Example:**

```JavaScript
var api = impress();
api.init();
api.next();
```

#### impress().prev()

Navigates to the previous step of the presentation.

**Example:**

```JavaScript
var api = impress();
api.init();
api.prev();
```

#### impress().goto(stepIndex|stepElementId|stepElement, [duration])

Accepts a [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) that represents the step index.
Navigates to the step given the provided step index.

**Example:**

```JavaScript
var api = impress();
api.init();
api.goto(7);
```

Accepts a [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) that represents the Step Element id.
Navigates to the step given the provided Step Element id.

**Example:**

```JavaScript
var api = impress();
api.init();
api.goto( "overview" );
```

Accepts an [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) that represents the Step Element.
Navigates to the step given the provided Step Element.

**Example:**

```JavaScript
var overview = document.getElementById( "overview" )
var api = impress();
api.init();
api.goto( overview );
```

Accepts an optional [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) in the last argument that represents the duration of the transition in milliseconds. If not provided, the default transition duration for the presentation will be used.

BROWSER SUPPORT
-----------------

### TL;DR;

Currently impress.js works fine in latest Chrome/Chromium browser, Safari 5.1 and Firefox 10.
With addition of some HTML5 polyfills (see below for details) it should work in Internet Explorer 10, 11 and Edge.
It doesn't work in Opera, as it doesn't support CSS 3D transforms.

If you find impress.js working on other browsers, feel free to tell us and we'll update this documentation.

As a presentation tool it was not developed with mobile browsers in mind, but some tablets are good
enough to run it, so it should work quite well on iPad (iOS 5, or iOS 4 with HTML5 polyfills) and
Blackberry Playbook. Inform us of any bug and we will try to fix this.

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

For example IE10 is said to support CSS 3D transforms and transitions, but it doesn't have `dataset`
APIs implemented at the moment. So including polyfill libraries *should* help IE10 with running
impress.js.


### And few more details about mobile support

Mobile browsers are currently not supported. Even Android browsers that support CSS 3D transforms are
forced into fallback view at this point.

Fortunately some tablets seem to have good enough hardware support and browsers to handle it.
Currently impress.js presentations should work on iPad and Blackberry Playbook.

In theory iPhone should also be able to run it (as it runs the same software as iPad), but I haven't
found a good way to handle its small screen.

Also note that iOS supports `classList` and `dataset` APIs starting with version 5, so iOS 4.X and older
requires polyfills to work.

Copyright 2011-2016 Bartek Szopka - Released under the MIT [License](LICENSE)
