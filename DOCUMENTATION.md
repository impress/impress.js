# Reference API

## HTML

### Root Element

impress.js requires a Root Element. All the content of the presentation will be created inside that element. It is not recommended to manipulate any of the styles, attributes or classes that are created by impress.js inside the Root Element after initialization.

**Example:**

```html
<div id="impress"></div>
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

#### .next()

Navigates to the next step of the presentation using the [`goto()` function](#impressgotostepindexstepelementidstepelement-duration).

**Example:**

```JavaScript
var api = impress();
api.init();
api.next();
```

#### impress().prev()

Navigates to the previous step of the presentation using the [`goto()` function](#impressgotostepindexstepelementidstepelement-duration).

**Example:**

```JavaScript
var api = impress();
api.init();
api.prev();
```

#### impress().goto( stepIndex | stepElementId | stepElement, [ duration ] )

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
rootElement.addEventListener( "impress:stepenter", function() {
  var currentStep = document.querySelector( ".present" );
  console.log( "Entered the Step Element '" + currentStep.id + "'" );
});
```

Triggers the `impress:stepleave` event in the [Root Element](#root-element) when the presentation navigates away from the current [Step Element](#step-element).

**Example:**
```JavaScript
var rootElement = document.getElementById( "impress" );
rootElement.addEventListener( "impress:stepleave", function(event) {
  var currentStep = event.target
  console.log( "Left the Step Element '" + currentStep.id + "'" );
});
```

# Improve The Docs

Did you found something that can be improved? Then [create an issue](https://github.com/impress/impress.js/issues/new) so that we can discuss it!