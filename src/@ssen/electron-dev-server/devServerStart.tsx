import { ElectronSwitchesYargsValues, toElectronArgv } from '@ssen/electron-switches';
import { mirrorFiles, MirrorMessage } from '@ssen/mirror-files';
import { patchConsole } from '@ssen/patch-console';
import { createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import { render } from 'ink';
import path from 'path';
import React, { ReactNode } from 'react';
import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';
import tmp from 'tmp';
import { Configuration as WebpackConfiguration } from 'webpack';
import { merge } from 'webpack-merge';
import { DevServerUI } from './DevServerUI';
import { ElectronServer } from './ElectronServer';
import { WebpackServer } from './WebpackServer';

export interface DevServerStartParams {
  mainWebpackConfig: WebpackConfiguration;
  rendererWebpackConfig: WebpackConfiguration;
  staticFileDirectories?: string[];
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  header?: ReactNode;
  cwd?: string;
  outDir?: string;
  logfile?: string;
  electronSwitches?: ElectronSwitchesYargsValues;
  restartAlarm?: Observable<string[]>;
}

export async function devServerStart({
  mainWebpackConfig,
  rendererWebpackConfig,
  staticFileDirectories,
  stdout = process.stdout,
  stdin = process.stdin,
  header,
  cwd = process.cwd(),
  outDir,
  logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  electronSwitches = {},
  restartAlarm,
}: DevServerStartParams): Promise<() => Promise<void>> {
  console.clear();
  const stream: NodeJS.WritableStream = fs.createWriteStream(logfile);
  const restoreConsole = patchConsole({ stdout: stream, stderr: stream, colorMode: false });

  if (!outDir) {
    outDir = await createTmpDirectory();
  }

  await fs.symlink(path.join(cwd, 'node_modules'), path.join(outDir, 'node_modules'));

  const syncStaticFiles: Observable<MirrorMessage> | undefined =
    Array.isArray(staticFileDirectories) && staticFileDirectories.length > 0
      ? mirrorFiles({
          filesDirsOrGlobs: staticFileDirectories,
          outDir,
        })
      : undefined;

  const syncStaticFilesCaster: ConnectableObservable<MirrorMessage> | undefined = syncStaticFiles?.pipe(
    multicast(() => new Subject()),
  ) as ConnectableObservable<MirrorMessage>;

  const syncStaticFilesSubscription = syncStaticFilesCaster?.connect();

  const webpackServer: WebpackServer = new WebpackServer({
    mainWebpackConfig: merge(mainWebpackConfig, {
      // TODO
      output: {
        path: outDir,
      },
    }),
    rendererWebpackConfig: merge(rendererWebpackConfig, {
      // TODO
      output: {
        path: outDir,
      },
    }),
    mainWebpackWatchOptions: {},
    rendererWebpackWatchOptions: {},
  });

  await webpackServer.waitUntilStart();

  const electronServer: ElectronServer = new ElectronServer({
    argv: toElectronArgv(electronSwitches),
    dir: outDir,
    main: path.join(outDir, 'main.js'),
  });

  const { unmount } = render(
    <DevServerUI
      header={header}
      webpackServer={webpackServer}
      electronServer={electronServer}
      cwd={cwd}
      logfile={logfile}
      syncStaticFiles={syncStaticFilesCaster}
      restartAlarm={restartAlarm}
    />,
    {
      stdout,
      stdin,
      patchConsole: false,
    },
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return async () => {
    syncStaticFilesSubscription?.unsubscribe();
    electronServer.close();
    webpackServer.close();
    await webpackServer.waitUntilClose();
    unmount();
    restoreConsole();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
}
