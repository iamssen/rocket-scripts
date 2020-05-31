import fs from 'fs-extra';
import { buildTransformFileNamePattern, packageJsonFactoryFileNamePattern } from '../rule';

// prettier-ignore
export function fsPackagesCopyFilter(src: string): boolean {
  const completelyIgnore: boolean =
    /__(\w*)__/.test(src);                           // __tests__ , __fixtures__
  
  const ignore: boolean =
    /\.(ts|tsx|mjs|js|jsx)$/.test(src) ||            // *.ts, *.tsx, *.js, *.jsx, *.mjs
    packageJsonFactoryFileNamePattern.test(src) ||   // .package.json.(js|ts)
    buildTransformFileNamePattern.test(src);         // .build.(js|ts)
  
  const pass: boolean =
    !completelyIgnore &&
    (
      !ignore ||
      /\.d\.ts$/.test(src) ||                        // *.d.ts
      /\/bin\/[a-zA-Z0-9._-]+.js$/.test(src) ||      // bin/*.js
      /\/public\//.test(src)                         // public/*
    );
  
  if (pass && !process.env.JEST_WORKER_ID) {
    if (fs.statSync(src).isFile()) console.log('COPY:', src);
  }
  
  return pass;
}
