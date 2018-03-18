var test = require('tape');
var punycode = require('punycode');
var ent = require('../');

test('hex', function (t) {
    for (var i = 0; i < 32; i++) {
        var a = String.fromCharCode(i);
        if (a.match(/\s/)) {
            t.equal(ent.decode(a), a);
        }
        else {
            var b = '&#x' + i.toString(16) + ';';
            t.equal(ent.decode(b), a);
            t.equal(ent.encode(a), '&#' + i + ';');
        }
    }
    
    for (var i = 127; i < 2000; i++) {
        var a = String.fromCharCode(i);
        var b = '&#x' + i.toString(16) + ';';
        var c = '&#X' + i.toString(16) + ';';
        
        t.equal(ent.decode(b), a);
        t.equal(ent.decode(c), a);
        
        var encoded = ent.encode(a);
        var encoded2 = ent.encode(a + a);
        if (!encoded.match(/^&\w+;/)) {
            t.equal(encoded, '&#' + i + ';');
            t.equal(encoded2, '&#' + i + ';&#' + i + ';');
        }
    }
    t.end();
});

