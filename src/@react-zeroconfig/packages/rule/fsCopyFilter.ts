import { packageJsonFactoryFileNamePattern } from './fileNames';
import fs from 'fs-extra';

// prettier-ignore
export function fsCopyFilter(src: string): boolean {
  const pass: boolean = (
      // IGNORE PATTERNS
      !/__(\w*)__/.test(src) &&                    // IGNORE : __tests__ , __fixtures__
      !/\.(ts|tsx|mjs|js|jsx)$/.test(src) &&       // IGNORE : *.ts, *.tsx, *.js, *.jsx, *.mjs
      !packageJsonFactoryFileNamePattern.test(src) // IGNORE : .package.json.js
    ) ||
    // OK PATTERNS
    /\.d\.ts$/.test(src) ||                        // OK : *.d.ts
    /\/bin\/[a-zA-Z0-9._-]+.js$/.test(src);        // OK : bin/*.js
  
  if (pass && !process.env.JEST_WORKER_ID) {
    if (fs.statSync(src).isFile()) console.log(src);
  }
  
  return pass;
}
