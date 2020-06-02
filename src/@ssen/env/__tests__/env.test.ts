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
});
