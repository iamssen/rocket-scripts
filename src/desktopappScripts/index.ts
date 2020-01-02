import multiplerun from 'multiplerun';
import path from 'path';
import { DesktopappArgv, DesktopappConfig } from '../types';
import { sayTitle } from '../utils/sayTitle';
import { sayZeroconfig } from '../utils/sayZeroconfig';
import { createDesktopappConfig } from './createDesktopappConfig';
import help from './help';
import { parseDesktopappArgv } from './parseDesktopappArgv';
import { startElectron } from './startElectron';
import { watchElectron } from './watchElectron';

const zeroconfigPath: string = path.join(__dirname, '../..');

export async function desktopappScripts(nodeArgv: string[], {cwd = process.cwd()}: {cwd?: string} = {}) {
  if (nodeArgv.indexOf('--help') > -1) {
    console.log(help);
    return;
  }
  
  const argv: DesktopappArgv = parseDesktopappArgv(nodeArgv);
  const config: DesktopappConfig = await createDesktopappConfig({argv, cwd, zeroconfigPath});
  
  if (config.command === 'start') {
    const argvString: string = nodeArgv.slice(1).join(' ');
    multiplerun([
      `npx zeroconfig-desktopapp-scripts electron-start ${argvString} --output ${config.output}`,
      `npx zeroconfig-desktopapp-scripts electron-watch ${argvString} --output ${config.output}`,
    ], cwd);
  } else {
    sayZeroconfig();
    
    sayTitle('EXECUTED COMMAND');
    console.log('zeroconfig-desktopapp-scripts ' + nodeArgv.join(' '));
    
    sayTitle('CREATED CONFIG');
    console.log(config);
    
    switch (config.command) {
      case 'electron-watch':
        process.env.BROWSERSLIST_ENV = 'server_development';
        await watchElectron(config);
        break;
      case 'electron-start':
        await startElectron(config);
        break;
      default:
        console.error('Unknown command :', config.command);
    }
  }
}