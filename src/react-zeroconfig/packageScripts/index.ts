import { sayTitle } from '../utils/sayTitle';
import { sayZeroconfig } from '../utils/sayZeroconfig';
import { buildPackages } from './buildPackages';
import help from './help';
import { listPackages } from './listPackages';
import { parsePackageArgv } from './parsePackageArgv';
import { publishPackages } from './publishPackages';
import { syncPackages } from './syncPackages';
import { validatePackages } from './validatePackages';

export async function packageScripts(nodeArgv: string[], { cwd = process.cwd() }: { cwd?: string } = {}) {
  if (nodeArgv.indexOf('--help') > -1) {
    console.log(help);
    return;
  }

  const { command, choice } = parsePackageArgv(nodeArgv);

  sayZeroconfig();

  sayTitle('EXECUTED COMMAND');
  console.log('zeroconfig-package-scripts ' + nodeArgv.join(' '));

  if (command === 'build') {
    process.env.BROWSERSLIST_ENV = 'package';
    await buildPackages({ cwd });
  } else if (command === 'publish') {
    await publishPackages({ cwd, choice });
  } else if (command === 'validate') {
    await validatePackages({ cwd });
  } else if (command === 'list') {
    await listPackages({ cwd });
  } else if (command === 'sync') {
    await syncPackages({ cwd });
  } else {
    console.error('Unknown command :', command);
  }
}
