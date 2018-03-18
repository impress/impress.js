var inherit = require('..');

exports.testIsFunction = function(test) {
    test.equal(typeof inherit, 'function');
    test.done();
};

exports.testInstanceProperties = function(test) {
    var A = inherit({
        __constructor : function(val) {
            this.prop = val;
        }
    });

    test.equal(new A('test').prop, 'test');
    test.equal(new A('other').prop, 'other');
    test.done();
};

exports.testInstanceOf = function(test) {
    var A = inherit({}),
        B = inherit(A, {});

    test.ok(new A() instanceof A);
    test.ok(!(new A() instanceof B));
    test.ok(new B() instanceof A);
    test.ok(new B() instanceof B);
    test.done();
};

exports.testInstanceOfConstructorResult = function(test) {
    var A = inherit({}),
        B = inherit({
            __constructor : function(val) {
                return new A();
            }
        });

    test.ok(new B() instanceof A);
    test.done();
};

exports.testSelf = function(test) {
    var A = inherit({}),
        B = inherit(A, {});

    test.strictEqual(new A().__self, A);
    test.strictEqual(new B().__self, B);
    test.done();
};

exports.testInherit = function(test) {
    var A = inherit({
            method1 : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            method2 : function() {
                return 'B';
            }
        });

    test.equal(typeof new A().method2, 'undefined');
    test.equal(new B().method1(), 'A');
    test.done();
};

exports.testInheritFromPlaneFunction = function(test) {
    var A = function(val) {
            this.prop = val;
        },
        B = inherit(A, {});

    test.ok(new B() instanceof A);
    test.equal(new B('val').prop, 'val');
    test.done();
};

exports.testInheritAndBaseCallFromPlaneFunction = function(test) {
    var A = function(val) {
            this.prop = val;
        },
        B = inherit(A, {
            __constructor : function() {
                this.__base('fromB');
            }
        });

    test.ok(new B() instanceof A);
    test.equal(new B().prop, 'fromB');
    test.done();
};

exports.testStaticInherit = function(test) {
    var A = inherit({}, {
            method1 : function() {
                return 'A';
            }
        }),
        B = inherit(A, {}, {
            method2 : function() {
                return 'B';
            }
        });

    test.equal(typeof A.method2, 'undefined');
    test.equal(B.method1(), 'A');
    test.done();
};

exports.testOverride = function(test) {
    var A = inherit({
            method : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            method : function() {
                return 'B';
            }
        });

    test.equal(new A().method(), 'A');
    test.equal(new B().method(), 'B');
    test.done();
};

exports.testStaticOverride = function(test) {
    var A = inherit({}, {
            method : function() {
                return 'A';
            }
        }),
        B = inherit(A, {}, {
            method : function() {
                return 'B';
            }
        });

    test.equal(A.method(), 'A');
    test.equal(B.method(), 'B');
    test.done();
};

exports.testBase = function(test) {
    var A = inherit({
            method1 : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            method1 : function() {
                return this.__base() + 'B';
            },
            method2 : function() {
                return this.__base() + 'B2';
            }
        });

    test.equal(new B().method1(), 'AB');
    test.equal(new B().method2(), 'undefinedB2');
    test.done();
};

exports.testStaticBase = function(test) {
    var A = inherit({}, {
            staticMethod : function() {
                return 'A';
            }
        }),
        B = inherit(A, {}, {
            staticMethod : function() {
                return this.__base() + 'B';
            }
        });

    test.equal(B.staticMethod(), 'AB');
    test.done();
};

exports.testObjectMixin = function(test) {
    var A = inherit(),
        M = {
            methodM : function() {
                return 'M';
            }
        },
        B = inherit([A, M]);

    test.equal(new B().methodM(), 'M');
    test.done();
};

exports.testFunctionMixin = function(test) {
    var A = inherit(),
        M = inherit({
            methodM : function() {
                return 'M';
            }
        }),
        B = inherit([A, M]);

    test.equal(new B().methodM(), 'M');
    test.strictEqual(new B().__self, B);
    test.done();
};

exports.testFunctionMixinStatic = function(test) {
    var A = inherit(),
        M = inherit({}, {
            staticMethodM : function() {
                return 'M';
            }
        }),
        B = inherit([A, M]);

    test.equal(B.staticMethodM(), 'M');
    test.done();
};

exports.testBaseMocking = function(test) {
     var A = inherit({
            m : function() {
                return 'A';
            }
        }),
        B = inherit(A, {
            m : function() {
                return this.__base() + 'B';
            }
        });

     B.prototype.m.__base = function() { return 'C'; };

     var b = new B();

     test.equal(b.m(), 'CB');
     test.done();
};
