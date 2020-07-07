import { mapEnv, pickEnv } from '@ssen/env';
import path from 'path';
import { pipe } from 'ramda';

describe('mapEnv()', () => {
  test('should get mapped env', () => {
    const env: NodeJS.ProcessEnv = pipe(
      mapEnv(path.join(process.cwd(), `test/fixtures/env/basic/.env1`)),
      mapEnv(path.join(process.cwd(), `test/fixtures/env/basic/.env2`)),
    )({});

    expect(env['FOO']).toBe('BAR');
    expect(env['BOO']).toBe('ZOO');
  });
});

describe('pickEnv()', () => {
  test('should get picked env', () => {
    const env: NodeJS.ProcessEnv = pickEnv(
      'FOO',
      'BAR',
    )({
      FOO: 'A',
      BAR: 'A',
      BOO: 'A',
      ZOO: 'A',
    });

    expect(env['FOO']).toBe('A');
    expect(env['BAR']).toBe('A');
    expect(env['BOO']).toBeUndefined();
    expect(env['ZOO']).toBeUndefined();
  });

  test('error case', () => {
    const PORT = 'PORT';
    const OUT_DIR = 'OUT_DIR';
    const STATIC_FILE_DIRECTORIES = 'STATIC_FILE_DIRECTORIES';
    const PUBLIC_PATH = 'PUBLIC_PATH';
    const CHUNK_PATH = 'CHUNK_PATH';
    const SOURCE_MAP = 'SOURCE_MAP';
    const HTTPS = 'HTTPS';
    const HTTPS_KEY = 'HTTPS_KEY';
    const HTTPS_CERT = 'HTTPS_CERT';
    const EXTERNALS = 'EXTERNALS';
    const TSCONFIG = 'TSCONFIG';

    const env: NodeJS.ProcessEnv = pickEnv(
      PORT,
      // TODO is this using?
      OUT_DIR,
      STATIC_FILE_DIRECTORIES,
      PUBLIC_PATH,
      CHUNK_PATH,
      // TODO is this using?
      SOURCE_MAP,
      HTTPS,
      HTTPS_KEY,
      HTTPS_CERT,
      // TODO it looks not available because webpack externals config needs like this { react: 'React' }
      EXTERNALS,
      TSCONFIG,
    )({
      PORT: '1333',
      LC_TERMINAL: 'iTerm2',
      npm_config_send_metrics: '',
      npm_config_save_bundle: '',
      npm_config_node_options: '',
      npm_config_init_version: '1.0.0',
      npm_config_umask: '0022',
      npm_config_init_author_name: '',
      npm_config_git: 'git',
      npm_config_scope: '',
      npm_config_onload_script: '',
      npm_config_tmp: '/var/folders/1_/knms8lfj3sbc8x2r8hdl6r3w0000gn/T',
      npm_config_unsafe_perm: 'true',
      npm_node_execpath: '/usr/local/Cellar/node/14.5.0/bin/node',
      npm_config_link: '',
      npm_config_prefix: '/usr/local',
      npm_config_format_package_lock: 'true',
      COLORTERM: 'truecolor',
      WEBPACK_DEV_SERVER: 'true',
    });

    expect(env['PORT']).toBe('1333');
  });
});
