import fs from 'fs-extra';

export function fsCopySourceFilter(src: string): boolean {
  if (
    /\/public\//.test(src) ||
    !/\.(ts|tsx|mjs|js|jsx)$/.test(src) ||
    /\.d\.ts$/.test(src) ||
    /\/bin\/[a-zA-Z0-9._-]+.js$/.test(src)
  ) {
    if (!process.env.JEST_WORKER_ID) {
      if (fs.statSync(src).isFile()) console.log(src);
    }
    return true;
  }
  return false;
}