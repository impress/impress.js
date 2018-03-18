module.exports = (process.env.COVERAGE ?
  require("./lib-cov/sauce-connect-launcher") :
  require("./lib/sauce-connect-launcher"));
