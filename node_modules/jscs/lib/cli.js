/**
 * Command line implementation for JSCS.
 *
 * See documentation on exit codes in - https://github.com/jscs-dev/node-jscs/wiki/Exit-codes
 *
 * Common usage case is:
 *
 * ./node_modules/.bin/jscs file1 dir1 file2 dir2
 */

var Vow = require('vow');
var exit = require('exit');

var Checker = require('./checker');
var configFile = require('./cli-config');
var ConfigGenerator = require('./config/generator');

module.exports = function cli(program) {
    var reporter;
    var config;
    var checkerPromise;
    var defer = Vow.defer();
    var promise = defer.promise();
    var checker = new Checker();
    var args = program.args;
    var returnArgs = {
        checker: checker,
        reporter: program.reporter,
        promise: promise
    };

    function handleMaxErrors() {
        if (checker.maxErrorsExceeded()) {
            console.error('Too many errors... Increase `maxErrors` configuration option value to see more.');
        }
    }

    promise.always(function(status) {
        exit(status.valueOf());
    });

    try {
        config = configFile.load(program.config);
    } catch (e) {
        console.error('Config source is corrupted -', e.toString());
        defer.reject(5);

        return returnArgs;
    }

    /**
     * Trying to load config.
     * Custom config path can be specified using '-c' option.
     */
    if (!config && !program.preset && !program.autoConfigure) {
        if (program.config) {
            console.error('Configuration source', program.config, 'was not found.');
        } else {
            console.error('No configuration found. Add a .jscsrc file to your project root or use the -c option.');
        }

        defer.reject(4);

        return returnArgs;
    }

    if (!args.length && process.stdin.isTTY && typeof program.autoConfigure !== 'string') {
        console.error('No input files specified. Try option --help for usage information.');
        defer.reject(3);

        return returnArgs;
    }

    reporter = configFile.getReporter(program.reporter, program.colors);

    returnArgs.reporter = reporter.path;

    if (!reporter.writer) {
        console.error('Reporter "%s" does not exist.', program.reporter);
        returnArgs.reporter = reporter.path;
        defer.reject(6);

        return returnArgs;
    }

    if (!config) {
        config = {};
    }

    // To run autoconfigure over all errors in the path
    if (program.autoConfigure) {
        program.maxErrors = Infinity;
    }

    checker.getConfiguration().overrideFromCLI(program);
    checker.getConfiguration().registerDefaultRules();

    try {
        checker.configure(config);
    } catch (e) {
        console.error(e.message);
        defer.reject(1);

        return returnArgs;
    }
    if (program.autoConfigure) {
        var generator = new ConfigGenerator();

        generator
        .generate(program.autoConfigure)
        .then(function() {
            defer.resolve(0);
        }, function(error) {
            console.error('Configuration generation failed due to ', error);
            defer.reject(7);
        });

        return returnArgs;
    }

    // Handle usage like 'cat myfile.js | jscs' or 'jscs -''
    var usedDash = args[args.length - 1] === '-';
    if (!args.length || usedDash) {
        // So the dash doesn't register as a file
        if (usedDash) { args.length--; }

        if (program.fix) {
            return {
                promise: checker.fixStdin().then(function(result) {
                    process.stdout.write(result.output);
                }),
                checker: checker
            };
        }

        checkerPromise = checker.checkStdin().then(function(errors) {
            return [errors];
        });
    }

    // Processing specified files and dirs.
    if (args.length) {
        checkerPromise = Vow.all(args.map(checker.execute, checker)).then(function(results) {
            return [].concat.apply([], results);
        });
    }

    checkerPromise.then(function(errorsCollection) {
        reporter.writer(errorsCollection);
        handleMaxErrors();

        errorsCollection.forEach(function(errors) {
            if (!errors.isEmpty()) {
                defer.reject(2);
            }
        });

        defer.resolve(0);
    }).fail(function(e) {
        console.error(e.stack);
        defer.reject(1);
    });

    return returnArgs;
};
