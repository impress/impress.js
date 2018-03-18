# is-integer [![build status](https://secure.travis-ci.org/parshap/js-is-integer.svg?branch=master)](http://travis-ci.org/parshap/js-is-integer)

ES2015 (ES6) [`Number.isInteger`][isInteger] polyfill implemented in
ES3.

## Example

```js
var isInteger = require("is-integer");
isInteger("hello") // -> false
isInteger(4) // -> true
isInteger(4.0) // -> true
isInteger(4.1) // -> false
```

## API

### `var isInteger = require("is-integer")`

> Determines whether the provided value is an integer.

See [`Number.isInteger`][isInteger].

[isInteger]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger "Number.isInteger - MDN Documentation"

## Install

```
npm install is-integer
```

