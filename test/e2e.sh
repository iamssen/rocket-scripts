#!/bin/bash

# VARIABLES
# ==================================================----------------------------------
ROOT=$(pwd);
VERDACCIO_PORT=4873;
LOCAL_REGISTRY_URL="http://localhost:$VERDACCIO_PORT/";

echo "ROOT=$ROOT";
echo "LOCAL_REGISTRY_URL=$LOCAL_REGISTRY_URL";


# SETUP LOCAL REGISTRY
# ==================================================----------------------------------
function stopLocalRegistry {
  kill -9 $(lsof -t -i:$VERDACCIO_PORT); # kill verdaccio
  rm -rf "$ROOT/test/storage"; # clean verdaccio storage
}

function cleanup {
  stopLocalRegistry;
}

function handleError {
  echo "$(basename "$0"): ERROR! An error was encountered executing line $1." 1>&2;
  echo 'Exiting with error.' 1>&2;
  cleanup;
  exit 1;
}

function handleExit {
  echo 'Exiting without error.' 1>&2;
  cleanup;
  exit;
}

trap 'handleError $LINE0 $BASH_COMMAND' ERR;
trap 'handleExit' SIGQUIT SIGTERM SIGINT SIGHUP;

if [[ -d "$ROOT/test/storage" ]]; then
  tree "$ROOT/test/storage";
  rm -rf "$ROOT/test/storage";
fi;

VERDACCIO_REGISTRY_LOG=$(mktemp);
echo "VERDACCIO_REGISTRY_LOG=$VERDACCIO_REGISTRY_LOG";

(npx verdaccio@latest --config "$ROOT/test/verdaccio.yaml" --listen $VERDACCIO_PORT &>"$VERDACCIO_REGISTRY_LOG" &); # start verdaccio with log
grep -q 'http address' <(tail -f "$VERDACCIO_REGISTRY_LOG"); # wating verdaccio


# LOCAL PUBLISH
# ==================================================----------------------------------
echo "PUNCH=$(which rocket-punch)";
npx rocket-punch publish --skip-selection --tag e2e --registry "$LOCAL_REGISTRY_URL";

# TEST
# ==================================================----------------------------------
fileExists() {
  if ! ls "$1" 1> /dev/null 2>&1; then
    echo "ERROR: Undefined the file $1";
    exit 1;
  fi
}

