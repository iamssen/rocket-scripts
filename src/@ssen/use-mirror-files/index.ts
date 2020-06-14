import { Matcher } from 'anymatch';
import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import fs from 'fs-extra';
import path from 'path';
import { useEffect } from 'react';

interface Params {
  filesDirsOrGlobs: string[];
  outDir: string;
  ignored?: Matcher;
  onMessage: (message: MirrorMessage) => void;
}

export type MirrorMessage =
  | {
      type: 'added' | 'updated' | 'removed';
      file: string;
    }
  | {
      type: 'undefined';
      file: string;
    };

export function useMirrorFiles({ filesDirsOrGlobs, outDir, ignored, onMessage }: Params) {
  useEffect(() => {
    fs.mkdirpSync(outDir);

    function toRelativePath(file: string): string | undefined {
      const source: string | undefined = filesDirsOrGlobs.find((s) => file.indexOf(s) === 0);
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

        if (!relpath) {
          onMessage({
            type: 'undefined',
            file,
          });
          return;
        }

        const tofile: string = path.join(outDir, relpath);

        await fs.mkdirp(path.dirname(tofile));
        await fs.copy(file, tofile, { dereference: false });

        onMessage({
          type: 'added',
          file: relpath,
        });
      })
      .on('change', async (file) => {
        const relpath: string | undefined = toRelativePath(file);

        if (!relpath) {
          onMessage({
            type: 'undefined',
            file,
          });
          return;
        }

        const tofile: string = path.join(outDir, relpath);

        await fs.mkdirp(path.dirname(tofile));
        await fs.copy(file, tofile, { dereference: false });

        onMessage({
          type: 'updated',
          file: relpath,
        });
      })
      .on('unlink', async (file) => {
        const relpath: string | undefined = toRelativePath(file);

        if (!relpath) {
          onMessage({
            type: 'undefined',
            file,
          });
          return;
        }

        const tofile: string = path.join(outDir, relpath);

        if (fs.pathExistsSync(tofile)) {
          await fs.remove(tofile);

          onMessage({
            type: 'removed',
            file: relpath,
          });
        }
      });

    return () => {
      watcher.close();
    };
  }, [ignored, onMessage, outDir, filesDirsOrGlobs]);
}
