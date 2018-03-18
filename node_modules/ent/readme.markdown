# ent

Encode and decode HTML entities

[![browser support](http://ci.testling.com/substack/node-ent.png)](http://ci.testling.com/substack/node-ent)

[![build status](https://secure.travis-ci.org/substack/node-ent.png)](http://travis-ci.org/substack/node-ent)

# example

``` js
var ent = require('ent');
console.log(ent.encode('<span>©moo</span>'))
console.log(ent.decode('&pi; &amp; &rho;'));
```

```
&#60;span&#62;&#169;moo&#60;/span&#62;
π & ρ
```

![ent](http://substack.net/images/ent.png)

# methods

``` js
var ent = require('ent');
var encode = require('ent/encode');
var decode = require('ent/decode');
```

## encode(str, opts={})

Escape unsafe characters in `str` with html entities.

By default, entities are encoded with numeric decimal codes.

If `opts.numeric` is false or `opts.named` is true, encoding will used named
codes like `&pi;`.

If `opts.special` is set to an Object, the key names will be forced
to be encoded (defaults to forcing: `<>'"&`). For example:

``` js
console.log(encode('hello', { special: { l: true } }));
```

```
he&#108;&#108;o
```

## decode(str)

Convert html entities in `str` back to raw text.

# credits

HTML entity tables shamelessly lifted from perl's
[HTML::Entities](http://cpansearch.perl.org/src/GAAS/HTML-Parser-3.68/lib/HTML/Entities.pm)

# install

With [npm](https://npmjs.org) do:

```
npm install ent
```

# license

MIT