createTmpFixture() {
  TEMP=$(mktemp -d);
  cp -rv "$ROOT/test/fixtures/$1"/* "$TEMP";
  cp -rv "$ROOT/test/fixtures/$1"/.[^.]* "$TEMP";
  cd "$TEMP" || exit 1;
  echo "TEMP=$TEMP";
  echo "PWD=$(pwd)";
  npm install @rocket-scripts/cli@e2e --save-dev --registry "$LOCAL_REGISTRY_URL";
  npm install;
}

# should build packages normally
#createTmpFixture packages/basic;
#npm run package:build;
#
#fileExists "$TEMP/dist/packages/a/README.md";
#fileExists "$TEMP/dist/packages/a/index.js";
#fileExists "$TEMP/dist/packages/a/index.d.ts";
#fileExists "$TEMP/dist/packages/a/package.json";
#
#fileExists "$TEMP/dist/packages/b/README.md";
#fileExists "$TEMP/dist/packages/b/index.js";
#fileExists "$TEMP/dist/packages/b/index.d.ts";
#fileExists "$TEMP/dist/packages/b/package.json";
#
#fileExists "$TEMP/dist/packages/c/README.md";
#fileExists "$TEMP/dist/packages/a/index.js";
#fileExists "$TEMP/dist/packages/c/index.d.ts";
#fileExists "$TEMP/dist/packages/c/package.json";
#fileExists "$TEMP/dist/packages/c/public/test.txt";

# TODO should build packages with a .env.ts config file
# TODO should build packages with a .package.json.ts config file
# TODO should build packages with a .build.ts config file





# OLD TEST
# ==================================================----------------------------------

# zeroconfig-package-scripts build
# createTmpFixture simple-packages;
# npm run package:build;
# fileExists "$TEMP"/dist/packages/iamssen-test-component/index.js;
# fileExists "$TEMP"/dist/packages/iamssen-test-component/index.d.ts;
# fileExists "$TEMP"/dist/packages/iamssen-test-component/package.json;
# fileExists "$TEMP"/dist/packages/iamssen-test-component/readme.md;

# createTmpFixture packages;
# npm run package:build;
# fileExists "$TEMP"/dist/packages/a/index.js;
# fileExists "$TEMP"/dist/packages/a/package.json;
# fileExists "$TEMP"/dist/packages/a/readme.md;
# fileExists "$TEMP"/dist/packages/b/index.js;
# fileExists "$TEMP"/dist/packages/b/index.d.ts;
# fileExists "$TEMP"/dist/packages/b/package.json;
# fileExists "$TEMP"/dist/packages/b/readme.md;
# fileExists "$TEMP"/dist/packages/c/index.js;
# fileExists "$TEMP"/dist/packages/c/index.d.ts;
# fileExists "$TEMP"/dist/packages/c/package.json;
# fileExists "$TEMP"/dist/packages/c/readme.md;
# fileExists "$TEMP"/dist/packages/c/public/test.txt;

# createTmpFixture packages-group;
# npm run package:build;
# fileExists "$TEMP"/dist/packages/a/index.js;
# fileExists "$TEMP"/dist/packages/a/package.json;
# fileExists "$TEMP"/dist/packages/a/readme.md;
# fileExists "$TEMP"/dist/packages/@group/b/index.js;
# fileExists "$TEMP"/dist/packages/@group/b/index.d.ts;
# fileExists "$TEMP"/dist/packages/@group/b/package.json;
# fileExists "$TEMP"/dist/packages/@group/b/readme.md;
# fileExists "$TEMP"/dist/packages/@group/c/index.js;
# fileExists "$TEMP"/dist/packages/@group/c/index.d.ts;
# fileExists "$TEMP"/dist/packages/@group/c/package.json;
# fileExists "$TEMP"/dist/packages/@group/c/readme.md;
# fileExists "$TEMP"/dist/packages/@group/c/public/test.txt;

# # zeroconfig-webapp-scripts build app
# createTmpFixture simple-csr-js;
# npm run build;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/index.html;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/app.*.js;
# fileExists "$TEMP"/dist/app/browser/vendor.*.js;

# createTmpFixture simple-csr-ts;
# npm run build;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/index.html;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/app.*.js;
# fileExists "$TEMP"/dist/app/browser/vendor.*.js;

# createTmpFixture simple-ssr-js;
# npm run build;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/loadable-stats.json;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/app.*.js;
# fileExists "$TEMP"/dist/app/browser/vendor.*.js;
# fileExists "$TEMP"/dist/app/server/index.js;
# fileExists "$TEMP"/dist/app/server/package.json;

# createTmpFixture simple-ssr-ts;
# npm run build;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/loadable-stats.json;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/app.*.js;
# fileExists "$TEMP"/dist/app/browser/vendor.*.js;
# fileExists "$TEMP"/dist/app/server/index.js;
# fileExists "$TEMP"/dist/app/server/package.json;

# createTmpFixture custom;
# npm run build;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/loadable-stats.json;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/app.*.js;
# fileExists "$TEMP"/dist/app/browser/vendor.*.js;
# fileExists "$TEMP"/dist/app/server/index.js;
# fileExists "$TEMP"/dist/app/server/package.json;

# # zeroconfig-webapp-scripts build app ---
# createTmpFixture simple-csr-ts;
# npm run app:build --- --mode development;
# fileExists "$TEMP"/.dev/app/size-report.html;
# fileExists "$TEMP"/.dev/app/browser/favicon.ico;
# fileExists "$TEMP"/.dev/app/browser/index.html;
# fileExists "$TEMP"/.dev/app/browser/manifest.json;
# fileExists "$TEMP"/.dev/app/browser/app.*.js;
# fileExists "$TEMP"/.dev/app/browser/vendor.*.js;

# output=$(mktemp -d);
# createTmpFixture simple-csr-ts;
# npm run app:build --- --output "$output";
# fileExists "$output"/size-report.html;
# fileExists "$output"/browser/favicon.ico;
# fileExists "$output"/browser/index.html;
# fileExists "$output"/browser/manifest.json;
# fileExists "$output"/browser/app.*.js;
# fileExists "$output"/browser/vendor.*.js;

# createTmpFixture simple-csr-ts;
# npm run app:build --- --app-file-name myapp --vendor-file-name common;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/index.html;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/myapp.*.js;
# fileExists "$TEMP"/dist/app/browser/common.*.js;

# createTmpFixture simple-csr-ts;
# npm run app:build --- --chunk-path chunks/path;
# fileExists "$TEMP"/dist/app/size-report.html;
# fileExists "$TEMP"/dist/app/browser/favicon.ico;
# fileExists "$TEMP"/dist/app/browser/index.html;
# fileExists "$TEMP"/dist/app/browser/manifest.json;
# fileExists "$TEMP"/dist/app/browser/chunks/path/app.*.js;
# fileExists "$TEMP"/dist/app/browser/chunks/path/vendor.*.js;

# TODO *.worker test
# TODO loadable-components code split test


# EXIT
# ==================================================----------------------------------
cleanup;