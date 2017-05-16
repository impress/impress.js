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
    audio,video,media,currPlaying,
    impressObj = impress(),
    impressGoto = impressObj.goto;
  var TimerID;
  var SpacingTime = 300; //ms

  $(document).on('impress:stepenter', function(event,f) {
    var $currSlide = $(event.target);
    if(currPlaying) {
      currPlaying.pause();
    }

    media = $currSlide.find('audio,video');

    // make it play audio first then try to play the video if exist
    if(media[0]) {
      currPlaying = media.first()[0];
      currPlaying.play();
      media.each(function(){
        $(this)[0].removeEventListener('ended'); // unbind event if its exist
        $(this)[0].addEventListener('ended',function() {
          var nextPlay = $(this).next()[0]
          if(nextPlay){
            // play next media
            currPlaying = nextPlay;
            currPlaying.play();
          }else{
            // go to the next slide
            if(isPlaying && $currSlide[0] != $currSlide.parent().children().last()[0]) {
              setTimeout(function(){impressObj.goto($currSlide.next())}, SpacingTime);
              //impressObj.goto($currSlide.next());
            } else {
              isPlaying = false;
            }
          }
        });
      });
    }

    clearTimeout(TimerID);
    if(!media[0] && waitTimeout > 0 ){
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

// TODO:
// 1. add keydown Listener for <enter> / <esc> for play(resume) / pause event
//

})(document, jQuery);


