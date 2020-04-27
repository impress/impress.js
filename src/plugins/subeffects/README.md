Substep Effects Plugin
===============

This plugin allow easy creation of animation bind to substeps appling custom classes

### USAGE

The plugin adds the posibility to add custom classes at each substep to objects:
When an object with class substep uses one of the following attributes, the following classes are added to certain objects.

The attributes are:
        - `data-addonly-TOCLASS = "CLASS"` : This attribute is used to apply certain classes in particular `CLASS`, `CLASS-base`, `CLASS-before`, `CLASS-after`, following the rules explained in section classes.
        - `data-addfrom-TOCLASS = "CLASS"` and `data-addto-TOCLASS = "CLASS"`: this two attributes are used to apply certain classes from the substep with the attribute `data-addfrom-TOCLASS = "CLASS"` to the substep with the attribute `data-addto-TOCLASS = "CLASS"` with the rules explained in the following.

The classes are:
        - `CLASS-base`: This class is added at step enter to each object reffered by `TOCLASS`
        - `CLASS-before`: This class is added at step enter to each obbject reffered by `TOCLASS` ad removed when the substep with the attribute `data-addonly-TOCLASS = "CLASS"` or `data-addfrom-TOCLASS = "CLASS"` is reached.
        - `CLASS-after`: This class is added after the substep with the attribute `data-addonly-TOCLASS = "CLASS"` or `data-addto-TOCLASS = "CLASS"` is reached.
        - `CLASS`: This class is added when the substep with the attribute `data-addonly-TOCLASS = "CLASS"` is reached and removed efterwards or between the substep with the attribute `data-addfrom-TOCLASS = "CLASS"` and `data-addto-TOCLASS = "CLASS"`.

### EXAMPLE

Some examples of all these features are presented in the file example.html

### AUTHOR

Copyright 2020 Gastone Pietro Rosati Papini (@tonegas)
http://tonegas.com
Released under the MIT license.


