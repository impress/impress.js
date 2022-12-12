Impress Console Plugin
======================

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



Credits
-------

* Henrik Ingo, henrik.ingo@avoinelama.fi, impress.js (plugin) integration
* Heiko Richler, Aico.Richler@gmx.net, major changes in rev. 1.3
* Lennart Regebro, regebro@gmail.com, main author of impressConsole
* David Souther, davidsouther@gmail.com, author of the original notes.js

MIT License
