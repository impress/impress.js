/**
 * Buildify tasks
 *
 * @param {{run: String}} [options]
 * @constructor Tasks
 */
function Tasks (options) {
  var me = this;

  // properties
  this.tasks = {};
  this.options = {
    run: 'auto' // can be 'auto' or 'manual'
  };
  this.executed = false;

  // set options
  if (options) {
    this.setOptions(options);
  }

  // execute a function on next process tick which will execute the tasks
  // (when configured to be executed automatically)
  if (process && process.nextTick) {
    process.nextTick(function () {
      if (me.options.run == 'auto') {
        me.run();
      }
    });
  }
}

/**
 * Add a task
 * @param {{
 *          name: String,
 *          (depends: String | String[]),
 *          (desc: String),
 *          (task: Function)
 *        }} options
 */
Tasks.prototype.task = function task (options) {
  // test requirements
  if (!options) {
    throw new SyntaxError('Task configuration expected');
  }
  if (!options.name) {
    throw new SyntaxError('Parameter "name" missing');
  }
  else if (this.tasks[options.name]) {
    throw new SyntaxError('Task already existing');
  }

  // create task
  var task = {
    name: options.name,
    desc: options.desc,
    task: options.task,
    executed: false
  };

  // write dependencies
  if (options.depends instanceof Array) {
    task.depends = options.depends;
  }
  else if (options.depends) {
    task.depends = [
      options.depends
    ];
  }
  else {
    task.depends = [];
  }

  // append to list with tasks
  this.tasks[task.name] = task;
};

/**
 * Configure tasks
 * @param {{run: String}} options
 */
Tasks.prototype.setOptions = function setOptions (options) {
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      this.options[prop] = options[prop];
    }
  }
};

/**
 * Run the provided task. Depending tasks will be executed first
 * @param {{
 *          name: String,
 *          (depends: String | String[]),
 *          (desc: String),
 *          (task: Function)
 *        }} task
 * @private
 */
Tasks.prototype._runTask = function _runTask (task) {
  var me = this;

  if (task.executed) {
    throw new Error('Cannot run task: task is already executed');
  }
  task.executed = true;

  // execute dependencies
  if (task.depends) {
    // TODO: give an error on circular dependencies
    task.depends.forEach(function (name) {
      var dep = me.tasks[name];
      if (!dep.executed) {
        me._runTask(dep);
      }
    });
  }

  // execute the task itself
  if (task.task) {
    task.task();
  }
};

/**
 * Run the tasks.
 * If there are command line arguments with task names only these tasks
 * will be executed. Else, all tasks will be executed.
 */
Tasks.prototype.run = function run () {
  if (this.executed) {
    throw new Error('Tasks are already executed');
  }
  this.executed = true;

  // build list with tasks to execute
  var tasks = this.tasks;
  var names;
  if (process.argv.length > 2) {
    // specific task names from command line arguments
    names = process.argv.slice(2);
  }
  else {
    // execute all tasks
    names = Object.keys(tasks);
  }

  // run the selected tasks
  var me = this;
  names.forEach(function (name) {
    var task = tasks[name];
    if (!task) {
      throw new Error('Task "' + name + '" not found');
    }
    if (!task.executed) {
      me._runTask(task);
    }
  });
};

/**
 * Factory method which creates a new Tasks
 *
 * @param {Object} [options]    Constructor options
 */
module.exports = function(options) {
  return new Tasks(options);
};
