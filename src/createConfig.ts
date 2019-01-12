import fs from 'fs';
import { Config, UserConfig } from './types';

function getDefaultEntry(appDirectory: Config['appDirectory']): string[] {
  const entryDirectories: string[] = fs.readdirSync(`${appDirectory}/src/_entry/client`);
  const entry: string[] = [];
  
  for (const entryName of entryDirectories) {
    if (fs.statSync(`${appDirectory}/src/_entry/client/${entryName}`).isDirectory()) {
      entry.push(entryName);
    }
  }
  
  return entry;
}

function getDefaultModulesEntry(appDirectory: Config['appDirectory']): Config['modules']['entry'] {
  if (!fs.existsSync(`${appDirectory}/src/_modules`) || !fs.statSync(`${appDirectory}/src/_modules`).isDirectory()) return {};
  
  const entryDirectories: string[] = fs.readdirSync(`${appDirectory}/src/_modules`);
  const entry: Config['modules']['entry'] = {};
  
  for (const entryName of entryDirectories) {
    if (fs.statSync(`${appDirectory}/src/_modules/${entryName}`).isDirectory()) {
      entry[entryName] = {};
    }
  }
  
  return entry;
}

interface Params {
  command: Config['command'];
  appDirectory: Config['appDirectory'];
  zeroconfigDirectory: Config['zeroconfigDirectory'];
}

export = function ({command, appDirectory, zeroconfigDirectory}: Params): Config {
  // tslint:disable:no-any
  const packageJson: {[k: string]: any} = require(`${appDirectory}/package.json`);
  // tslint:enable:no-any
  
  const userConfig: UserConfig = fs.existsSync(`${process.cwd()}/zeroconfig.local.config.js`)
    ? require(`${appDirectory}/zeroconfig.local.config.js`)
    : fs.existsSync(`${process.cwd()}/zeroconfig.config.js`)
      ? require(`${appDirectory}/zeroconfig.config.js`)
      : packageJson.zeroconfig || {};
  
  const app: Config['app'] = {
    entry: getDefaultEntry(appDirectory),
    port: 3100,
    staticFileDirectories: ['public'],
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
  
  const ssrEnabled: boolean = fs.existsSync(`${appDirectory}/src/_entry/ssr`) && fs.statSync(`${appDirectory}/src/_entry/ssr`).isDirectory();
  
  return {
    app,
    modules,
    command,
    appDirectory,
    zeroconfigDirectory,
    ssrEnabled,
  };
};