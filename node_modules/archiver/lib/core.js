/**
 * node-archiver
 *
 * Copyright (c) 2012-2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-archiver/blob/master/LICENSE-MIT
 */
var fs = require('fs');
var inherits = require('util').inherits;
var Transform = require('readable-stream').Transform;

var async = require('async');

var util = require('./util');

var Archiver = module.exports = function(options) {
  if (!(this instanceof Archiver)) {
    return new Archiver(options);
  }

  options = this.options = util.defaults(options, {
    highWaterMark: 1024 * 1024,
    statConcurrency: 4
  });

  Transform.call(this, options);

  this._entries = [];
  this._format = false;
  this._module = false;
  this._pending = 0;
  this._pointer = 0;

  this._queue = async.queue(this._onQueueTask.bind(this), 1);
  this._queue.drain = this._onQueueDrain.bind(this);

  this._statQueue = async.queue(this._onStatQueueTask.bind(this), options.statConcurrency);

  this._state = {
    aborted: false,
    finalize: false,
    finalizing: false,
    finalized: false,
    modulePiped: false
  };
};

inherits(Archiver, Transform);

Archiver.prototype._abort = function() {
  this._state.aborted = true;
  this._queue.kill();
  this._statQueue.kill();

  if (this._queue.idle()) {
    this._shutdown();
  }
};

Archiver.prototype._append = function(filepath, data) {
  data = data || {};

  var task = {
    source: null,
    filepath: filepath
  };

  if (!data.name) {
    data.name = filepath;
  }

  data.sourcePath = filepath;
  task.data = data;

  if (data.stats && data.stats instanceof fs.Stats) {
    task = this._updateQueueTaskWithStats(task, data.stats);
    this._queue.push(task);
  } else {
    this._statQueue.push(task);
  }
};

Archiver.prototype._finalize = function() {
  if (this._state.finalizing || this._state.finalized || this._state.aborted) {
    return;
  }

  this._state.finalizing = true;

  this._moduleFinalize();

  this._state.finalizing = false;
  this._state.finalized = true;
};

Archiver.prototype._maybeFinalize = function() {
  if (this._state.finalizing || this._state.finalized || this._state.aborted) {
    return false;
  }

  if (this._state.finalize && this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
    this._finalize();
    return true;
  }

  return false;
};

Archiver.prototype._moduleAppend = function(source, data, callback) {
  if (this._state.aborted) {
    callback();
    return;
  }

  this._module.append(source, data, function(err) {
    this._task = null;

    if (this._state.aborted) {
      this._shutdown();
      return;
    }

    if (err) {
      this.emit('error', err);
      setImmediate(callback);
      return;
    }

    this.emit('entry', data);
    this._entries.push(data);

    setImmediate(callback);
  }.bind(this));
};

Archiver.prototype._moduleFinalize = function() {
  if (typeof this._module.finalize === 'function') {
    this._module.finalize();
  } else if (typeof this._module.end === 'function') {
    this._module.end();
  } else {
    this.emit('error', new Error('module: no suitable finalize/end method found'));
    return;
  }
};

Archiver.prototype._modulePipe = function() {
  this._module.on('error', this._onModuleError.bind(this));
  this._module.pipe(this);
  this._state.modulePiped = true;
};

Archiver.prototype._moduleSupports = function(key) {
  if (!this._module.supports || !this._module.supports[key]) {
    return false;
  }

  return this._module.supports[key];
};

Archiver.prototype._moduleUnpipe = function() {
  this._module.unpipe(this);
  this._state.modulePiped = false;
};

Archiver.prototype._normalizeEntryData = function(data, stats) {
  data = util.defaults(data, {
    type: 'file',
    name: null,
    date: null,
    mode: null,
    sourcePath: null,
    stats: false
  });

  if (stats && data.stats === false) {
    data.stats = stats;
  }

  var isDir = data.type === 'directory';

  if (data.name) {
    data.name = util.sanitizePath(data.name);

    if (data.name.slice(-1) === '/') {
      isDir = true;
      data.type = 'directory';
    } else if (isDir) {
      data.name += '/';
    }
  }

  if (typeof data.mode === 'number') {
    data.mode &= 0777;
  } else if (data.stats && data.mode === null) {
    data.mode = data.stats.mode & 0777;
  } else if (data.mode === null) {
    data.mode = isDir ? 0755 : 0644;
  }

  if (data.stats && data.date === null) {
    data.date = data.stats.mtime;
  } else {
    data.date = util.dateify(data.date);
  }

  return data;
};

Archiver.prototype._onModuleError = function(err) {
  this.emit('error', err);
};

Archiver.prototype._onQueueDrain = function() {
  if (this._state.finalizing || this._state.finalized || this._state.aborted) {
    return;
  }

  if (this._state.finalize && this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
    this._finalize();
    return;
  }
};

Archiver.prototype._onQueueTask = function(task, callback) {
  if (this._state.finalizing || this._state.finalized || this._state.aborted) {
    callback();
    return;
  }

  this._task = task;
  this._moduleAppend(task.source, task.data, callback);
};

Archiver.prototype._onStatQueueTask = function(task, callback) {
  if (this._state.finalizing || this._state.finalized || this._state.aborted) {
    callback();
    return;
  }

  fs.stat(task.filepath, function(err, stats) {
    if (this._state.aborted) {
      setImmediate(callback);
      return;
    }

    if (err) {
      this.emit('error', err);
      setImmediate(callback);
      return;
    }

    task = this._updateQueueTaskWithStats(task, stats);

    if (task.source !== null) {
      this._queue.push(task);
      setImmediate(callback);
    } else {
      this.emit('error', new Error('unsupported entry: ' + task.filepath));
      setImmediate(callback);
      return;
    }
  }.bind(this));
};

