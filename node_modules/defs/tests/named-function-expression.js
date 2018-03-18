"use strict";

const f1 = function named_f() {
    console.log(named_f);
};

const f2 = function named_f() {
    console.log(named_f);
    if (true) {
        const named_f = 1;
        console.log(named_f);
    }
};

const named_g = function() {};
if (true) {
    const named_g = function() {}; // renamed
    const f3 = function named_g() { // stays
        console.log(named_g); // stays
    };
    console.log(named_g); // renamed
}
console.log(named_g)
