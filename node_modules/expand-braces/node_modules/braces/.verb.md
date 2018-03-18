# {%= name %} {%= badge("fury") %}

> {%= description %}

## Benchmarks

```bash
node benchmark
```

## Example usage

```js
var expand = require('{%= name %}');

expand('a/{x,y}/c{d}e')
//=> ['a/x/cde', 'a/y/cde']

expand('a/b/c/{x,y}')
//=> ['a/b/c/x', 'a/b/c/y']

expand('a/{x,{1..5},y}/c{d}e')
//=> ['a/x/cde', 'a/1/cde', 'a/y/cde', 'a/2/cde', 'a/3/cde', 'a/4/cde', 'a/5/cde']
```

See the [examples](./examples.js) and [tests](./test) to see more use cases.


### Range expansion

Uses [expand-range](https://github.com/jonschlinkert/expand-range) for range expansion.

```js
expand('a{1..3}b')
//=> ['a1b', 'a2b', 'a3b']

expand('a{5..8}b')
//=> ['a5b', 'a6b', 'a7b', 'a8b']

expand('a{00..05}b')
//=> ['a00b', 'a01b', 'a02b', 'a03b', 'a04b', 'a05b']

expand('a{01..03}b')
//=> ['a01b', 'a02b', 'a03b']

expand('a{000..005}b')
//=> ['a000b', 'a001b', 'a002b', 'a003b', 'a004b', 'a005b']

expand('a{a..e}b')
//=> ['aab', 'abb', 'acb', 'adb', 'aeb']

expand('a{A..E}b')
//=> ['aAb', 'aBb', 'aCb', 'aDb', 'aEb']
```

Pass a function as the last argument to customize range expansions:

```js
var range = expand('x{a..e}y', function (str, i) {
  return String.fromCharCode(str) + i;
});

console.log(range);
//=> ['xa0y', 'xb1y', 'xc2y', 'xd3y', 'xe4y']
```
See [expand-range](https://github.com/jonschlinkert/expand-range) for benchmarks, tests and information related to expanding ranges.


## Install
{%= include("install-npm", {save: true}) %}

## Run tests

```bash
npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue]({%= bugs.url %}).

## Author
{%= include("author") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}
