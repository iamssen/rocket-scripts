import fs from 'fs-extra';
import { buildTransformFileNamePattern, packageJsonFactoryFileNamePattern } from '../rule';

// prettier-ignore
export function fsPackagesCopyFilter(src: string): boolean {
  const s: string = src.replace(/\\/g, '/');
  
  const completelyIgnore: boolean =
    /__(\w*)__/.test(s);                           // __tests__ , __fixtures__
  
  const ignore: boolean =
    /\.(ts|tsx|mjs|js|jsx)$/.test(s) ||            // *.ts, *.tsx, *.js, *.jsx, *.mjs
    packageJsonFactoryFileNamePattern.test(s) ||   // .package.json.(js|ts)
    buildTransformFileNamePattern.test(s);         // .build.(js|ts)
  
  const pass: boolean =
    !completelyIgnore &&
    (
      !ignore ||
      /\.d\.ts$/.test(s) ||                        // *.d.ts
      /\/bin\/[a-zA-Z0-9._-]+.js$/.test(s) ||      // bin/*.js
      /\/public\//.test(s)                         // public/*
    );
  
  if (pass && !process.env.JEST_WORKER_ID) {
    if (fs.statSync(s).isFile()) console.log('COPY:', s);
  }
  
  return pass;
}
