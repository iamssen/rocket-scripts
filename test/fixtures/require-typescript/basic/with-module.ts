import fs from 'fs-extra';
import path from 'path';

export const hello3: number = fs.readJsonSync(path.join(__dirname, 'test.json')).hello;
