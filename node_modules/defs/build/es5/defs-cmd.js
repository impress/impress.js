"use strict";

var fs = require("fs");
var fmt = require("simple-fmt");
var tryor = require("tryor");
var defs = require("./defs-main");
var version = "1.1.1";
var yargs = require("yargs")
    .options("config", {});
var argv = yargs.argv;

if (!argv._.length) {
    var usage = [
        "defs v" + version + "",
        "",
        "Usage: defs OPTIONS <file>",
        "",
        "Options: ",
        "  --config  use specified defs-config.js instead of searching for it",
    ].join("\n");
    console.error(usage);
    process.exit(-1);
}
var filename = argv._[0];

if (!fs.existsSync(filename)) {
    console.error("error: file not found <%s>", filename);
    process.exit(-1);
}

var src = String(fs.readFileSync(filename));

var config = findAndReadConfig();

var ret = defs(src, config);
if (ret.errors) {
    process.stderr.write(ret.errors.join("\n"));
    process.stderr.write("\n");
    process.exit(-1);
}

if (config.stats) {
    process.stdout.write(ret.stats.toString());
    process.exit(0);
}
if (ret.ast) {
    process.stdout.write(JSON.stringify(ret.ast, null, 4));
}
if (ret.src) {
    process.stdout.write(ret.src);
}

function findAndReadConfig() {
    if (argv.config) {
        var config = tryor(function() { return String(fs.readFileSync(argv.config)) }, null);
        if (!config) {
            console.error("error: config file not found <%s>", argv.config);
            process.exit(-1);
        }
        var json = tryor(function() { return JSON.parse(config) }, null);
        if (!json) {
            console.error("error: config file is not valid JSON <%s>", argv.config);
            process.exit(-1);
        }
        return json;
    }

    var path = "";
    var filename = "defs-config.json";
    var filenamePath = null;

    while (fs.existsSync(path || ".")) {
        filenamePath = path + filename;
        if (fs.existsSync(filenamePath)) {
            var config$0 = tryor(function() {
                return JSON.parse(String(fs.readFileSync(filenamePath)));
            }, null);
            if (config$0 === null) {
                console.error("error: config file is not valid JSON <%s>", filenamePath);
                process.exit(-1);
            }
            return config$0;
        }

        path = "../" + path;
    }

    return {};
}