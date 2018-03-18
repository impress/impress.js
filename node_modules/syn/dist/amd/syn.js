/*syn@0.9.0#syn*/
define(function (require, exports, module) {
    var syn = require('./synthetic');
    require('./mouse.support');
    require('./browsers');
    require('./key.support');
    require('./drag');
    window.syn = syn;
    module.exports = syn;
});