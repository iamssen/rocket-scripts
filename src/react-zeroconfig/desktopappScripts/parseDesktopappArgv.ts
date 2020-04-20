import minimist, { ParsedArgs } from 'minimist';
import {
  DesktopappArgv,
  DesktopappCommand,
  desktopappCommands,
  isDesktopappCommand,
  isMode,
  Mode,
  modes,
} from '../types';
import { sayTitle } from '../utils/sayTitle';
import { takeMinimistEveryValues } from '../utils/takeMinimistEveryValues';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parseDesktopappArgv(nodeArgv: string[]): DesktopappArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;

  if (!isDesktopappCommand(command)) {
    throw new Error(`command must be one of ${desktopappCommands.join(', ')}`);
  }

  const inputMode: string | undefined = takeMinimistLatestValue(argv['mode']);

  if (inputMode !== undefined && !isMode(inputMode)) {
    throw new Error(`mode must be one of ${modes.join(', ')}`);
  }

  switch (command) {
    case 'build':
      if (process.env.NODE_ENV && isMode(process.env.NODE_ENV)) {
        if (isMode(inputMode) && process.env.NODE_ENV !== inputMode) {
          sayTitle('FOUND NODE_ENV');
          console.log('if NODE_ENV and --mode are entered differently, NODE_ENV takes precedence.');
          console.log(`[setting change]: --mode → ${process.env.NODE_ENV}`);
        }
      } else if (!process.env.NODE_ENV && isMode(inputMode)) {
        process.env.NODE_ENV = inputMode;
      } else {
        process.env.NODE_ENV = 'production';
      }
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
    sourceMap:
      takeMinimistLatestValue(argv['source-map']) === 'true'
        ? true
        : takeMinimistLatestValue(argv['source-map']) === 'false'
        ? false
        : undefined,
    staticFileDirectories: takeMinimistEveryValues(argv['static-file-directories']),
    staticFilePackages: takeMinimistEveryValues(argv['static-file-packages']),
    output: takeMinimistLatestValue(argv['output']),
    mode: process.env.NODE_ENV as Mode,
  };
}
