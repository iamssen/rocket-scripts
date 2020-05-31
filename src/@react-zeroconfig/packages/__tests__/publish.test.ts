import { build, publish } from '@react-zeroconfig/packages';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

const dummyTag: string = '__dummy_tag__';

describe('publish()', () => {
  test('should publish packages normally', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/packages/basic');
    const outDir: string = path.join(cwd, 'dist/packages');

    await exec(`npm install`, { cwd });

    await build({
      cwd,
      outDir,
      onMessage: async (message) => {
        switch (message.type) {
          case 'error':
            throw new Error(message.errors.join('\n'));
        }
      },
    });

    const packageNames: Set<string> = new Set<string>();

    await publish({
      cwd,
      outDir,
      skipSelection: true,
      tag: dummyTag,
      onMessage: async (message) => {
        switch (message.type) {
          case 'error':
            throw new Error(message.errors.join('\n'));
          case 'exec':
            packageNames.add(message.publishOption.name);
            expect(message.command.indexOf(`cd "${path.join(outDir, message.publishOption.name)}"`) > -1).toBeTruthy();
            expect(message.command.indexOf(`npm publish --tag ${dummyTag}`) > -1).toBeTruthy();
        }
      },
    });

    expect([...packageNames].sort((a, b) => (a < b ? -1 : 1))).toEqual(['a', 'b', 'c']);
  }, 100000);

  test.todo('should publish packages with the registry option');

  test.todo('should publish packages with the tag option');

  test('should get error with wrong cwd', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/browserslist/custom');
    const outDir: string = path.join(cwd, 'dist/packages');

    async function check() {
      await publish({
        cwd,
        outDir,
        skipSelection: true,
        tag: dummyTag,
        onMessage: async (message) => {
          switch (message.type) {
            case 'error':
              throw new Error(message.errors.join('\n'));
          }
        },
      });
    }

    await expect(check()).rejects.toThrow();
  });
});
