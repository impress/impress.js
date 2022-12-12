# Plugins
impress.js has a plugin system that allows you to expand its functionality. It ships with some default plugins which are activated by default, but there are more plugins which you can find [here](/extras/). You may learn how to activate those plugins by reading [this](#extra-plugins). Here you can see all the collected plugin READMEs and Documentation from the js files. I have added a note, where I have added my own documentation and where I have changed something.

## CONTENTS

* [Autoplay](#autoplay)
* [Blackout](#blackout)
* [Form](#form)
* [Fullscreen](#fullscreen)
* [Goto](#fullscreen)



# Main plugins
## Autoplay
*This documentation here was not authored by the creator of the plugin*

The [autoplay](/src/plugins/autoplay/autoplay.js) plugin automatically advances the presentation after a certain timeout expired. 

**USAGE**

You first have to enable the plugin by setting a global ```data-autoplay``` value on the impress-div. Then you can change individual ```data-autoplay``` values on each *step* by adding ```data-autoplay``` to it. If this value is set to ```0```, there will be no more auto-advancing on this *step*. The value you enter is time in seconds to switch to the next slide.

**EXAMPLE**

Note: This only shows part of the HTML. If you want to know how to set up a presentation, I highly recommend you read our [Getting Started Guide](/GettingStarted.md)
```
<div id=impress data-autoplay="5">
    <div class="step" data-autoplay="0">
        This slide will not auto-advance
    </div>
     <div class="step">
        This slide will auto-advance at the globally defined rate.
    </div>
     <div class="step" data-autoplay="10">
        This slide will auto-advance after 10 seconds
    </div>
</div>
```


## Blackout
*This documentation here was not authored by the creator of the plugin*

This plugin is automatically enabled and runs whenever you start your presentation. You can press *B* or *.* on your keyboard to blank / unblank the screen.


## Form
Form support! Functionality to better support use of input, textarea, button... elements in a presentation.

This plugin does two things:

Set stopPropagation on any element that might take text input. This allows users to type, for example, the letter 'P' into a form field, without causing the presenter console to spring up.
 
On impress:stepleave, de-focus any potentially active element. This is to prevent the focus from being left in a form element that is no longer visible in the window, and user therefore typing garbage into the form.

***THIS PLUGIN REQUIRES FURTHER DEVELOPMENT***

 TODO: Currently it is not possible to use TAB to navigate between form elements. Impress.js, and
 in particular the navigation plugin, unfortunately must fully take control of the tab key,
 otherwise a user could cause the browser to scroll to a link or button that's not on the current
 step. However, it could be possible to allow tab navigation between form elements, as long as
 they are on the active step. This is a topic for further study.

## Fullscreen
*This documentation here was not authored by the creator of the plugin*
This plugin puts your presentation into fullscreen by pressing *F5*. You can leave fullscreen again by pressing *Esc*. 

*Note:* impress.js works just fine with the normal fullscreen offered by your browser where you would (usually) press *F11* to enter it. There are certain circumstances where you might want to use this plugin instead, as it should work with the impressConsole plugin as well.



## Goto
The goto plugin is a pre-stepleave plugin. It is executed before 
`impress:stepleave` event, and will alter the destination where to transition next.

Example:

        <!-- When leaving this step, go directly to "step-5" -->
        <div class="step" data-goto="step-5">

        <!-- When leaving this step with next(), go directly to "step-5", instead of the next step.
             If moving backwards to previous step - e.g. prev() instead of next() - then go to "step-1". -->
        <div class="step" data-goto-next="step-5" data-goto-prev="step-1">

        <!-- data-goto-key-list and data-goto-next-list allow you to build advanced non-linear navigation. -->
        <div class="step" data-goto-key-list="ArrowUp ArrowDown ArrowRight ArrowLeft" data-goto-next-list="step-4 step-3 step-2 step-5">

See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for a table
of what strings to use for each key.

***Author:***

Copyright 2016 Henrik Ingo (@henrikingo)


## Help
Shows a help popup when a presentation is loaded, as well as when 'H' is pressed.

To enable the help popup, add following div to your presentation:

    <div id="impress-help"></div>

Example CSS:

        .impress-enabled #impress-help {
            background: none repeat scroll 0 0 rgba(0, 0, 0, 0.5);
            color: #EEEEEE;
            font-size: 80%;
            position: fixed;
            left: 2em;
            bottom: 2em;
            width: 24em;
            border-radius: 1em;
            padding: 1em;
            text-align: center;
            z-index: 100;
            font-family: Verdana, Arial, Sans;
        }
        .impress-enabled #impress-help td {
            padding-left: 1em;
            padding-right: 1em;
        }



***Author:***

Copyright Henrik Ingo (@henrikingo), 2016


## impressConsole
Press 'P' to show a speaker console window.

* View of current slide
* Preview of next slide
* Speaker notes (contents of a <div class="notes"> element on current slide)
* Navigation

For speaker notes, add the following anywhere inside a step

    <div class="notes">Speaker notes text...</div>

Example CSS:

    /* Hide notes from the actual presentation. This will not affect the visibility of notes in the impress console window. */

    .notes {
        display: none;
    }



***Authors:***
* Henrik Ingo, henrik.ingo@avoinelama.fi, impress.js (plugin) integration
* Heiko Richler, Aico.Richler@gmx.net, major changes in rev. 1.3
* Lennart Regebro, regebro@gmail.com, main author of impressConsole
* David Souther, davidsouther@gmail.com, author of the original notes.js


## Media
This plugin will do the following things:
 - Add a special class when playing (body.impress-media-video-playing and body.impress-media-video-playing) and pausing media (body.impress-media-video-paused and body.impress-media-audio-paused) (removing them when ending). This can be useful for example for darkening the background or fading out other elements while a video is playing. Only media at the current step are taken into account. All classes are removed when leaving a step.
- Introduce the following new data attributes:
    - data-media-autoplay="true": Autostart media when entering its step.
    - data-media-autostop="true": Stop media (= pause and reset to start), when leaving its step.
    - data-media-autopause="true": Pause media but keep current time when leaving its step.

When these attributes are added to a step they are inherited by all media on this step. Of course this setting can be overwritten by adding different attributes to inidvidual media.

The same rule applies when this attributes is added to the root element. Settings can be overwritten for individual steps and media.
Examples:
- data-media-autoplay="true" data-media-autostop="true": start media on enter, stop on leave, restart from beginning when re-entering the step.
- data-media-autoplay="true" data-media-autopause="true": start media on enter, pause on leave, resume on re-enter
- data-media-autoplay="true" data-media-autostop="true" data-media-autopause="true": start media on enter, stop on leave (stop overwrites pause).
- data-media-autoplay="true" data-media-autopause="false": let media start automatically when entering a step and let it play when leaving the step.
- ```<div id="impress" data-media-autoplay="true"> ... <div class="step" data-media-autoplay="false">```
 All media is startet automatically on all steps except the one that has the data-media-autoplay="false" attribute.
- Pro tip: Use ```<audio onended="impress().next()"> or <video onended="impress().next()">``` to proceed to the next step automatically, when the end of the media is reached.

## Mobile

**Mobile devices support**

Presentations with a lot of 3D effects and graphics can consume a lot of resources, especially on mobile devices.
This plugin provides some CSS classes that can be used to hide most of the slides, only showing the current, previous
and next slide.

In particular, this plugin adds:

`body.impress-mobile` class, if it detects running on a mobile OS.

`div.prev` and `div.prev` to the adjacent steps to the current one. Note that the current slide is already identified
by `present` and `active` CSS classes.

### Example CSS

        body.impress-mobile .step { 
            display:none;
        }
        body.impress-mobile .step.active,
        body.impress-mobile .step.present,
        body.impress-mobile .step.next,
        body.impress-mobile .step.prev { 
            display:block; 
        }

**Note**

This plugin does not take into account redirects that could happen with skip, goto and other plugins. The active
step will of course always be correct, but "non-linear" transitions to anything else than the actual previous and next
steps will probably not look correct.

***Author:***

Kurt Zenisek (@KZeni)


## Mouse-timeout
After 3 seconds of mouse inactivity, add the css class 
`body.impress-mouse-timeout`. On `mousemove`, `click` or `touch`, remove the
class.

The use case for this plugin is to use CSS to hide elements from the screen
and only make them visible when the mouse is moved. Examples where this
might be used are: the toolbar from the toolbar plugin, and the mouse cursor
itself.

**Example CSS**

    body.impress-mouse-timeout {
        cursor: none;
    }
    body.impress-mouse-timeout div#impress-toolbar {
        display: none;
    }

***Author***

Copyright 2016 Henrik Ingo (@henrikingo)


## Navigation-UI
This plugin provides UI elements "back", "forward" and a list to select
a specific slide number.

Element attribut title is used for select option content if available, it uses element id if no title is provided.

The navigation controls are visible if the toolbar plugin is enabled. To add the toolbar to your
presentations, [see toolbar plugin README](/src/plugins/toolbar/README.md).

***Author***

Henrik Ingo (@henrikingo), 2016


## Navigation
As you can see this part is separate from the impress.js core code.
It's because these navigation actions only need what impress.js provides with
its simple API.
This plugin is what we call an _init plugin_. It's a simple kind of
impress.js plugin. When loaded, it starts listening to the `impress:init`
event. That event listener initializes the plugin functionality - in this
case we listen to some keypress and mouse events. The only dependencies on
core impress.js functionality is the `impress:init` method, as well as using
the public api `next(), prev(),` etc when keys are pressed.
Copyright 2011-2012 Bartek Szopka (@bartaz)
Released under the MIT license.

***Author:***

Bartek Szopka



## Progress
Progressbar and pagexounter for impress.js presentations

### Usage

Add a div for progressbar and/or progress as you can see it here:

**HTML**

	  <div class="impress-progressbar"><div></div></div>
	  <div class="impress-progress"></div>

**Sample CSS**

    .impress-progressbar {
      position: absolute;
      right: 318px;
      bottom: 1px;
      left: 118px;
      border-radius: 7px;
      border: 2px solid rgba(100, 100, 100, 0.2);
    }
    .impress-progressbar DIV {
      width: 0;
      height: 2px;
      border-radius: 5px;
      background: rgba(75, 75, 75, 0.4);
      transition: width 1s linear;
    }
    .impress-progress {
      position: absolute;
      left: 59px;
      bottom: 1px;
      text-align: left;
      opacity: 0.6;
    }

Feel free to change the style of your progressbar as you like by editing the CSS file.

***Author***

Copyright 2014: Matthias Bilger (@m42e)


## Relative Positioning (Rel)
This plugin provides support for defining the coordinates of a step relative
to previous steps. This is often more convenient when creating presentations,
since as you add, remove or move steps, you may not need to edit the positions
as much as is the case with the absolute coordinates supported by impress.js
core.

Example:

    <!-- Position step 1000 px to the right and 500 px up from the previous step. -->
    <div class="step" data-rel-x="1000" data-rel-y="500">
        
    <!-- Position step 1000 px to the left and 750 px up from the step with id "title". -->
    <div class="step" data-rel-x="-1000" data-rel-y="750" data-rel-to="title">

Following html attributes are supported for step elements:

    data-rel-x
    data-rel-y
    data-rel-z
    data-rel-to

    data-rel-rotate-x
    data-rel-rotate-y
    data-rel-rotate-z

    data-rel-position
    data-rel-reset

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

Note that referencing a special step with the `data-rel-to` attribute is *limited to previous steps* to avoid the possibility of circular or offending positioning.
If you need a reference to a step that is shown later make use of the goto plugin:


    <div id="shown-first" class="step" data-goto-next="shown-earlier">
    <div id="shown-later" class="step" data-goto-prev="shown-earlier" data-goto-next="shown-last">
    <div id="shown-earlier" class="step" data-rel-to="shown-later" data-rel-x="1000" data-rel-y="500" data-goto-prev="shown-first" data-goto-next="shown-later">
    <div id="shown-last" class="step" data-goto-prev="shown-later">

### Relative positioning

All `data-rel-x`/`y`/`z` is used world coordinate by default. So the value should be alternated according to the rotation state of previous slides.

To easy relative positioning, the `data-rel-position` attribute is introduced.

`data-rel-position` has a default value of "absolute", which works like this attribute is not introduced.

When `data-rel-position="relative"`, everything changed. The rotation of previous is no need to be considered, you can set all the `data-rel-` attributes as if the previous has no rotation. This plugin will calculate the acual position according to the position and rotation of the previous slide and the relative settings. This make it possible to split a presentation into parts, construct each parts standalone without consider the final position, and then assemble them together.

For example, if you want the slide slided in from the right hand side, all you need is `data-rel-x="1000"`, no matter the rotation of the previous slide. If the previous slide has `data-rotate-z="90"`, the actual attribute of this slide will work like `data-rel-y="1000"`.

Not only relative positions, the relative rotations can be used while `data-rel-position="relative"`.

For example, `data-rel-rotate-y="45"` will make the slide has an angle of 45 degree to the previous slide. It make it easy to build a circle and do other complicated positioning.

If not set, the `data-rel-position` attribute will be inherited from previous slide. So we only need to set it at the first slide, then all done.

To avoid the boring need to set most `data-rel-*` to zero, but set only one or two ones, `data-rel-reset` attribute can be used: 

- `data-rel-reset` equals to: `data-rel-x="0" data-rel-y="0" data-rel-z="0" data-rel-rotate-x="0" data-rel-rotate-y="0" data-rel-rotate-z="0"`
- `data-rel-reset="all"` works like `data-rel-reset`, in additions `data-rotate-x="0" data-rotate-y="0" data-rotate-z="0"`

When `data-rel-position="relative"` and `data-rel-to` is specified, `data-rotate-*` and `data-rel-*` will be inherited from specified slide too.

**IMPORTANT: Incompatible change**

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


**About Pre-Init Plugins**

This plugin is a *pre-init plugin*. It is called synchronously from impress.js
core at the beginning of `impress().init()`. This allows it to process its own
data attributes first, and possibly alter the data-x, data-y and data-z attributes
that will then be processed by `impress().init()`.

(Another name for this kind of plugin might be called a *filter plugin*, but
*pre-init plugin* is more generic, as a plugin might do whatever it wants in
the pre-init stage.)


***Author***

Henrik Ingo (@henrikingo), 2016


## Resize
*This documentation here was not authored by the creator of the plugin*

This plugin resizes the presentation after a window resize. It does not offer any programmatic way of interaction, as this is not needed. It runs automatically in the background.


## Skip
Example:

        <!-- This slide is disabled in presentations, when moving with next()
             and prev() commands, but you can still move directly to it, for
             example with a url (anything using goto()). -->
        <div class="step skip">

The skip plugin is a pre-stepleave plugin. It is executed before 
`impress:stepleave` event. If the next step also has `class="skip"`
set, it will set the next step to the one after that.

***Author***

Copyright 2016 Henrik Ingo (@henrikingo)


## Stop
Example:

        <!-- Stop at this slide.
             (For example, when used on the last slide, this prevents the 
             presentation from wrapping back to the beginning.) -->
        <div class="step stop">

The stop plugin is a pre-stepleave plugin. It is executed before 
`impress:stepleave` event. If the current slide has `class="stop"`
set, it will disable the next() command by setting the next slide to the current
slide.

***Author***

Copyright 2016 Henrik Ingo (@henrikingo)

## Substep
Reveal each substep (such as a bullet point) of the step separately. Just like in PowerPoint!

If the current step contains html elements with `class="substep"` then this plugin will prevent a
`prev()` / `next()` call to leave the slide, and instead reveal the next substep (for `next()`) or
alternatively hide one (for `prev()`). Only once all substeps are shown, will a call to `next()`
actually move to the next step, and only when all are hidden will a call to `prev()` move to the
previous one.

By default, this plugin reveals substeps in the order in which they appear in the HTML.  If you
would like to reveal them in a different order, you can supply an integer to `data-substep-order`.
If you do so, this plugin will reveal the substeps in ascending order; any substeps without a
specified `data-substep-order` will be revealed after all substeps with a specified order have
been revealed.

Calls to `goto()` will be ignored by this plugin, i.e. `goto()` will transition to whichever step is
the target.

In practice what happens is that when each substep is stepped through via `next()` calls, a
`class="substep-visible"` class is added to the element. It is up to the presentation author to
use the appropriate CSS to make the substeps hidden and visible.

Example:

        <style type="text/css">
            .substep { opacity: 0; }
            .substep.substep-visible { opacity: 1; transition: opacity 1s; }
        </style>

        <div class="step">
            <h1>Fruits</h1>
            <p class="substep">Orange</p>
            <p class="substep">Apple</p>
        </div>

Classes:

`substep-active` - The most recent substep in the current step

`substep-visible` - The most recent and all previous substeps in the current step

***Author:***
Copyright 2017 Henrik Ingo (@henrikingo)


## Toolbar
This plugin provides a generic graphical toolbar. Other plugins that
want to expose a button or other widget, can add those to this toolbar.

Using a single consolidated toolbar for all GUI widgets makes it easier
to position and style the toolbar rather than having to do that for lots
of different divs.

To add/activate the toolbar in your presentation, add this div:

    <div id="impress-toolbar"></div>
 
Styling the toolbar is left to presentation author. Here's an example CSS:

    .impress-enabled div#impress-toolbar {
        position: fixed;
        right: 1px;
        bottom: 1px;
        opacity: 0.6;
    }
    .impress-enabled div#impress-toolbar > span {
        margin-right: 10px;
    }

The [mouse-timeout](../mouse-timeout/README.md) plugin can be leveraged to hide
the toolbar from sight, and only make it visible when mouse is moved.

    body.impress-mouse-timeout div#impress-toolbar {
        display: none;
    }

If you're writing a plugin and would like to add a widget to the toolbar, see
[the top of the source file for further instructions](toolbar.js).


***Author***

Henrik Ingo (@henrikingo), 2016


## Touch
*This documentation here was not authored by the creator of the plugin*

This plugin handles touch input (of mobile devices). You cannot programmatically interact with it. It runs in the background.


# Extra plugins
## Extras Plugin
The Extras plugin will initialize the optional addon plugins from 
[extras/](/extras/) directory, if they were loaded.

Generally, for an extras plugin to have been loaded, 2 things must have happened:

1. The extras plugins must be present in extras/ directory, for example after 
   running `git submodule update`
2. One or more extras plugins are added to the impress.js presentation (the HTML
   file) by the author using a regular `<script>` tag.

If one or more extras plugins were so added, this plugin will automatically
discover them and perform initialization (such as calling 
`mermaid.initialize()`).

If no extras plugins are added to a presentation, this plugin does nothing.

Note that some extra plugins (like mathjax) initialize themselves immediately, and
there's nothing to do here.

***Author***

Henrik Ingo (@henrikingo), 2016

## General infos on the plugins in the extras repository
- You need to clone the git repo here recursively or add the folder manually.
- You need to follow [these instructions](#extra-plugins) to run the extras plugin.