import fs from 'fs-extra';
import path from 'path';

export const hello3 = fs.readJsonSync(path.join(__dirname, 'test.json')).hello;
