import { loadConfig } from 'browserslist/node';

export const defaultQuery = {
  production: ['chrome > 60', 'firefox > 60', 'safari > 12'],
  development: [
    'last 1 chrome version',
    'last 1 firefox version',
    'last 1 safari version',
  ],
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

function findQuery(
  key: string | undefined = '',
): string | string[] | undefined {
  if (key in defaultQuery) {
    //@ts-ignore
    return defaultQuery[key];
  }
  return undefined;
}

export function getBrowserslistQuery({ cwd, env }: Params): string | string[] {
  if (env) process.env.BROWSERSLIST_ENV = env;
  const query: string | string[] | undefined = loadConfig({ path: cwd });
  return (
    query ?? findQuery(process.env.BROWSERSLIST_ENV) ?? defaultQuery.defaults
  );
}
