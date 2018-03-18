Spherical Positioning Plugin
===========================

This plugin provides support for positioning steps with polar or shperical coordinates. This is often more convenient when arranging slides along a circle or similar. It also supports relative positioning.

Example:

```html
<!-- Position stepat  1000 px distance to origin along an angle of 50 degree. -->
<div class="step" data-spherical-distance="1000" data-spherical-rho="50">
        
<!-- Position step 500 px distance to origin at a primary angle of 270 degree and a secondary angle of -30 degree (= 330 degree) -->
<div class="step" data-spherical-distance="500" data-spherical-rho="270" data-spherical-theta="-30">

<!-- Position step 500 px distance to origin along an angle of 75 degree and then 20 px upwards along z axis. -->
<div class="step" data-spherical-distance="500" data-spherical-rho="75" data-z="20">
```

Following html attributes are supported for step elements:

    data-spherical-distance
    data-spherical-rho
    data-spherical-theta    // optional, default 90
    
    data-spherical-rel-distance
    data-sphercial-rel-rho
    data-spherical-rel-theta // optional, default 90

This makes it easy to create a presentation where subsequent slides are arranged along a circle, a sphere or a cylinder. The combination with the `rel` plugin's `data-rel-to` attribute can be extraordinary useful.

When ommitting the `*-theta` attributes, resulting coordinates lie in or parallel to the x-y-plane. An additional `data-z` value can be defined to get some kind of cylidrical coordinates. When `data-z` or `data-rel-z` is defined along with `data-spherical-theta` resp. `data-spherical-rel-theta` the latter ones are ignored and a warning is printed at the browser console.

The above spherical values are ignored, if the corresponding absolute value (`data-x` etc...) is set.
The same rule applies to relative definitions.

The plugin translates all spherical coordinates to cartesian coordinates, which then could for example be used by the `rel` plugin. In fact, to get the relative positioning working, the `rel` plugin is needed, actually. If it is not present, relative values are computed but not translated into actual absolute positions, thus silently ignored.

Author
------

Holger Teichert (@complanar), 2018
