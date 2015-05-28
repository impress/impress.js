/*
https://github.com/danielsimons1/impress-audio
Author: Daniel Simons
Author Email: daniel.simons1@gmail.com
Version: 1.0.0
License: Free General Public License (GPL)
*/
(function(document, $, undefined) {
  'use strict';

  var isPlaying, waitTimeout ,
    audio,video,
    impressObj = impress(),
    impressGoto = impressObj.goto;
  var TimerID;

  $(document).on('impress:stepenter', function(event,f) {
    var $currSlide = $(event.target);
    if(audio) {
      audio.pause();
    }
    if(video) {
      video.pause();
    }

    audio = $currSlide.find('audio')[0];
    video = $currSlide.find('video')[0];

    // make it play audio first then try to play the video if exist
    if(audio) {
      audio.play();
      if(isPlaying && $currSlide[0] != $currSlide.parent().children().last()[0]) {
        audio.addEventListener('ended',function() {
          if(!video){
            impressObj.goto($currSlide.next());
          }else{
            video.play();
          }
          audio.removeEventListener('ended');
        });
      } else {
        isPlaying = false;
      }
    }

    if(video) {
      if(!audio){
        video.play();
      }
      if(isPlaying && $currSlide[0] != $currSlide.parent().children().last()[0]) {
        video.addEventListener('ended',function() {
          impressObj.goto($currSlide.next());
          video.removeEventListener('ended');
        });
      } else {
        isPlaying = false;
      }
    }

    clearTimeout(TimerID);
    if(!audio && !video && waitTimeout > 0 ){
      TimerID = setTimeout(function(){impressObj.goto($currSlide.next())}, waitTimeout );
    }
  });

  impressObj.play = function(SecTimeout) {
    isPlaying = true;
    waitTimeout = parseInt(SecTimeout)*1000 ;
    this.goto(0);
  };

  impressObj.goto = function($el) {
    if($el instanceof jQuery) {
      impressGoto($el.parent().children().index($el), $el.data('transition-duration'));
    } else {
      impressGoto($el);
    }
  }


})(document, jQuery);
