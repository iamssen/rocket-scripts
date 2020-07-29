import { patchConsole } from '@ssen/patch-console';
import fs from 'fs';
import { render } from 'ink';
import React from 'react';
import tmp from 'tmp';
import { merge } from 'webpack-merge';
import { DevServer, DevServerParams } from './DevServer';
import { DevServerUI } from './DevServerUI';

export interface DevServerStartParams extends DevServerParams {
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  header?: string;
  cwd?: string;
  logfile?: string;
}

export async function devServerStart({
  stdout = process.stdout,
  stdin = process.stdin,
  header,
  cwd = process.cwd(),
  logfile = tmp.fileSync({ mode: 0o644, postfix: '.log' }).name,
  port,
  hostname,
  webpackConfig,
  devServerConfig,
}: DevServerStartParams): Promise<() => Promise<void>> {
  console.clear();
  const stream: NodeJS.WritableStream = fs.createWriteStream(logfile);
  const restoreConsole = patchConsole({ stdout: stream, stderr: stream, colorMode: false });

  const server: DevServer = new DevServer({
    port,
    hostname,
    webpackConfig: merge(webpackConfig, {
      // TODO
    }),
    devServerConfig: {
      ...devServerConfig,
      // TODO
    },
  });

  const { unmount } = render(<DevServerUI header={header} devServer={server} cwd={cwd} logfile={logfile} />, {
    stdout,
    stdin,
    patchConsole: false,
  });

  await server.waitUntilStart();

  return async () => {
    server.close();
    await server.waitUntilClose();
    unmount();
    restoreConsole();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
}
