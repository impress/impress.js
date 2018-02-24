/**
 * Media Plugin
 * 
 * This plugin will do the following things:
 * 
 *  - Add a special class when playing and pausing media (removing them when ending).
 *
 *  - Autostart videos when entering a step, if the attribute data-media-autoplay is set and not "false".
 *
 *  - Pause all video and audio an the active step when leaving it. This can be disabled for 
 *    indivudual media nodes by adding the data-media-autopause="false" attribute. 
 *    
 *    Example: 
 *
 *      <audio contols data-media-autopause="false">
 *        <source src="..." type="audio/...">
 *        Your browser does not support HTML5 audio. Please update you browser to 
 *        a recent version.
 *      </audio>
 *  - 
 *
 * Copyright 2018 Holger Teichert (@complanar)
 * Released under the MIT license.
 */
/* global window, document */

(function (document, window) {
    "use strict";
    var api, gc;

    // function names
    var enhanceMediaNodes,
        enhanceMedia,
        removeMediaClasses,
        onStepenter,
        onStepleave,
        onPlay,
        onPause,
        onEnded;
    
    document.addEventListener("impress:init", function(event) {
        //root = event.target;
        api = event.detail.api;
        gc = api.lib.gc;
        
        enhanceMedia();
        
        gc.pushCallback(removeMediaClasses);
    }, false);

    onPlay = function (event) {
        var type = event.target.nodeName.toLowerCase();
        
        document.body.classList.add('impress-media-' + type + "-playing");
        document.body.classList.remove('impress-media-' + type + "-paused");
    };

    onPause = function (event) {
        var type = event.target.nodeName.toLowerCase();
        
        document.body.classList.add('impress-media-' + type + "-paused");
        document.body.classList.remove('impress-media-' + type + "-playing");
    };

    onEnded = function (event) {
        var type = event.target.nodeName.toLowerCase();
        
        document.body.classList.remove('impress-media-' + type + "-playing");
        document.body.classList.remove('impress-media-' + type + "-paused");
    };
    
    removeMediaClasses = function () {
        var types = ['video', 'audio'];
        for (var type in types) {
            document.body.classList.remove('impress-media-' + types[type] + "-playing");
            document.body.classList.remove('impress-media-' + types[type] + "-paused");
        }
    }

    enhanceMediaNodes = function () {
        var i, id, media, type;
        
        //gc = event.detail.api.lib.gc;
        media = document.querySelectorAll('audio, video');
        for (i = 0; i < media.length; i++) {
            type = media[i].nodeName.toLowerCase();
            // Set an id to identify each media node - used e.g. by the consoleMedia plugin
            id = media[i].getAttribute('id');
            if (id === undefined || id === null) {
                media[i].setAttribute('id', 'media-' + type + '-' + i);
            }
            gc.addEventListener(media[i], "play", onPlay);
            gc.addEventListener(media[i], "playing", onPlay);
            gc.addEventListener(media[i], "pause", onPause);
            gc.addEventListener(media[i], "ended", onEnded);
        }
    };

    enhanceMedia = function () {
        var steps, i;
        enhanceMediaNodes();
        steps = document.getElementsByClassName('step');
        for (i = 0; i < steps.length; i++) {
            gc.addEventListener(steps[i], 'impress:stepenter', onStepenter);
            gc.addEventListener(steps[i], 'impress:stepleave', onStepleave);
        }
    };

    onStepenter = function (event) {
        var media, play, i;
        if ((!event) || (!event.target)) {
            return;
        }
        removeMediaClasses();
        media = event.target.querySelectorAll('audio, video');
        for (i = 0; i < media.length; i++) {
            play = media[i].dataset.mediaAutoplay;
            if (play !== undefined && play !== "false") {
                media[i].play();
            }
        }
    }
    
    onStepleave = function (event) {
        var media, i, dplay, play, dpause, pause, dstop, stop;
        if ((!event || !event.target)) {
            return;
        }
        
        media = event.target.querySelectorAll('audio, video');
        for (i = 0; i < media.length; i++) {
            dplay = media[i].dataset.mediaAutoplay;
            dpause = media[i].dataset.mediaAutopause;
            dstop = media[i].dataset.mediaAutostop;
            
            if (dplay !== undefined && dplay !== "false") {
                play = true;
            } else {
                play = false
            }
            
            if (dpause == undefined || dpause !== "false") {
                pause = true;
            } else {
                pause = false;
            }
            
            if (dstop == undefined) {
                stop = play && !pause;
            } else if (dstop !== "false") {
                stop = true;
            } else {
                stop = false;
            }
            
            if (pause || stop) {
                media[i].pause();
                if (stop) {
                    media[i].currentTime = 0;
                }
            }
        }
        removeMediaClasses();
    }

})(document, window);
