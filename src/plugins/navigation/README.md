# Navigation
As you can see this part is separate from the impress.js core code.
It's because these navigation actions only need what impress.js provides with
its simple API.
This plugin is what we call an _init plugin_. It's a simple kind of
impress.js plugin. When loaded, it starts listening to the `impress:init`
event. That event listener initializes the plugin functionality - in this
case we listen to some keypress and mouse events. The only dependencies on
core impress.js functionality is the `impress:init` method, as well as using
the public api `next(), prev(),` etc when keys are pressed.
Copyright 2011-2012 Bartek Szopka (@bartaz)
Released under the MIT license.

***Author:***

Bartek Szopka