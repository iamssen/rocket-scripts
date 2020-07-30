import fs from 'fs-extra';
import path from 'path';
import { ProxyConfigArray, ProxyConfigMap } from 'webpack-dev-server';

export const selector = (object) => object?.proxy;

export function getProxyConfig(cwd: string): ProxyConfigMap | ProxyConfigArray | undefined {
  try {
    const object = fs.readJsonSync(path.join(cwd, 'package.json'));
    return selector(object);
  } catch {
    return undefined;
  }
}
