import fs from 'fs-extra';
import path from 'path';
import { Observable, Subscription } from 'rxjs';
import { createTmpDirectory } from '../utils/createTmpDirectory';
import { createTmpFixture } from '../utils/createTmpFixture';
import { mirrorFiles, MirrorResult, MirrorTreat } from './mirrorFiles';

async function timeout(t: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

const textContent: string = 'foo';

describe('mirrorFiles', () => {
  test('File들이 Copy 되고, Sync 되어야 한다', async () => {
    const dir1: string = await createTmpFixture('mirror-files');
    const dir2: string = await createTmpFixture('simple-csr-js');
    const output: string = await createTmpDirectory();

    const observable: Observable<MirrorResult> = await mirrorFiles({
      sources: [dir1, dir2],
      output,
    });

    const treats: Map<string, MirrorTreat> = new Map();

    const subscription: Subscription = observable.subscribe(({ file, treat }) => {
      expect(treats.get(file)).toEqual(treat);
      console.log(`mirrorFiles.test.ts..() [${treat}] ${file}`);

      if (treat === MirrorTreat.ADDED || treat === MirrorTreat.UPDATED) {
        expect(fs.pathExistsSync(path.join(output, file))).toBeTruthy();
        expect(fs.readFileSync(path.join(output, file), { encoding: 'utf8' })).toEqual(textContent);
      } else if (treat === MirrorTreat.REMOVED) {
        expect(fs.pathExistsSync(path.join(output, file))).toBeFalsy();
      }

      treats.delete(file);
    });

    console.log({ dir1, dir2, output });

    // copy
    const files: string[] = [
      'a.mp4',
      'b.jpeg',
      'public/c.svg',
      'public/d.html',
      'public/e.pdf',
      'public/favicon.ico',
      'public/manifest.json',
      'src/app/index.html',
      'src/app/index.jsx',
      '.gitignore',
      'jsconfig.json',
      'package.json',
      'webpack.config.js',
    ];

    for (const file of files) {
      await expect(fs.pathExists(path.join(output, file))).resolves.toBeTruthy();
    }

    // add
    treats.set('src/test.text', MirrorTreat.ADDED);
    await fs.writeFile(path.join(dir2, 'src/test.text'), textContent);
    await expect(fs.pathExists(path.join(dir2, 'src/test.text'))).resolves.toBeTruthy();

    treats.set('public/d.html', MirrorTreat.UPDATED);
    await fs.writeFile(path.join(dir1, 'public/d.html'), textContent, { encoding: 'utf8' });

    treats.set('jsconfig.json', MirrorTreat.REMOVED);
    await fs.remove(path.join(dir2, 'jsconfig.json'));

    await timeout(1000);
    expect(treats.size).toEqual(0);
    subscription.unsubscribe();
  });
});
