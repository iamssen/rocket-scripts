import { Options } from 'browserslist';

declare module 'browserslist/node' {
  function loadConfig(opts?: Options): string | string[] | undefined;
  
  function findConfig(from: string): object | string | string[];
}