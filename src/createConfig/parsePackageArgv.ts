import minimist, { ParsedArgs } from 'minimist';
import { PackageArgv } from '../types';

export function parsePackageArgv(nodeArgv: string[]): PackageArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command] = argv._;
  
  if (command !== 'build' && command !== 'publish') throw new Error('command should be the build or the publish');
  
  return {
    command,
  };
}