import { patchConsole } from '@ssen/patch-console';
import { WritableStreamBuffer } from 'stream-buffers';

describe('patchConsole()', () => {
  test('should write console messages in another writable stream', () => {
    const orig: Function = console.log;
    const stdout: WritableStreamBuffer = new WritableStreamBuffer();

    const restore = patchConsole({
      stdout,
    });

    expect(console.log).not.toBe(orig);

    console.log(1);
    console.log(2);
    console.log(3);
    console.log(4);
    console.log(5);

    expect(stdout.getContentsAsString('utf8')).toBe('1\n2\n3\n4\n5\n');

    restore();

    expect(console.log).toBe(orig);
  });
});
