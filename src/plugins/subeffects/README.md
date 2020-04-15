Substep Effects Plugin
===============

This plugin allow easy creation of animation bind to substeps

### USAGE

This plugin will do the following things:

- The plugin adds the effects for the substeps. 
        
When an object with class substep uses one of the following attributes, the value of these attribute indicate the objects that are subjected to some effectes:
        
        - data-show-only = "CLASS" : The objects with class="CLASS" are shown only in the corresponding substep.
        
        - data-hide-only = "CLASS" : The objects with class="CLASS" are hidden only in the corresponding substep.
        
        - data-show-from = "CLASS" : The objects with class="CLASS" are shown from the corresponding substep until the end or "data-show-to".
        - data-show-to = "CLASS" : It is used with "data-show-from", the objects with class="CLASS" are shown from the substep with "data-show-from" to the corresponding substep.

        - data-hide-from = "CLASS" : The objects with class="CLASS" are hidden from the corresponding substep until the end or "data-hide-to".
        - data-hide-to = "CLASS" : It is used with "data-hide-from", the objects with class="CLASS" are hidden from the substep with "data-hide-from" to the corresponding substep. 

When an object with class substep uses one of the following attributes, the value of these attributes indicate the css style to apply to a certain class. In particular:

        - data-style-only-CLASS = "STYLE_LIST" : Apply to objects with class=CLASS the css style="STYL_LIST" only in the corresponding substep.

        - data-style-from-CLASS = "STYLE_LIST" : Apply to objects with class=CLASS the css style="STYL_LIST" from the corresponding substep until the end or "data-syle-to-CLASS".
        - data-style-to-CLASS = "STYLE_LIST" : It is used with "data-syle-from-CLASS", the objects with class="CLASS" are setted to style="" or if "data-style-base='LIST_STYLE_BASE'" is configured in the object with class=CLASS the style is setted to style="LIST_STYLE_BASE".

### EXAMPLE

Some examples of all these features are presented in the file example.html

### AUTHOR

Copyright 2020 Gastone Pietro Rosati Papini (@tonegas)
http://tonegas.com
Released under the MIT license.