Archiver.prototype._shutdown = function() {
  this._moduleUnpipe();
  this.end();
};

Archiver.prototype._transform = function(chunk, encoding, callback) {
  if (chunk) {
    this._pointer += chunk.length;
  }

  callback(null, chunk);
};

Archiver.prototype._updateQueueTaskWithStats = function(task, stats) {
  if (stats.isFile()) {
    task.data.type = 'file';
    task.data.sourceType = 'stream';
    task.source = util.lazyReadStream(task.filepath);
  } else if (stats.isDirectory() && this._moduleSupports('directory')) {
    task.data.name = util.trailingSlashIt(task.data.name);
    task.data.type = 'directory';
    task.data.sourcePath = util.trailingSlashIt(task.filepath);
    task.data.sourceType = 'buffer';
    task.source = new Buffer(0);
  } else {
    return task;
  }

  task.data = this._normalizeEntryData(task.data, stats);
  return task;
};

Archiver.prototype.abort = function() {
  if (this._state.aborted || this._state.finalized) {
    return this;
  }

  this._abort();

  return this;
};

Archiver.prototype.append = function(source, data) {
  if (this._state.finalize || this._state.aborted) {
    this.emit('error', new Error('append: queue closed'));
    return this;
  }

  data = this._normalizeEntryData(data);

  if (typeof data.name !== 'string' || data.name.length === 0) {
    this.emit('error', new Error('append: entry name must be a non-empty string value'));
    return this;
  }

  if (data.type === 'directory' && !this._moduleSupports('directory')) {
    this.emit('error', new Error('append: entries of "directory" type not currently supported by this module'));
    return this;
  }

  source = util.normalizeInputSource(source);

  if (Buffer.isBuffer(source)) {
    data.sourceType = 'buffer';
  } else if (util.isStream(source)) {
    data.sourceType = 'stream';
  } else {
    this.emit('error', new Error('append: input source must be valid Stream or Buffer instance'));
    return this;
  }

  this._queue.push({
    data: data,
    source: source
  });

  return this;
};

Archiver.prototype.bulk = function(mappings) {
  if (this._state.finalize || this._state.aborted) {
    this.emit('error', new Error('bulk: queue closed'));
    return this;
  }

  if (!Array.isArray(mappings)) {
    mappings = [mappings];
  }

  var self = this;
  var files = util.file.normalizeFilesArray(mappings);

  files.forEach(function(file){
    var isExpandedPair = file.orig.expand || false;
    var fileData = file.data || {};

    file.src.forEach(function(filepath) {
      var data = util._.extend({}, fileData);
      data.name = isExpandedPair ? util.unixifyPath(file.dest) : util.unixifyPath(file.dest || '', filepath);

      if (data.name === '.') {
        return;
      }

      self._append(filepath, data);
    });
  });

  return this;
};

Archiver.prototype.directory = function(dirpath, destpath, data) {
  if (this._state.finalize || this._state.aborted) {
    this.emit('error', new Error('directory: queue closed'));
    return this;
  }

  if (typeof dirpath !== 'string' || dirpath.length === 0) {
    this.emit('error', new Error('directory: dirpath must be a non-empty string value'));
    return this;
  }

  this._pending++;

  if (destpath === false) {
    destpath = '';
  } else if (typeof destpath !== 'string'){
    destpath = dirpath;
  }

  if (typeof data !== 'object') {
    data = {};
  }

  var self = this;

  util.walkdir(dirpath, function(err, results) {
    if (err) {
      self.emit('error', err);
    } else {
      results.forEach(function(file) {
        var entryData = util._.extend({}, data);
        entryData.name = util.sanitizePath(destpath, file.relative);
        entryData.stats = file.stats;

        self._append(file.path, entryData);
      });
    }

    self._pending--;
    self._maybeFinalize();
  });

  return this;
};

Archiver.prototype.file = function(filepath, data) {
  if (this._state.finalize || this._state.aborted) {
    this.emit('error', new Error('file: queue closed'));
    return this;
  }

  if (typeof filepath !== 'string' || filepath.length === 0) {
    this.emit('error', new Error('file: filepath must be a non-empty string value'));
    return this;
  }

  this._append(filepath, data);

  return this;
};

Archiver.prototype.finalize = function() {
  if (this._state.aborted) {
    this.emit('error', new Error('finalize: archive was aborted'));
    return this;
  }

  if (this._state.finalize) {
    this.emit('error', new Error('finalize: archive already finalizing'));
    return this;
  }

  this._state.finalize = true;

  if (this._pending === 0 && this._queue.idle() && this._statQueue.idle()) {
    this._finalize();
  }

  return this;
};

Archiver.prototype.setFormat = function(format) {
  if (this._format) {
    this.emit('error', new Error('format: archive format already set'));
    return this;
  }

  this._format = format;

  return this;
};

Archiver.prototype.setModule = function(module) {
  if (this._state.aborted) {
    this.emit('error', new Error('module: archive was aborted'));
    return this;
  }

  if (this._state.module) {
    this.emit('error', new Error('module: module already set'));
    return this;
  }

  this._module = module;
  this._modulePipe();

  return this;
};

Archiver.prototype.pointer = function() {
  return this._pointer;
};