/**
 * Media Plugin
 * 
 * This plugin will do the following things:
 * 
 *  - Add a special class when playing (body.impress-media-video-playing 
 *    and body.impress-media-video-playing) and pausing media (body.impress-media-video-paused
 *    and body.impress-media-audio-paused) (removing them when ending).
 *    This can be useful for example for darkening the background or fading out other elements
 *    while a video is playing.
 *    Only media at the current step are taken into account. All classes are removed when leaving a step.
 *  
 *  - Introduce the following new data attributes:
 *
 *    - data-media-autoplay="true": Autostart media when entering its step.
 *    - data-media-autostop="true": Stop media (= pause and reset to start), when leaving its step.
 *    - data-media-autopause="true": Pause media but keep current time when leaving its step.
 *    
 *    When these attributes are added to a step they are inherited by all media on this step. Of course 
 *    this setting can be overwritten by adding different attributes to inidvidual media.
 *    
 *    The same rule applies when this attributes is added to the root element. Settings can be overwritten
 *    for individual steps and media.
 *
 *    Examples:
 *    - data-media-autostart="true" data-media-autostop="true": start media on enter, stop on leave, 
 *      restart from beginning when re-entering the step.
 *
 *    - data-media-autostart="true" data-media-autopause="true": start media on enter, pause on leave, 
 *      resume on re-enter
 *
 *    - data-media-autostart="true" data-media-autostop="true" data-media-autopause="true": start 
 *      media on enter, stop on leave (stop overwrites pause).
 *
 *    - <div id="impress" data-media-autostart="true"> ... <div class="step" data-media-autostart="false">
 *      All media is startet automatically on all steps except the one that has the data-media-autostart="false"
 *      attribute.
 *
 *  - Pro tip: Use <audio onended="impress().next()"> or <video onended="impress().next()"> to proceed to the 
 *    next step automatically, when the end of the media is reached.
 *    
 *
 * Copyright 2018 Holger Teichert (@complanar)
 * Released under the MIT license.
 */
/* global window, document */

