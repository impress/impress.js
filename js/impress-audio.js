/*
https://github.com/danielsimons1/impress-audio
Author: Daniel Simons
Author Email: daniel.simons1@gmail.com
Version: 1.0.0
License: Free General Public License (GPL)
*/
(function(document, $, undefined) {
  'use strict';

  var isPlaying,
  audio,
  impressObj = impress(),
    impressGoto = impressObj.goto;

  $(document).on('impress:stepenter', function(event,f) {
    var $currSlide = $(event.target);
    if(audio) {
      audio.pause();
    }
    audio = $currSlide.find('audio')[0];
    if(audio) {
      audio.play();
      if(isPlaying && $currSlide[0] != $currSlide.parent().children().last()[0]) {
        audio.addEventListener('ended',function() {
          impressObj.goto($currSlide.next());
          audio.removeEventListener('ended');
        });
      } else {
        isPlaying = false;
      }

    }
  });

  impressObj.play = function() {
    isPlaying = true;
    this.goto(0);
  };

  impressObj.goto = function($el) {
    if(isNaN($el)) {
      impressGoto($el.parent().children().index($el), $el.data('transition-duration'));
    } else {
      impressGoto($el);
    }
  }


})(document, jQuery);
