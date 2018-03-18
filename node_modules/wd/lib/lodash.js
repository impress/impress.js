var _  = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

_.mixin({
    includeString: _.str.include,
    reverseString: _.str.reverse
});

module.exports = _;
