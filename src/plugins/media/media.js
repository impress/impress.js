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
 *    Only media at the current step are taken into account. All classes are removed when leaving
 *    a step.
 *
 *  - Introduce the following new data attributes:
 *
 *    - data-media-autoplay="true": Autostart media when entering its step.
 *    - data-media-autostop="true": Stop media (= pause and reset to start), when leaving its
 *      step.
 *    - data-media-autopause="true": Pause media but keep current time when leaving its step.
 *
 *    When these attributes are added to a step they are inherited by all media on this step.
 *    Of course this setting can be overwritten by adding different attributes to inidvidual
 *    media.
 *
 *    The same rule applies when this attributes is added to the root element. Settings can be
 *    overwritten for individual steps and media.
 *
 *    Examples:
 *    - data-media-autostart="true" data-media-autostop="true": start media on enter, stop on
 *      leave, restart from beginning when re-entering the step.
 *
 *    - data-media-autostart="true" data-media-autopause="true": start media on enter, pause on
 *      leave, resume on re-enter
 *
 *    - data-media-autostart="true" data-media-autostop="true" data-media-autopause="true": start
 *      media on enter, stop on leave (stop overwrites pause).
 *
 *    - data-media-autostart="true" data-media-autopause="false": let media start automatically
 *      when entering a step and let it play when leaving the step.
 *
 *    - <div id="impress" data-media-autostart="true"> ... <div class="step"
 *      data-media-autostart="false">
 *      All media is startet automatically on all steps except the one that has the
 *      data-media-autostart="false" attribute.
 *
 *  - Pro tip: Use <audio onended="impress().next()"> or <video onended="impress().next()"> to
 *    proceed to the next step automatically, when the end of the media is reached.
 *
 *
 * Copyright 2018 Holger Teichert (@complanar)
 * Released under the MIT license.
 */
/* global window, document */

