
# native-or-bluebird

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Use either `bluebird` or the native `Promise` implementation.
If no implementation is found, an error will be thrown:

```js
var Promise = require('native-or-bluebird');
```

The goal of this library is to be able to eventually remove this line
from your code and use native `Promise`s, allowing you to
to write future-compatible code with ease.
You should install `bluebird` in your libraries for maximum compatibility.

If you do not want an error to be thrown,
`require()` the `Promise` implementation directly.
If no implementation is found, `undefined` will be returned.

```js
var Promise = require('native-or-bluebird/promise');
if (Promise) // do stuff with promises
```

[npm-image]: https://img.shields.io/npm/v/native-or-bluebird.svg?style=flat-square
[npm-url]: https://npmjs.org/package/native-or-bluebird
[github-tag]: http://img.shields.io/github/tag/normalize/native-or-bluebird.svg?style=flat-square
[github-url]: https://github.com/normalize/native-or-bluebird/tags
[travis-image]: https://img.shields.io/travis/normalize/native-or-bluebird.svg?style=flat-square
[travis-url]: https://travis-ci.org/normalize/native-or-bluebird
[coveralls-image]: https://img.shields.io/coveralls/normalize/native-or-bluebird.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/normalize/native-or-bluebird?branch=master
[david-image]: http://img.shields.io/david/normalize/native-or-bluebird.svg?style=flat-square
[david-url]: https://david-dm.org/normalize/native-or-bluebird
[license-image]: http://img.shields.io/npm/l/native-or-bluebird.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/native-or-bluebird.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/native-or-bluebird
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
