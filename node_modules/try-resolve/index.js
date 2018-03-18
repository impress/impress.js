var Module = require("module");

var resolve = module.exports = function (loc, _require) {
  try {
    return (_require || require).resolve(loc);
  } catch (err) {
    return null;
  }
};

var relativeMod;

resolve.relative = function (loc) {
  // we're in the browser, probably
  if (typeof Module === "object") return null;

  if (!relativeMod) {
    relativeMod = new Module;
    relativeMod.paths = Module._nodeModulePaths(process.cwd());
  }

  try {
    return Module._resolveFilename(loc, relativeMod);
  } catch (err) {
    return null;
  }
};
