import fs from 'fs-extra';

export function fsCopySourceFilter(src: string): boolean {
  if (!/\.(ts|tsx|js|jsx)$/.test(src)) {
    if (fs.statSync(src).isFile()) console.log(src);
    return true;
  }
  return false;
}