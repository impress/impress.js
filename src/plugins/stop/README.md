Stop Plugin
===========

Example:

        <!-- Stop at this slide.
             (For example, when used on the last slide, this prevents the 
             presentation from wrapping back to the beginning.) -->
        <div class="step stop">

The stop plugin is a pre-stepleave plugin. It is executed before 
`impress:stepleave` event. If the current slide has `class="stop"`
set, it will disable the next() command by setting the next slide to the current
slide.

Author
------

Copyright 2016 Henrik Ingo (@henrikingo)
Released under the MIT license.

