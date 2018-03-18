/**
 * @module vow-fs
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 * @version 0.3.6
 * @license
 * Dual licensed under the MIT and GPL licenses:
 *   * http://www.opensource.org/licenses/mit-license.php
 *   * http://www.gnu.org/licenses/gpl.html
 */

var vow = require('vow'),
    Queue = require('vow-queue'),
    openFilesQueue = new Queue(),
    fs = require('fs'),
    path = require('path'),
    os = require('os'),
    uuid = require('uuid'),
    glob = require('glob'),
    slice = Array.prototype.slice,
    promisify = function(nodeFn) {
        return function() {
            var defer = vow.defer(),
                args = slice.call(arguments);
            args.push(function(err) {
                err? defer.reject(err) : defer.resolve(arguments[1]);
            });
            try {
                nodeFn.apply(fs, args);
            }
            catch(err) {
                defer.reject(err);
            }
            return defer.promise();
        };
    },
    tmpDir = os.tmpdir || os.tmpDir || function() { return '/tmp'; },
    makeDir = promisify(fs.mkdir),
    removeDir = promisify(fs.rmdir),
    lstat = promisify(fs.lstat),
    emfileTimeout = 1,
    emfileFixWrapper = function(method, weight) {
        var wrapper = function() {
                var callArgs = arguments;
                return openFilesQueue.enqueue(function() {
                    return method.apply(vfs, callArgs).then(
                       function(res) {
                           emfileTimeout = Math.max(1, emfileTimeout / 2);
                           return res;
                       },
                       function(err) {
                           if(err.code === 'EMFILE') {
                               emfileTimeout++;
                               return vow.delay(null, emfileTimeout).then(function() {
                                   return wrapper.apply(vfs, callArgs);
                               });
                           }
                           else {
                               throw err;
                           }
                       });
                }, weight);
           };
           return wrapper;
    },
    undef;

