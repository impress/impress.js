# Loop closures
A loop closure that captures a block scoped loop variable can't be transpiled only with
variable renaming.

Let's take the following example:

```javascript
const arr = [];
for (let x = 0; x < 10; x++) {
    let y = x;
    arr.push(function() { return y; });
}
```

defs with default options gives you an error:

    line 4: loop-variable y is captured by a loop-closure. Tried "loopClosures": "iife" in defs-config.json?

This is because With ES6 semantics `y` is bound fresh per loop iteration, so each closure captures a separate
instance of `y`, unlike if `y` would have been a `var`.

You can now either choose to rewrite it manually (in usual pre-ES6 style), with an IIFE or
bind or similar. For example:

```javascript
for (let x = 0; x < 10; x++) {
    const arr = [];
    (function(y) {
        arr.push(function() { return y; });
    })(x);
}
```

And that runs just fine and defs stops complaining. Alternatively, you can ask defs to
create the IIFE for you by adding `"loopClosures": "iife"` to your `defs-config.json`.
Run on the original example, defs transpiles that without complaining to:

```javascript
var arr = [];
for (var x = 0; x < 10; x++) {(function(){
    var y = x;
    arr.push(function() { return y; });
}).call(this);}
```

Not all loop closures can be transpiled into IIFE's. If the loop body (which contains the
loop closure) also contains a `return`, `yield`, `break`, `continue`, `arguments` or `var`, then
defs will detect that and give you an error (because an IIFE would likely change
the loop body semantics). If so either rewrite the loop body so it doesn't use any of these or
insert an IIFE manually (knowing what you're doing).

defs does not support transforming loops containing loop closures in any other way than
with IIFE's, including try-catch statements.
