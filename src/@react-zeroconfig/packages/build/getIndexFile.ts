import { glob } from '@ssen/promised';

interface Params {
  packageDir: string;
}

export async function getIndexFile({ packageDir }: Params): Promise<string> {
  const indexFileSearchResult: string[] = await glob(`${packageDir}/index.{js,jsx,ts,tsx}`);

  if (indexFileSearchResult.length === 0) {
    throw new Error(`Undefined index file on "${packageDir}"`);
  } else if (indexFileSearchResult.length > 1) {
    throw new Error(`Only one index file must exist : "${indexFileSearchResult.join(', ')}"`);
  }

  return indexFileSearchResult[0];
}
