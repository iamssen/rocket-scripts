import { Options } from 'http-proxy-middleware';
import { Subject } from 'rxjs';
import { ProxyConfigArray, ProxyConfigMap } from 'webpack-dev-server';
import { TimeMessage } from '../types';

interface Params {
  proxyConfig: ProxyConfigMap | ProxyConfigArray;
  subject: Subject<TimeMessage[]>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function toMessage(args: unknown[], level: TimeMessage['level']): TimeMessage {
  return {
    time: Date.now(),
    level,
    message: args.join(' '),
  };
}

export function patchProxyLogger({
  proxyConfig,
  subject,
}: Params): ProxyConfigMap | ProxyConfigArray {
  let messages: TimeMessage[] = [];

  function next(args: unknown[], level: TimeMessage['level']) {
    const prevMessages: TimeMessage[] =
      messages.length > 9 ? messages.slice(messages.length - 9) : messages;
    const nextMessages: TimeMessage[] = [
      ...prevMessages,
      toMessage(args, level),
    ];
    subject.next(nextMessages);
    messages = nextMessages;
  }

  const logProvider: LogProvider = {
    log: (...args: any[]) => {
      console.log(...args);
      next(args, 'log');
    },
    info: (...args: any[]) => {
      console.info(...args);
      next(args, 'info');
    },
    debug: (...args: any[]) => {
      console.debug(...args);
      next(args, 'debug');
    },
    warn: (...args: any[]) => {
      console.warn(...args);
      next(args, 'warn');
    },
    error: (...args: any[]) => {
      console.error(...args);
      next(args, 'error');
    },
  };

  if (Array.isArray(proxyConfig)) {
    return proxyConfig.map((config) => ({
      ...config,
      logProvider: () => logProvider,
    }));
  } else {
    return Object.keys(proxyConfig).reduce((config, context) => {
      const contextConfig: Options | string = proxyConfig[context] as
        | Options
        | string;

      config[context] =
        typeof contextConfig === 'string'
          ? {
              // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L242
              target: contextConfig,
            }
          : {
              ...contextConfig,
              logProvider: () => logProvider,
            };

      return config;
    }, {} as ProxyConfigMap);
  }
}

// Copied from http-proxy-middleware/dist/types.d.ts
interface LogProvider {
  log: Logger;
  debug?: Logger;
  info?: Logger;
  warn?: Logger;
  error?: Logger;
}

declare type Logger = (...args: any[]) => void;
