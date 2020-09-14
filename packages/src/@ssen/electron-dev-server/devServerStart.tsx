import {
  ElectronSwitchesYargsValues,
  toElectronArgv,
} from '@ssen/electron-switches';
import { mirrorFiles, MirrorMessage } from '@ssen/mirror-files';
import { patchConsole } from '@ssen/patch-console';
import { createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import { Box, render, Text } from 'ink';
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
  children?: ReactNode;
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
  children,
}: DevServerStartParams): Promise<() => Promise<void>> {
  if (!fs.existsSync(path.dirname(logfile))) {
    fs.mkdirpSync(path.dirname(logfile));
  }

  const interactiveUI = !process.env.CI && process.env.NODE_ENV !== 'test';
  const clearUI: (() => void)[] = [];

  if (interactiveUI) {
    console.clear();
    const stream: NodeJS.WritableStream = fs.createWriteStream(logfile);
    const restoreConsole = patchConsole({
      stdout: stream,
      stderr: stream,
      colorMode: false,
    });
    clearUI.push(restoreConsole);
  }

  if (!outDir) {
    outDir = await createTmpDirectory();
  }

  await fs.mkdirp(outDir);
  const outNodeModules: string = path.resolve(outDir, 'node_modules');
  if (fs.existsSync(outNodeModules)) fs.unlinkSync(outNodeModules);
  // TODO Test this code should works in a package on yarn workspaces
  //await exec(`ln -s ${path.resolve(cwd, 'node_modules')} ${outNodeModules}`)
  await fs.symlink(path.resolve(cwd, 'node_modules'), outNodeModules, 'dir');
  //console.log('devServerStart.tsx..devServerStart()', outNodeModules);

  const syncStaticFiles: Observable<MirrorMessage> | undefined =
    Array.isArray(staticFileDirectories) && staticFileDirectories.length > 0
      ? mirrorFiles({
          filesDirsOrGlobs: staticFileDirectories,
          outDir,
        })
      : undefined;

  const syncStaticFilesCaster:
    | ConnectableObservable<MirrorMessage>
    | undefined = syncStaticFiles?.pipe(
    multicast(() => new Subject()),
  ) as ConnectableObservable<MirrorMessage>;

  const syncStaticFilesSubscription = syncStaticFilesCaster?.connect();

  const webpackServer: WebpackServer = new WebpackServer({
    mainWebpackConfig: merge(mainWebpackConfig, {
      output: {
        path: outDir,
      },
    }),
    rendererWebpackConfig: merge(rendererWebpackConfig, {
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

  if (interactiveUI) {
    const { unmount, rerender } = render(
      <DevServerUI
        header={header}
        webpackServer={webpackServer}
        electronServer={electronServer}
        cwd={cwd}
        logfile={logfile}
        syncStaticFiles={syncStaticFilesCaster}
        restartAlarm={restartAlarm}
        children={children}
        exit={() => {
          rerender(
            <Box height={3}>
              <Text color="blueBright">[DevServer Closed] {logfile}</Text>
            </Box>,
          );
          process.exit();
        }}
      />,
      {
        stdout,
        stdin,
        patchConsole: false,
        exitOnCtrlC: false,
      },
    );
    clearUI.push(unmount);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return async () => {
    electronServer.close();
    webpackServer.close();
    await webpackServer.waitUntilClose();
    syncStaticFilesSubscription?.unsubscribe();
    clearUI.forEach((fn) => fn());
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
}
