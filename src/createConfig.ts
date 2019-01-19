import fs from 'fs';
import path from 'path';
import { Config, UserConfig } from './types';
import glob from 'glob';

function getDefaultEntry(appDirectory: Config['appDirectory']): string[] {
  const entryDirectories: string[] = fs.readdirSync(path.join(appDirectory, 'src/_entry/client'));
  const entry: string[] = [];
  
  for (const entryName of entryDirectories) {
    if (fs.statSync(path.join(appDirectory, 'src/_entry/client', entryName)).isDirectory()) {
      entry.push(entryName);
    }
  }
  
  return entry;
}

function getDefaultModulesEntry(appDirectory: Config['appDirectory']): Config['modules']['entry'] {
  if (!fs.existsSync(path.join(appDirectory, 'src/_modules')) || !fs.statSync(path.join(appDirectory, 'src/_modules')).isDirectory()) {
    return [];
  }
  
  return glob
    .sync(`${appDirectory}/src/_modules/**/package.json`)
    .map(packageJsonPath => path.dirname(packageJsonPath))
    .map(dirname => path.relative(path.join(appDirectory, 'src/_modules'), dirname).split(path.sep))
    .map(dirnamePaths => dirnamePaths.join('/'));
}

function getDefaultModulePublics(appDirectory: Config['appDirectory']): string[] {
  return getDefaultModulesEntry(appDirectory)
    .map(moduleName => path.join(appDirectory, `src/_modules/${moduleName}/public`))
    .filter(publicPath => fs.existsSync(publicPath) && fs.statSync(publicPath).isDirectory())
    .map(publicPath => path.relative(appDirectory, publicPath).split(path.sep).join('/'));
}

interface Params {
  command: Config['command'];
  appDirectory: Config['appDirectory'];
  zeroconfigDirectory: Config['zeroconfigDirectory'];
}

export = function ({command, appDirectory, zeroconfigDirectory}: Params): Config {
  // tslint:disable:no-any
  const packageJson: {[k: string]: any} = require(path.join(appDirectory, 'package.json'));
  // tslint:enable:no-any
  
  const userConfig: UserConfig = fs.existsSync(path.join(process.cwd(), 'zeroconfig.local.config.js'))
    ? require(path.join(appDirectory, 'zeroconfig.local.config.js'))
    : fs.existsSync(path.join(process.cwd(), 'zeroconfig.config.js'))
      ? require(path.join(appDirectory, 'zeroconfig.config.js'))
      : packageJson.zeroconfig || {};
  
  const app: Config['app'] = {
    entry: getDefaultEntry(appDirectory),
    port: 3100,
    staticFileDirectories: ['public'].concat(getDefaultModulePublics(appDirectory)),
    buildPath: '',
    https: false,
    vendorFileName: 'vendor',
    styleFileName: 'style',
    publicPath: '',
    ssrPort: 4100,
    
    ...(userConfig.app || {}),
  };
  
  if (app.buildPath !== '' && !/\/$/.test(app.buildPath)) {
    app.buildPath = app.buildPath + '/';
  }
  
  const modules: Config['modules'] = {
    entry: getDefaultModulesEntry(appDirectory),
    
    ...(userConfig.modules || {}),
  };
  
  const ssrEnabled: boolean = fs.existsSync(path.join(appDirectory, 'src/_entry/ssr')) && fs.statSync(path.join(appDirectory, 'src/_entry/ssr')).isDirectory();
  
  return {
    app,
    modules,
    command,
    appDirectory,
    zeroconfigDirectory,
    ssrEnabled,
  };
};