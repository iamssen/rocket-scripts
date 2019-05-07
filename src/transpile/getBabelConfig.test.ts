import { getBabelConfig } from './getBabelConfig';

describe('getBabelConfig()', () => {
  test('get config correctly', () => {
    const config: object = getBabelConfig({modules: 'commonjs'});
    expect(Object.keys(config)).toEqual(['presets', 'plugins', 'overrides']);
    expect(config['presets'][0][1]['modules']).toEqual('commonjs');
    expect(getBabelConfig({modules: false})['presets'][0][1]['modules']).toEqual(false);
  });
});