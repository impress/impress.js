# Reference API

## HTML

### Root Element

impress.js requires a Root Element. All the content of the presentation will be created inside that element. It is not recommended to manipulate any of the styles, attributes or classes that are created by impress.js inside the Root Element after initialization.

To change the duration of the transition between slides use `data-transition-duration="2000"` giving it
a number of ms. It defaults to 1000 (1s).

When authoring impress.js presentations, you should target some screen size, which you can define here.
The default is 1024 x 768. You should write your CSS as if this is the screen size used for the
presentation. When you present your presentation on a screen (or browser window) of different size,
impress.js will automatically scale the presentation to fit the screen. The minimum and maximum limits
to this scaling can also be defined here.

All impress.js steps are wrapped inside a div element of 0 size! This means that in your CSS you
can't use relative values for width and height (example: `width: 100%`) to define the size of step elements.
You need to use pixel values. The pixel values used here correspond to the `data-width` and `data-height`
given to the `#impress` root element. When the presentation is viewed on a larger or smaller screen, impress.js
will automatically scale the steps to fit the screen.

**NOTE:** I intend to change the defaults to target HD screens in 2021. So you may want to make a habit
of explicitly defining these attributes for now, to avoid any disruption when the defaults change.

You can also control the perspective with `data-perspective="500"` giving it a number of pixels.
It defaults to 1000. You can set it to 0 if you don't want any 3D effects.
If you are willing to change this value make sure you understand how CSS perspective works:
https://developer.mozilla.org/en/CSS/perspective

See also [the plugin README](src/plugins/README.md) for documentation on `data-autoplay`.

**Attributes**

Attribute                | Default   | Explanation
-------------------------|-----------|------------
data-transition-duration | 1000 (ms) | Speed of transition between steps.
data-width               | 1024 (px) | Width of target screen size. When presentation is viewed on a larger or smaller screen, impress.js will scale all content automatically.
data-height              | 768 (px)  | Height of target screen size.
data-max-scale           | 1         | Maximum scale factor. (Note that the default 1 will not increase content size on larger screens!)
data-min-scale           | 0         | Minimum scale factor.
data-perspective         | 1000      | Perspective for 3D rendering. See https://developer.mozilla.org/en/CSS/perspective

**Example:**

```html
<div id="impress"
    data-transition-duration="1000"

    data-width="1024"
    data-height="768"
    data-max-scale="3"
    data-min-scale="0"
    data-perspective="1000"

    data-autoplay="7">
```

### Step Element

A Step Element is an element that contains metadata that defines how it is going to be presented in the screen.
A Step Element should contain a `.step` class and an optional `id` attribute.
The content represents an html fragment that will be positioned at the center of the camera.
In the Step Element, you can define a specific set of default attributes and positioning, that are documented below.

**Example:**

```html
<div id="bored" class="step" data-x="-1000">
    <q>Aren’t you just <b>bored</b> with all those slides-based presentations?</q>
</div>
```

#### 2D Coordinates Positioning (data-x, data-y)

