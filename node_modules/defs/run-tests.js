const fs = require("fs");
const fmt = require("simple-fmt");
const exec = require("child_process").exec;
const diff = require("diff");

function slurp(filename) {
    return fs.existsSync(filename) ? String(fs.readFileSync(filename)) : "";
}

const pathToTests = (fs.existsSync("tests") ? "tests" : "../../tests");

const tests = fs.readdirSync(pathToTests).filter(function(filename) {
    return !/-out\.js$/.test(filename) && !/-stderr$/.test(filename);
});

function run(test) {
    function diffOutput(correct, got, name) {
        if (got !== correct) {
            const patch = diff.createPatch(name, correct, got);
            process.stdout.write(patch);
            process.stdout.write("\n\n");
        }
    }

    const noSuffix = test.slice(0, -3);
    exec(fmt("{0} {1} defs-cmd {2}/{3}", NODE, FLAG, pathToTests, test), function(error, stdout, stderr) {
        stderr = stderr || "";
        stdout = stdout || "";
        const expectedStderr = slurp(fmt("{0}/{1}-stderr", pathToTests, noSuffix));
        const expectedStdout = slurp(fmt("{0}/{1}-out.js", pathToTests, noSuffix));

        const pass = (stderr === expectedStderr && stdout === expectedStdout);

        if (!pass) {
            console.log(fmt("FAILED test {0}", test));
        }
        diffOutput(expectedStdout, stdout, fmt("{0}-out.js", test));
        diffOutput(expectedStderr, stderr, fmt("{0}-stderr", test));
    });
}

const NODE = process.argv[0];
const FLAG = (process.argv[2] === "es5" ? "" : "--harmony");
tests.forEach(run);
