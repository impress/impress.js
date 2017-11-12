Substep Plugin
===============

Reveal each substep (such as a bullet point) of the step separately. Just like in PowerPoint!

If the current step contains html elements with `class="substep"` then this plugin will prevent a
`prev()` / `next()` call to leave the slide, and instead reveal the next substep (for `next()`) or
alternatively hide one (for `prev()`). Only once all substeps are shown, will a call to `next()`
actually move to the next step, and only when all are hidden will a call to `prev()` move to the
previous one.

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

Author
------

Copyright 2017 Henrik Ingo (@henrikingo)
Released under the MIT license.

