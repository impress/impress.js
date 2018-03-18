# Jsdoc type parser
[![Build Status](https://travis-ci.org/Kuniwak/jsdoctypeparser.svg?branch=master)](https://travis-ci.org/Kuniwak/jsdoctypeparser)
[![NPM version](https://badge.fury.io/js/jsdoctypeparser.svg)](http://badge.fury.io/js/jsdoctypeparser)

This module is Jsdoc type expression parser, it makes easy to publish a type name link by `toHTML()`.

This parser provide:

* Parse to object model
* Convert a type name to a link by using `toHtml()`

```javascript
var Parser = require('jsdoctypeparser').Parser;
var parser = new Parser();
var result = parser.parse('Array.<MyClass>=');

console.log(result.toHtml()); // ⇒ 'Array.&lt;<a href="MyClass.html">MyClass</a>&gt;|undefined'
console.log(result.toString()); // ⇒ 'Array.<MyClass>|undefined'
```

This parser can parse:

* [JsDoc type expressions](https://code.google.com/p/jsdoc-toolkit/wiki/TagParam)
  * `foo.bar`, `String[]`
* [Closure Compiler type expressions](https://developers.google.com/closure/compiler/docs/js-for-compiler)
  * `Array.<string>`, `function(this: Objext, arg1, arg2): ret`
* Nested type expressions
  * `Array.<Array.<string>>`, `function(function(Function))`


## Live demo
The [live demo](http://kuniwak.github.io/jsdoctypeparser/) is available.


## Publishing

```javascript
var Parser = require('jsdoctypeparser').Parser;
var parser = new Parser();
var result = parser.parse('Array.<MyClass>=');
```

* `result.toString()` ⇒ `'Array.<MyClass>|undefined'`

* `result.toHtml()` ⇒ `'Array.&lt;<a href="MyClass.html">MyClass</a>&gt;|undefined'`

### Customize type name URI
You can change a file URL by set `TypeBulder.TypeName.getUrlByTypeName(typeName)`.

```javascript
var Builder = require('jsdoctypeparser').Builder;
Bulder.TypeName.getUrlByTypeName = function(typeName) {
  // do something.
  return typeName;
}; 
```

## Parsing

```javascript
var Parser = require('jsdoctypeparser').Parser;
var parser = new Parser();
var result = parser.parse('Array.<string|number, ?Object=>|string|undefined');
```

The `result` is:

```javascript
{ // instanceof TypeBuilder.TypeUnion
  optional: true,
  types: [
    { // instanceof TypeBuilder.FunctionType
      parameterTypeUnions: [
        { // instanceof TypeBuilder.TypeUnion
          types: [
            { name: 'string' }, // instanceof TypeBuilder.TypeName
            { name: 'number' }  // instanceof TypeBuilder.TypeName
          ]
        },
        { // instanceof TypeBuilder.TypeUnion
          nullable: true
          optional: true
          types: [
            { name: 'Object' }  // instanceof TypeBuilder.TypeName
          ]
        }
      ]
    }, { // instanceof TypeBuilder.TypeName
      { name: 'string' }
    }
  ]
}
```

### Specification

#### Type name
```javascript
TypeName = {
  name: string
};
```

#### Type Union
```javascript
TypeUnion = {
  optional: boolean,
  nullable: boolean,
  variable: boolean,
  nonNullable: boolean,
  all: boolean,
  unknown: boolean,
  types: Array.<TypeName|GenericType|FunctionType|RecordType>
};
```

#### Generic type
```javascript
GenericType = {
  genericTypeName: string,
  parameterTypeUnions: Array.<TypeUnion>
};
```

#### Function type
```javascript
FunctionType = {
  parameterTypeUnions: Array.<TypeUnion>,
  returnTypeUnion: TypeUnion|null,
  isConstructor: boolean,
  contextTypeUnion: TypeUnion|null
};
```

#### Record type
```javascript
RecordType = {
  entries: Array.<RecordEntry>
};

RecordType.Entry = {
  name: string,
  typeUnion: TypeUnion
};
```


## License
This script licensed under the MIT.
See: [http://orgachem.mit-license.org](http://orgachem.mit-license.org)
