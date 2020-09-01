declare module 'browserslist/node' {
  import type { Options } from 'browserslist';

  function loadConfig(opts?: Options): string | string[] | undefined;
  function findConfig(from: string): object | string | string[];
}
