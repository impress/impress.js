impress.js with substeps!
============

This is a fork of [impress.js][1] that adds sub-step capability.  For documentation on everything else about impress.js, read that [documentation][1].

You can see an example of this code in action here: http://tehfoo.github.io/impress.js

## Using substeps
This is pretty easy.  There are two parts, the HTML part and the CSS part.

### Getting Started
Just like [impress.js][1], you really only need the `impress.js` file.  You can learn all about using `impesss.js` by viewing the source of the main [index.html](https://github.com/tehfoo/impress.js/blob/master/index.html) file.  This just builds on what is already there, and doesn't break anything... I think ;)

### In your HTML
This is pretty simple. In an element marked with the `step` class, you can add the `substep` class to whatever elements you want to be a substep.  On init, the  modified `impress.js` script will find all elements with class `substep`, and mark them with the class `future`.  This is just like regular steps.  

As you navigate forward or backward through your steps, any substep found will be treated as a navigation step.  While viewing an element with substeps, navigation forward finds the next substep,  swapping `future` for `present` and `active`.  When a moving forward from a substep, the `present` substep has `present` removed, and the class `past` is added.  This is much like the behavior for steps.  If there are no more substeps ahead, the navigation moves to the next step.

An important key difference between regular steps and substeps is that substeps keep their `active` class when they are marked as `past`.  This is different from regular steps, which have the `active` class removed when they are marked as `past`.  I might make this behavior configurable in the future. 

The reverse is applied when navigating backward; if there are substeps they last one will get focus, which adds removes `past` and adds `present`.  Continue backward, and both `present` and `active` classes are removed, while the class `future` is set.  If there is another substep, that gets focus and is treated as above.  If there are no more substeps, backward navigation moves to the previous step.

To get all this magic on, all you have to do is set the `substep` class on whatever you want to have act as a substep.  Of course, this has to be withing a `step` enabled element.

Example

    <div id="introduction" class="step" data-x="0" data-y="0">
      <h1 class="line">Can Haz Substep?</h1>
        <ul>
          <li class="substep">Sure!</li>
          <li class="substep">Why Not?</li>
          <li class="substep">Just Add the Substep Class</li>
          <li class="substep">And Amaze Friends</li>
          <li class="substep">With Substep Goodness</li>
        </ul>
      </div>

That will get you substep elements with CSS classes that change as you navigate.  Now you need to style them.

### In your CSS
To put the substeps to work, you need to style them.  They don't really do anything by default. You might be thinking ['Y U NO HIDE AS DEFAULT?'](#y-u-no-hide-as-default). Ask me that later. This is easy to make work with some CSS. 

A simple (and possibly ['Powerpointish'](https://github.com/bartaz/impress.js/issues/81#issuecomment-3700541)) behavior is to set the substep `opacity: 0` by default, and then transition them to `opacity: 1` when they are `active`.

Example

    .impress-enabled .substep {
      opacity: 0;
      -webkit-transition: all 1s;
      -moz-transition:    all 1s;
      -ms-transition:     all 1s;
      -o-transition:      all 1s;
      transition:         all 1s;  
    }

    .impress-enabled .substep.active {
      opacity: 1;
    }

    .impress-enabled .substep.present { 
      color: rgb(100, 135, 195);
    }

This would style the HTML example above to have substeps hidden by default, become visible when a substep becomes `active`, and get colored when the substep becomes `present`.  All the property changes get a 1 second transition.

### More Help
If you need more help, try viewing source on the [substep.html](https://github.com/tehfoo/impress.js/blob/master/substep.html) example file, and looking at the [substep.css](https://github.com/tehfoo/impress.js/blob/master/css/substep.css) as well.

See this exact code working here: http://tehfoo.github.io/impress.js

### Y U NO HIDE AS DEFAULT?
You may notice there is no default behavior to hide substeps, and reveal them when they get focus.  That's because I wanted to mimic the default `impress.js` behavior for steps.  By default, all steps are visible; they may be out of the viewport, but they are visible.  If you want steps to act otherwise, you need to style them.  Same applies for substeps.  You could pretty easily fork this and hack in default hiding if you really want it. 

### Y U NO EVENTS?
I haven't added "impress:substep" events dispatching yet.  I actually have a day job.  They're coming soon, and then maybe I'll pull request @bartaz :)


LICENSE
---------

Same as [impress.js][1], this code is released under the MIT and GPL Licenses.


[1]: https://github.com/bartaz/impress.js
