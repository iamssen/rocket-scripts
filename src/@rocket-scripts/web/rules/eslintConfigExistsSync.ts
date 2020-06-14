import fs from 'fs-extra';
import path from 'path';

// https://github.com/eslint/eslint/blob/master/lib/cli-engine/config-array-factory.js#L52
const configFilenames: string[] = [
  '.eslintrc.js',
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
    if (fs.pathExistsSync(filename)) {
      return true;
    }
  }

  const { eslintConfig } = fs.readJsonSync(path.join(cwd, 'package.json'));

  return typeof eslintConfig === 'object';
}
