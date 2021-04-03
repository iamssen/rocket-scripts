declare module '@svgr/plugin-jsx' {
  import type { PluginOptions } from '@babel/core';
  const fn: (
    svgCode: string,
    config: PluginOptions,
    state: {
      filePath?: string;
      componentName?: string;
      [babelPluginOptions: string]: unknown;
    },
  ) => string;
  export = fn;
}
