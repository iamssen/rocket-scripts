import minimist, { ParsedArgs } from 'minimist';
import { ExtensionArgv, ExtensionCommand, extensionCommands, isExtensionCommand } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { takeMinimistEveryValues } from '../utils/takeMinimistEveryValues';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parseExtensionArgv(nodeArgv: string[]): ExtensionArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;
  
  if (!isExtensionCommand(command)) {
    throw new Error(`command must be one of ${extensionCommands.join(', ')}`);
  }
  
  switch (command) {
    case 'build':
      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
        sayTitle('FOUND NODE_ENV');
        console.log(`In "zeroconfig-extension-scripts ${command}". NODE_ENV should always be "production"`);
        console.log('[setting change]: process.env.NODE_ENV → production');
      }
      
      process.env.NODE_ENV = 'production';
      break;
    case 'watch':
      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
        sayTitle('FOUND NODE_ENV');
        console.log(`In "zeroconfig-extension-scripts ${command}". NODE_ENV should always be "development"`);
        console.log('[setting change]: process.env.NODE_ENV → development');
      }
      
      process.env.NODE_ENV = 'development';
      break;
    default:
      throw new Error(`command must be one of ${extensionCommands.join(', ')}`);
  }
  
  return {
    command: command as ExtensionCommand,
    app,
    output: takeMinimistLatestValue(argv['output']),
    vendorFileName: takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
    styleFileName: takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
    staticFileDirectories: takeMinimistEveryValues(argv['static-file-directories']),
    staticFilePackages: takeMinimistEveryValues(argv['static-file-packages']),
  };
}