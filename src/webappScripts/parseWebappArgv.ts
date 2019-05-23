import minimist, { ParsedArgs } from 'minimist';
import { isMode, isWebappCommand, Mode, modes, WebappArgv, WebappCommand, webappCommands } from '../types';
import { takeMinimistEveryValues } from '../utils/takeMinimistEveryValues';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parseWebappArgv(nodeArgv: string[]): WebappArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;
  
  if (!isWebappCommand(command)) {
    throw new Error(`command must be one of ${webappCommands.join(', ')}`);
  }
  
  if (!isMode(argv['mode']) && argv['mode'] !== undefined) {
    throw new Error(`mode must be one of ${modes.join(', ')}`);
  }
  
  const https: boolean | {key: string, cert: string} = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
    ? {key: argv['https-key'], cert: argv['https-cert']}
    : argv['https'] === 'true';
  
  let chunkPath: string = (takeMinimistLatestValue(argv['chunk-path']) || '').trim();
  if (chunkPath.length > 0 && !/\/$/.test(chunkPath)) {
    chunkPath = chunkPath + '/';
  }
  
  return {
    command: command as WebappCommand,
    app,
    staticFileDirectories: takeMinimistEveryValues(argv['static-file-directories']),
    staticFilePackages: takeMinimistEveryValues(argv['static-file-packages']),
    sizeReport: takeMinimistLatestValue(argv['size-report']) === 'true',
    mode: (takeMinimistLatestValue(argv['mode']) || 'production') as Mode,
    output: takeMinimistLatestValue(argv['output']),
    appFileName: takeMinimistLatestValue(argv['app-file-name']) || 'app',
    vendorFileName: takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
    styleFileName: takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
    chunkPath,
    publicPath: takeMinimistLatestValue(argv['public-path']) || '',
    port: parseInt(takeMinimistLatestValue(argv['port']) || '3100', 10),
    serverPort: parseInt(takeMinimistLatestValue(argv['server-port']) || '4100', 10),
    https,
  };
}