# reserved-words

[![Build Status](https://secure.travis-ci.org/zxqfox/reserved-words.svg)](http://travis-ci.org/zxqfox/reserved-words)

## What is it?

Tiny package for detecting reserved words.

`Reserved Word` is either a `Keyword`, or a `Future Reserved Word`, or a `Null Literal`, or a `Boolean Literal`.
See: [ES5 #7.6.1](http://es5.github.io/#x7.6.1) and
[ES6 #11.6.2](http://www.ecma-international.org/ecma-262/6.0/#sec-reserved-words).

## Installation

```
npm install reserved-words
```

## API

### check(word, [dialect], [strict])

Returns `true` if provided identifier string is a Reserved Word
in some ECMAScript dialect (ECMA-262 edition).

If the `strict` flag is truthy, this function additionally checks whether
`word` is a Keyword or Future Reserved Word under strict mode.

#### Example

```
var reserved = require('reserved-words');
reserved.check('volatile', 'es3'); // true
reserved.check('volatile', 'es2015'); // false
reserved.check('yield', 3); // false
reserved.check('yield', 6); // true
```

### dialects

#### es3 (or 3)

Represents [ECMA-262 3rd edition](http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf).

See section 7.5.1.

#### es5 (or 5)

Represents [ECMA-262 5th edition (ECMAScript 5.1)](http://es5.github.io/).

Reserved Words are formally defined in ECMA262 sections
[7.6.1.1](http://es5.github.io/#x7.6.1.1) and [7.6.1.2](http://es5.github.io/#x7.6.1.2).

#### es2015 (or es6, 6)

Represents [ECMA-262 6th edition](ECMAScript 2015).

Reserved Words are formally defined in sections
[11.6.2.1](http://ecma-international.org/ecma-262/6.0/#sec-keywords) and
[11.6.2.2](http://ecma-international.org/ecma-262/6.0/#sec-future-reserved-words).

### License

Licensed under [The MIT License](https://github.com/zxqfox/reserved-words/blob/master/LICENSE)
