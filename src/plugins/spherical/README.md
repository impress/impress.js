Spherical Positioning Plugin
===========================

This plugin provides support for positioning steps with polar or shperical coordinates. This is often more convenient when arranging slides along a circle or similar. It also supports relative positioning.

Example:

```html
<!-- Position step 1000 px distance to origin at an angle of 50 degree. -->
<div class="step" data-spherical-dist="1000" data-spherical-rho="50">
        
<!-- Position step 500 px distance to origin at a primary angle of 270 degree and a secondary angle of -30 degree (= 330 degree) -->
<div class="step" data-spherical-dist="500" data-spherical-rho="270" data-spherical-theta="-30">
```

Following html attributes are supported for step elements:

    data-spherical-dist
    data-spherical-rho
    data-spherical-theta
    
    data-spherical-rel-dist
    data-sphercial-rel-rho
    data-spherical-rel-theta

Non-zero relative values are inherited from the previous step. This makes it easy to 
create a presentation where subsequent slides are arranged along a circle.

The above spherical values are ignored, or set to zero, if the corresponding 
absolute value (`data-x` etc...) is set. Note that this also has the effect of
resetting the inheritance functionality.

The plugin translates all spherical coordinates to cartesian coordinates, which then ould for example be used by the `rel` plugin. In fact, to get the relative positioning working, the `rel` plugin is needed, actually. If it is not present, relative values are silently ignored.

Author
------

Holger Teichert (@complanar), 2018
