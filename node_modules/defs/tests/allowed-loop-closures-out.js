"use strict";
var arr = [];

// can be transformed (common WAT)
for (var x = 0; x < 10; x++) {
    arr.push(function() { return x; });
}

// can be transformed (common manual work-around)
for (var x$0 = 0; x$0 < 3; x$0++) {
    arr.push((function(x) { return function() { return x; } })(x$0));
}

// can be transformed (no extra IIFE will be inserted)
for (var x$1 = 0; x$1 < 3; x$1++) {(function(){
    var y = 1;
    arr.push(function() { return y; });
}).call(this);}

// can be transformed (added IIFE)
for (var x$2 = 0; x$2 < 3; x$2++) {(function(){
    var y = 1;
    arr.push(function() { return y; });
}).call(this);}

// can be transformed (added IIFE)
for (var x$3 = 0; x$3 < 3; x$3++) {(function(){
    var y = x$3;
    arr.push(function() { return y; });
}).call(this);}

// can be transformed (added IIFE)
for (var x$4 = 0; x$4 < 3; x$4++) {(function(){
    var y = x$4, z = arr.push(function() { return y; });
}).call(this);}

// can be transformed (added IIFE)
for (var x$5 = 0; x$5 < 3; x$5++) {(function(){
    var x = 1;
    arr.push(function() { return x; });
}).call(this);}

// can be transformed (added IIFE)
while (true) {
    var f = function() {
        for (var x = 0; x < 10; x++) {(function(){
            var y = x;
            arr.push(function() { return y; });
        }).call(this);}
    };
    f();
}

// it's fine to use break, continue, return and arguments as long as
// it's contained within a function below the loop so that it doesn't
// interfere with the inserted IIFE
(function() {
    for (var x = 0; x < 3; x++) {(function(){
        var y = x;
        (function() {
            for(;;) break;
            return;
        })();
        (function() {
            for(;;) continue;
            arguments
        })();
        arr.push(function() { return y; });
    }).call(this);}
})();

// For-In
for (var x$6 in [0,1,2]) {(function(x){
    arr.push(function() { return x; });
}).call(this, x$6);}

// Block-less For-In
for (var x$7 in [0,1,2]) (function(x){arr.push(function() { return x; });}).call(this, x$7);/*with semicolon*/
for (var x$8 in [0,1,2]) (function(x){arr.push(function() { return x; })}).call(this, x$8);/*no semicolon*/

null; // previous semicolon-less for statement's range ends just before 'n' in 'null'

// For-Of
for (var x$9 of [0,1,2]) {(function(x){
    arr.push(function() { return x; });
}).call(this, x$9);}

// Block-less For-Of
for (var x$10 of [0,1,2]) (function(x){arr.push(function() { return x; });}).call(this, x$10);/*with semicolon*/
for (var x$11 of [0,1,2]) (function(x){arr.push(function() { return x; })}).call(this, x$11);/*no semicolon*/

null; // previous semicolon-less for statement's range ends just before 'n' in 'null'

// While
while (true) {(function(){
    var x = 1;
    arr.push(function() { return x; });
}).call(this);}

// Do-While
do {(function(){
    var x = 1;
    arr.push(function() { return x; });
}).call(this);} while (true);

arr.forEach(function(f) {
    console.log(f());
});
