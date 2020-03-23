import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';

export function getBackdoorWebpackConfig({ cwd }: { cwd: string }): Configuration {
  const patchFile: string = path.join(cwd, 'experimentalPatch.js');

  if (!fs.existsSync(patchFile)) return {};

  return require(patchFile)();
}
