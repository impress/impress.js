#!/bin/sh
type browserify >/dev/null 2>&1 || {
  echo >&2 "error: browserify not found in path"
  echo >&2 "  try npm install -g browserify"; exit 1;
}
echo "building before creating bundle"
./build.sh
echo "creating defs_bundle.js via browserify"
rm -rf browser
mkdir browser
cp index.html browser/
cd es5
browserify -r "./defs-main" > ../browser/defs_bundle.js
echo "done bundle"