(function (document, window) {
    "use strict";
    var root, api, gc, gcAttributes;
    
    gcAttributes = [];
    
    // function names
    var enhanceMediaNodes,
        enhanceMedia,
        removeMediaClasses,
        onStepenter,
        onStepleave,
        onPlay,
        onPause,
        onEnded,
        garbage;
    
    document.addEventListener("impress:init", function (event) {
        root = event.target;
        api = event.detail.api;
        gc = api.lib.gc;
        
        if (root.dataset.mediaAutoplay === "" || root.dataset.mediaAutoplay === "true") {
            root.mediaAutoplay = true;
        } else {
            root.mediaAutoplay = false;
        }
        if (root.dataset.mediaAutostop === "" || root.dataset.mediaAutostop === "true") {
            root.mediaAutostop = true;
        } else {
            root.mediaAutostop = false;
        }
        if (root.dataset.mediaAutopause === "" || root.dataset.mediaAutopause === "true") {
            root.mediaAutopause = true;
        } else {
            root.mediaAutopause = false;
        }
        
        // this *must* be called only after setting the autopause, autoplay and autostop values
        enhanceMedia();
        
        gc.pushCallback(garbage());
    }, false);
    
    garbage = function () {
        var elements, el, i;
        removeMediaClasses();
        delete root.mediaAutoplay;
        delete root.mediaAutopause;
        delete root.mediaAutopstop;
        elements = document.querySelectorAll("#root, .step, audio, video");
        for (i = 0; i < elements.length; i += 1) {
            el = elements[i];
            delete el.mediaAutoplay;
            delete el.mediaAutopause;
            delete el.mediaAutostop;
        }
        for (i = 0; i < gcAttributes.length; i += 1) {
            el = gcAttributes[i];
            el.node.removeAttribute(el.attr);
        }
        gcAttributes = [];
    };
    
    onPlay = function (event) {
        var type = event.target.nodeName.toLowerCase();
        document.body.classList.add("impress-media-" + type + "-playing");
        document.body.classList.remove("impress-media-" + type + "-paused");
    };

    onPause = function (event) {
        var type = event.target.nodeName.toLowerCase();
        document.body.classList.add("impress-media-" + type + "-paused");
        document.body.classList.remove("impress-media-" + type + "-playing");
    };

    onEnded = function (event) {
        var type = event.target.nodeName.toLowerCase();
        document.body.classList.remove("impress-media-" + type + "-playing");
        document.body.classList.remove("impress-media-" + type + "-paused");
    };
    
    removeMediaClasses = function () {
        var type, types;
        types = ["video", "audio"];
        for (type in types) {
            document.body.classList.remove("impress-media-" + types[type] + "-playing");
            document.body.classList.remove("impress-media-" + types[type] + "-paused");
        }
    };

    enhanceMediaNodes = function () {
        var i, id, media, mediaElement, type;
        
        //gc = event.detail.api.lib.gc;
        media = document.querySelectorAll("audio, video");
        for (i = 0; i < media.length; i += 1) {
            type = media[i].nodeName.toLowerCase();
            // Set an id to identify each media node - used e.g. by the consoleMedia plugin
            mediaElement = media[i];
            id = mediaElement.getAttribute("id");
            if (id === undefined || id === null) {
                mediaElement.setAttribute("id", "media-" + type + "-" + i);
                gcAttributes.push({"node": mediaElement, "attr": "id"});
            }
            gc.addEventListener(media[i], "play", onPlay);
            gc.addEventListener(media[i], "playing", onPlay);
            gc.addEventListener(media[i], "pause", onPause);
            gc.addEventListener(media[i], "ended", onEnded);
        }
    };

    enhanceMedia = function () {
        var steps, stepElement, i;
        enhanceMediaNodes();
        steps = document.getElementsByClassName("step");
        for (i = 0; i < steps.length; i += 1) {
            stepElement = steps[i];
            
            // Inherit autoplay, autostop and autopause settings from root element if there is no own setting
            if (stepElement.dataset.mediaAutoplay === undefined || stepElement.dataset.mediaAutoplay === null) {
                stepElement.mediaAutoplay = root.mediaAutoplay;
            } else {
                stepElement.mediaAutoplay = stepElement.dataset.mediaAutoplay === "" || stepElement.dataset.mediaAutoplay === "true";
            }
            if (stepElement.dataset.mediaAutoplay === undefined || stepElement.dataset.mediaAutoplay === null) {
                stepElement.mediaAutostop = root.mediaAutostop;
            } else {
                stepElement.mediaAutostop = stepElement.dataset.mediaAutostop === "" || stepElement.dataset.mediaAutostop === "true";
            }
            if (stepElement.dataset.mediaAutoplay === undefined || stepElement.dataset.mediaAutoplay === null) {
                stepElement.mediaAutopause = root.mediaAutopause;
            } else {
                stepElement.mediaAutopause = stepElement.dataset.mediaAutopause === "" || stepElement.dataset.mediaAutopause === "true";
            }
            
            gc.addEventListener(stepElement, "impress:stepenter", onStepenter);
            gc.addEventListener(stepElement, "impress:stepleave", onStepleave);
        }
    };

    onStepenter = function (event) {
        var stepElement, media, mediaElement, i;
        if ((!event) || (!event.target)) {
            return;
        }
        removeMediaClasses();
        stepElement = event.target;
        media = event.target.querySelectorAll("audio, video");
        for (i = 0; i < media.length; i += 1) {
            mediaElement = media[i];
            
            // Inherit autoplay settings from step element if there is no own setting
            if (mediaElement.dataset.mediaAutoplay === undefined || mediaElement.dataset.mediaAutoplay === null) {
                mediaElement.mediaAutoplay = stepElement.mediaAutoplay;
            } else {
                mediaElement.mediaAutoplay = mediaElement.dataset.mediaAutoplay === "" || mediaElement.dataset.mediaAutoplay === "true";
            }
            
            // Autoplay when true
            if (mediaElement.mediaAutoplay) {
                mediaElement.play();
            }
        }
    };
    
    onStepleave = function (event) {
        var stepElement, media, i, mediaElement;
        if ((!event || !event.target)) {
            return;
        }
        
        stepElement = event.target;
        media = event.target.querySelectorAll("audio, video");
        for (i = 0; i < media.length; i += 1) {
            mediaElement = media[i];
            
            // Inherit autostop and autopause settings from step element if there is no own setting
            if (mediaElement.dataset.mediaAutopause === undefined || mediaElement.dataset.mediaAutopause === null) {
                mediaElement.mediaAutopause = stepElement.mediaAutopause;
            } else {
                mediaElement.mediaAutopause = mediaElement.dataset.mediaAutopause === "" || mediaElement.dataset.mediaAutopause === "true";
            }
                        
            if (mediaElement.dataset.mediaAutostop === undefined || mediaElement.dataset.mediaAutostop === null) {
                // Try to derive autostop from parent step or root element – set to autostart value if no 
                // explicit values are set there and autopause is not true
                if (stepElement.dataset.mediaAutostop !== undefined && mediaElement.dataset.mediaAutostop !== null) {
                    mediaElement.mediaAutostop = stepElement.mediaAutostop;
                } else if (root.dataset.mediaAutostop !== undefined && root.dataset.mediaAutostop !== null) {
                    mediaElement.mediaAutostop = root.mediaAutostop;
                } else {
                    mediaElement.mediaAutostop = mediaElement.mediaAutoplay && !mediaElement.mediaAutopause;
                }
            } else {
                mediaElement.mediaAutostop = mediaElement.dataset.mediaAutostop === "" || mediaElement.dataset.mediaAutostop === "true";
            }
            
            if (mediaElement.mediaAutopause || mediaElement.mediaAutostop) {
                mediaElement.pause();
                if (mediaElement.mediaAutostop) {
                    mediaElement.currentTime = 0;
                }
            }
        }
        removeMediaClasses();
    };

})(document, window);