( function( document, window ) {
    "use strict";
    var root, api, gc, attributeTracker;

    attributeTracker = [];

    // Function names
    var enhanceMediaNodes,
        enhanceMedia,
        removeMediaClasses,
        onStepenterDetectImpressConsole,
        onStepenter,
        onStepleave,
        onPlay,
        onPause,
        onEnded,
        getMediaAttribute,
        teardown;

    document.addEventListener( "impress:init", function( event ) {
        root = event.target;
        api = event.detail.api;
        gc = api.lib.gc;

        enhanceMedia();

        gc.pushCallback( teardown );
    }, false );

    teardown = function() {
        var el, i;
        removeMediaClasses();
        for ( i = 0; i < attributeTracker.length; i += 1 ) {
            el = attributeTracker[ i ];
            el.node.removeAttribute( el.attr );
        }
        attributeTracker = [];
    };

    getMediaAttribute = function( attributeName, nodes ) {
        var attrName, attrValue, i, node;
        attrName = "data-media-" + attributeName;

        // Look for attributes in all nodes
        for ( i = 0; i < nodes.length; i += 1 ) {
            node = nodes[ i ];

            // First test, if the attribute exists, because some browsers may return
            // an empty string for non-existing attributes - specs are not clear at that point
            if ( node.hasAttribute( attrName ) ) {

                // Attribute found, return their parsed boolean value, empty strings count as true
                // to enable empty value booleans (common in html5 but not allowed in well formed
                // xml).
                attrValue = node.getAttribute( attrName );
                if ( attrValue === "" || attrValue === "true" ) {
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

    onPlay = function( event ) {
        var type = event.target.nodeName.toLowerCase();
        document.body.classList.add( "impress-media-" + type + "-playing" );
        document.body.classList.remove( "impress-media-" + type + "-paused" );
    };

    onPause = function( event ) {
        var type = event.target.nodeName.toLowerCase();
        document.body.classList.add( "impress-media-" + type + "-paused" );
        document.body.classList.remove( "impress-media-" + type + "-playing" );
    };

    onEnded = function( event ) {
        var type = event.target.nodeName.toLowerCase();
        document.body.classList.remove( "impress-media-" + type + "-playing" );
        document.body.classList.remove( "impress-media-" + type + "-paused" );
    };

    removeMediaClasses = function() {
        var type, types;
        types = [ "video", "audio" ];
        for ( type in types ) {
            document.body.classList.remove( "impress-media-" + types[ type ] + "-playing" );
            document.body.classList.remove( "impress-media-" + types[ type ] + "-paused" );
        }
    };

    enhanceMediaNodes = function() {
        var i, id, media, mediaElement, type;

        media = root.querySelectorAll( "audio, video" );
        for ( i = 0; i < media.length; i += 1 ) {
            type = media[ i ].nodeName.toLowerCase();

            // Set an id to identify each media node - used e.g. for cross references by
            // the consoleMedia plugin
            mediaElement = media[ i ];
            id = mediaElement.getAttribute( "id" );
            if ( id === undefined || id === null ) {
                mediaElement.setAttribute( "id", "media-" + type + "-" + i );
                attributeTracker.push( { "node": mediaElement, "attr": "id" } );
            }
            gc.addEventListener( mediaElement, "play", onPlay );
            gc.addEventListener( mediaElement, "playing", onPlay );
            gc.addEventListener( mediaElement, "pause", onPause );
            gc.addEventListener( mediaElement, "ended", onEnded );
        }
    };

    enhanceMedia = function() {
        var steps, stepElement, i;
        enhanceMediaNodes();
        steps = document.getElementsByClassName( "step" );
        for ( i = 0; i < steps.length; i += 1 ) {
            stepElement = steps[ i ];

            gc.addEventListener( stepElement, "impress:stepenter", onStepenter );
            gc.addEventListener( stepElement, "impress:stepleave", onStepleave );
        }
    };

    onStepenterDetectImpressConsole = function() {
        return {
            "preview": ( window.frameElement !== null && window.frameElement.id === "preView" ),
            "slideView": ( window.frameElement !== null && window.frameElement.id === "slideView" )
        };
    };

    onStepenter = function( event ) {
        var stepElement, media, mediaElement, i, onConsole, autoplay;
        if ( ( !event ) || ( !event.target ) ) {
            return;
        }

        stepElement = event.target;
        removeMediaClasses();

        media = stepElement.querySelectorAll( "audio, video" );
        for ( i = 0; i < media.length; i += 1 ) {
            mediaElement = media[ i ];

            // Autoplay when (maybe inherited) autoplay setting is true,
            // but only if not on preview of the next step in impressConsole
            onConsole = onStepenterDetectImpressConsole();
            autoplay = getMediaAttribute( "autoplay", [ mediaElement, stepElement, root ] );
            if ( autoplay && !onConsole.preview ) {
                if ( onConsole.slideView ) {
                    mediaElement.muted = true;
                }
                mediaElement.play();
            }
        }
    };

    onStepleave = function( event ) {
        var stepElement, media, i, mediaElement, autoplay, autopause, autostop;
        if ( ( !event || !event.target ) ) {
            return;
        }

        stepElement = event.target;
        media = event.target.querySelectorAll( "audio, video" );
        for ( i = 0; i < media.length; i += 1 ) {
            mediaElement = media[ i ];

            autoplay = getMediaAttribute( "autoplay", [ mediaElement, stepElement, root ] );
            autopause = getMediaAttribute( "autopause", [ mediaElement, stepElement, root ] );
            autostop = getMediaAttribute( "autostop",  [ mediaElement, stepElement, root ] );

            // If both autostop and autopause are undefined, set it to the value of autoplay
            if ( autostop === undefined && autopause === undefined ) {
                autostop = autoplay;
            }

            if ( autopause || autostop ) {
                mediaElement.pause();
                if ( autostop ) {
                    mediaElement.currentTime = 0;
                }
            }
        }
        removeMediaClasses();
    };

} )( document, window );
