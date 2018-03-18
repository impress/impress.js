
vargs
=====

> variable argument handling for functions taking a callback

rationale
----------

JavaScript has very poor argument handling. *vargs* tries to make it simpler.

synopsis
--------

    var Args = require("vargs").Constructor;
  
    function (/* [arg1, arg2, ...][,callback] */) {
        var args = new(Args)(arguments);
        
        args.first;    // first argument
        args.last;     // last argument before callback
        args.callback; // callback argument, or an empty function
        args.all;      // all arguments except callback
        args.length;   // number of arguments, not including callback
        
        args.callbackGiven(); // returns true or false
        args.at(-1);          // last argument, including callback
        args.array;           // all arguments, including callback
    }

example
-------

For a real-world example of *vargs*, check <http://github.com/cloudhead/cradle>
