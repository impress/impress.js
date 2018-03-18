# v0.3.2
- fix RegExp for `description` extraction to allow $ char

# v0.3.1
- use `readable-stream` fro Node 0.8 comatibility
- allow to pass optional parameters to `parse.file(path [,opts], done)`  
- allow `parse.stream` to work with Buffers in addition to strings

# v0.3.0
- `feature` allow to use custom parsers
- `feature` always include source, no `raw_value` option needed
- `bugfix` always provide `optional` tag property
- `refactor` clean up tests

# v0.2.3

- `bugfix` Accept `/** one line */` comments
- `refactor` Get rid of `lodash` to avoid unnecessary extra size when bundled

# v0.2.2

- `feature` allow spaces in default values `@my-tag {my.type} [name=John Doe]`

# v0.2.1

- `refactor` make line pasing mechanism more tolerable

# v0.2.0

- `feature` include source line numbers in parsed data
- `feature` optionally prevent dotten names expanding

# v0.1.2

- `bugfix` Allow to build nested tags from `name.subname` even if `name` wasn't d
- `bugfix` Preserve indentation when extracting comments

# v0.1.1

- `improvement` `parse(source)` returns array of all blocks found in source or an empty array
- `bugfix` fixed indented blocks parsing

# v0.1.0

Initial implementation
