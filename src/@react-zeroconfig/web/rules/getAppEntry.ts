import fs from 'fs-extra';
import path from 'path';

interface Params {
  appDir: string;
}

export interface AppEntry {
  name: string;
  html: string;
  index: string;
}

export async function getAppEntry({ appDir }: Params): Promise<AppEntry[]> {
  const list: string[] = await fs.readdir(appDir);
  const set: Set<string> = new Set<string>(list);

  return list
    .map<AppEntry | null>((html) => {
      if (path.extname(html) === '.html') {
        const name: string = path.basename(html, '.html');

        for (const extname of ['.ts', '.tsx', '.js', '.jsx']) {
          if (set.has(name + extname)) {
            return { name, html, index: name + extname };
          }
        }
      }
      return null;
    })
    .filter((entry): entry is AppEntry => !!entry)
    .sort((a, b) => (a.name > b.name ? -1 : 1));
}
