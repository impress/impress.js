"use strict";
var arr = [];

// can be transformed (common WAT)
for (var x = 0; x < 10; x++) {
    arr.push(function() { return x; });
}

// can be transformed (common manual work-around)
for (let x = 0; x < 3; x++) {
    arr.push((function(x) { return function() { return x; } })(x));
}

// can be transformed (no extra IIFE will be inserted)
for (let x = 0; x < 3; x++) {(function(){
    let y = 1;
    arr.push(function() { return y; });
}).call(this);}

// can be transformed (added IIFE)
for (let x = 0; x < 3; x++) {
    let y = 1;
    arr.push(function() { return y; });
}

// can be transformed (added IIFE)
for (let x = 0; x < 3; x++) {
    let y = x;
    arr.push(function() { return y; });
}

// can be transformed (added IIFE)
for (let x = 0; x < 3; x++) {
    let y = x, z = arr.push(function() { return y; });
}

// can be transformed (added IIFE)
for (let x = 0; x < 3; x++) {
    let x = 1;
    arr.push(function() { return x; });
}

// can be transformed (added IIFE)
while (true) {
    let f = function() {
        for (let x = 0; x < 10; x++) {
            let y = x;
            arr.push(function() { return y; });
        }
    };
    f();
}

// it's fine to use break, continue, return and arguments as long as
// it's contained within a function below the loop so that it doesn't
// interfere with the inserted IIFE
(function() {
    for (let x = 0; x < 3; x++) {
        let y = x;
        (function() {
            for(;;) break;
            return;
        })();
        (function() {
            for(;;) continue;
            arguments
        })();
        arr.push(function() { return y; });
    }
})();

// For-In
for (let x in [0,1,2]) {
    arr.push(function() { return x; });
}

// Block-less For-In
for (let x in [0,1,2]) arr.push(function() { return x; });/*with semicolon*/
for (let x in [0,1,2]) arr.push(function() { return x; })/*no semicolon*/

null; // previous semicolon-less for statement's range ends just before 'n' in 'null'

// For-Of
for (let x of [0,1,2]) {
    arr.push(function() { return x; });
}

// Block-less For-Of
for (let x of [0,1,2]) arr.push(function() { return x; });/*with semicolon*/
for (let x of [0,1,2]) arr.push(function() { return x; })/*no semicolon*/

null; // previous semicolon-less for statement's range ends just before 'n' in 'null'

// While
while (true) {
    let x = 1;
    arr.push(function() { return x; });
}

// Do-While
do {
    let x = 1;
    arr.push(function() { return x; });
} while (true);

arr.forEach(function(f) {
    console.log(f());
});
