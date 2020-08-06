import { build, BuildParams, start, StartParams } from '@rocket-scripts/web';
import yargs, { Arguments, Argv, PositionalOptions } from 'yargs';

const cwd: string = process.cwd();

type Options = Parameters<Argv['options']>[0];

type CommonArgs = {
  emit?: boolean;
};

const commonOptions: Options = {
  emit: {
    type: 'boolean',
    default: true,
    describe: 'if you set this false it will only print options without run (e.g. --no-emit or --emit false)',
  },
};

type WebCommonArgs = {
  staticFileDirectories?: string;
  tsconfig?: string;
  app?: string;
  webpackConfig?: string;
};

const webCommonApp: [string, PositionalOptions] = [
  'app',
  {
    type: 'string',
    describe:
      'target directory name (e.g. "rocket-scripts web/start app" if you want run "/src/app" directory)',
  },
];

const webCommonOptions: Options = {
  'static-file-directories': {
    type: 'string',
    alias: 'f',
    describe: 'static files (e.g. --static-file-directories "{cwd}/public {cwd}/static")',
  },
  tsconfig: {
    type: 'string',
    alias: 't',
    describe: 'tsconfig file name (e.g. --tsconfig "tsconfig.dev.json")',
  },
  'webpack-config': {
    type: 'string',
    alias: 'w',
    describe: 'base webpack config (e.g. --webpack-config "{cwd}/webpack.config.js")',
  },
};

type WebStartArgs = {
  port?: number | 'random';
  hostname?: string;
  https?: boolean;
  httpsCert?: string;
  httpsKey?: string;
};

const webStartOptions: Options = {
  port: {
    type: 'number',
    alias: 'p',
    describe: 'server port (e.g. --port 8000)',
  },
  hostname: {
    type: 'string',
    describe: 'server hostname (e.g. --hostname localhost)',
  },
  https: {
    type: 'boolean',
    describe: 'if true the web server will start with https (e.g. --https)',
  },
  'https-cert': {
    type: 'string',
    describe: 'certification file location (e.g. --https-cert /path/to/cert.pem)',
  },
  'https-key': {
    type: 'string',
    describe: 'key file location (e.g. --https-key /path/to/key.pem)',
  },
};

type WebBuildArgs = {
  outDir?: string;
};

const webBuildOptions: Options = {
  'out-dir': {
    type: 'string',
    alias: 'o',
    describe: 'output directory (e.g. --out-dir "{cwd}/out")',
  },
};

export function run() {
  return yargs
    .command({
      command: 'web/start <app>',
      describe: 'start development server',
      builder: (yargs) =>
        yargs.positional(...webCommonApp).options({
          ...webStartOptions,
          ...webCommonOptions,
          ...commonOptions,
        }),
      handler: ({
        app,
        emit,
        tsconfig,
        staticFileDirectories,
        port,
        hostname,
        https,
        httpsCert,
        httpsKey,
        webpackConfig,
        ...argv
      }: Arguments<CommonArgs & WebCommonArgs & WebStartArgs>) => {
        if (!app) {
          console.error('<app> is required');
          yargs.showHelp('error');
          return;
        }
        const params: StartParams = {
          app: 'app',
          port,
          hostname,
          https:
            httpsCert && httpsKey ? { cert: httpsCert, key: httpsKey } : https === true ? true : undefined,
          tsconfig,
          staticFileDirectories: staticFileDirectories?.split(' '),
          webpackConfig,
          cwd,
        };
        if (emit) {
          start(params);
        } else {
          console.log(params);
        }
      },
    })
    .command({
      command: 'web/build <app>',
      describe: 'build production',
      builder: (yargs) =>
        yargs.positional(...webCommonApp).options({
          ...webBuildOptions,
          ...webCommonOptions,
          ...commonOptions,
        }),
      handler: ({
        app,
        emit,
        tsconfig,
        staticFileDirectories,
        outDir,
        webpackConfig,
      }: Arguments<CommonArgs & WebCommonArgs & WebBuildArgs>) => {
        if (!app) {
          console.error('<app> is required');
          yargs.showHelp('error');
          return;
        }
        const params: BuildParams = {
          app,
          outDir,
          tsconfig,
          staticFileDirectories: staticFileDirectories?.split(' '),
          webpackConfig,
          cwd,
        };
        if (emit) {
          build(params);
        } else {
          console.log(params);
        }
      },
    })
    .wrap(null)
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(true)
    .demandCommand()
    .recommendCommands()
    .strict()
    .epilog('🚀 Rocket Scripts!').argv;
}
