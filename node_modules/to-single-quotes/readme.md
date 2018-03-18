# to-single-quotes [![Build Status](https://travis-ci.org/sindresorhus/to-single-quotes.svg?branch=master)](https://travis-ci.org/sindresorhus/to-single-quotes)

> Convert matching double-quotes to single-quotes: `I "love" unicorns` → `I 'love' unicorns`


## Install

```
$ npm install --save to-single-quotes
```


## Usage

```js
const toSingleQuotes = require('to-single-quotes');

toSingleQuotes('I love "unicorns" \'and\' "ponies"');
//=> "I love 'unicorns' 'and' 'ponies'"
```


## Related

- [to-single-quotes-cli](https://github.com/sindresorhus/to-single-quotes-cli) - CLI for this module
- [to-double-quotes](https://github.com/sindresorhus/to-double-quotes) - Convert matching single-quotes to double-quotes


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
