Skip Plugin
===========

Example:

        <!-- This slide is disabled in presentations, when moving with next()
             and prev() commands, but you can still move directly to it, for
             example with a url (anything using goto()). -->
        <div class="step skip">

The skip plugin is a pre-stepleave plugin. It is executed before 
`impress:stepleave` event. If the next step also has `class="skip"`
set, it will set the next step to the one after that.

Author
------

Copyright 2016 Henrik Ingo (@henrikingo)
Released under the MIT license.

