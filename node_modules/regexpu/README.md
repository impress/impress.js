# regexpu [![Build status](https://travis-ci.org/mathiasbynens/regexpu.svg?branch=master)](https://travis-ci.org/mathiasbynens/regexpu) [![Code coverage status](http://img.shields.io/coveralls/mathiasbynens/regexpu/master.svg)](https://coveralls.io/r/mathiasbynens/regexpu) [![Dependency status](https://gemnasium.com/mathiasbynens/regexpu.svg)](https://gemnasium.com/mathiasbynens/regexpu)

_regexpu_ is a source code transpiler that enables the use of ES6 Unicode regular expressions in JavaScript-of-today (ES5). It rewrites regular expressions that make use of [the ES6 `u` flag](https://mathiasbynens.be/notes/es6-unicode-regex) into equivalent ES5-compatible regular expressions.

[Here’s an online demo.](https://mothereff.in/regexpu)

[Traceur v0.0.61+](https://github.com/google/traceur-compiler), [Babel v1.5.0+](https://github.com/babel/babel), and [esnext v0.12.0+](https://github.com/esnext/esnext) use _regexpu_ for their `u` regexp transpilation. The REPL demos for [Traceur](https://google.github.io/traceur-compiler/demo/repl.html#%2F%2F%20Traceur%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES6%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%20and%0A%2F%2F%20info.%0A), [Babel](https://babeljs.io/repl/#?experimental=true&playground=true&evaluate=true&code=%2F%2F%20Babel%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES6%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%20and%0A%2F%2F%20info.%0A), and [esnext](https://esnext.github.io/esnext/#%2F%2F%20esnext%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES6%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%20and%0A%2F%2F%20info.%0A) let you try `u` regexps as well as other ES.next features.

## Example

Consider a file named `example-es6.js` with the following contents:

```js
var string = 'foo💩bar';
var match = string.match(/foo(.)bar/u);
console.log(match[1]);
// → '💩'

// This regex matches any symbol from U+1F4A9 to U+1F4AB, and nothing else.
var regex = /[\u{1F4A9}-\u{1F4AB}]/u;
// The following regex is equivalent.
var alternative = /[💩-💫]/u;
console.log([
  regex.test('a'),  // false
  regex.test('💩'), // true
  regex.test('💪'), // true
  regex.test('💫'), // true
  regex.test('💬')  // false
]);
```

Let’s transpile it:

```bash
$ regexpu -f example-es6.js > example-es5.js
```

`example-es5.js` can now be used in ES5 environments. Its contents are as follows:

```js
var string = 'foo💩bar';
var match = string.match(/foo((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))bar/);
console.log(match[1]);
// → '💩'

// This regex matches any symbol from U+1F4A9 to U+1F4AB, and nothing else.
var regex = /(?:\uD83D[\uDCA9-\uDCAB])/;
// The following regex is equivalent.
var alternative = /(?:\uD83D[\uDCA9-\uDCAB])/;
console.log([
  regex.test('a'),  // false
  regex.test('💩'), // true
  regex.test('💪'), // true
  regex.test('💫'), // true
  regex.test('💬')  // false
]);
```

## Known limitations

1. _regexpu_ only transpiles regular expression _literals_, so things like `RegExp('…', 'u')` are not affected.
2. _regexpu_ doesn’t polyfill [the `RegExp.prototype.unicode` getter](https://mths.be/es6#sec-get-regexp.prototype.unicode) because it’s not possible to do so without side effects.
3. _regexpu_ doesn’t support [canonicalizing the contents of back-references in regular expressions with both the `i` and `u` flag set](https://github.com/mathiasbynens/regexpu/issues/4), since that would require transpiling/wrapping strings.
4. _regexpu_ [doesn’t match lone low surrogates accurately](https://github.com/mathiasbynens/regexpu/issues/17). Unfortunately that is impossible to implement due to the lack of lookbehind support in JavaScript regular expressions.

## Installation

To use _regexpu_ programmatically, install it as a dependency via [npm](https://www.npmjs.com/):

```bash
npm install regexpu --save-dev
```

To use the command-line interface, install _regexpu_ globally:

```bash
npm install regexpu -g
```

## API

### `regexpu.version`

A string representing the semantic version number.

### `regexpu.rewritePattern(pattern, flags)`

This function takes a string that represents a regular expression pattern as well as a string representing its flags, and returns an ES5-compatible version of the pattern.

```js
regexpu.rewritePattern('foo.bar', 'u');
// → 'foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar'

regexpu.rewritePattern('[\\u{1D306}-\\u{1D308}a-z]', 'u');
// → '(?:[a-z]|\\uD834[\\uDF06-\\uDF08])'

regexpu.rewritePattern('[\\u{1D306}-\\u{1D308}a-z]', 'ui');
// → '(?:[a-z\\u017F\\u212A]|\\uD834[\\uDF06-\\uDF08])'
```

_regexpu_ can rewrite non-ES6 regular expressions too, which is useful to demonstrate how their behavior changes once the `u` and `i` flags are added:

```js
// In ES5, the dot operator only matches BMP symbols:
regexpu.rewritePattern('foo.bar');
// → 'foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uFFFF])bar'

// But with the ES6 `u` flag, it matches astral symbols too:
regexpu.rewritePattern('foo.bar', 'u');
// → 'foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar'
```

`regexpu.rewritePattern` uses [regjsgen](https://github.com/d10/regjsgen), [regjsparser](https://github.com/jviereck/regjsparser), and [regenerate](https://github.com/mathiasbynens/regenerate) as internal dependencies. If you only need this function in your program, it’s better to include it directly:

```js
var rewritePattern = require('regexpu/rewrite-pattern');
```

This prevents the [Recast](https://github.com/benjamn/recast) and [Esprima](https://github.com/ariya/esprima) dependencies from being loaded into memory.

### `regexpu.transformTree(ast)` or its alias `regexpu.transform(ast)`

This function accepts an abstract syntax tree representing some JavaScript code, and returns a transformed version of the tree in which any regular expression literals that use the ES6 `u` flag are rewritten in ES5.

```js
var regexpu = require('regexpu');
var recast = require('recast');
var tree = recast.parse(code); // ES6 code
tree = regexpu.transform(tree);
var result = recast.print(tree);
console.log(result.code); // transpiled ES5 code
console.log(result.map); // source map
```

`regexpu.transformTree` uses [Recast](https://github.com/benjamn/recast), [regjsgen](https://github.com/d10/regjsgen), [regjsparser](https://github.com/jviereck/regjsparser), and [regenerate](https://github.com/mathiasbynens/regenerate) as internal dependencies. If you only need this function in your program, it’s better to include it directly:

```js
var transformTree = require('regexpu/transform-tree');
```

This prevents the [Esprima](https://github.com/ariya/esprima) dependency from being loaded into memory.

### `regexpu.transpileCode(code, options)`

This function accepts a string representing some JavaScript code, and returns a transpiled version of this code tree in which any regular expression literals that use the ES6 `u` flag are rewritten in ES5.

```js
var es6 = 'console.log(/foo.bar/u.test("foo💩bar"));';
var es5 = regexpu.transpileCode(es6);
// → 'console.log(/foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar/.test("foo💩bar"));'
```

The optional `options` object recognizes the following properties:

* `sourceFileName`: a string representing the file name of the original ES6 source file.
* `sourceMapName`: a string representing the desired file name of the source map.

These properties must be provided if you want to generate source maps.

```js
var result = regexpu.transpileCode(code, {
  'sourceFileName': 'es6.js',
  'sourceMapName': 'es6.js.map',
});
console.log(result.code); // transpiled source code
console.log(result.map); // source map
```

`regexpu.transpileCode` uses [Esprima](https://github.com/ariya/esprima), [Recast](https://github.com/benjamn/recast), [regjsgen](https://github.com/d10/regjsgen), [regjsparser](https://github.com/jviereck/regjsparser), and [regenerate](https://github.com/mathiasbynens/regenerate) as internal dependencies. If you only need this function in your program, feel free to include it directly:

```js
var transpileCode = require('regexpu/transpile-code');
```

## Transpilers that use regexpu internally

If you’re looking for a general-purpose ES.next-to-ES5 transpiler with support for Unicode regular expressions, consider using one of these:

* [Traceur](https://github.com/google/traceur-compiler) v0.0.61+
* [Babel](https://github.com/babel/babel) v1.5.0+
* [esnext](https://github.com/esnext/esnext) v0.12.0+

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## License

_regexpu_ is available under the [MIT](https://mths.be/mit) license.
