#!/bin/bash

zeroconfig=$(pwd);
tarball=$zeroconfig/$(npm pack | tail -n 1);

fileExists() {
  if ! ls $1 1> /dev/null 2>&1; then
    echo "ERROR: Undefined the file $1";
    exit 1;
  fi
}

createTmpFixture() {
  cwd=$(mktemp -d);
  cp -R $zeroconfig/test/fixtures/$1/* $cwd;
  cd $cwd;
  npm install $tarball --save-dev;
  npm install;
}

# zeroconfig-package-scripts build
createTmpFixture packages;
npm run package:build;
fileExists $cwd/dist/packages/a/index.js;
fileExists $cwd/dist/packages/a/package.json;
fileExists $cwd/dist/packages/a/readme.md;
fileExists $cwd/dist/packages/b/index.js;
fileExists $cwd/dist/packages/b/index.d.ts;
fileExists $cwd/dist/packages/b/package.json;
fileExists $cwd/dist/packages/b/readme.md;
fileExists $cwd/dist/packages/c/index.js;
fileExists $cwd/dist/packages/c/index.d.ts;
fileExists $cwd/dist/packages/c/package.json;
fileExists $cwd/dist/packages/c/readme.md;
fileExists $cwd/dist/packages/c/public/test.txt;

# zeroconfig-webapp-scripts build app
createTmpFixture simple-csr-ts
npm run app:build;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/browser/app.*.js;
fileExists $cwd/dist/app/browser/favicon.ico
fileExists $cwd/dist/app/browser/index.html
fileExists $cwd/dist/app/browser/manifest.json
fileExists $cwd/dist/app/browser/vendor.*.js
