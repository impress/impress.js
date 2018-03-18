var test = require('tape');
var ent = require('../');

test('opts.numeric', function (t) {
    var a = 'a & b & c';
    var ax = 'a &#38; b &#38; c';
    var b = '<html> © π " \'';
    var bx = '&#60;html&#62; &#169; &#960; &#34; &#39;';
    
    t.equal(ent.encode(a), ax);
    t.equal(ent.encode(b), bx);
    t.end();
});
