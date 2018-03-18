## What is "ls"?

`ls` is a node module for cleanly traversing directories and listing files.

The primary goal is a flexible, expressive syntax.

## Installation

    $ npm i ls

## Overview

First require:

    var ls = require('ls');

Then we can be as sparse as

    for (var file of ls('/path/*')) {
      console.log(file.name)
    }

Or as elaborate as

    ls(
      '/path/*',
      { recurse: true },
      /jpg/,
      file => console.log `${file.name} is in ${$file.path} and is ${file.stat.size}`
    )

## Usage

The only required argument is the initial path, the rest can be omitted.

    ls([path/s], {config}, /file regex/, iteratorFunction)

Each file produces an object with the following parameters:

* full: The path and file (/foo/bar/baz.jpg)
* path: The path to the file (/foo/bar/)
* file: The file (baz.jpg)
* name: The file without an extension (baz)
* stat: A lazy loaded stat object from [fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats)

You can either grab the whole list

    all_files = ls('/path/*')
    for (var file of all_files) {
      console.log(file.name, 'is', file.stat.size);
    }

Or use an iterator function, with the context being the file's object

    var prettysize = require('prettysize');
    ls('/tmp/*', file => console.log(`${file.name} is ${prettysize(file.stat.size)}`));

The {config} object accepts the following parameters:

* recurse: Should we recurse into directories? (Boolean, default is false)
* type: What kind of files should we return? ('all', 'dir', 'file', default is 'all')

The /regex/ will only return matching files. All directories will still be recursed.

The iterator function is mostly a style preference, but can be handy if you need to throw an error and stop traversal.

## License

ls is [UNLICENSED](http://unlicense.org/). Do whatever you want with it.
