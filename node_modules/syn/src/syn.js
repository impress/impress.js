var syn = require('./synthetic');
require('./mouse.support');
require('./browsers');
require('./key.support');
require('./drag');

window.syn = syn;
module.exports = syn;
