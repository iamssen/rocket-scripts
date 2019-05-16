import fs from 'fs-extra';
import { createTmpDirectory } from './createTmpDirectory';

describe('createTmpDirectory', () => {
  test('빈 Tmp 디렉토리를 가져온다', async () => {
    const cwd: string = await createTmpDirectory();
    
    expect(fs.pathExistsSync(cwd) && fs.statSync(cwd).isDirectory()).toBeTruthy();
  });
});