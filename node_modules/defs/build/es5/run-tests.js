var fs = require("fs");
var fmt = require("simple-fmt");
var exec = require("child_process").exec;
var diff = require("diff");

function slurp(filename) {
    return fs.existsSync(filename) ? String(fs.readFileSync(filename)) : "";
}

var pathToTests = (fs.existsSync("tests") ? "tests" : "../../tests");

var tests = fs.readdirSync(pathToTests).filter(function(filename) {
    return !/-out\.js$/.test(filename) && !/-stderr$/.test(filename);
});

function run(test) {
    function diffOutput(correct, got, name) {
        if (got !== correct) {
            var patch = diff.createPatch(name, correct, got);
            process.stdout.write(patch);
            process.stdout.write("\n\n");
        }
    }

    var noSuffix = test.slice(0, -3);
    exec(fmt("{0} {1} defs-cmd {2}/{3}", NODE, FLAG, pathToTests, test), function(error, stdout, stderr) {
        stderr = stderr || "";
        stdout = stdout || "";
        var expectedStderr = slurp(fmt("{0}/{1}-stderr", pathToTests, noSuffix));
        var expectedStdout = slurp(fmt("{0}/{1}-out.js", pathToTests, noSuffix));

        var pass = (stderr === expectedStderr && stdout === expectedStdout);

        if (!pass) {
            console.log(fmt("FAILED test {0}", test));
        }
        diffOutput(expectedStdout, stdout, fmt("{0}-out.js", test));
        diffOutput(expectedStderr, stderr, fmt("{0}-stderr", test));
    });
}

var NODE = process.argv[0];
var FLAG = (process.argv[2] === "es5" ? "" : "--harmony");
tests.forEach(run);
