Relative Positioning Plugin
===========================

This plugin provides support for defining the coordinates of a step relative
to the previous step. This is often more convenient when creating presentations,
since as you add, remove or move steps, you may not need to edit the positions
as much as is the case with the absolute coordinates supported by impress.js
core.

Example:

        <!-- Position step 1000 px to the right and 500 px up from the previous step. -->
        <div class="step" data-rel-x="1000" data-rel-y="500">

Following html attributes are supported for step elements:

    data-rel-x
    data-rel-y
    data-rel-z

Non-zero values are also inherited from the previous step. This makes it easy to 
create a boring presentation where each slide shifts for example 1000px down 
from the previous.

The above relative values are ignored, or set to zero, if the corresponding 
absolute value (`data-x` etc...) is set. Note that this also has the effect of
resetting the inheritance functionality.

In addition to plain numbers, which are pixel values, it is also possible to
define relative positions as a multiple of screen height and width, using
a unit of "h" and "w", respectively, appended to the number.

Example:

        <div class="step" data-rel-x="1.5w" data-rel-y="1.5h">


IMPORTANT: Incompatible change
------------------------------

Enabling / adding this plugin has a small incompatible side effect on default values.

Prior to this plugin, a missing data-x/y/z attribute would be assigned the default value of 0.
But when using a version of impress.js with this plugin enabled, a missing data-x/y/z attribute
will inherit the value from the previous step. (The first step will inherit the default value of 0.)

For example, if you have an old presentation with the following 3 steps, they would be positioned
differently when using a version of impress.js that includes this plugin:

        <div class="step" data-x="100" data-y="100" data-z="100"></div>
        <div class="step" data-x="100" data-y="100"></div>
        <div class="step" data-x="100" data-y="100"></div>

To get the same rendering now, you need to add an explicit `data-z="0"` to the second step:

        <div class="step" data-x="100" data-y="100" data-z="100"></div>
        <div class="step" data-x="100" data-y="100" data-z="0"></div>
        <div class="step" data-x="100" data-y="100"></div>

Note that the latter code will render correctly also in old versions of impress.js.

If you have an old presentation that doesn't use relative positioning, and for some reason you
cannot or don't want to add the explicit 0 values where needed, your last resort is to simply
remove the `rel.js` plugin completely. You can either:

* Remove `rel.js` from [/build.js](../../../build.js) and recompile `impress.js` with: `npm build`
* Just open [/js/impress.js] in an editor and delete the `rel.js` code.
* Or, just uncomment the following single line, which is the last line of the plugin:

        impress.addPreInitPlugin( rel );


About Pre-Init Plugins
----------------------

This plugin is a *pre-init plugin*. It is called synchronously from impress.js
core at the beginning of `impress().init()`. This allows it to process its own
data attributes first, and possibly alter the data-x, data-y and data-z attributes
that will then be processed by `impress().init()`.

(Another name for this kind of plugin might be called a *filter plugin*, but
*pre-init plugin* is more generic, as a plugin might do whatever it wants in
the pre-init stage.)


Author
------

Henrik Ingo (@henrikingo), 2016
