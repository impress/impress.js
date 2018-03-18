// Only download on install when requested.
if (!process.env.SAUCE_CONNECT_DOWNLOAD_ON_INSTALL) {
  return;
}

var sauceConnectLauncher = require("../");

sauceConnectLauncher.download({
  logger: console.log.bind(console),
}, function (err) {
  if (err) {
    console.log("Failed to download sauce connect binary:", err);
    console.log("sauce-connect-launcher will attempt to re-download " +
      "next time it is run.");
  }
});
