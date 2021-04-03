import { copyFixture } from '@ssen/copy-fixture';
import svgReactLoader from '@ssen/svg-react-loader';
import path from 'path';

function compile(
  resourcePath: string,
  source: string,
): Promise<string | Buffer | undefined> {
  return new Promise<string | Buffer | undefined>((resolve, reject) => {
    const context = {
      resourcePath,
      async: () => (
        err: Error | null | undefined,
        content: string | Buffer | undefined,
      ) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      },
    };

    svgReactLoader.call(context, source);
  });
}

describe('svg-react-loader', () => {
  test('should get react jsx codes', async () => {
    // Arrange
    const cwd: string = await copyFixture(`test/fixtures/web/bundle`);

    const content = ['export default "/absoulte-path/test.svg"'].join('\n');

    const result = await compile(
      path.join(cwd, 'src/app/components/test.svg'),
      content,
    );

    expect(result).toMatchSnapshot();
  });
});
