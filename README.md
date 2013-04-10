impress.js with substeps!
============

This is a fork of impress.js that adds sub-step capability.  For documentation on everything else about impress.js, see the parent project documentation.

## Using substeps

This is pretty easy.  There are two parts, the HTML part and the CSS part.

### In your HTML

This is pretty simple. In an element marked with the 'step' class, you can add the 'substep' class to whatever elements you want to be a substep.  On init, the  modified impress.js script will find all elements with class 'substep', and mark them with the class 'future'.  This is just like regular steps.  

As you navigate forward or backward through your steps, any substep found will be treated as a navigation step.  While viewing an element with substeps, navigation forward find the next substep, remove the class 'future', and add 'present' and 'active'.  When a moving forward from a substep, the 'present' substep has 'present' removed, and the class 'past' is added.  This is much like the behavior for steps.  If there are no more substeps ahead, the navigation moves to the next step.

An important key difference between regular steps and substeps is that substeps keep their 'active' class when they are marked as 'past'.  This is different from regular steps, which have the 'active' class removed when they marked as 'past'.  I might make this behavior configurable in the future. 

The reverse is applied when navigating backward; the substep has 'present' and 'active' classes removed, and the class 'future' is set.  If there is another substep, that gets the 'past' class removed, and 'present' class.  If there are no more substeps navigation moves to the previous step.

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

To put the substeps to work, you need to style them.  A simple default is to set the substep `opacity: 0` by default, and then transition them to `opacity: 1` 

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

This would style the HTML example above to have substeps hidden by default, and become visible when a substep becomes 'active', and get colored when the substep becomes 'present'.  All the property changes get a 1 second transition.


### Y U NO HIDE AS DEFAULT?

You may notice there is no default behavior to hide substeps, and reveal them when you navigate to them.  That's because I wanted to mimic the default behavior for steps.  By default, all steps are visible; they may be out of the viewport, but they are visible.  If you want steps to act otherwise, you need to style them.  Same applies for substeps.


LICENSE
---------

Same as impress.js, this code is released under the MIT and GPL Licenses.


