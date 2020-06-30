import { CommandParams, parseNumber } from '@rocket-scripts/rule';
import { mapEnv, pickEnv } from '@ssen/env';
import path from 'path';
import { pipe } from 'ramda';
import { start as _start } from './start';

/* eslint-disable @typescript-eslint/typedef */

const PORT = 'PORT';
const OUT_DIR = 'OUT_DIR';
const STATIC_FILE_DIRECTORIES = 'STATIC_FILE_DIRECTORIES';
const PUBLIC_PATH = 'PUBLIC_PATH';
const CHUNK_PATH = 'CHUNK_PATH';
const SOURCE_MAP = 'SOURCE_MAP';
const HTTPS = 'HTTPS';
const HTTPS_KEY = 'HTTPS_KEY';
const HTTPS_CERT = 'HTTPS_CERT';
const EXTERNALS = 'EXTERNALS';
const TSCONFIG = 'TSCONFIG';

export function start({ cwd, env, commands: [app] }: CommandParams) {
  const e: NodeJS.ProcessEnv = pipe(
    mapEnv(path.join(cwd, '.env.js')),
    mapEnv(path.join(cwd, 'src', app, '.env.js')),
    (env) => ({
      [OUT_DIR]: env[OUT_DIR] || '{cwd}/dist/{app}',
    }),
  )(env);

  console.log(
    JSON.stringify(
      pickEnv(
        PORT,
        OUT_DIR,
        STATIC_FILE_DIRECTORIES,
        PUBLIC_PATH,
        CHUNK_PATH,
        SOURCE_MAP,
        HTTPS,
        HTTPS_KEY,
        HTTPS_CERT,
        EXTERNALS,
        TSCONFIG,
      )(e),
    ),
  );

  _start({
    cwd,
    app,
    outDir: e[OUT_DIR]!,
    publicPath: e[PUBLIC_PATH],
    chunkPath: e[CHUNK_PATH],
    staticFileDirectories: e[STATIC_FILE_DIRECTORIES]?.split(' '),
    externals: e[EXTERNALS]?.split(' '),
    port: parseNumber(e[PORT]) || 'random',
    https: e[HTTPS_KEY] && e[HTTPS_CERT] ? { key: e[HTTPS_KEY]!, cert: e[HTTPS_CERT]! } : e[HTTPS] === 'true',
    tsconfig: e[TSCONFIG],
  });
}