var vfs = module.exports = {
    /**
     * Reads file by given path
     * @param {String} path
     * @param {String} [encoding]
     * @returns {vow:Promise}
     */
    read : emfileFixWrapper(promisify(fs.readFile)),

    /**
     * Writes data to file by given path
     * @param {String} path
     * @param {String|Buffer} data
     * @param {String} [encoding]
     * @returns {vow:Promise}
     */
    write : emfileFixWrapper(promisify(fs.writeFile)),

    /**
     * Appends data to file by given path
     * @param {String} path
     * @param {String|Buffer} data
     * @param {String} [encoding]
     * @returns {vow:Promise}
     */
    append : emfileFixWrapper(promisify(fs.appendFile)),

    /**
     * Removes file at given path
     * @param {String} pathToRemove
     * @returns {vow:Promise}
     */
    remove : promisify(fs.unlink),

    /**
     * Copies file from sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {vow:Promise}
     */
    copy : emfileFixWrapper(function(sourcePath, targetPath) {
        return this.isFile(sourcePath).then(function(isFile) {
            if(!isFile) {
                var err = Error();
                err.errno = 28;
                err.code = 'EISDIR';
                err.path = sourcePath;
                throw err;
            }

            var defer = vow.defer(),
                sourceStream = fs.createReadStream(sourcePath),
                errFn = function(err) {
                    defer.reject(err);
                };

            sourceStream
                .on('error', errFn)
                .on('open', function() {
                    var targetStream = fs.createWriteStream(targetPath);
                    sourceStream.pipe(
                        targetStream
                            .on('error', errFn)
                            .on('close', function() {
                                defer.resolve();
                            }));
                });

            return defer.promise();
        });
    }, 2),

    /**
     * Moves from sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {vow:Promise}
     */
    move : promisify(fs.rename),

    /**
     * Extracts fs.Stats about a given path
     * @param {String} path
     * @returns {vow:Promise}
     */
    stat : promisify(fs.stat),

    /**
     * Tests whether or not the given path exists
     * @param {String} path
     * @returns {vow:Promise}
     */
    exists : fs.exists?
        function(path) {
            var defer = vow.defer();
            fs.exists(path, function(exists) {
                defer.resolve(exists);
            });
            return defer.promise();
        } :
        function(path) {
            var defer = vow.defer();
            fs.stat(path, function(err) {
                defer.resolve(!err);
            });
            return defer.promise();
        },

    /**
     * Creates a hard link from the sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @returns {vow:Promise}
     */
    link : promisify(fs.link),

    /**
     * Creates a relative symbolic link from the sourcePath to targetPath
     * @param {String} sourcePath
     * @param {String} targetPath
     * @param {String} [type=file] can be either 'dir', 'file', or 'junction'
     * @returns {vow:Promise}
     */
    symLink : promisify(fs.symlink),

    /**
     * Changes the owner for a given path using Unix user-id and group-id numbers
     * @param {String} path
     * @param uid
     * @param gid
     * @returns {vow:Promise}
     */
    chown : promisify(fs.chown),

    /**
     * Changes the Unix mode for a path. Returns a promise
     * @param {String} path
     * @param mode
     * @returns {vow:Promise}
     */
    chmod : promisify(fs.chmod),

    /**
     * Normalizes a given path to absolute path
     * @param {String} path
     * @returns {vow:Promise}
     */
    absolute : promisify(fs.realpath),

    /**
     * Checks whether the given path is a file
     * @param {String} path
     * @returns {vow:Promise}
     */
    isFile : function(path) {
        return this.stat(path).then(function(stats) {
            return stats.isFile();
        });
    },

    /**
     * Checks whether the given path is a directory
     * @param {String} path
     * @returns {vow:Promise}
     */
    isDir : function(path) {
        return this.stat(path).then(function(stats) {
            return stats.isDirectory();
        });
    },

    /**
     * Checks whether the given path is a socket
     * @param {String} path
     * @returns {vow:Promise}
     */
    isSocket : function(path) {
        return this.stat(path).then(function(stats) {
            return stats.isSocket();
        });
    },

    /**
     * Checks whether the given path is a symbolic link
     * @param {String} path
     * @returns {vow:Promise}
     */
    isSymLink : function(path) {
        return lstat(path).then(function(stats) {
            return stats.isSymbolicLink();
        });
    },

    /**
     * Makes a temporary file
     * @param {Object} options
     * @param {String} [options.prefix]
     * @param {String} [options.dir=os.tmpdir()]
     * @param {String} [options.ext=tmp]
     * @returns {vow:Promise}
     */
    makeTmpFile : function(options) {
        options || (options = {});

        var filePath = path.join(
                options.dir || tmpDir(),
                (options.prefix || '') + uuid.v4() + (options.ext || '.tmp'));

        return vfs.write(filePath, '').then(function() {
            return filePath;
        });
    },

    /**
     * Reads the contents of a directory by given path
     * @param {String} path
     * @returns {vow:Promise}
     */
    listDir : emfileFixWrapper(promisify(fs.readdir)),

    /**
     * Makes a directory at a given path, recursively creating any branches that doesn't exist
     * @param {String} dirPath
     * @param [mode=0777]
     * @param [failIfExist=false]
     * @returns {vow:Promise}
     */
    makeDir : function(dirPath, mode, failIfExist) {
        if(typeof mode === 'boolean') {
            failIfExist = mode;
            mode = undef;
        }

        var dirName = path.dirname(dirPath),
            onFailed = function(e) {
                if(e.code !== 'EEXIST' || failIfExist) {
                    throw e;
                }

                return vfs.isDir(dirPath).then(function(isDir) {
                    if(!isDir) {
                        throw e;
                    }
                });
            };

        return vfs.exists(dirName).then(function(exists) {
            if(exists) {
                return makeDir(dirPath, mode).fail(onFailed);
            }
            else {
                failIfExist = false;
                return vfs.makeDir(dirName, mode).then(function() {
                    return makeDir(dirPath, mode).fail(onFailed);
                });
            }
        });
    },

    /**
     * Removes directory
     * @param {String} dirPath
     * @returns {vow:Promise}
     */
    removeDir : function(dirPath) {
        return vfs.listDir(dirPath)
            .then(function(list) {
                return list.length && vow.all(
                    list.map(function(file) {
                        var fullPath = path.join(dirPath, file);
                        return vfs.isFile(fullPath).then(function(isFile) {
                            return isFile?
                                vfs.remove(fullPath) :
                                vfs.removeDir(fullPath);
                        });
                    }));
            })
            .then(function() {
                return removeDir(dirPath);
            });
    },

    /**
     * Matches files using the patterns, see https://github.com/isaacs/node-glob for details
     * @param {String} pattern to be matched
     * @param {Object} [options] options
     * @returns {vow:Promise}
     */
    glob : promisify(glob),

    options : function(opts) {
        if(typeof opts.openFileLimit !== 'undefined') {
            openFilesQueue.setParams({ weightLimit : opts.openFileLimit });
        }
    }
};

openFilesQueue.start();
