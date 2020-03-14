import minimist, { ParsedArgs } from 'minimist';
import { isMode, isWebappCommand, Mode, modes, WebappArgv, WebappCommand, webappCommands } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { takeMinimistEveryValues } from '../utils/takeMinimistEveryValues';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parseWebappArgv(nodeArgv: string[]): WebappArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;
  
  if (!isWebappCommand(command)) {
    throw new Error(`command must be one of ${webappCommands.join(', ')}`);
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
    case 'server-watch':
    case 'server-start':
    case 'browser-start':
      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
        sayTitle('FOUND NODE_ENV');
        console.log(`In "zeroconfig-webapp-scripts ${command}". NODE_ENV should always be "development"`);
        console.log('[setting change]: process.env.NODE_ENV → development');
      }
      
      process.env.NODE_ENV = 'development';
      break;
    default:
      throw new Error(`command must be one of ${webappCommands.join(', ')}`);
  }
  
  const https: boolean | {key: string, cert: string} = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
    ? {key: argv['https-key'], cert: argv['https-cert']}
    : argv['https'] === 'true';
  
  let chunkPath: string = (takeMinimistLatestValue(argv['chunk-path']) || '').trim();
  if (chunkPath.length > 0 && !/\/$/.test(chunkPath)) {
    chunkPath = chunkPath + '/';
  }
  
  const defaultPort: string = process.env.PORT || '3100';
  const defaultServerPort: string = process.env.SERVER_PORT || '4100';
  
  return {
    command: command as WebappCommand,
    app,
    sourceMap: takeMinimistLatestValue(argv['source-map']) === 'true' ? true : takeMinimistLatestValue(argv['source-map']) === 'false' ? false : undefined,
    staticFileDirectories: takeMinimistEveryValues(argv['static-file-directories']),
    staticFilePackages: takeMinimistEveryValues(argv['static-file-packages']),
    sizeReport: takeMinimistLatestValue(argv['size-report']) === 'true',
    mode: process.env.NODE_ENV as Mode,
    output: takeMinimistLatestValue(argv['output']),
    appFileName: takeMinimistLatestValue(argv['app-file-name']) || 'app',
    vendorFileName: takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
    styleFileName: takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
    chunkPath,
    publicPath: takeMinimistLatestValue(argv['public-path']) || '',
    internalEslint: takeMinimistLatestValue(argv['internal-eslint']) !== 'false',
    port: parseInt(takeMinimistLatestValue(argv['port']) || defaultPort, 10),
    serverPort: parseInt(takeMinimistLatestValue(argv['server-port']) || defaultServerPort, 10),
    https,
  };
}