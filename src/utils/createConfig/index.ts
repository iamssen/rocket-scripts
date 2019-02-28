import fs from 'fs';
import path from 'path';
import { Config, UserConfig } from '../../types';
import { getDefaultEntry } from './getDefaultEntry';
import { getDefaultModulePublics } from './getDefaultModulePublics';
import { getDefaultModulesEntry } from './getDefaultModulesEntry';
import glob from 'glob';

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
  
  const ssrEnabled: boolean = fs.existsSync(path.join(appDirectory, 'src/_ssr')) && fs.statSync(path.join(appDirectory, 'src/_ssr')).isDirectory();
  
  const typescriptEnabled: boolean = glob.sync(`${appDirectory}/src/**/*.(ts|tsx)`).length > 0;
  
  return {
    app,
    modules,
    command,
    appDirectory,
    zeroconfigDirectory,
    ssrEnabled,
    typescriptEnabled,
  };
};