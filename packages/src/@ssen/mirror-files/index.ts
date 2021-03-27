import { Matcher } from 'anymatch';
import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import fs from 'fs-extra';
import path from 'path';
import { Observable } from 'rxjs';

interface Params {
  filesDirsOrGlobs: string[];
  outDir: string;
  ignored?: Matcher;
}

export type MirrorMessage =
  | {
      type: 'added' | 'updated' | 'removed';
      file: string;
      time: Date;
    }
  | {
      type: 'undefined';
      file: string;
      time: Date;
    };

export function mirrorFiles({
  filesDirsOrGlobs,
  outDir,
  ignored,
}: Params): Observable<MirrorMessage> {
  return new Observable<MirrorMessage>((subscriber) => {
    fs.mkdirpSync(outDir);

    function toRelativePath(file: string): string | undefined {
      const source: string | undefined = filesDirsOrGlobs.find(
        (s) => file.indexOf(s) === 0,
      );
      return source ? path.relative(source, file) : undefined;
    }

    const watcher: FSWatcher = watch(filesDirsOrGlobs, {
      ignored,
    });

    watcher
      //.on('ready', () => {
      //})
      .on('add', async (file) => {
        const relpath: string | undefined = toRelativePath(file);

        console.log('mirrorFiles index.ts..()', { relpath });

        if (!relpath) {
          subscriber.next({
            type: 'undefined',
            file,
            time: new Date(),
          });
          return;
        }

        const tofile: string = path.join(outDir, relpath);

        await fs.mkdirp(path.dirname(tofile));
        await fs.copy(file, tofile, { dereference: false });

        subscriber.next({
          type: 'added',
          file: relpath,
          time: new Date(),
        });
      })
      .on('change', async (file) => {
        const relpath: string | undefined = toRelativePath(file);

        if (!relpath) {
          subscriber.next({
            type: 'undefined',
            file,
            time: new Date(),
          });
          return;
        }

        const tofile: string = path.join(outDir, relpath);

        await fs.mkdirp(path.dirname(tofile));
        await fs.copy(file, tofile, { dereference: false });

        subscriber.next({
          type: 'updated',
          file: relpath,
          time: new Date(),
        });
      })
      .on('unlink', async (file) => {
        const relpath: string | undefined = toRelativePath(file);

        if (!relpath) {
          subscriber.next({
            type: 'undefined',
            file,
            time: new Date(),
          });
          return;
        }

        const tofile: string = path.join(outDir, relpath);

        if (fs.pathExistsSync(tofile)) {
          await fs.remove(tofile);

          subscriber.next({
            type: 'removed',
            file: relpath,
            time: new Date(),
          });
        }
      });

    return () => {
      watcher.close();
    };
  });
}
