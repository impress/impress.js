"use strict";

const fs = require("fs");
const fmt = require("simple-fmt");
const tryor = require("tryor");
const defs = require("./defs-main");
const version = require("./package.json").version;
const yargs = require("yargs")
    .options("config", {});
const argv = yargs.argv;

if (!argv._.length) {
    const usage = [
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
const filename = argv._[0];

if (!fs.existsSync(filename)) {
    console.error("error: file not found <%s>", filename);
    process.exit(-1);
}

const src = String(fs.readFileSync(filename));

const config = findAndReadConfig();

const ret = defs(src, config);
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
        const config = tryor(function() { return String(fs.readFileSync(argv.config)) }, null);
        if (!config) {
            console.error("error: config file not found <%s>", argv.config);
            process.exit(-1);
        }
        const json = tryor(function() { return JSON.parse(config) }, null);
        if (!json) {
            console.error("error: config file is not valid JSON <%s>", argv.config);
            process.exit(-1);
        }
        return json;
    }

    let path = "";
    let filename = "defs-config.json";
    let filenamePath = null;

    while (fs.existsSync(path || ".")) {
        filenamePath = path + filename;
        if (fs.existsSync(filenamePath)) {
            const config = tryor(function() {
                return JSON.parse(String(fs.readFileSync(filenamePath)));
            }, null);
            if (config === null) {
                console.error("error: config file is not valid JSON <%s>", filenamePath);
                process.exit(-1);
            }
            return config;
        }

        path = "../" + path;
    }

    return {};
}