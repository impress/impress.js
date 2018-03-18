"use strict";
let x = "x";
function named_fn(a, b) {
    if (true) {
        (function() {
            console.log(x);
        })();
    }

    // let x must be renamed or else it will shadow the reference on line 5
    for (let x = 0; x < 2; x++) {
        console.log(x);
    }
}
named_fn();
