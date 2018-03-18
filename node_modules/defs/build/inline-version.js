const version = require("../package.json").version
const fs = require("fs");

const src = String(fs.readFileSync("es5/defs-cmd.js"));
const dst = src.replace('require("./package.json").version', JSON.stringify(version));
fs.writeFileSync("es5/defs-cmd.js", dst);
