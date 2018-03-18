// breakable.js
// MIT licensed, see LICENSE file
// Copyright (c) 2013-2014 Olov Lassus <olov.lassus@gmail.com>

var breakable = (function() {
    "use strict";

    function Val(val, brk) {
        this.val = val;
        this.brk = brk;
    }

    function make_brk() {
        return function brk(val) {
            throw new Val(val, brk);
        };
    }

    function breakable(fn) {
        var brk = make_brk();
        try {
            return fn(brk);
        } catch (e) {
            if (e instanceof Val && e.brk === brk) {
                return e.val;
            }
            throw e;
        }
    }

    return breakable;
})();

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = breakable;
}
