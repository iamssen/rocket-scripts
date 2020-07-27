import { patchConsole } from '@ssen/patch-console';
import fs from 'fs-extra';
import { render } from 'ink';
import React from 'react';
import tmp from 'tmp';
import { DevServer, DevServerParams } from './DevServer';
import { DevServerUI } from './DevServerUI';

export interface DevServerStartParams extends DevServerParams {
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  logfile?: string;
}

export async function devServerStart({
  stdout = process.stdout,
  stdin = process.stdin,
  logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  port,
  hostname,
  webpackConfig,
  devServerConfig,
}: DevServerStartParams): Promise<() => Promise<void>> {
  const restoreConsole = patchConsole({ stdout: fs.createWriteStream(logfile), colorMode: 'auto' });

  const server: DevServer = new DevServer({
    port,
    hostname,
    webpackConfig: {
      ...webpackConfig,
      // TODO
    },
    devServerConfig: {
      ...devServerConfig,
      // TODO
    },
  });

  const { unmount } = render(<DevServerUI devServer={server} logfile={logfile} />, { stdout, stdin });

  await server.waitUntilStart();

  return async () => {
    server.close();
    await server.waitUntilClose();
    unmount();
    restoreConsole();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
}
