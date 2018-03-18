#!/bin/sh
echo "beginning defs self-build"
rm -rf es5
mkdir es5

declare -a files=(defs-main.js defs-cmd.js error.js options.js run-tests.js scope.js stats.js)
for i in ${files[@]}
do
  echo "building $i"
  node --harmony ../defs-cmd ../$i > es5/$i
done

cp defs es5/

echo "hard-coding version"
node --harmony inline-version.js

cp -r ../jshint_globals es5/

cd es5

echo "running tests (in es5 mode i.e. without --harmony)"
/usr/bin/env node run-tests.js es5
echo "done self-build"
