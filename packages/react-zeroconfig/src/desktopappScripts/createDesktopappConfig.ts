import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import { DesktopappArgv, DesktopappConfig } from '../types';
import { glob } from '../utils/glob-promise';
import { getStaticFileDirectories } from '../webappScripts/getStaticFileDirectories';

export async function createDesktopappConfig({
  argv,
  cwd,
  zeroconfigPath,
}: {
  argv: DesktopappArgv;
  cwd: string;
  zeroconfigPath: string;
}): Promise<DesktopappConfig> {
  const { command, app } = argv;

  if (!(await fs.pathExists(path.join(cwd, 'src', app)))) throw new Error(`${path.join(cwd, 'src', app)} is undefined`);

  const staticFileDirectories: string[] = await getStaticFileDirectories({ ...argv, cwd });
  const output: string =
    typeof argv.output === 'string'
      ? path.resolve(cwd, argv.output)
      : command === 'start'
      ? tmp.dirSync().name
      : path.join(cwd, 'dist', app);
  const templateFiles: string[] = (await glob(`${cwd}/src/${app}/*.html`)).map(file => path.basename(file));

  return {
    command,
    app,

    staticFileDirectories,

    output,

    cwd,
    zeroconfigPath,
    extend: {
      templateFiles,
    },
  };
}
