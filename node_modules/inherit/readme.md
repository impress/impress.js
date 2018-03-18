Inherit [![NPM version](https://badge.fury.io/js/inherit.png)](http://badge.fury.io/js/inherit)
=======
This module provides some syntax sugar for "class" declarations, constructors, mixins, "super" calls and static members.

Getting Started
---------------
###In Node.js###
You can install using Node Package Manager (npm):

    npm install inherit

###In Browsers###
```html
<script type="text/javascript" src="inherit.js"></script>
```
It also supports RequireJS module format and [YM module](https://github.com/ymaps/modules) format.

Module has been tested in IE6+, Mozilla Firefox 3+, Chrome 5+, Safari 5+, Opera 10+.

Specification
-------------
###Creating a base class###
````js
Function inherit(Object props);
````
###Creating a base class with static properties###
````js
Function inherit(
    Object props,
    Object staticProps);
````
###Creating a derived class###
````js
Function inherit(
    Function BaseClass,
    Object props,
    Object staticProps);
````
###Creating a derived class with mixins###
````js
Function inherit(
    [
        Function BaseClass,
        Function Mixin,
        Function AnotherMixin,
        ...
    ],
    Object props,
    Object staticProps);
````

Example
------------
```javascript
var inherit = require('inherit');

// base "class"
var A = inherit(/** @lends A.prototype */{
    __constructor : function(property) { // constructor
        this.property = property;
    },

    getProperty : function() {
        return this.property + ' of instanceA';
    },
    
    getType : function() {
        return 'A';
    },

    getStaticProperty : function() {
        return this.__self.staticProperty; // access to static
    }
}, /** @lends A */ {    
    staticProperty : 'staticA',
    
    staticMethod : function() {
        return this.staticProperty;
    }
});

// inherited "class" from A
var B = inherit(A, /** @lends B.prototype */{
    getProperty : function() { // overriding
        return this.property + ' of instanceB';
    },
    
    getType : function() { // overriding + "super" call
        return this.__base() + 'B';
    }
}, /** @lends B */ {
    staticMethod : function() { // static overriding + "super" call
        return this.__base() + ' of staticB';
    }
});

// mixin M
var M = inherit({
    getMixedProperty : function() {
        return 'mixed property';
    }
});

// inherited "class" from A with mixin M
var C = inherit([A, M], {
    getMixedProperty : function() {
        return this.__base() + ' from C';
    }
});

var instanceOfB = new B('property');

instanceOfB.getProperty(); // returns 'property of instanceB'
instanceOfB.getType(); // returns 'AB'
B.staticMethod(); // returns 'staticA of staticB'

var instanceOfC = new C();
instanceOfC.getMixedProperty() // returns "mixed property from C"
```
