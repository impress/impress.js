"use strict";
const fn1 = function f(a) {
    // not allowed and defs produces an error accordingly
    const a = 3;
}
const fn2 = function f(a) {
    // defs produces an error but it's a false positive
    // (it's allowed per the ES spec). Being conservative
    // is a good thing here because the usage is unnecessary
    // and error-prone
    const f = 3;
}
