import fs from 'fs-extra';
import path from 'path';
import { WebappArgv, WebappConfig } from '../types';
import { glob } from '../utils/glob-promise';
import { getStaticFileDirectories } from './getStaticFileDirectories';

export async function createWebappConfig({argv, cwd, zeroconfigPath}: {argv: WebappArgv, cwd: string, zeroconfigPath: string}): Promise<WebappConfig> {
  const {command, app, sizeReport, compress, vendorFileName, styleFileName, chunkPath, port, serverPort, https} = argv;
  
  if (!(await fs.pathExists(path.join(cwd, 'src', app)))) throw new Error(`${path.join(cwd, 'src', app)} is undefined`);
  
  const staticFileDirectories: string[] = await getStaticFileDirectories({argv, cwd});
  const output: string = typeof argv.output === 'string'
    ? path.resolve(cwd, argv.output)
    : path.join(cwd, 'dist', app);
  const serverEnabled: boolean = (await glob(`${cwd}/src/${app}/server.{js,jsx,ts,tsx}`)).length > 0;
  
  return {
    command,
    app,
    
    staticFileDirectories,
    
    sizeReport,
    compress,
    output,
    vendorFileName,
    styleFileName,
    chunkPath,
    
    port,
    serverPort,
    https,
    
    cwd,
    zeroconfigPath,
    serverEnabled,
  };
}