Define the pixel based position in which the **center** of the [Step Element](#step-element) will be positioned inside the infinite canvas.

**Attributes**

Attribute                | Default   | Explanation
-------------------------|-----------|------------
data-x                   | 0         | X coordinate for step position
data-y                   | 0         | Y coordinate for step position

**Example:**

```html
<div id="bored" class="step" data-x="-1000" data-y="-1500">
    <q>Aren’t you just <b>bored</b> with all those slides-based presentations?</q>
</div>
```

#### 2D Scaling (data-scale)

Defines the scaling multiplier of the [Step Element](#step-element) relative to other Step Elements. For example, `data-scale="4"` means that the element will appear to be 4 times larger than the others. From the presentation and transitions point of view, it means that it will have to be scaled down (4 times) to make it back to its correct size.

**Example:**

```html
<div id="title" class="step" data-x="0" data-y="0" data-scale="4">
    <span class="try">then you should try</span>
    <h1>impress.js<sup>*</sup></h1>
    <span class="footnote"><sup>*</sup> no rhyme intended</span>
</div>
```

#### 2D Rotation (data-rotate)

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


#### 3D Coordinates Positioning (data-z)

Define the pixel based position in which the **center** of the [Step Element](#step-element) will be positioned inside the infinite canvas on the third dimension (Z) axis. For example, if we use `data-z="-3000"`, it means that the [Step Element](#step-element) will be positioned far away from the camera (by 3000px).

**Example:**

```html
<div id="tiny" class="step" data-x="2825" data-y="2325" data-z="-3000" data-rotate="300" data-scale="1">
    <p>and <b>tiny</b> ideas</p>
</div>
```

**Note:** The introduction of the [rel](src/plugins/rel/README.md) plugin includes a slight backward incompatible change.
Previously the default value for `data-x`, `data-y` and `data-z` was zero. The `rel` plugin changes the default to inherit
the value of the previous slide. This means, you need to explicitly set these values to zero, if they ever were non-zero.


#### 3D Rotation (data-rotate-x, data-rotate-y, data-rotate-z)

You can not only position a [Step Element](#step-element) in 3D, but also rotate it around any axis.

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

#### 3D Rotation Order (data-rotate-order)

The order in which the CSS `rotateX(), rotateY(), rotateZ()` transforms are applied matters. This is because each rotation is relative to the then current position of the element.

By default the rotation order is `data-rotate-order="xyz"`. For some advanced uses you may need to change it. The demo presentation [3D rotations](examples/3D-rotations/index.html) sets this attribute to rotate some steps into positions that are impossible to reach with the default order.


## CSS

### 4D States (.past, .present and .future classes)

The `.future` class is added to all [Step Elements](#step-element) that haven't been visited yet.

**Example:**

```CSS
.future {
  display: none;
}
```

The `.present` class is added to the [Step Element](#step-element) that is currently at the center of the camera. This is useful to create animations inside the step once the camera navigates to it.

**Example:**

```CSS
.present .rotating {
  transform: rotate(-10deg);
  transition-delay: 0.25s;
}
```

The `.past` class is added to all [Step Elements](#step-element) that have been visited at least once.

**Example:**

```CSS
.past {
  display: none;
}
```

### Current Active Step (.active class)

The `.active` class is added to the [Step Element](#step-element) that is currently visible at the center of the camera.

**Example:**

```CSS
.step {
  opacity: 0.3;
  transition: opacity 1s;
}
.step.active {
  opacity: 1
}
```

At the same time, the `impress-on-*` class is added to the body element, the class name represents the active [Step Element](#step-element) id. This allows for custom global styling, since you can't match a CSS class backwards from the active [Step Element](#step-element) to the `body`.

**Example:**

```CSS
.impress-on-overview .step {
    opacity: 1;
    cursor: pointer;
}
.impress-on-step-1,
.impress-on-step-2,
.impress-on-step-3 {
  background: LightBlue;
}
```

### Progressive Enhancement (.impress-not-supported class)

The `.impress-not-supported` class is added to the `body` element if the browser doesn't support the features required by impress.js to work, it is useful to apply some fallback styles in the CSS.

It's not necessary to add it manually on the `body` element. If the script detects that the browser lacks important features it will add this class.

It is recommended to add the class manually to the `body` element though, because that means that users without JavaScript will also get fallback styles. When impress.js script detects that the browser supports all required features, the `.impress-not-support` class will be removed from the `body` element.

**Example:**

```CSS
.impress-not-supported .step {
  display: inline-block;
}
```

## Plugins

Many new features are implemented as plugins. The [Plugins documentation](src/plugins/README.md) is the starting place to learn about those, as well as the README.md of [each plugin](src/plugins/).


## JavaScript

### impress( [ id ] )

A factory function that creates the [ImpressAPI](#impressapi).

Accepts a [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) that represents the id of the root element in the page. If omitted, impress.js will lookup for the element with the id "impress" by default.

**Example:**

```JavaScript
var impressAPI = impress( "root" );
```

### ImpressAPI

The main impress.js API that handles common operations of impress.js, listed below.

#### .init()

Initializes impress.js globally in the page. Only one instance of impress.js is supported per document.

**Example:**

```JavaScript
impress().init();
```

Triggers the `impress:init` event in the [Root Element](#root-element) after the presentation is initialized.

**Example:**

```JavaScript
var rootElement = document.getElementById( "impress" );
rootElement.addEventListener( "impress:init", function() {
  console.log( "Impress init" );
});
impress().init();
```

#### .tear()

Resets the DOM to its original state, as it was before `init()` was called.

This can be used to "unload" impress.js. A particular use case for this is, if you want to do
dynamic changes to the presentation, you can do a teardown, apply changes, then call `init()`
again. (In most cases, this will not cause flickering or other visible effects to the user,
beyond the intended dynamic changes.)

**Example:**

```JavaScript
impress().tear();
```

#### .next()

Navigates to the next step of the presentation using the [`goto()` function](#impressgotostepindexstepelementidstepelement-duration).

**Example:**

```JavaScript
var api = impress();
api.init();
api.next();
```

#### .prev()

Navigates to the previous step of the presentation using the [`goto()` function](#impressgotostepindexstepelementidstepelement-duration).

**Example:**

```JavaScript
var api = impress();
api.init();
api.prev();
```

#### .goto( stepIndex | stepElementId | stepElement, [ duration ] )

Accepts a [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) that represents the step index.

Navigates to the step given the provided step index.

**Example:**

```JavaScript
var api = impress();
api.init();
api.goto(7);
```

Accepts a [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) that represents the [Step Element](#step-element) id.

Navigates to the step given the provided [Step Element](#step-element) id.

**Example:**

```JavaScript
var api = impress();
api.init();
api.goto( "overview" );
```

Accepts an [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) that represents the [Step Element](#step-element).

Navigates to the step given the provided [Step Element](#step-element).

**Example:**

```JavaScript
var overview = document.getElementById( "overview" );
var api = impress();
api.init();
api.goto( overview );
```

Accepts an optional [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) in the last argument that represents the duration of the transition in milliseconds. If not provided, the default transition duration for the presentation will be used.

Triggers the `impress:stepenter` event in the [Root Element](#root-element) when the presentation navigates to the target [Step Element](#step-element).

**Example:**

```JavaScript
var rootElement = document.getElementById( "impress" );
rootElement.addEventListener( "impress:stepenter", function(event) {
  var currentStep = event.target;
  console.log( "Entered the Step Element '" + currentStep.id + "'" );
});
```

Triggers the `impress:stepleave` event in the [Root Element](#root-element) when the presentation navigates away from the current [Step Element](#step-element).

**Example:**
```JavaScript
var rootElement = document.getElementById( "impress" );
rootElement.addEventListener( "impress:stepleave", function(event) {
  var currentStep = event.target;
  var nextStep = event.detail.next;
  console.log( "Left the Step Element '" + currentStep.id + "' and about to enter '" + nextStep.id );
});
```

# Improve The Docs

Did you find something that can be improved? Then [create an issue](https://github.com/impress/impress.js/issues/new) so that we can discuss it!
