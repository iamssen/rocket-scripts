import { parseNumber } from '@rocket-scripts/utils';
import { start } from '@rocket-scripts/web';

(async () => {
  await start({
    app: 'app',
    port: parseNumber(process.env.PORT) ?? 'random',
    webpackDevServerConfig: {
      proxy: {
        '/api': {
          target: 'http://labs.ssen.name',
          changeOrigin: true,
          logLevel: 'debug',
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
  });
})();
