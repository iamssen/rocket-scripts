import fs from 'fs';
import path from 'path';

interface Params {
  packageDir: string;
}

export async function getIndexFile({ packageDir }: Params): Promise<string> {
  const indexFiles: string[] = ['js', 'jsx', 'ts', 'tsx']
    .map((ext) => path.join(packageDir, 'index.' + ext))
    .filter((file) => fs.existsSync(file));

  if (indexFiles.length === 0) {
    throw new Error(`Undefined index file on "${packageDir}"`);
  } else if (indexFiles.length > 1) {
    throw new Error(`Only one index file must exist : "${indexFiles.join(', ')}"`);
  }

  return indexFiles[0];
}
