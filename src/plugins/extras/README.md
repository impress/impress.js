Extras Plugin
=============

The Extras plugin will initialize the optional addon plugins from 
[extras/](../../../extras/) directory, if they were loaded.

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

Author
------

Henrik Ingo (@henrikingo), 2016
