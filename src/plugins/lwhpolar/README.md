Polar Coordinate Positioning Plugin
===================================

Preface
-------
This plugin replaces the "rel" relative positioning plugin. 
It includes and enhances its functionality.
Using both will confuse the positioning, as the first one called replaces 
relative positions by absolute ones, thus disabling the second one.

Relative Positioning (Cartesian)
--------------------------------
The plugin uses the following attributes for a step:
	data-rel-ref
	data-rel-x
	data-rel-y
	data-rel-z

If the attribute "data-rel-ref" is not given, relative coordinates will be measured
from the position of the previous frame. If added, the step with the given id determines
the origin. This allows to group steps to a topic without the risk of scattering them when 
one of them is removed.
In addition to plain numbers, which are pixel values, it is also possible to
define relative positions as a multiple of normal step height and width, using
a unit of "h" or "w", respectively, appended to the number.

Example:
	<div id="relstep" class="step" 
		data-rel-ref="main_step" data-rel-x="1w" data-rel-y="0.5h" data-rel-z="0">
			
Relative coordinates not given are inherited from the previous step, so make sure
to set them to zero if that behaviour is not desired.
Absolute values always override relative values!

Polar Positioning
-----------------

To place steps e.g. in a circle around a central thought, polar positioning is introduced here.
It uses the following attributes for a step:
	data-rel-ref
	data-rho
	data-phi
	data-rel-rho
	data-rel-phi

Rho is the radius (the distance from the origin) and phi the angle in degree, counting from the 
horizontal (positive x, "03:00hrs") counterclockwise.
In addition to plain numbers, which are pixel values, it is also possible to define the radius 
as a multiple of the normal step diagonal, using a unit of "d" appended to the number.

Relative polar coordinates are not added up, they just count from the given origin. For absolute
coordinates that is (0,0,0), for relative ones the origin of the last step or the one pointed to 
by the "data-rel-ref" attribute. 
Alternatively, a new relative origin can be set by giving absolute cartesian coordinates.

Combined Positioning
--------------------
When cartesian and polar coordinates are mixed, some take precedence over others.
The following rules apply:
	If no absolute positions are given:
		if relative rx/ry are given (or inherited!):
			these will be used wrto the previous (or referenced) position, rphi/rrho are ignored 
		if relative rphi/rrho are given:
			these will be used wrto the previous (or referenced) position, unless rx/ry are defined
	If absolute x/y are given:
		if relative rphi/rrho are given:
 			these will be used wrto the absolute x/y
		everything else is ignored now
	If absolute phi/rho are given:
		any relative coordinates are ignored

Examples:

	<div id="group" class="step" 
			data-rho="5d" data-phi="98">
		<!-- will be placed above slightly to the left and 
			five frame diagonals away from (0,0,0) -->
	<div>
	<div id="member1"  class="step" 
			data-rel-ref="group" data-rel-x="1w" data-rel-y="0h"
		<!-- will be placed one frame to the right of the group header -->
	<div>
	<div id="member2"  class="step" 
			data-rel-phi="180" data-rel-rho="2d"
		<!-- will be placed two frames to the left of "member1" and
			thus one frame to the left of the group header -->
	<div>
	<div id="newloc"  class="step" 
			data-x="1000" data-y="500" data-rel-phi="45" data-rel-rho="1d"
		<!-- will be placed one frame to the left and upwards from (1000,500,0) -->
	<div>
	
Author
------

Relative part 	Copyright 2016 Henrik Ingo (@henrikingo)
Polar additions	Copyright 2018 Harald Martin (LWH), harald.martin@lwh-brainware.de
Released under the MIT license.
