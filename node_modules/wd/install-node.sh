#!/bin/bash
set -e
git clone https://github.com/visionmedia/n.git /tmp/n
cd /tmp/n
make install
n stable
