import escapeStringRegexp from 'escape-string-regexp';

// from https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InterpolateHtmlPlugin.js
/* eslint-disable @typescript-eslint/typedef */
export class InterpolateHtmlPlugin {
  constructor(private htmlWebpackPlugin, private replacements) {}

  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (compilation) => {
      this.htmlWebpackPlugin.getHooks(compilation).beforeEmit.tap('InterpolateHtmlPlugin', (data) => {
        // Run HTML through a series of user-specified string replacements.
        Object.keys(this.replacements).forEach((key) => {
          const value = this.replacements[key];
          data.html = data.html.replace(new RegExp('%' + escapeStringRegexp(key) + '%', 'g'), value);
        });
      });
    });
  }
}
