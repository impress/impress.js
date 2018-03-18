var
  fs = require("fs"),
  path = require("path"),
  rimraf = require("rimraf"),
  os = require("os"),
  _ = require("lodash"),
  async = require("async"),
  https = require("https"),
  AdmZip = require("adm-zip"),
  spawn = require("child_process").spawn,
  exec = require("child_process").exec,
  processOptions = require("./process_options"),
  archivefile,
  scDir = path.normalize(__dirname + "/../sc"),
  exists = fs.existsSync || path.existsSync,
  currentTunnel,
  logger = console.log,
  cleanup_registered = false;

function getScVersion() {
  return process.env.SAUCE_CONNECT_VERSION ||
    require("../package.json").sauceConnectLauncher.scVersion;
}

function killProcesses(callback) {
  callback = callback || function () {};

  if (!currentTunnel) {
    return callback();
  }

  currentTunnel.on("close", function () {
    currentTunnel = null;
    callback();
  });
  currentTunnel.kill("SIGTERM");
}

function clean(callback) {
  async.series([
    killProcesses,
    function (next) {
      rimraf(scDir, next);
    }
  ], callback);
}

function getArchiveName() {
  var sc_version = getScVersion();
  return {
    darwin: "sc-" + sc_version + "-osx.zip",
    win32: "sc-" + sc_version + "-win32.zip"
  }[process.platform] || "sc-" + sc_version + "-linux.tar.gz";
}

function getScFolderName() {
  var sc_version = getScVersion();
  return {
    darwin: "sc-" + sc_version + "-osx",
    win32: "sc-" + sc_version + "-win32"
  }[process.platform] || "sc-" + sc_version + "-linux";
}

function getScBin() {
  return path.normalize(scDir + "/" + getScFolderName() + "/bin/sc");
}

// Make sure all processes have been closed
// when the script goes down
function closeOnProcessTermination() {
  if (cleanup_registered) {
    return;
  }
  cleanup_registered = true;
  process.on("exit", function () {
    logger("Shutting down");
    killProcesses();
  });
}

function unpackArchive(callback) {
  logger("Unzipping " + getArchiveName());
  setTimeout(function () {
    if (archivefile.match(/\.tar\.gz$/)) {
      exec("tar -xf '" + archivefile + "'", {cwd: scDir}, callback);
    } else {
      try {
        var zip = new AdmZip(archivefile);
        zip.extractAllTo(scDir, true);
      } catch (e) {
        return callback(new Error("ERROR Unzipping file: ", e.message));
      }
      callback(null);
    }
  }, 1000);
}

function setExecutePermissions(callback) {
  if (os.type() === "Windows_NT") {
    // No need to set permission for the executable on Windows
    callback(null);
  } else {
    // check current permissions
    fs.stat(getScBin(), function (err, stat) {
      if (err) { return callback(new Error("Couldn't read sc permissions: " + err.message)); }

      if (stat.mode.toString(8) !== "100755") {
        fs.chmod(getScBin(), 0755, function (err) {
          if (err) { return callback(new Error("Couldn't set permissions: " + err.message)); }
          callback(null);
        });
      } else {
        callback(null);
      }
    });
  }
}

function fetchAndUnpack(options, callback) {
  var req = https.request({
      host: "saucelabs.com",
      port: 443,
      path: "/downloads/" + getArchiveName()
    });

  function removeArchive() {
    try {
      logger("Removing " + archivefile);
      fs.unlinkSync(archivefile);
    } catch (e) {}
    _.defer(process.exit.bind(null, 0));
  }

  logger("Missing Sauce Connect local proxy, downloading dependency");
  logger("This will only happen once.");

  req.on("response", function (res) {
    var len = parseInt(res.headers["content-length"], 10),
      prettyLen = (len / (1024 * 1024) + "").substr(0, 4);

    logger("Downloading " + prettyLen + "MB");

    res.pipe(fs.createWriteStream(archivefile));

    // cleanup if the process gets interrupted.
    process.on("exit", removeArchive);
    process.on("SIGHUP", removeArchive);
    process.on("SIGINT", removeArchive);
    process.on("SIGTERM", removeArchive);

    function done(err) {
      if (err) { return callback(new Error("Couldn't unpack archive: " + err.message)); }
      // write queued data before closing the stream
      logger("Removing " + getArchiveName());
      fs.unlinkSync(archivefile);
      logger("Sauce Connect downloaded correctly");
      callback(null);
    }

    res.on("end", function () {
      unpackArchive(done);
    });

  });

  req.end();
}

