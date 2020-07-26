import { AppEntry, getAppEntry } from '@rocket-scripts/web/rules/getAppEntry';
import { getBabelLoaderOptions, getWebpackConfig } from '@rocket-scripts/web/start';
import { exec } from '@ssen/promised';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import getPort from 'get-port';
import path from 'path';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import WebpackDevServer, { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

describe('webpack-dev-server', () => {
  test('should listen and close server', async () => {
    const port: number = await getPort({ port: getPort.makeRange(8000, 9999) });
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/web/start'));

    await exec(`npm install`, { cwd });

    const entry: AppEntry[] = getAppEntry({ appDir: path.join(cwd, 'src/app') });
    const babelLoaderOptions: object = getBabelLoaderOptions({ cwd });
    const webpackConfig: WebpackConfiguration = getWebpackConfig({
      cwd,
      app: 'app',
      publicPath: '',
      chunkPath: '',
      entry,
      alias: {},
      webpackEnv: {},
      babelLoaderOptions,
      tsconfig: path.join(cwd, 'tsconfig.json'),
    });

    const devServerConfig: WebpackDevServerConfiguration | null = {
      hot: true,
      compress: true,
      contentBase: [path.join(cwd, 'public')],
      quiet: true,
      clientLogLevel: 'error',
      stats: {
        colors: false,
      },
    };

    let devServer = new WebpackDevServer(webpack(webpackConfig), devServerConfig);

    console.log('before listen 1');

    await new Promise((resolve) => {
      devServer.listen(port, 'localhost', (err) => {
        expect(err).toBeUndefined();

        fetch(`http://localhost:${port}`).then((res) => {
          expect(res.status).toBe(200);
          resolve();
        });
      });
    });

    console.log('before close 1');

    await new Promise((resolve) => {
      devServer.close(() => {
        fetch(`http://localhost:${port}`)
          .then((res) => {
            throw new Error(res.status.toString());
          })
          .catch((err) => {
            expect(err).not.toBeUndefined();
            resolve();
          });
      });
    });

    devServer = new WebpackDevServer(webpack(webpackConfig), devServerConfig);

    console.log('before listen 2');

    await new Promise((resolve) => {
      devServer.listen(port, 'localhost', (err) => {
        expect(err).toBeUndefined();

        fetch(`http://localhost:${port}`).then((res) => {
          expect(res.status).toBe(200);
          resolve();
        });
      });
    });

    console.log('before close 2');

    await new Promise((resolve) => {
      devServer.close();

      setTimeout(resolve, 1000 * 5);
    });
  });
});
