import fs from 'fs-extra';
import tmp from 'tmp';

export async function createTmpDirectory(): Promise<string> {
  const { name } = tmp.dirSync();
  return fs.realpathSync(name);
}
