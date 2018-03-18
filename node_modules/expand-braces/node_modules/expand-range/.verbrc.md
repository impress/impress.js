# {%= name %} {%= badge("fury") %}

> {%= description %}

## Benchmarks

```bash
node benchmark
```

## Example usage

```js
var expand = require('{%= name %}');

expand('1..3')
//=> ['1', '2', '3']

expand('5..8')
//=> ['5', '6', '7', '8']

expand('00..05')
//=> ['00', '01', '02', '03', '04', '05']

expand('01..03')
//=> ['01', '02', '03']

expand('000..005')
//=> ['000', '001', '002', '003', '004', '005']

expand('a..e')
//=> ['a', 'b', 'c', 'd', 'e']

expand('A..E')
//=> ['A', 'B', 'C', 'D', 'E']
```

### Custom function

Pass a function as the last argument to customize the expansions:

**Params:**

  - `str` the expanded string
  - `ch` the [unicode value][unicode] for the string
  - `i` the current index


**Example using the `str` value:**

```js
var range = expand('a..e', function (str, ch, i) {
  return str + i;
});

console.log(range);
//=> ['a0', 'b1', 'c2', 'd3', 'e4']
```

**Example using the unicode value:**

```js
var range = expand('a..e', function (str, ch, i) {
  return String.fromCharCode(ch) + i;
});

console.log(range);
//=> ['a0', 'b1', 'c2', 'd3', 'e4']
```

## Install
{%= include("install") %}

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


[unicode]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode