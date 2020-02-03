import path from 'path';
import help from '../extensionScripts/help';
import { ExtensionArgv, ExtensionConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { sayZeroconfig } from '../utils/sayZeroconfig';
import { buildExtension } from './buildExtension';
import { createExtensionConfig } from './createExtensionConfig';
import { parseExtensionArgv } from './parseExtensionArgv';
import { watchExtension } from './watchExtension';

const zeroconfigPath: string = path.join(__dirname, '../..');

export async function extensionScripts(nodeArgv: string[], {cwd = process.cwd()}: {cwd?: string} = {}) {
  if (nodeArgv.indexOf('--help') > -1) {
    console.log(help);
    return;
  }
  
  const argv: ExtensionArgv = parseExtensionArgv(nodeArgv);
  const config: ExtensionConfig = await createExtensionConfig({argv, cwd, zeroconfigPath});
  
  sayZeroconfig();
  
  sayTitle('EXECUTED COMMAND');
  console.log('zeroconfig-extension-scripts ' + nodeArgv.join(' '));
  
  sayTitle('CREATED CONFIG');
  console.log(config);
  
  switch (config.command) {
    case 'build':
      process.env.BROWSERSLIST_ENV = 'development';
      await buildExtension(config);
      break;
    case 'watch':
      process.env.BROWSERSLIST_ENV = 'development';
      await watchExtension(config);
      break;
    default:
      console.error('Unknown command :', config.command);
  }
}