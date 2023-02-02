# Media
This plugin will do the following things:
 - Add a special class when playing (body.impress-media-video-playing and body.impress-media-video-playing) and pausing media (body.impress-media-video-paused and body.impress-media-audio-paused) (removing them when ending). This can be useful for example for darkening the background or fading out other elements while a video is playing. Only media at the current step are taken into account. All classes are removed when leaving a step.
- Introduce the following new data attributes:
    - data-media-autoplay="true": Autostart media when entering its step.
    - data-media-autostop="true": Stop media (= pause and reset to start), when leaving its step.
    - data-media-autopause="true": Pause media but keep current time when leaving its step.

When these attributes are added to a step they are inherited by all media on this step. Of course this setting can be overwritten by adding different attributes to inidvidual media.

The same rule applies when this attributes is added to the root element. Settings can be overwritten for individual steps and media.
Examples:
- data-media-autoplay="true" data-media-autostop="true": start media on enter, stop on leave, restart from beginning when re-entering the step.
- data-media-autoplay="true" data-media-autopause="true": start media on enter, pause on leave, resume on re-enter
- data-media-autoplay="true" data-media-autostop="true" data-media-autopause="true": start media on enter, stop on leave (stop overwrites pause).
- data-media-autoplay="true" data-media-autopause="false": let media start automatically when entering a step and let it play when leaving the step.
- ```<div id="impress" data-media-autoplay="true"> ... <div class="step" data-media-autoplay="false">```
 All media is startet automatically on all steps except the one that has the data-media-autoplay="false" attribute.
- Pro tip: Use ```<audio onended="impress().next()"> or <video onended="impress().next()">``` to proceed to the next step automatically, when the end of the media is reached.