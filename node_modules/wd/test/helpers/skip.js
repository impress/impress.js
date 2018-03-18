var Args = require('vargs').Constructor;

GLOBAL.skip = function () {
  var cat = null;
  var patterns = {
    'iphone': 'ios',
    'ipad': 'ios',
    'ios': 'ios',
    'android': 'android'
  };
  _(patterns).each(function(_cat, pattern) {
    var re = new RegExp(pattern, 'i');
    if((env.BROWSER || "").match(re)) {
        cat = _cat;
    }
  }).value();
  var args = new Args(arguments);
  var found = _(args.all).find(function(skipConfig) {
    var re = new RegExp( '^' + skipConfig + '$','i');
    return (env.BROWSER || "").match(re) || (cat||"").match(re);
  });
  return found ? {pending: true} : {};
};

