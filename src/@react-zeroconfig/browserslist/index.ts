import { loadConfig } from 'browserslist/node';

//eslint-disable-next-line @typescript-eslint/typedef
export const defaultQuery = {
  production: ['chrome > 60', 'firefox > 60', 'safari > 12'],
  development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
  server: 'node 10',
  server_development: 'current node',
  electron: 'last 1 electron version',
  package: ['chrome > 60', 'firefox > 60', 'safari > 12'],
  defaults: 'current node',
} as const;

interface Params {
  cwd: string;
  env?: keyof typeof defaultQuery;
}

export function getBrowserslistQuery({ cwd, env }: Params): string | string[] {
  if (env) process.env.BROWSERSLIST_ENV = env;
  const query: string | string[] | undefined = loadConfig({ path: cwd });
  return query || defaultQuery[process.env.BROWSERSLIST_ENV || 'defaults'] || defaultQuery['defaults'];
}
