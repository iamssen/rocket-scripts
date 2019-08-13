import { Configuration, DefinePlugin } from 'webpack';

export function createWebpackEnvConfig({serverPort, publicPath}: {serverPort: number, publicPath: string}): Configuration {
  return {
    plugins: [
      new DefinePlugin({
        'process.env.SERVER_PORT': JSON.stringify(serverPort),
        'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
        'process.env.PUBLIC_URL': JSON.stringify(publicPath),
      }),
    ],
  };
}