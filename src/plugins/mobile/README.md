Mobile devices support
======================

Presentations with a lot of 3D effects and graphics can consume a lot of resources, especially on mobile devices.
This plugin provides some CSS classes that can be used to hide most of the slides, only showing the current, previous
and next slide.

In particular, this plugin adds:

`body.impress-mobile` class, if it detects running on a mobile OS.

`div.prev` and `div.prev` to the adjacent steps to the current one. Note that the current slide is already identified
by `present` and `active` CSS classes.

Example CSS
-----------

        body.impress-mobile .step { 
            display:none;
        }
        body.impress-mobile .step.active,
        body.impress-mobile .step.present,
        body.impress-mobile .step.next,
        body.impress-mobile .step.prev { 
            display:block; 
        }

Note
----

This plugin does not take into account redirects that could happen with skip, goto and other plugins. The active
step will of course always be correct, but "non-linear" transitions to anything else than the actual previous and next
steps will probably not look correct.

Author
------

Kurt Zenisek (@KZeni)
