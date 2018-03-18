var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    _ = require('underscore'),
    uglifyJS = require('uglify-js'),
    cleanCSS = require('clean-css'),
    tasks = require('./tasks.js');

/**
 * @param {String} [dir]                 Starting directory absolute path. Default: current working dir
 * @param {Object} [options]
 * @param {Object} [options.interpolate] Underscore template settings. Default to mustache {{var}} style interpolation tags.
 * @param {String} [options.encoding]    File encoding ('utf-8')
 * @param {String} [options.eol]         End of line character ('\n')
 * @param {Boolean} [options.quiet]      Whether to silence console output
 */
function Builder(dir, options) {
  dir = dir || process.cwd();

  this.options = _.extend({
    encoding: 'utf-8',
    eol: '\n',
    interpolate: /\{\{(.+?)\}\}/g
  }, options);

  _.templateSettings.interpolate = this.options.interpolate;

  //The current directory
  this.setDir(dir);

  //The content being acted on
  this.content = '';
};

/**
 * Set the current working directory
 *
 * @param {String} absolutePath     Absolute directory path
 */
Builder.prototype.setDir = function(absolutePath) {
  this.dir = path.normalize(absolutePath);

  return this;
};

/**
 * Change the directory, relateive to the current working directory
 *
 * @param {String} relativePath     Directory path, relative to the current directory
 */
Builder.prototype.changeDir = function(relativePath) {
  this.setDir(this.dir + '/' + relativePath);

  return this;
};

/**
 * Set the content to work with
 *
 * @param {String} content
 */
Builder.prototype.setContent = function(content) {
  this.content = content;

  return this;
};

/**
 * Returns the content. Note: this method breaks the chain
 *
 * @return {String}
 */
Builder.prototype.getContent = function() {
  return this.content;
};

/**
 * Load file contents
 *
 * @param {String} file     File path relative to current directory
 */
Builder.prototype.load = function(file) {
  file = path.normalize(this.dir + '/' + file);

  this.content = fs.readFileSync(file, this.options.encoding);

  return this;
};

/**
 * Concatenate file contents
 *
 * @param {String|String[]} files   File path(s) relative to current directory
 * @param {String} [eol]            Join character. Default: '\n'
 */
Builder.prototype.concat = function(files, eol) {
  eol = (_.isUndefined(eol)) ? this.options.eol : eol;

  if (!_.isArray(files)) files = [files];

  var dir = this.dir,
      encoding = this.options.encoding;

  var contents = files.map(function(file) {
    file = path.normalize(dir + '/' + file);

    return fs.readFileSync(file, encoding);
  });

  if (this.content) contents.unshift(this.content);

  this.content = contents.join(eol);

  return this;
};

/**
 * Wrap the contents in a template
 *
 * @param {String} templatePath   Template file path, relative to current directory. Should have a {{body}} tag where content will go.
 * @param {Object} [templateData] Data to pass to template
 */
Builder.prototype.wrap = function(templatePath, templateData) {
  templatePath = path.normalize(this.dir + '/' + templatePath);
  templateData = templateData || {};

  var data = _.extend(templateData, {
    body: this.content
  });

  var templateStr = fs.readFileSync(templatePath, this.options.encoding);

  this.content = _.template(templateStr, data);

  return this;
};

/**
 * Perform a function to manipulate or use the content, function must return the content
 *
 * @param {Function} fn     Function that takes the current content and returns it after an operation
 */
Builder.prototype.perform = function(fn) {
  this.content = fn(this.content);

  return this;
};

/**
 * Uglifies the content
 *
 * @param {Object} [options]
 * @param {Boolean} [options.mangle]    Whether to mangle variable names etc. Default: true
 */
Builder.prototype.uglify = function(options) {
  options = _.extend({
    mangle: true
  }, options);

  var parse = uglifyJS.parser.parse,
      uglify = uglifyJS.uglify;

  var output = parse(this.content);

  output = uglify.ast_mangle(output, { mangle: options.mangle });
  output = uglify.ast_squeeze(output);
  output = uglify.gen_code(output);

  this.content = output;

  return this;
};

/**
 * Minimizes css content
 *
 * @param {number} [maxLineLength]   Add a linebreak after this number of characters in minimized content.
 */
Builder.prototype.cssmin = function(maxLineLength) {
  var content = this.content,
      startIndex,
      i;

  content = cleanCSS.process(content);

  // Some source control tools don't like it when files containing lines longer
  // than, say 8000 characters, are checked in. The linebreak option is used in
  // that case to split long lines after a specific column.
  if (_.isNumber(maxLineLength) && maxLineLength > 0) {
    startIndex = 0;
    i = 0;
    while (i < content.length) {
      i += 1;
      if (content[i - 1] === '}' && i - startIndex > maxLineLength) {
        content = content.slice(0, i) + '\n' + content.slice(i);
        startIndex = i;
      }
    }
  }

  this.content = content;

  return this;
};

/**
 * Save the contents to disk
 *
 * @param {String} file         File path relative to current directory
 */
Builder.prototype.save = function(file) {
  file = path.normalize(this.dir + '/' + file);

  var dir = path.dirname(file);

  mkdirp.sync(dir);

  fs.writeFileSync(file, this.content);

  if (!this.options.quiet) console.log(file);

  return this;
};

/**
 * Reset/clear the contents
 */
Builder.prototype.clear = function() {
  this.content = '';

  return this;
};

/**
 * Factory method which creates a new builder
 *
 * @param {Object} [options]    Constructor options
 */
module.exports = function(dir, options) {
  return new Builder(dir, options);
};

/**
 * Add a task
 * @param {{
 *          name: String,
 *          (depends: String | String[]),
 *          (desc: String),
 *          (task: Function)
 *        }} options
 */
var builderTasks = null; // singleton, lazy loaded
module.exports.task = function (options) {
  // create a tasks if needed
  if (!builderTasks) {
    builderTasks = tasks(options);
  }

  // add the task to the list
  builderTasks.task(options);
};
