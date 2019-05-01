import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';

export async function createTmpMockup(id: string): Promise<string> {
  const mock: string = path.join(__dirname, '../../mock-files/', id);
  const {name} = tmp.dirSync();
  
  await fs.copy(mock, name);
  
  return fs.realpathSync(name);
}