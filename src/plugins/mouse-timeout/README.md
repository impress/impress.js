Mouse timeout plugin
====================

After 3 seconds of mouse inactivity, add the css class 
`body.impress-mouse-timeout`. On `mousemove`, `click` or `touch`, remove the
class.

The use case for this plugin is to use CSS to hide elements from the screen
and only make them visible when the mouse is moved. Examples where this
might be used are: the toolbar from the toolbar plugin, and the mouse cursor
itself.

Example CSS
------------

    body.impress-mouse-timeout {
        cursor: none;
    }
    body.impress-mouse-timeout div#impress-toolbar {
        display: none;
    }


Copyright 2016 Henrik Ingo (@henrikingo)
Released under the MIT license.
