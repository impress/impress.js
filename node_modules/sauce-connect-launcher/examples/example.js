
var sauceConnectLauncher = require('../lib/sauce-connect-launcher');

sauceConnectLauncher({
	username: 'bermi',
	accessKey: '12345678-1234-1234-1234-1234567890ab',
	verbose: false,
	logger: console.log
}, function (err, sauceConnectProcess) {
	console.log("Started Sauce Connect Process");
	sauceConnectProcess.close(function () {
		console.log("Closed Sauce Connect process");
	});
});
