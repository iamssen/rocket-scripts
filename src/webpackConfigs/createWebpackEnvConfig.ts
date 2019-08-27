import escapeStringRegexp from 'escape-string-regexp';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';
import { isMode } from '../types';
import { sayTitle } from '../utils/sayTitle';

type RawEnv = {[key: string]: string | number | boolean};

function getProcessEnv(): RawEnv {
  return Object.keys(process.env)
    .filter(key => /^REACT_APP_/i.test(key))
    .reduce((e, key) => {
      e[key] = process.env[key];
      return e;
    }, {});
}

export function createWebpackEnvConfig({serverPort, publicPath}: {serverPort: number, publicPath: string}): Configuration {
  if (!process.env.NODE_ENV || !isMode(process.env.NODE_ENV)) {
    throw new Error('Required process.env.NODE_ENV');
  }
  
  const env: RawEnv = {
    ...getProcessEnv(),
    SERVER_PORT: serverPort,
    PUBLIC_PATH: publicPath,
    PUBLIC_URL: publicPath,
    NODE_ENV: process.env.NODE_ENV,
  };
  
  sayTitle('ENV');
  console.log(JSON.stringify(env, null, 2));
  
  return {
    plugins: [
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),
      new DefinePlugin({
        'process.env': Object.keys(env).reduce((stringifiedEnv, key) => {
          stringifiedEnv[key] = JSON.stringify(env[key]);
          return stringifiedEnv;
        }, {}),
      }),
    ],
  };
}

// from https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InterpolateHtmlPlugin.js
// tslint:disable
class InterpolateHtmlPlugin {
  constructor(private htmlWebpackPlugin, private replacements) {
  }
  
  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
      this.htmlWebpackPlugin
        .getHooks(compilation)
        .beforeEmit.tap('InterpolateHtmlPlugin', data => {
        // Run HTML through a series of user-specified string replacements.
        Object.keys(this.replacements).forEach(key => {
          const value = this.replacements[key];
          data.html = data.html.replace(
            new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
            value,
          );
        });
      });
    });
  }
}