import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';

export async function createTmpDirectory(): Promise<string> {
  const { name } = tmp.dirSync();
  return fs.realpathSync(name);
}

export async function copyTmpDirectory(...paths: string[]): Promise<string> {
  const { name } = tmp.dirSync();

  await fs.copy(path.join(...paths), name);

  return fs.realpathSync(name);
}
