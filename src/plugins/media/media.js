/**
 * Media Plugin
 *
 * The media plugin is a combination of a preeinit and prestepleave plugin. 
 * It is executed before impress:init and before impress:stepleave.
 * 
 * It will do the following things:
 * 
 *   - Parse special shortcuts to full html5 audio or video nodes:
 *     e.g. <div class="media" data-media-source="…" data-media-type="audio/…"></div>
 *     or   <span class="media" data-media-source="…" data-media-type="video/…"></span>
 *     
 *     All type of html tags are allowed. Currently only a single source is supported.
 *     All nodes will have the control attribute added, except the 'data-media-controls="false"'
 *     attribute is added.
 *     
 *         <div class="media" data-media-source="…" data-media-type="…/…" data-media-controls="false"></div>
 * 
 *  - Add a special class when playing and pausing media (removing them when ending)
 *
 *  - Pause all video and audio an the active step when leaving it. This can be disabled for 
 *    indivudual media nodes by adding the data-media-pauseonleave="false" attribute. This attribute
 *    is inherited from the shortcut described above.
 *    
 *    Examples: 
 *
 *      <audio contols data-media-pauseonleave="false">
 *        <source src="…" type="audio/…">
 *        Your browser does not support HTML5 audio. Please update you browser to 
 *        a recent version.
 *      </audio>
 *      
 *      <div class="media" 
 *           data-media-source="…" 
 *           data-media-type="video/…" 
 *           data-media-controls="false" 
 *           data-media-pauseonleave="false">
 *      </div>
 *
 * Copyright 2018 Holger Teichert (@complanar)
 * Released under the MIT license.
 */
/* global window, document, impress */

(function (document, window) {
  "use strict";
  
  // function names
  var parseMediaShortcut, 
      enhanceMediaNode, 
      enhanceMedia, 
      pauseOnStepleave, 
      onPlay, 
      onPause, 
      onEnded;

  // Parse nodes with media class <div class="media" data-media-source="PATH" data-media-type="MIMETYPE"></div>
  parseMediaShortcut = function (target) {
    var data, mimeParts, controls, pauseonleave;
    data = target.dataset;
    if (data.mediaType && data.mediaSource) {
      mimeParts = data.mediaType.split('/');
      target.classList.add('media-' + mimeParts[0]);
      controls = data.mediaControls === "false" ? '' : ' controls';
      pauseonleave = data.mediaPauseonleave === "false" ? ' data-media-pauseonleave="false"' : '';
      target.innerHTML = '<' + mimeParts[0] + controls + pauseonleave + '><source src="' + data.mediaSource + '" type="' + data.mediaType + '"> Your Browser does not support HTML5 ' + mimeParts[0] + '.</' + mimeParts[0] + '>';
    }
  };
  
  onPlay = function (event) {
    var type = event.target.nodeName.toLowerCase();
    document.body.classList.add(type + "playing");
    document.body.classList.remove(type + "paused");
  };
  
  onPause = function (event) {
    var type = event.target.nodeName.toLowerCase();
    document.body.classList.add(type + "paused");
    document.body.classList.remove(type + "playing");
  };
  
  onEnded = function (event) {
    var type = event.target.nodeName.toLowerCase();
    document.body.classList.remove(type + "playing");
    document.body.classList.remove(type + "paused");
  };
  
  enhanceMediaNode = function (type) {
    var i, id, media = document.getElementsByTagName(type);
    for (i = 0; i < media.length; i++) {
      // Set an id to identify each media node - used e.g. by the consoleMedia plugin
      id = media[i].getAttribute('id');
      if (id === undefined || id === null) {
        media[i].setAttribute('id', 'media-' + type + '-' + i);
      }
      media[i].addEventListener("play", onPlay, false);
      media[i].addEventListener("playing", onPlay, false);
      media[i].addEventListener("pause", onPause, false);
      media[i].addEventListener("ended", onEnded, false);
    }
  };
  
  enhanceMedia = function () {
    var i, media = document.getElementsByClassName('media');
    for (i = 0; i < media.length; i++) {
      parseMediaShortcut(media[i]);
    }
    enhanceMediaNode('audio');
    enhanceMediaNode('video');
  };

  pauseOnStepleave = function (event) {
    var videos, audios, media, type, i;
    if ((!event) || (!event.target)) {
      return;
    }

    videos = event.target.getElementsByTagName('video');
    audios = event.target.getElementsByTagName('audio');
    media = {
      video: videos,
      audio: audios
    };
    for (type in media) {
      for (i = 0; i < media[type].length; i++) {
        if (media[type][i].dataset.mediaPauseonleave !== "false") {
          media[type][i].pause();
        }
      }
    }
  };

  // Register the plugin to be called in the pre-init phase
  window.impress.addPreInitPlugin(enhanceMedia);

  // Register the plugin to be called in pre-stepleave phase
  impress.addPreStepLeavePlugin(pauseOnStepleave);

})(document, window);