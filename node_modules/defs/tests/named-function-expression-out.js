"use strict";

var f1 = function named_f() {
    console.log(named_f);
};

var f2 = function named_f() {
    console.log(named_f);
    if (true) {
        var named_f$0 = 1;
        console.log(named_f$0);
    }
};

var named_g = function() {};
if (true) {
    var named_g$0 = function() {}; // renamed
    var f3 = function named_g() { // stays
        console.log(named_g); // stays
    };
    console.log(named_g$0); // renamed
}
console.log(named_g)
