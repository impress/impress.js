"use strict";
var x = "x";
function named_fn(a, b) {
    if (true) {
        (function() {
            console.log(x);
        })();
    }

    // let x must be renamed or else it will shadow the reference on line 5
    for (var x$0 = 0; x$0 < 2; x$0++) {
        console.log(x$0);
    }
}
named_fn();
