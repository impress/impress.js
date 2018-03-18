var resolve = require('resolve');

var cli;
try {
    cli = require(
        resolve.sync('jscs/lib/cli', { basedir: process.cwd() })
    );
} catch (e) {
    cli = require('./cli');
}

module.exports = cli;
