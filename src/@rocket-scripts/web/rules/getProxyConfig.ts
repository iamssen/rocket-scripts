import fs from 'fs-extra';
import { Options as HttpProxyMiddlewareOptions } from 'http-proxy-middleware';
import path from 'path';

const selector = (object) => object?.proxy;

export type ProxyConfig = { [uri: string]: HttpProxyMiddlewareOptions };

export function getProxyConfig(cwd: string): ProxyConfig | undefined {
  try {
    const object = fs.readJsonSync(path.join(cwd, 'package.json'));
    return selector(object);
  } catch {
    return undefined;
  }
}
