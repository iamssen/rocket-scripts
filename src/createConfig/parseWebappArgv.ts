import minimist, { ParsedArgs } from 'minimist';
import { WebappArgv } from '../types';

export function parseWebappArgv(nodeArgv: string[]): WebappArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command, app] = argv._;
  const https: boolean | {key: string, cert: string} = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
    ? {key: argv['https-key'], cert: argv['https-cert']}
    : argv['https'] === 'true';
  
  if (command !== 'build' && command !== 'start') throw new Error('command should be the build or the start');
  
  return {
    command,
    app,
    staticFileDirectories: argv['static-file-directories'],
    staticFilePackages: argv['static-file-packages'],
    sizeReport: argv['size-report'] !== 'false',
    compress: argv['compress'] !== 'false',
    output: argv['output'],
    vendorFileName: argv['vendor-file-name'] || 'vendor',
    styleFileName: argv['style-file-name'] || 'style',
    chunkPath: argv['chunk-path'] || '',
    port: argv['port'] || 3100,
    serverPort: argv['server-port'] || 4100,
    https,
  };
}