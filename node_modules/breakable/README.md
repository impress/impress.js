# breakable.js
Break out of functions, recursive or not, in a more composable way
than by using exceptions explicitly. Non-local return.



## Usage
You can use breakable to break out of simple loops like this example
but note that it is often simpler to just use `.some` instead. Anyways,
here's a minimal example.

```javascript
var breakable = require("breakable");

breakable(function(brk) {
    arr.forEach(function(v) {
        if (...) {
           brk();
        }
    });
});
```

Pass a value to `brk` and it becomes the return-value of breakable.


breakable is useful when you want to break out of a deep recursion,
passing a value, without riddling your code with exception ceremony.

Instead of:

```javascript
var esprima = require("esprima").parse;
var traverse = require("ast-traverse");
var ast = esprima("f(!x, y)");

var val;
try {
    traverse(ast, {pre: function(node) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            val = node.argument;
            throw 0;
        }
    }});
} catch(e) {
    if (val === undefined) {
        throw e; // re-throw if it wasn't our exception
    }
}

console.dir(val); // { type: 'Identifier', name: 'x' }
```

you use breakable and do:

```javascript
var breakable = require("breakable");
var esprima = require("esprima").parse;
var traverse = require("ast-traverse");
var ast = esprima("f(!x, y)");

var val = breakable(function(brk) {
    traverse(ast, {pre: function(node) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            brk(node.argument);
        }
    }});
});

console.dir(val); // { type: 'Identifier', name: 'x' }
```



## Installation

### Node
Install using npm

    npm install breakable

```javascript
var breakable = require("breakable");
```

### Browser
Clone the repo and include it in a script tag

    git clone https://github.com/olov/breakable.git

```html
<script src="breakable/breakable.js"></script>
```
