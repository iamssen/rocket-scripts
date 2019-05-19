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
createTmpFixture simple-packages;
npm run package:build;
fileExists $cwd/dist/packages/iamssen-test-component/index.js;
fileExists $cwd/dist/packages/iamssen-test-component/index.d.ts;
fileExists $cwd/dist/packages/iamssen-test-component/package.json;
fileExists $cwd/dist/packages/iamssen-test-component/readme.md;

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

createTmpFixture packages-group;
npm run package:build;
fileExists $cwd/dist/packages/a/index.js;
fileExists $cwd/dist/packages/a/package.json;
fileExists $cwd/dist/packages/a/readme.md;
fileExists $cwd/dist/packages/@group/b/index.js;
fileExists $cwd/dist/packages/@group/b/index.d.ts;
fileExists $cwd/dist/packages/@group/b/package.json;
fileExists $cwd/dist/packages/@group/b/readme.md;
fileExists $cwd/dist/packages/@group/c/index.js;
fileExists $cwd/dist/packages/@group/c/index.d.ts;
fileExists $cwd/dist/packages/@group/c/package.json;
fileExists $cwd/dist/packages/@group/c/readme.md;
fileExists $cwd/dist/packages/@group/c/public/test.txt;

# zeroconfig-webapp-scripts build app
createTmpFixture simple-csr-js;
npm run build;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/index.html;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/app.*.js;
fileExists $cwd/dist/app/browser/vendor.*.js;

createTmpFixture simple-csr-ts;
npm run build;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/index.html;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/app.*.js;
fileExists $cwd/dist/app/browser/vendor.*.js;

createTmpFixture simple-ssr-js;
npm run build;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/loadable-stats.json;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/app.*.js;
fileExists $cwd/dist/app/browser/vendor.*.js;
fileExists $cwd/dist/app/server/index.js;
fileExists $cwd/dist/app/server/package.json;

createTmpFixture simple-ssr-ts;
npm run build;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/loadable-stats.json;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/app.*.js;
fileExists $cwd/dist/app/browser/vendor.*.js;
fileExists $cwd/dist/app/server/index.js;
fileExists $cwd/dist/app/server/package.json;

createTmpFixture custom;
npm run build;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/loadable-stats.json;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/app.*.js;
fileExists $cwd/dist/app/browser/vendor.*.js;
fileExists $cwd/dist/app/server/index.js;
fileExists $cwd/dist/app/server/package.json;

# zeroconfig-webapp-scripts build app ---
createTmpFixture simple-csr-ts;
npm run app:build --- --mode development;
fileExists $cwd/.dev/app/size-report.html;
fileExists $cwd/.dev/app/browser/favicon.ico;
fileExists $cwd/.dev/app/browser/index.html;
fileExists $cwd/.dev/app/browser/manifest.json;
fileExists $cwd/.dev/app/browser/app.*.js;
fileExists $cwd/.dev/app/browser/vendor.*.js;

output=$(mktemp -d);
createTmpFixture simple-csr-ts;
npm run app:build --- --output $output;
fileExists $output/size-report.html;
fileExists $output/browser/favicon.ico;
fileExists $output/browser/index.html;
fileExists $output/browser/manifest.json;
fileExists $output/browser/app.*.js;
fileExists $output/browser/vendor.*.js;

createTmpFixture simple-csr-ts;
npm run app:build --- --app-file-name myapp --vendor-file-name common;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/index.html;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/myapp.*.js;
fileExists $cwd/dist/app/browser/common.*.js;

createTmpFixture simple-csr-ts;
npm run app:build --- --chunk-path chunks/path;
fileExists $cwd/dist/app/size-report.html;
fileExists $cwd/dist/app/browser/favicon.ico;
fileExists $cwd/dist/app/browser/index.html;
fileExists $cwd/dist/app/browser/manifest.json;
fileExists $cwd/dist/app/browser/chunks/path/app.*.js;
fileExists $cwd/dist/app/browser/chunks/path/vendor.*.js;

# TODO *.worker test
# TODO loadable-components code split test