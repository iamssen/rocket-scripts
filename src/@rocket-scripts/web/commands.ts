import { parseNumber } from '@rocket-scripts/utils';
import { mapEnv, pickEnv } from '@ssen/env';
import path from 'path';
import { pipe } from 'ramda';
import { start as _start } from './start';

const PORT = 'PORT';
const HTTPS = 'HTTPS';
const HTTPS_KEY = 'HTTPS_KEY';
const HTTPS_CERT = 'HTTPS_CERT';

export function start({
  cwd,
  env,
  commands: [app],
}: {
  cwd: string;
  env: NodeJS.ProcessEnv;
  commands: string[];
}) {
  const e: NodeJS.ProcessEnv = pipe(
    mapEnv(path.join(cwd, '.env.js')),
    mapEnv(path.join(cwd, 'src', app, '.env.js')),
    (env) => ({
      ...env,
    }),
  )(env);

  console.log(JSON.stringify(pickEnv(PORT, HTTPS, HTTPS_KEY, HTTPS_CERT)(e)));

  _start({
    cwd,
    app,
    port: parseNumber(e[PORT]) || 'random',
    https: e[HTTPS_KEY] && e[HTTPS_CERT] ? { key: e[HTTPS_KEY]!, cert: e[HTTPS_CERT]! } : e[HTTPS] === 'true',
  });
}
