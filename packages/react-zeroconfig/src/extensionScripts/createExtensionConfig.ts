import fs from 'fs-extra';
import path from 'path';
import { ExtensionArgv, ExtensionConfig } from '../types';
import { glob } from '../utils/glob-promise';
import { getStaticFileDirectories } from '../webappScripts/getStaticFileDirectories';

export async function createExtensionConfig({
  argv,
  cwd,
  zeroconfigPath,
}: {
  argv: ExtensionArgv;
  cwd: string;
  zeroconfigPath: string;
}): Promise<ExtensionConfig> {
  const { command, app, vendorFileName, styleFileName } = argv;

  if (!(await fs.pathExists(path.join(cwd, 'src', app)))) throw new Error(`${path.join(cwd, 'src', app)} is undefined`);

  const staticFileDirectories: string[] = await getStaticFileDirectories({ ...argv, cwd });
  const output: string =
    typeof argv.output === 'string' ? path.resolve(cwd, argv.output) : path.join(cwd, 'dist-dev', app);
  const templateFiles: string[] = (await glob(`${cwd}/src/${app}/*.html`)).map(file => path.basename(file));

  const entryFiles: string[] = (await glob(`${cwd}/src/${app}/*.{js,jsx,ts,tsx}`)).map(file => path.basename(file));

  return {
    command,
    app,

    staticFileDirectories,

    output,
    vendorFileName,
    styleFileName,

    entryFiles,

    cwd,
    zeroconfigPath,
    extend: {
      templateFiles,
    },
  };
}
