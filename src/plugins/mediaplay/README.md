Media Play Plugin
=================

The mediaplay plugin takes care of various embedded video or audio elements.

First of all, the "autostart" attribute allows a video or audio to start 
automatically when the step has been entered.

Example:
	<!-- start this video when the step becomes active	-->
	<video width="800" height="600" autostart>
		...
	</video>
 	
Do not confuse this with the official "autoplay" attribute: This will play the video 
as soon as the presentation is opened.
When the step is left, the video (or audio) will be paused (not stopped), so it will
continue when the step is re-entered, e.g. by stepping back.

In the console, the video will play as well, but without sound to avoid echoes.
This can be avoided by using the class "noconsole", which will either show an 
alternative image given in the video tag or, by default, the image 
"./media/Video-default.png", which must be provided by the user. 
If neither exist, the video file name will be displayed in a box.

Example:
	<video class="noconsole" width="800" height="600" autostart>
		<source src="./media/Clip.mp4"/>
		<img src="./media/NoClip.png" title="video tag not supported" alt="no Video"/>
	</video>

ATTENTION: The latter requires that the class "impress-console" is properly set,
which due to IFRAME restrictions may fail under certain conditions.

The attribute "transition" can be used for an audio element to be played already
when the previous step is left, thus allowing a transition sound, like a swoosh or
a fanfare or such. Preferably, the transition duration should be set accordingly.

Example:
	<div class="step" data-transition-duration="1200">
		<audio id="flourish" transition>
			<source src="./media/flourish.mp3" type="audio/mp3"/> 
			<img src="./media/no_sound-64.png" title="audio tag not supported" alt="no Audio"/>
		</audio>
		...
	</div>

Finally, as audio and video clips come with different volumes, that can be adjusted as well.

Example:
	<audio id="loud_theme" data-volume="0.5">

The maximum (original) volume setting is 1.0, which is also the default. So if You have one 
sample which is very quiet, all the other ones have to be scaled down.

Author
------

Copyright 2018 Harald Martin (LWH), harald.martin@lwh-brainware.de
Released under the MIT license.