function download(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = {};
  }
  logger = options.logger || function () {};

  if (!fs.existsSync(scDir)) {
    fs.mkdirSync(scDir);
  }

  function checkForArchive(next) {
    if (!exists(archivefile)) {
      fetchAndUnpack(options, next);
    } else {
      // the zip is being downloaded, poll for the binary to be ready
      async.doUntil(function wait(cb) {
        _.delay(cb, 1000);
      }, async.apply(exists, getScBin()), next);
    }
  }

  async.waterfall([
    function checkForBinary(next) {
      if (exists(getScBin())) {
        next(null);
      } else {
        checkForArchive(next);
      }
    },
    async.apply(setExecutePermissions),
  ], callback);
}

function run(options, callback) {
  callback = _.once(callback);

  function ready() {
    logger("Testing tunnel ready");
    closeOnProcessTermination();
    callback(null, child);
  }

  logger("Opening local tunnel using Sauce Connect");
  var child,
    watcher,
    readyfile,
    readyFileName = "sc-launcher-readyfile",
    args = processOptions(options),
    error,
    handleError = function (data) {
      if (data.indexOf("Not authorized") !== -1 && !error) {
        logger("Invalid Sauce Connect Credentials");
        error = new Error("Invalid Sauce Connect Credentials. " + data);
      } else if (data.indexOf("Sauce Connect could not establish a connection") !== -1) {
        logger("Sauce Connect API failure");
        error = new Error(data);
      } else if (data.indexOf("HTTP response code indicated failure") === -1) {
        // sc says the above before it says "Not authorized", but the following
        // Error: message is more useful
        error = new Error(data);
      }
      // error will be handled in the child.on("exit") handler
    },
    dataActions = {
      "Please wait for 'you may start your tests' to start your tests": function connecting() {
        logger("Creating tunnel with Sauce Labs");
      },
      //"you may start your tests": ready,
      "This version of Sauce Connect is outdated": function outdated() {

      },
      "Error: ": handleError,
      "Error bringing": handleError,
      "Sauce Connect could not establish a connection": handleError,
      "{\"error\":": handleError,
      "Goodbye.": function shutDown() {

      }
    };

  if (options.readyFileId) {
    readyFileName = readyFileName + "_" + options.readyFileId;
  }

  // Node v0.8 uses os.tmpDir(), v0.10 uses os.tmpdir()
  readyfile = path.normalize((os.tmpdir ? os.tmpdir() : os.tmpDir()) +
    "/" + readyFileName);

  args.push("--readyfile", readyfile);

  // Watching file as directory watching does not work on
  // all File Systems http://nodejs.org/api/fs.html#fs_caveats
  watcher = fs.watchFile(readyfile, {persistent: false}, function () {
    fs.exists(readyfile, function (exists) {
      if (exists) {
        logger("Detected sc ready");
        ready();
      }
    });
  });

  watcher.on("error", callback);

  logger("Starting sc with args: " + args
    .join(" ")
    .replace(/-u\ [^\ ]+\ /, "-u XXXXXXXX ")
    .replace(/[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}/i,
      "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX"));

  child = spawn(getScBin(), args);

  currentTunnel = child;

  child.stdout.on("data", function (data) {
    data = data.toString().trim();
    if (options.verbose && data !== "") {
      console.log(data);
    }

    _.each(dataActions, function (action, key) {
      if (data.indexOf(key) !== -1) {
        action(data);
        return false;
      }
    });
  });

  child.on("exit", function (code, signal) {
    currentTunnel = null;

    if (error) { // from handleError() above
      return callback(error);
    }

    var message = "Closing Sauce Connect Tunnel";
    if (code > 0) {
      message = "Could not start Sauce Connect. Exit code " + code +
        " signal: " + signal;
      callback(new Error(message));
    }
    logger(message);
  });

  child.close = function (closeCallback) {
    if (closeCallback) {
      child.on("close", function () {
        closeCallback();
      });
    }
    child.kill("SIGTERM");
  };
}

function downloadAndRun(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = {};
  }
  logger = options.logger || function () {};

  async.waterfall([
    async.apply(download, options),
    async.apply(run, options),
  ], callback);
}

archivefile = path.normalize(scDir + "/" + getArchiveName());

module.exports = downloadAndRun;
module.exports.download = download;
module.exports.kill = killProcesses;
module.exports.getArchiveName = getArchiveName;
module.exports.clean = clean;
