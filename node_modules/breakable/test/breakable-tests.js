"use strict";

var test = require("tap").test;
var breakable = require("../");

test("normal-return", function(t) {
    t.equal(breakable(function(brk) {
        return 1;
    }), 1);
    t.end();
});

test("break-return", function(t) {
    t.equal(breakable(function(brk) {
        brk(2);
        return 1;
    }), 2);
    t.end();
});

test("recurse", function(t) {
    t.equal(breakable(function(brk) {
        function traverse(n) {
            if (n < 100) {
                traverse(n + 1);
            }
            brk(n);
        }
        traverse(0);
    }), 100);
    t.end();
});

test("simple-throws", function(t) {
    t.throws(breakable.bind(null, function(brk) {
        throw 1;
    }));
    t.doesNotThrow(breakable.bind(null, function(brk) {
        brk(1);
        throw 2;
    }));
    t.end();
});

test("prop-recurse-break", function(t) {
    var tstObj = {a: 1, b: {c: 2, d: {e: 3, f: "gold", g: null}}, h: {i: 6}};

    var found = breakable(function(brk) {
        function traverse(obj) {
            var props = Object.keys(obj);
            props.forEach(function(prop) {
                var val = obj[prop];
                if (val === "gold") {
                    brk(prop);
                } else if (val === null) {
                    throw new Error("break did not work");
                } else if (val && typeof val === "object") {
                    traverse(val);
                }
            });
        }
        traverse(tstObj);
    });
    t.equal(found, "f");
    t.end();
});

test("forEach-break", function(t) {
    var cnt = 0;
    breakable(function(brk) {
        [1,2,3].forEach(function(v) {
            ++cnt;
            if (v === 2) {
                brk();
            }
        });
    });
    t.equal(cnt, 2);
    t.end();
});

test("nested-forEach-break", function(t) {
    var cnt = 0;
    breakable(function(brk) {
        [1,2,3].forEach(function(v) {
            [4,5,6].forEach(function(v1) {
                ++cnt;
                if (v === 2 && v1 === 5) {
                    brk();
                }
            });
        });
    });
    t.equal(cnt, 5);
    t.end();
});

test("nested-breakables-1", function(t) {
    var res = breakable(function(brk1) {
        breakable(function(brk2) {
            brk1(13);
        });
    });
    t.equal(res, 13);
    t.end();
});

test("nested-breakables-2", function(t) {
    t.plan(2);
    var res1 = breakable(function(brk1) {
        var res2 = breakable(function(brk2) {
            brk2(13);
        });
        t.equal(res2, 13);
    });
    t.equal(res1, undefined);
    t.end();
});
