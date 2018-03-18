#!/usr/bin/env node

var cli = require('./');

cli.spinner('Working..');

setTimeout(function () {
    cli.spinner('Working.. done!', true); //End the spinner
}, 3000);
