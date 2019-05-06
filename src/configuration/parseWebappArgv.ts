import minimist, { ParsedArgs } from 'minimist';
import { isMode, isWebappCommand, modes, WebappArgv, WebappCommand, webappCommands } from '../types';
import { takeEvery } from './takeEvery';
import { takeLatest } from './takeLatest';

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
    staticFileDirectories: takeEvery(argv['static-file-directories']),
    staticFilePackages: takeEvery(argv['static-file-packages']),
    sizeReport: takeLatest(argv['size-report']) !== 'false',
    mode: takeLatest(argv['mode']) || 'production',
    output: takeLatest(argv['output']),
    appFileName: takeLatest(argv['app-file-name']) || 'main',
    vendorFileName: takeLatest(argv['vendor-file-name']) || 'vendor',
    styleFileName: takeLatest(argv['style-file-name']) || 'style',
    chunkPath: takeLatest(argv['chunk-path']) || '',
    publicPath: takeLatest(argv['public-path']) || '',
    port: takeLatest(argv['port']) || 3100,
    serverPort: takeLatest(argv['server-port']) || 4100,
    https,
  };
}