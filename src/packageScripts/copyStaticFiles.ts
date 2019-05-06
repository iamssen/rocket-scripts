import fs from 'fs-extra';
import path from 'path';
import { PackageBuildOption } from '../types';

export async function copyStaticFiles({buildOption, cwd}: {buildOption: PackageBuildOption, cwd: string}) {
  await fs.copy(
    path.join(cwd, 'src/_packages', buildOption.name),
    path.join(cwd, 'dist/packages', buildOption.name),
    {
      filter: src => {
        if (!/\.(ts|tsx|js|jsx)$/.test(src)) {
          if (fs.statSync(src).isFile()) console.log(src);
          return true;
        }
        return false;
      },
    },
  );
}