#!/bin/sh
cd ..
rm -rf build/npm
mkdir build/npm
git archive master -o build/npm/defs.tar --prefix=defs/
cd build/npm
tar xf defs.tar && rm defs.tar
cd defs/build
./build.sh
cd ../..
tar czf defs.tgz defs && rm -rf defs
