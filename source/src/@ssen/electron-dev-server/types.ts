import { Stats } from 'webpack';

export enum WebpackServerStatus {
  STARTING,
  STARTED,
  CLOSING,
  CLOSED,
}

export enum ElectronServerStatus {
  WAITING,
  STARTED,
  CLOSED,
}

export type WebpackStats =
  | {
      status: 'waiting' | 'invalid';
    }
  | {
      status: 'done';
      statsData: Stats;
    };

export type TimeMessage = {
  time: number;
  level: 'log' | 'info' | 'warn' | 'debug' | 'error';
  message: string;
};

/**
 * @see https://www.electronjs.org/docs/api/command-line-switches
 */
export interface ElectronSwitches {
  'ignore-connections-limit'?: string;
  'disable-http-cache'?: boolean;
  'disable-http2'?: boolean;
  'disable-ntlm-v2'?: boolean;
  lang?: string;
  inspect?: string;
  'inspect-brk'?: string;
  'remote-debugging-port'?: string;
  'disk-cache-size'?: number;
  'js-flags'?: string;
  'proxy-server'?: string;
  'proxy-bypass-list'?: string;
  'proxy-pac-url'?: string;
  'no-proxy-server'?: boolean;
  'host-rules'?: string;
  'host-resolver-rules'?: string;
  'auth-server-whitelist'?: string;
  'auth-negotiate-delegate-whitelist'?: string;
  'ignore-certificate-errors'?: boolean;
  'log-net-log'?: string;
  'disable-renderer-backgrounding'?: boolean;
  'enable-logging'?: boolean;
  v?: string;
  vmodule?: string;
  'enable-api-filtering-logging'?: boolean;
  'no-sandbox'?: boolean;
}
