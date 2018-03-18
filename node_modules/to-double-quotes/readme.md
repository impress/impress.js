# to-double-quotes [![Build Status](https://travis-ci.org/sindresorhus/to-double-quotes.svg?branch=master)](https://travis-ci.org/sindresorhus/to-double-quotes)

> Convert matching single-quotes to double-quotes: `I 'love' unicorns` → `I "love" unicorns`


## Install

```
$ npm install --save to-double-quotes
```


## Usage

```js
const toDoubleQuotes = require('to-double-quotes');

toDoubleQuotes('I love \'unicorns\' "and" \'ponies\'');
//=> 'I love "unicorns" "and" "ponies"'
```


## Related

- [to-double-quotes-cli](https://github.com/sindresorhus/to-double-quotes-cli) - CLI for this module
- [to-single-quotes](https://github.com/sindresorhus/to-single-quotes) - Convert matching double-quotes to single-quotes


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
