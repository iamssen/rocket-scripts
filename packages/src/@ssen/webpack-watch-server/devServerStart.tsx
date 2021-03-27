import { mirrorFiles, MirrorMessage } from '@ssen/mirror-files';
import { patchConsole } from '@ssen/patch-console';
import fs from 'fs-extra';
import { Box, render, Text } from 'ink';
import path from 'path';
import React, { ReactNode } from 'react';
import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';
import tmp from 'tmp';
import { DevServer, DevServerParams } from './DevServer';
import { DevServerUI } from './DevServerUI';

export interface DevServerStartParams extends DevServerParams {
  staticFileDirectories?: string[];
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  header?: ReactNode;
  cwd?: string;
  outDir: string;
  logfile?: string;
  restartAlarm?: Observable<string[]>;
  children?: ReactNode;
}

export async function devServerStart({
  stdout = process.stdout,
  stdin = process.stdin,
  staticFileDirectories,
  header,
  cwd = process.cwd(),
  outDir,
  logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  restartAlarm,
  children,
  webpackConfigs,
  watchOptions = {},
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

  console.log('devServerStart.tsx..devServerStart()', {
    staticFileDirectories,
    outDir,
  });

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

  const server: DevServer = new DevServer({
    webpackConfigs,
    watchOptions,
  });

  if (interactiveUI) {
    const { unmount, rerender } = render(
      <DevServerUI
        header={header}
        devServer={server}
        cwd={cwd}
        logfile={logfile}
        syncStaticFiles={syncStaticFiles}
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

  await server.waitUntilStart();

  return async () => {
    server.close();
    await server.waitUntilClose();
    syncStaticFilesSubscription?.unsubscribe();
    clearUI.forEach((fn) => fn());
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
}
