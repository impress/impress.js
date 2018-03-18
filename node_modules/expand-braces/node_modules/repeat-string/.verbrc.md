# {%= name %} {%= badge("fury") %}
> {%= description %}

## Install
{%= include("install-npm", {save: true}) %}
{%= include("install-bower", {save: true}) %}

## Usage

```js
var repeat = require('{%= name %}');

repeat('A', 5);
//=> AAAAA
```

## Author
{%= include("author") %}
### Other javascript/node.js utils

Other projects that I maintain:

  - [assemble](https://github.com/jonschlinkert/assemble)
  - [verb](https://github.com/jonschlinkert/verb)
  - [less.js](https://github.com/jonschlinkert/less.js)
  - [handlebars-helpers](https://github.com/jonschlinkert/handlebars-helpers)
  - [arr](https://github.com/jonschlinkert/arr)
  - [arr-diff](https://github.com/jonschlinkert/arr-diff)
  - [array-last](https://github.com/jonschlinkert/array-last)
  - [array-slice](https://github.com/jonschlinkert/array-slice)
  - [array-sum](https://github.com/jonschlinkert/array-sum)
  - [arrayify-compact](https://github.com/jonschlinkert/arrayify-compact)
  - [compact-object](https://github.com/jonschlinkert/compact-object)
  - [delete](https://github.com/jonschlinkert/delete)
  - [for-in](https://github.com/jonschlinkert/for-in)
  - [for-own](https://github.com/jonschlinkert/for-own)
  - [has-any](https://github.com/jonschlinkert/has-any)
  - [has-value](https://github.com/jonschlinkert/has-value)
  - [is-number](https://github.com/jonschlinkert/is-number)
  - [is-plain-object](https://github.com/jonschlinkert/is-plain-object)
  - [mixin-deep](https://github.com/jonschlinkert/mixin-deep)
  - [mixin-object](https://github.com/jonschlinkert/mixin-object)
  - [object-length](https://github.com/jonschlinkert/object-length)
  - [omit-empty](https://github.com/jonschlinkert/omit-empty)
  - [reduce-object](https://github.com/jonschlinkert/reduce-object)

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}