# Bookmark

Nonlinear navigation similar to the Goto plugin.

Goto supports nonlinear navigation by *locally* defining *out-links*, accessible via the arrow keys.

Bookmark supports nonlinear navigation by *globally* defining *in-links*, accessible via normal keys like 1,2,3,A,B,C.

Example:

```html
<!-- data-bookmark-key-list allows an "inbound"-oriented style of non-linear navigation. -->
<div id="..." class="step" data-bookmark-key-list="Digit1 KeyA 1 2 3 a b c">
```

An `id` is required on the `div`.

If you assign the same key to multiple steps, that hotkey will cycle among them.

WARNING: It's up to you to avoid reserved hotkeys H, B, P, ?, etc.

Author
------

Copyright 2023 Wong Meng Weng (@mengwong)
Released under the MIT license.

