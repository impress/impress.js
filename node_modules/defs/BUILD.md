# Build instructions
defs is written in constlet style itself. There is an optional build step
where it transpiles itself so that it can execute without the `--harmony`
flag passed to node. There's another where Browserify bundles it up with
its dependencies in a single JS file so that it can run in a browser.

The git repository contains the original constlet style source code as well
as the build scripts. It does not contain build artefacts (transpiled or
bundled source).

The build scripts populates the `build/es5` and `build/browser` directories.
The NPM package contains a snapshot of the git repository at the time as
well as `build/es5`. `package.json` refers to the transpiled version in
`build/es5`, so there's no need to execute node with `--harmony` when
running a `npm -g` installed `defs` from the command line or when doing a
`require("defs")` of the same.

If you clone the git repository then don't forget to also `npm install` the
dependencies (see `package.json`).

If you want to run defs in its original form (rather than transpiled), for 
instance if you're hacking on it, then just run the tool via `defs-harmony`
(not a NPM exported binary but check the package root) or include it as a
library via `require("defs.js/defs-main")`. This applies to a git
clone just as well as the NPM package.

`run-tests.js` is the test runner. It executes a fresh node/defs process
for every test case. Run it on the original source via
`node --harmony run-tests.js` - meaning the test-runner is executed in
`--harmony` mode (because the runner is constlet style) and the child
processes are too (because defs is constlet style). Run it on the
transpiled source (i.e. `build/es5`) via `node run-tests.js es5` - meaning
the test-runner and the child processes are executed in regular es5 (all
have been transpiled). The tests are run automatically in the build scripts.

To build, `cd build` then run `./build.sh` for self transpilation and 
`./bundle.sh` to create a (self transpiled) browser bundle using Browserify.
Open up `build/browser/index.html` in your favorite browser to test the
latter. `./clean.sh` removes the build artefacts.

I use `prepare.sh` to prepare a release tarball for NPM publishing.

Happy hacking!
