import type { Argv } from 'yargs';

type Options = Parameters<Argv['options']>[0];

const describe = '* electon command-line switch';

/**
 * @see https://www.electronjs.org/docs/api/command-line-switches
 */
export const electronSwitchesYargsOptions = {
  'ignore-connections-limit': { type: 'string', describe },
  'disable-http-cache': { type: 'boolean', describe },
  'disable-http2': { type: 'boolean', describe },
  'disable-ntlm-v2': { type: 'boolean', describe },
  lang: { type: 'string', describe },
  inspect: { type: 'string', describe },
  'inspect-brk': { type: 'string', describe },
  'remote-debugging-port': { type: 'number', describe },
  'disk-cache-size': { type: 'number', describe },
  'js-flags': { type: 'string', describe },
  'proxy-server': { type: 'string', describe },
  'proxy-bypass-list': { type: 'string', describe },
  'proxy-pac-url': { type: 'string', describe },
  'no-proxy-server': { type: 'boolean', describe },
  'host-rules': { type: 'string', describe },
  'host-resolver-rules': { type: 'string', describe },
  'auth-server-whitelist': { type: 'string', describe },
  'auth-negotiate-delegate-whitelist': { type: 'string', describe },
  'ignore-certificate-errors': { type: 'boolean', describe },
  'log-net-log': { type: 'string', describe },
  'disable-renderer-backgrounding': { type: 'boolean', describe },
  'enable-logging': { type: 'boolean', describe },
  v: { type: 'string', describe },
  vmodule: { type: 'string', describe },
  'enable-api-filtering-logging': { type: 'boolean', describe },
  'no-sandbox': { type: 'boolean', describe },
} as const;

export type ElectronSwitchesYargsValues = {
  [Key in keyof typeof electronSwitchesYargsOptions]?: typeof electronSwitchesYargsOptions[Key]['type'] extends 'boolean'
    ? boolean
    : typeof electronSwitchesYargsOptions[Key]['type'] extends 'number'
    ? number
    : string;
};

export function toElectronArgv(values: ElectronSwitchesYargsValues): string[] {
  return Object.keys(values).reduce((args: string[], key) => {
    if (!!electronSwitchesYargsOptions[key]) {
      switch (electronSwitchesYargsOptions[key].type) {
        case 'boolean':
          if (values[key] === true) {
            args.push(`--${key}`);
          }
          break;
        case 'number':
          args.push(`--${key}=${values[key]}`);
          break;
        default:
          args.push(`--${key}="${values[key]}"`);
          break;
      }
    }
    return args;
  }, []);
}
