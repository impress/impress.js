# comment-parser


Generic JSDoc-like comment parser. This library is not intended to be documentation generator, but rather composite unit for it.

`npm install comment-parser`

Module provides `parse(s:String[, opts:Object]):Object` function which takes `/** ... */` comment string and returns array  of objects with parsed data.

It is not trying to detect relations between tags or somehow recognize their meaning. Any tag can be used, as long as it satisfies the format.

```
/**
 * Singleline or multiline description text. Line breaks are preserved.
 *
 * @some-tag {Type} name Singleline or multiline description text
 * @some-tag {Type} name.subname Singleline or multiline description text
 * @some-tag {Type} name.subname.subsubname Singleline or
 * multiline description text
 * @another-tag
 */
```

this would be parsed into following

```javascript
[{
  "tags": [{
    "tag": "some-tag",
    "type": "Type",
    "name": "name",
    "optional": false,
    "description": "Singleline or multiline description text",
    "line": 3,
    "source": "@some-tag {Type} name Singleline or multiline description text"
  }, {
    "tag": "some-tag",
    "type": "Type",
    "name": "name.subname",
    "optional": false,
    "description": "Singleline or multiline description text",
    "line": 4,
    "source": "@some-tag {Type} name.subname Singleline or multiline description text"
  }, {
    "tag": "some-tag",
    "type": "Type",
    "name": "name.subname.subsubname",
    "optional": false,
    "description": "Singleline or\nmultiline description text",
    "line": 5,
    "source": "@some-tag {Type} name.subname.subsubname Singleline or\nmultiline description text"
  }, {
    "tag": "another-tag",
    "name": "",
    "optional": false,
    "type": "",
    "description": "",
    "line": 7,
    "source": "@another-tag"
  }],
  "line": 0,
  "description": "Singleline or multiline description text. Line breaks are preserved.",
  "source": "Singleline or multiline description text. Line breaks are preserved.\n\n@some-tag {Type} name Singleline or multiline description text\n@some-tag {Type} name.subname Singleline or multiline description text\n@some-tag {Type} name.subname.subsubname Singleline or\nmultiline description text\n@another-tag"
}]
```

By default dotted names like `name.subname.subsubname` will be expanded into nested sections, this can be prevented by passing `opts.dotted_names = false`.

Invalid comment blocks are skipped. Comments starting with `/*` and `/***` are considered not valid.

Also you can parse entire file with `parse.file('path/to/file', callback)` or acquire an instance of [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream with `parse.stream()`.

## Custom parsers


In case you need to parse tags in different way you can pass `opts.parsers = [parser1, ..., parserN]`, where each parser is `function name(str:String, data:Object):{source:String, data:Object}`.

Each parser function takes string left after previous parsers applied and data produced by them. And returns `null` or `{source: '', data:{}}` where `source` is consumed substring and `data` is a payload with tag node fields.

Tag node data is build by merging result bits from all parsers. Here is some example that is not doing actual parsing but is demonstrating the flow:

```
/**
 * Source to be parsed below
 * @tag {type} name Description
 */
parse(source, {parsers: [
	// takes entire string
	function parse_tag(str, data) {
		return {source: ' @tag', data: {tag: 'tag'}};
	},
	// parser throwing exception
	function check_tag(str, data) {
		if (allowed_tags.indexOf(data.tag) === -1) {
			throw new Error('Unrecognized tag "' + data.tag + '"');
		}			
	},
	// takes the rest of the string after ' @tag''
	function parse_name1(str, data) {
		return {source: ' name', data: {name: 'name1'}};
	},
	// alternative name parser
	function parse_name2(str, data) {
		return {source: ' name', data: {name: 'name2'}};
	}
]});
```

This would produce following:

```
[{
  "tags": [{
    "tag": "tag",
    "errors": [
      "check_tag: Unrecognized tag \\"tag\\""
    ],
    "name": "name2",
    "optional": false,
    "type": "",
    "description": "",
    "line": 2,
    "source": "@tag {type} name Description"
  }],
  "line": 0,
  "description": "Source to be parsed below",
  "source": "Source to be parsed below\n@tag {type} name Description"
}]
```

## Packaging

`comment-parser` is CommonJS module and was primarely designed to be used with Node. Module `index.js` includes stream and file functionality. Use prser-only module in browser `comment-parser/parse.js`

## Contributors


- [Alexej Yaroshevich](https://github.com/zxqfox)
- [Evgeny Reznichenko](https://github.com/zxcabs)
- [Jordan Harband](https://github.com/ljharb)
- [Sergii Iavorskyi](https://github.com/yavorskiy)


Happy coding :)
