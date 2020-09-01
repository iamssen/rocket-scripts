import {
  ElectronSwitchesYargsValues,
  toElectronArgv,
} from '@ssen/electron-switches';

describe('electron-switches', () => {
  test('should convert to electron argv', () => {
    const options: ElectronSwitchesYargsValues = {
      'remote-debugging-port': 3566,
      'enable-logging': true,
      'js-flags': '--allow-natives-functions',
    };

    expect(toElectronArgv(options).join(' ')).toBe(
      '--remote-debugging-port=3566 --enable-logging --js-flags="--allow-natives-functions"',
    );
  });
});
