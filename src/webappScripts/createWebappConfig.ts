import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import { WebappArgv, WebappConfig } from '../types';
import { glob } from '../utils/glob-promise';
import { getStaticFileDirectories } from './getStaticFileDirectories';

export async function createWebappConfig({argv, cwd, zeroconfigPath}: {argv: WebappArgv, cwd: string, zeroconfigPath: string}): Promise<WebappConfig> {
  const {command, app, sizeReport, mode, appFileName, vendorFileName, styleFileName, chunkPath, publicPath, port, serverPort, https} = argv;
  
  if (!(await fs.pathExists(path.join(cwd, 'src', app)))) throw new Error(`${path.join(cwd, 'src', app)} is undefined`);
  
  const staticFileDirectories: string[] = await getStaticFileDirectories({argv, cwd});
  const output: string = typeof argv.output === 'string'
    ? path.resolve(cwd, argv.output)
    : command === 'start'
      ? tmp.dirSync().name
      : mode === 'development'
        ? path.join(cwd, '.dev', app)
        : path.join(cwd, 'dist', app);
  const serverSideRendering: boolean = (await glob(`${cwd}/src/${app}/server.{js,jsx,ts,tsx}`)).length > 0;
  const templateFiles: string[] = (await glob(`${cwd}/src/${app}/*.html`)).map(file => path.basename(file));
  
  return {
    command,
    app,
    
    staticFileDirectories,
    
    sizeReport,
    mode,
    output,
    appFileName,
    vendorFileName,
    styleFileName,
    chunkPath,
    publicPath,
    
    port,
    serverPort,
    https,
    
    cwd,
    zeroconfigPath,
    extend: {
      serverSideRendering,
      templateFiles,
    },
  };
}