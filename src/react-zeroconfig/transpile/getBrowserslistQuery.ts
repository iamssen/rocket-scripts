import { loadConfig } from 'browserslist/node';

const defaultQuery: { [env: string]: string | string[] } = {
  production: ['chrome > 60', 'firefox > 60', 'safari > 12'],
  development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
  server: 'node 10',
  server_development: 'current node',
  electron: 'last 1 electron version',
  package: ['chrome > 60', 'firefox > 60', 'safari > 12'],
  defaults: 'current node',
};

export function getBrowserslistQuery({ cwd }: { cwd: string }): string | string[] {
  const query: string | string[] | undefined = loadConfig({ path: cwd });
  return query || defaultQuery[process.env.BROWSERSLIST_ENV || 'defaults'] || defaultQuery['defaults'];
}
