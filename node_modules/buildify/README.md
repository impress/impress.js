buildify
===

Builder for creating distributable JavaScript files from source. Concatenate, wrap, uglify.


##Install
Requires [NodeJS](http://nodejs.org/#download) to run.

Then install buildify via npm:

```sh
npm install buildify
```

Create a file with your build script (see the example in 'Usage' below), call it something like `build.js` and then run it with:

```sh
node build.js
```

##Usage

```js
var buildify = require('buildify');

buildify()
  .load('base.js')
  .concat(['part1.js', 'part2.js'])
  .wrap('../lib/template.js', { version: '1.0' })
  .save('../distribution/output.js')
  .uglify()
  .save('../distribution/output.min.js');
```

##API

###buildify([dir, options])
Create a new Builder instance.

Takes the starting directory as the first argument, e.g. __dirname. If this is not set, the current working directory is used.

Options:
- `interpolate`   Underscore template settings. Default to mustache {{var}} style interpolation tags.
- `encoding`      File encoding (Default 'utf-8')
- `eol`           End of line character (Default '\n')
- `quiet`         Whether to silence console output


###setDir(absolutePath)
Set the current working directory.


###changeDir(relativePath)
Change the current working directory.


###setContent(content)
Set the content to work with.


###getContent()
Get the current content. Note: breaks the chain.


###load(file)
Load file contents.


###concat(files, [eol])
Concatenate the content of multiple files.

```js
buildify()
    .concat(['file1.js', 'file2.js']);
```


###wrap(template, [data])
Wrap the contents in a template.

Useful for creating AMD/CommonJS compatible versions of code, adding notes/comments to the top of the file etc.

By default the template uses Mustache-style tags and has a special tag, `{{body}}` which is where the contents are placed.

Other custom tags can be included and passed in the `data` argument.

```js
//template.js
/*
 * This is a module for doing stuff.
 * Version {{version}}.
 */
(function() {
    //Setup code can go here

    {{body}}
});

//build.js
buildify()
    .load('src.js')
    .wrap('template.js', { version: '1.0' });
```

###perform(fn)
Perform a function on the content. The content is set to what the function returns.

```js
buildify()
    .load('src.js')
    .perform(function(content) {
        return content.replace(\assetpath\g, 'http://cdn.example.com');
     });
```

###uglify(options)
Minimise your JS using uglifyJS.

Options:
- mangle: Whether to mangle output from UglifyJS. Default: true


###cssmin([maxLineLength])
Minimise your CSS using clean-css.
Optionally a line break is inserted after 'maxLineLength' characters in the minimized css file.


###save(file)
Save the contents to a file.


###clear()
Reset/clear contents.

## Tasks

Buildify supports tasks, allowing to separate a build script in different
sections. Dependencies can be specified between tasks.
By specifying tasks names as command line arguments, buildify will only run
the specified tasks, taking into account their dependencies

For example create a script named `buildify.js` with the following contents:
```js
var buildify = require('buildify');

buildify.task({
  name: 'task2',
  depends: ['task1'],
  task: function () {
    console.log('task2...');
  }
});

buildify.task({
  name: 'task1',
  task: function () {
    console.log('task1...');
  }
});
```

To run all tasks, just run the script:
```sh
node buildify.js
```

To run a specific task, specify the task name as command line arguments.
```sh
node buildify.js concat
```

### Tasks API

#### buildify.task(options)

Create a task.

Options:
- `name`    A string containing the task name
- `desc`    An optional description of the task
- `depends` An optional string or an array with strings containing the name(s)
            of tasks which this task depends on.
- `task`:   The function to be executed as task, doing the actual work.
            Optional.


## Command Line Interface

When installed globally, the command line application `buildify` is available.
Running `buildify` will execute the script named `buildify.js` in the current
directory (typically the root of a project).

```sh
buildify [tasks]
```

Optionally, a list of task names can be provided to only execute specified tasks.
If no tasks are provided, buildify will run the script including all tasks.


##Changelog

0.4.0
Implemented tasks (josdejong)

0.3.1
Fix mangling (can be disabled with mangle: false option in uglify()) (powmedia, whadar)

0.3.0
Add cssmin() for minifying CSS (RustyMarvin)
Fix tests under Windows (RustyMarvin)

0.2.0
Add perform() for custom functions (trevorgerhardt)
