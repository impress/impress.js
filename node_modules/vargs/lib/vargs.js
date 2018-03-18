//
// vargs.js
//
//   variable argument handling for functions taking a callback
//
// usage:
//   
//   var Args = new("vargs").Constructor;
//
//   function (/* [arg1, arg2, ...][,callback] */) {
//       var args = new(Args)(arguments);
//       
//       args.first;    // first argument
//       args.last;     // last argument before callback
//       args.callback; // callback argument, or an empty function
//       args.all;      // all arguments except callback
//       args.length;   // number of arguments, not including callback
//       
//       args.callbackGiven() // returns true or false
//       args.at(-1)          // last argument, including callback
//       args.array           // all arguments, including callback
//   }
//
exports.Constructor = function Vargs(arguments) {
    this.array = Array.prototype.slice.call(arguments);
    this.__defineGetter__('length', function () {
        if (this.callbackGiven()) {
            return this.array.length - 1;
        } else {
            return this.array.length;
        }
    });
    this.__defineGetter__('all', function () {
        if (this.callbackGiven()) {
            return this.array.slice(0, -1);
        } else {
            return this.array;
        }
    });
    this.__defineGetter__('last', function () {
        if (typeof(this.at(-1)) === 'function') {
            return this.at(-2);
        } else {
            return this.at(-1);
        }
    });
    this.__defineGetter__('first', function () {
        return this.array[0];
    });
    this.callback = this.callbackGiven() ? this.at(-1)
                                         : function () {};
};

exports.Constructor.prototype = {
    callbackGiven: function () {
        return typeof(this.at(-1)) === 'function';
    },
    at: function (n) {
        if (n < 0) {
            return this.array[this.array.length + n];
        } else {
            return this.array[n];
        }
    }
};

exports.Constructor.last = function (args) {
    return args[args.length - 1];
};

