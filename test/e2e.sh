#!/bin/bash

# VARIABLES
# ==================================================----------------------------------
ROOT=$(pwd);
VERDACCIO_PORT=4873;
LOCAL_REGISTRY_URL="http://localhost:$VERDACCIO_PORT/";
TEST_SERVER_PORT=19999;

echo "ROOT: $ROOT";
echo "LOCAL_REGISTRY_URL: $LOCAL_REGISTRY_URL";


# SETUP LOCAL REGISTRY
# ==================================================----------------------------------
function stopTestServer() {
  PID=$(lsof -t -i:$TEST_SERVER_PORT); # kill test server
  if [[ $PID =~ ^[0-9]+$ ]] ; then
    kill -9 "$PID";
  fi
}

function stopLocalRegistry {
  PID=$(lsof -t -i:$VERDACCIO_PORT); # kill verdaccio
  if [[ $PID =~ ^[0-9]+$ ]] ; then
    kill -9 "$PID";
  fi
  rm -rf "$ROOT/test/storage"; # clean verdaccio storage
}

function cleanup {
  stopLocalRegistry;
  stopTestServer;
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
echo "VERDACCIO_REGISTRY_LOG: $VERDACCIO_REGISTRY_LOG";

(npx verdaccio@latest --config "$ROOT/test/verdaccio.yaml" --listen $VERDACCIO_PORT &>"$VERDACCIO_REGISTRY_LOG" &); # start verdaccio with log
grep -q 'http address' <(tail -f "$VERDACCIO_REGISTRY_LOG"); # wating verdaccio


# LOCAL PUBLISH
# ==================================================----------------------------------
echo "PUNCH: $(which rocket-punch)";
npx rocket-punch publish --skip-selection --tag e2e --registry "$LOCAL_REGISTRY_URL";

# TEST
# ==================================================----------------------------------
function fileExists() {
  if ! ls "$1" 1> /dev/null 2>&1; then
    echo "ERROR: Undefined the file $1";
    handleError;
  fi
}

function is200() {
  STATUS=$(curl -o /dev/null -w "%{http_code}" "$1");

  if [[ $STATUS -ne 200 ]]; then
    echo "ERROR: the http status of $1 is not the 200 $STATUS";
    handleError;
  fi
}

function createTmpFixture() {
  TEMP=$(mktemp -d);
  cp -rv "$ROOT/test/fixtures/$1"/* "$TEMP";
  cp -rv "$ROOT/test/fixtures/$1"/.[^.]* "$TEMP";
  cd "$TEMP" || exit 1;
  echo "TEMP: $TEMP";
  echo "PWD: $(pwd)";
  npm install;
  npm install rocket-scripts@e2e --save-dev --registry "$LOCAL_REGISTRY_URL";
}

# web build


# web start

createTmpFixture web/start;
(npx rocket-scripts web/start app --port $TEST_SERVER_PORT &> log.txt &);
sleep 15s;
is200 "http://localhost:$TEST_SERVER_PORT";
is200 "http://localhost:$TEST_SERVER_PORT/manifest.json";
is200 "http://localhost:$TEST_SERVER_PORT/favicon.ico";
stopTestServer;

createTmpFixture web/static-file-directories;
(npx rocket-scripts web/start app --port $TEST_SERVER_PORT --static-file-directories "{cwd}/static {cwd}/public" &> log.txt &);
sleep 15s;
is200 "http://localhost:$TEST_SERVER_PORT";
is200 "http://localhost:$TEST_SERVER_PORT/manifest.json";
is200 "http://localhost:$TEST_SERVER_PORT/favicon.ico";
is200 "http://localhost:$TEST_SERVER_PORT/hello.json";
stopTestServer;

createTmpFixture web/github-proxy;
(npx rocket-scripts web/start app --port $TEST_SERVER_PORT &> log.txt &);
sleep 15s;
is200 "http://localhost:$TEST_SERVER_PORT";
is200 "http://localhost:$TEST_SERVER_PORT/manifest.json";
is200 "http://localhost:$TEST_SERVER_PORT/favicon.ico";
is200 "http://localhost:$TEST_SERVER_PORT/api/frontend-fixtures/package.json";
stopTestServer;


# OLD TEST
# ==================================================----------------------------------

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