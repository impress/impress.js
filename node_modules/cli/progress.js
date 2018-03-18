#!/usr/bin/env node

var cli = require('./');

var i = 0, interval = setInterval(function () { 
    cli.progress(++i / 100); 
    if (i === 100) {
        clearInterval(interval);
        cli.ok('Finished!');
    }
}, 50);
