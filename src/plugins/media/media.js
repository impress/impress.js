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
    var root, api, gc, attributeTracker;
    
    attributeTracker = [];
    
    // function names
    var enhanceMediaNodes,
        enhanceMedia,
        removeMediaClasses,
        onStepenter,
        onStepleave,
        onPlay,
        onPause,
        onEnded,
        getMediaAttribute,
        teardown;
    
    document.addEventListener("impress:init", function (event) {
        root = event.target;
        api = event.detail.api;
        gc = api.lib.gc;

        enhanceMedia();
        
        gc.pushCallback(teardown);
    }, false);
    
    teardown = function () {
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
        for (i = 0; i < attributeTracker.length; i += 1) {
            el = attributeTracker[i];
            el.node.removeAttribute(el.attr);
        }
        attributeTracker = [];
    };
    
    getMediaAttribute = function (attributeName, nodeList) {
        var attrName, attrValue, i, node;
        attrName = "data-media-" + attributeName;
        
        // Look for attributes in all nodes
        for (i = 0; i < nodeList.length; i += 1) {
            node = nodeList[i];
            // First test, if the attribute exists, because some browsers may return 
            // an empty string for non-existing attributes - specs are not clear at that point
            if (node.hasAttribute(attrName)) {
                // Attribute found, return their parsed boolean value, empty strings count as true
                // to enable empty value booleans (common in html5 vs. not allowed in well formed xml).
                attrValue = node.getAttribute(attrName);
                if (attrValue === "" || attrValue === "true") {
                    return true;
                } else {
                    return false;
                }
            }
            // No attribute found at current node, proceed with next round
        }
        
        // Last resort: no attribute found - return undefined to distiguish from false
        return undefined;
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
        media = root.querySelectorAll("audio, video");
        for (i = 0; i < media.length; i += 1) {
            type = media[i].nodeName.toLowerCase();
            // Set an id to identify each media node - used e.g. for cross references by 
            // the consoleMedia plugin
            mediaElement = media[i];
            id = mediaElement.getAttribute("id");
            if (id === undefined || id === null) {
                mediaElement.setAttribute("id", "media-" + type + "-" + i);
                attributeTracker.push({"node": mediaElement, "attr": "id"});
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
            
            gc.addEventListener(stepElement, "impress:stepenter", onStepenter);
            gc.addEventListener(stepElement, "impress:stepleave", onStepleave);
        }
    };

    onStepenter = function (event) {
        var stepElement, media, mediaElement, i, onConsolePreview, onConsoleSlideView;
        if ((!event) || (!event.target)) {
            return;
        }
        stepElement = event.target;
        
        removeMediaClasses();
        
        media = stepElement.querySelectorAll("audio, video");
        for (i = 0; i < media.length; i += 1) {
            mediaElement = media[i];
            
            // Autoplay when (maybe inherited) autoplay setting is true, 
            // but only if not on preview of the next step in impressConsole
            onConsolePreview = (window.frameElement !== null && window.frameElement.id === "preView");
            if (getMediaAttribute("autoplay", [mediaElement, stepElement, root]) && !onConsolePreview) {
                onConsoleSlideView = (window.frameElement !== null && window.frameElement.id === "slideView");
                if (onConsoleSlideView) {
                    mediaElement.muted = true;
                }
                mediaElement.play();
            }
        }
    };
    
    onStepleave = function (event) {
        var stepElement, media, i, mediaElement, autoplay, autopause, autostop;
        if ((!event || !event.target)) {
            return;
        }
        
        stepElement = event.target;
        media = event.target.querySelectorAll("audio, video");
        for (i = 0; i < media.length; i += 1) {
            mediaElement = media[i];
            
            autoplay = getMediaAttribute("autoplay", [mediaElement, stepElement, root]);
            autopause = getMediaAttribute("autopause", [mediaElement, stepElement, root]);
            autostop = getMediaAttribute("autostop", [mediaElement, stepElement, root]);
            
            // If both autostop and autopause are undefined, set it to the value of autoplay
            // Previously only if autopause was false, but in that case someone would expect
            // the media to play along, when leaving the step but it would be even stopped when
            // autoplay was set to true.
            if (autostop === undefined && autopause === undefined) {
                autostop = autoplay;
            }
            
            if (autopause || autostop) {
                mediaElement.pause();
                if (autostop) {
                    mediaElement.currentTime = 0;
                }
            }
        }
        removeMediaClasses();
    };

})(document, window);
