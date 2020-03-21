import minimist, { ParsedArgs } from 'minimist';
import { isPackageCommand, PackageArgv, PackageCommand, packageCommands } from '../types';
import { takeMinimistLatestValue } from '../utils/takeMinimistLatestValue';

export function parsePackageArgv(nodeArgv: string[]): PackageArgv {
  const argv: ParsedArgs = minimist(nodeArgv);
  const [command] = argv._;

  if (!isPackageCommand(command)) {
    throw new Error(`command must be one of ${packageCommands.join(', ')}`);
  }

  return {
    command: command as PackageCommand,
    choice: takeMinimistLatestValue(argv['choice']) !== 'false',
  };
}
