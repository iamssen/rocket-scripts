import { CommandParams } from '@react-zeroconfig/rule';
import { mapEnv, printEnv } from '@ssen/env';
import path from 'path';
import { pipe } from 'ramda';
import { build as _build } from './build';
import { publish as _publish } from './publish';

/* eslint-disable @typescript-eslint/typedef */

const OUT_DIR = 'OUT_DIR';
const NODE_ENV = 'NODE_ENV';
const TSCONFIG = 'TSCONFIG';
const FORCE_PUBLISH = 'FORCE_PUBLISH';
const FORCE_TAG = 'FORCE_TAG';
const FORCE_REGISTRY = 'FORCE_REGISTRY';

const defaultEnv = (env: NodeJS.ProcessEnv) => ({
  ...env,
  [OUT_DIR]: env[OUT_DIR] || '{cwd}/dist/packages',
});

export function build({ cwd, env }: CommandParams) {
  const e: NodeJS.ProcessEnv = pipe(
    mapEnv(path.join(cwd, '.env.js')), // root env
    defaultEnv,
  )(env);

  printEnv(OUT_DIR, NODE_ENV, TSCONFIG)(e);

  _build({
    cwd,
    outDir: e[OUT_DIR]!,
    mode: e[NODE_ENV] === 'development' ? 'development' : 'production',
    tsconfig: e[TSCONFIG],
    onMessage: () => {},
  });
}

export function publish({ cwd, env }: CommandParams) {
  const e: NodeJS.ProcessEnv = pipe(
    mapEnv(path.join(cwd, '.env.js')), // root env
    defaultEnv,
  )(env);

  printEnv(OUT_DIR, FORCE_PUBLISH, FORCE_TAG, FORCE_REGISTRY)(e);

  _publish({
    cwd,
    outDir: e[OUT_DIR]!,
    force: e[FORCE_PUBLISH] === 'true',
    tag: e[FORCE_TAG],
    registry: e[FORCE_REGISTRY],
  });
}
