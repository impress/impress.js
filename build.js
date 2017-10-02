var buildify = require('buildify');

buildify()
  .load('src/impress.js')
  .concat(['src/plugins/navigation/navigation.js',
           'src/plugins/resize/resize.js'])
  .save('js/impress.js');
/*
 * Disabled until uglify supports ES6: https://github.com/mishoo/UglifyJS2/issues/448
  .uglify()
  .save('js/impress.min.js');
*/