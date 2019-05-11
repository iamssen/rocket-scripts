import minimist, { ParsedArgs } from 'minimist';
import { isMode, isWebappCommand, modes, WebappArgv, WebappCommand, webappCommands } from '../types';
import { takeMinimistEveryValues } from '../utils/takeMinimistEveryValues';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parseWebappArgv(nodeArgv: string[]): WebappArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;
  const https: boolean | {key: string, cert: string} = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
    ? {key: argv['https-key'], cert: argv['https-cert']}
    : argv['https'] === 'true';
  
  if (!isWebappCommand(command)) {
    throw new Error(`command must be one of ${webappCommands.join(', ')}`);
  }
  
  if (!isMode(argv['mode']) && argv['mode'] !== undefined) {
    throw new Error(`mode must be one of ${modes.join(', ')}`);
  }
  
  return {
    command: command as WebappCommand,
    app,
    staticFileDirectories: takeMinimistEveryValues(argv['static-file-directories']),
    staticFilePackages: takeMinimistEveryValues(argv['static-file-packages']),
    sizeReport: takeMinimistLatestValue(argv['size-report']) !== 'false',
    mode: takeMinimistLatestValue(argv['mode']) || 'production',
    output: takeMinimistLatestValue(argv['output']),
    appFileName: takeMinimistLatestValue(argv['app-file-name']) || 'app',
    vendorFileName: takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
    styleFileName: takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
    chunkPath: takeMinimistLatestValue(argv['chunk-path']) || '',
    publicPath: takeMinimistLatestValue(argv['public-path']) || '',
    port: takeMinimistLatestValue(argv['port']) || 3100,
    serverPort: takeMinimistLatestValue(argv['server-port']) || 4100,
    https,
  };
}