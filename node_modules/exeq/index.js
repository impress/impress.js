var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var spawn = require('child_process').spawn;
var path = require('path');
var Promise = require('native-or-bluebird');
var platform = require('os').platform();

function Exeq(commands) {
  EventEmitter.call(this);
  this.commands = commands || [];
  this.cwd = '';
  this.results = [];

  var instance = new Promise(this.run.bind(this));
  instance.q = this;

  return instance;
}

inherits(Exeq, EventEmitter);

Exeq.prototype.run = function(resolve, reject) {

  var that = this;

  var stdout = new Buffer('');
  var stderr = new Buffer('');

  // done!
  if (this.commands.length === 0) {
    this.emit('done', this.results);
    resolve(this.results);
    return;
  }

  var cmdString = this.commands.shift();
  var parsed = parseCommand(cmdString);
  var s = this.proc = spawn(parsed.cmd, parsed.args, {
    cwd: this.cwd
  });

  s.stdout.pipe(process.stdout);
  s.stdout.on('data', function(data) {
    that.emit('stdout', data);
    stdout += data.toString();
  });

  s.stderr.pipe(process.stderr);
  s.stderr.on('data', function(data) {
    that.emit('stderr', data);
    stderr += data.toString();
  });

  s.on('close', function(code, signal) {
    var reason;
    if (code) {
      reason = {
        code: code,
        stdout: stdout.toString(),
        stderr: stderr.toString()
      };

      that.emit('failed', reason);
      return reject(reason);
    }

    that.results.push({
      cmd: cmdString,
      stdout: stdout.toString(),
      stderr: stderr.toString()
    });

    if (that.killed) {
      reason = {
        code: code,
        stderr: that.results.map(function(result) {
          return result.stdout.toString();
        }).join('') + 'Process has been killed.'
      };

      if (signal) {
        reason.errno = signal;
      }

      that.emit('killed', reason);
      return reject(reason);
    }

    // cd /path/to
    // change cwd to /path/to
    if (parsed.changeCwd) {
      that.cwd = path.resolve(that.cwd, parsed.changeCwd);
    }
    that.run(resolve, reject);
  });
};

Exeq.prototype.kill = function() {
  if (this.proc) {
    try {
      this.proc.kill('SIGTERM');
      this.killed = true;
    } catch (e) {
      if (e.errno != 'ESRCH') {
        throw (e);
      }
    }
  }
};


module.exports = function() {
  var cmds = [], args = Array.prototype.slice.call(arguments);
  args.forEach(function(arg) {
    if (Array.isArray(arg)) {
      cmds = cmds.concat(arg);
    } else {
      cmds.push(arg);
    }
  });
  return new Exeq(cmds);
};

function parseCommand(cmd) {
  cmd = cmd.trim();
  var command = (platform === 'win32' ? 'cmd.exe' : 'sh');
  var args = (platform === 'win32' ? ['/s', '/c'] : ['-c']);
  var changeCwd;
  // change cwd for "cd /path/to"
  if (/^cd\s+/.test(cmd)) {
    changeCwd = cmd.replace(/^cd\s+/, '');
  }
  return {
    cmd: command,
    args: args.concat([cmd]),
    changeCwd: changeCwd
  };
}
