var buildify = require('buildify');

buildify()
  .load('src/impress.js')
  // Libraries from src/lib
  .concat(['src/lib/gc.js'])
  .concat(['src/lib/util.js'])
  // Plugins from src/plugins
  .concat(['src/plugins/goto/goto.js',
           'src/plugins/navigation/navigation.js',
           'src/plugins/rel/rel.js',
           'src/plugins/resize/resize.js',
           'src/plugins/stop/stop.js',
           'src/plugins/touch/touch.js'])
  .save('js/impress.js');
/*
 * Disabled until uglify supports ES6: https://github.com/mishoo/UglifyJS2/issues/448
  .uglify()
  .save('js/impress.min.js');
*/