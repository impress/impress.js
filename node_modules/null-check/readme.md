# null-check [![Build Status](https://travis-ci.org/sindresorhus/null-check.svg?branch=master)](https://travis-ci.org/sindresorhus/null-check)

> Ensure a path doesn't contain [null bytes](http://en.wikipedia.org/wiki/Null_character)

The same check as done in all the core [`fs` methods](https://github.com/iojs/io.js/blob/18d457bd3408557a48b453f13b2b99e1ab5e7159/lib/fs.js#L88-L102).


## Install

```
$ npm install --save null-check
```


## Usage

```js
var nullCheck = require('null-check');

nullCheck('unicorn.png\u0000', function (err) {
	console.log(err);
	//=> { [Error: Path must be a string without null bytes.] code: 'ENOENT' }
});
//=> false

// the method is sync without a callback
nullCheck('unicorn.png');
//=> true
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
