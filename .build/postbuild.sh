#!/usr/bin/env bash

cp package.json dist/src/ && cp README.md dist/src/
sed -i "" "s/exit -1/exit 0/" "dist/src/package.json"
