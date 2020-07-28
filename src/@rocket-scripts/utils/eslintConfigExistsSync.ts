import fs from 'fs-extra';
import path from 'path';

// https://github.com/eslint/eslint/blob/master/lib/cli-engine/config-array-factory.js#L52
const configFilenames: string[] = [
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc.json',
  '.eslintrc',
];

export function eslintConfigExistsSync(cwd: string): boolean {
  try {
    if (
      typeof require.resolve('eslint-loader') !== 'string' ||
      typeof require.resolve('eslint') !== 'string'
    ) {
      return false;
    }
  } catch {
    return false;
  }

  for (const filename of configFilenames) {
    if (fs.existsSync(path.join(cwd, filename))) {
      return true;
    }
  }

  const packageJson: string = path.join(cwd, 'package.json');

  if (!fs.existsSync(packageJson)) return false;

  const { eslintConfig } = fs.readJsonSync(packageJson);

  return typeof eslintConfig === 'object';
}
