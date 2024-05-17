#!/usr/bin/env bash

# Copy files required for package publishing
# TODO
# cp package.json dist/src/ && cp README.md dist/src/ && cp .npmignore dist/src/

# Replace guards (used to prevent publishing from the root directory)
# TODO
# sed -i.bak 's/exit -1/exit 0/' "dist/src/package.json" && rm "dist/src/package.json.bak"
