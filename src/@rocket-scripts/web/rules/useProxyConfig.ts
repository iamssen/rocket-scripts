import { useJsonConfig } from '@ssen/use-json-config';
import { Options as HttpProxyMiddlewareOptions } from 'http-proxy-middleware';
import path from 'path';
import { useMemo } from 'react';

const selector = (object) => object?.proxy;

export type ProxyConfig = { [uri: string]: HttpProxyMiddlewareOptions };

export function useProxyConfig(cwd: string): ProxyConfig | undefined {
  const file = useMemo(() => path.join(cwd, 'package.json'), [cwd]);
  return useJsonConfig<ProxyConfig>({ file: file, selector: selector });
}
