import minimist, { ParsedArgs } from 'minimist';
import { DesktopappArgv, DesktopappCommand, desktopappCommands, isDesktopappCommand } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { takeMinimistEveryValues } from '../utils/takeMinimistEveryValues';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parseDesktopappArgv(nodeArgv: string[]): DesktopappArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;

  if (!isDesktopappCommand(command)) {
    throw new Error(`command must be one of ${desktopappCommands.join(', ')}`);
  }

  switch (command) {
    case 'build':
      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
        sayTitle('FOUND NODE_ENV');
        console.log(`In "zeroconfig-desktopapp-scripts ${command}". NODE_ENV should always be "production"`);
        console.log('[setting change]: process.env.NODE_ENV → production');
      }

      process.env.NODE_ENV = 'production';
      break;
    case 'start':
    case 'electron-watch':
    case 'electron-start':
      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
        sayTitle('FOUND NODE_ENV');
        console.log(`In "zeroconfig-desktopapp-scripts ${command}". NODE_ENV should always be "development"`);
        console.log('[setting change]: process.env.NODE_ENV → development');
      }

      process.env.NODE_ENV = 'development';
      break;
    default:
      throw new Error(`command must be one of ${desktopappCommands.join(', ')}`);
  }

  return {
    command: command as DesktopappCommand,
    app,
    output: takeMinimistLatestValue(argv['output']),
    staticFileDirectories: takeMinimistEveryValues(argv['static-file-directories']),
    staticFilePackages: takeMinimistEveryValues(argv['static-file-packages']),
  };
}
