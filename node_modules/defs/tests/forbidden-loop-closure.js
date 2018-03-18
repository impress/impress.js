"use strict";
var arr = [];

// fresh x per iteration but semantics not determined yet
// in ES6 spec draft (transfer in particular). Also inconsistent
// between VM implementations.
// once ES6 nails down the semantics (and VM's catch up) we'll
// revisit
// note v8 bug https://code.google.com/p/v8/issues/detail?id=2560
// also see other/v8-bug.js
for (let x = 0; x < 3; x++) {
    arr.push(function() { return x; });
}
for (let z, x = 0; x < 3; x++) {
    arr.push(function() { return x; });
}

// as a consequence of the above, defs is unable to transform
// the code below (even though it is the output of an earlier
// defs transformation). we should be able to detect this case
// (and pass it through unmodified) but is it worth the effort?
for (let x = 0; x < 3; x++) {(function(){
    let y = x;
    arr.push(function() { return y; });
}).call(this);}

// return is not allowed inside the loop body because the IIFE would break it
(function() {
    for (let x = 0; x < 3; x++) {
        let y = x;
        return 1;
        arr.push(function() { return y; });
    }
})();

// break is not allowed inside the loop body because the IIFE would break it
for (let x = 0; x < 3; x++) {
    let y = x;
    break;
    arr.push(function() { return y; });
}

// continue is not allowed inside the loop body because the IIFE would break it
for (let x = 0; x < 3; x++) {
    let y = x;
    continue;
    arr.push(function() { return y; });
}

// arguments is not allowed inside the loop body because the IIFE would break it
// (and I don't want to re-apply outer arguments in the inserted IIFE)
for (let x = 0; x < 3; x++) {
    let y = x;
    arguments[0];
    arr.push(function() { return y; });
}

// continue is not allowed inside the loop body because the IIFE would break it
for (let x = 0; x < 3; x++) {
    let y = x;
    var z = 1;
    arr.push(function() { return y; });
}

// TODO block-less loops (is that even applicable?)

arr.forEach(function(f) {
    console.log(f());
});
