import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import fs from 'fs-extra';
import path from 'path';
import { Observable, Observer } from 'rxjs';

interface Params {
  sources: string[];
  output: string;
  ignored?: RegExp;
}

export enum MirrorTreat {
  ADDED = 'added',
  UPDATED = 'updated',
  REMOVED = 'removed',
}

export interface MirrorResult {
  treat: MirrorTreat;
  file: string;
}

export async function mirrorFiles({ sources, output, ignored }: Params): Promise<Observable<MirrorResult>> {
  function toRelativePath(file: string): string | undefined {
    const source: string | undefined = sources.find((s) => file.indexOf(s) === 0);
    return source ? path.relative(source, file) : undefined;
  }

  await fs.mkdirp(output);
  await Promise.all(
    sources.map((dir) => {
      return fs.copy(dir, output, {
        dereference: false,
        filter: (src) => {
          return ignored ? !ignored.test(src) : true;
        },
      });
    }),
  );

  return new Observable<MirrorResult>((observer: Observer<MirrorResult>) => {
    const watcher: FSWatcher = watch(sources, {
      ignored,
      persistent: true,
      ignoreInitial: true,
    });

    watcher
      .on('add', async (file) => {
        const relpath: string | undefined = toRelativePath(file);
        if (!relpath) {
          console.log(`Can't found ${file} from sources`);
          return;
        }
        const tofile: string = path.join(output, relpath);
        await fs.mkdirp(path.dirname(tofile));
        await fs.copy(file, tofile, { dereference: false });

        observer.next({
          file: relpath,
          treat: MirrorTreat.ADDED,
        });
      })
      .on('change', async (file) => {
        const relpath: string | undefined = toRelativePath(file);
        if (!relpath) {
          console.log(`Can't found ${file} from sources`);
          return;
        }
        const tofile: string = path.join(output, relpath);
        await fs.mkdirp(path.dirname(tofile));
        await fs.copy(file, tofile, { dereference: false });

        observer.next({
          file: relpath,
          treat: MirrorTreat.UPDATED,
        });
      })
      .on('unlink', async (file) => {
        const relpath: string | undefined = toRelativePath(file);
        if (!relpath) {
          console.log(`Can't found ${file} from sources`);
          return;
        }
        const tofile: string = path.join(output, relpath);

        if (fs.pathExistsSync(tofile)) {
          await fs.remove(tofile);

          observer.next({
            file: relpath,
            treat: MirrorTreat.REMOVED,
          });
        }
      });

    return () => {
      watcher.close();
    };
  });
}
