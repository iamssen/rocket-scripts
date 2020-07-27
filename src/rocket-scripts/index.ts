import { start as webStart } from '@rocket-scripts/web/commands';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

const cwd: string = process.cwd();

// TODO env -> args 로 변경
export function run() {
  return (
    yargs
      .command('web <build|start> [app]', 'Webapp', (yargs) => {
        const [, command, app] = yargs.argv._;

        let error: string | null = null;

        if (!command) {
          error = `⚠️ <build|start> is required`;
        } else if (command !== 'build' && command !== 'start') {
          error = `⚠️ <build|start> must be "build" or "start"`;
        } else if (!app) {
          error = `⚠️ [app] is required`;
        } else if (!fs.existsSync(path.join(cwd, 'src', app)) || !fs.statSync(path.join(cwd, 'src', app))) {
          error = `⚠️ "${path.join(cwd, 'src', app)}" is undefined`;
        }

        yargs.positional('app', {
          describe: 'Directory name of src/[app]',
          type: 'string',
        });

        yargs.command('build [app]', 'Build webapp', (yargs) => {
          if (!error) {
            console.log('index.ts..() build app', yargs.argv, process.env);
          }
        });

        yargs.command('start [app]', 'Build webapp', () => {
          if (!error) {
            webStart({
              cwd: process.cwd(),
              commands: [app],
              env: process.env,
            });
          }
        });

        if (error) {
          yargs.showHelp();
          console.log('');
          console.error(error);
        }
      })
      .demandCommand()
      .example('PORT=<auto|number> $0 web start [app]', 'Set dev server port (default=auto)')
      .example(
        'STATIC_FILE_DIRECTORIES="{cwd}/public {cwd}/static" $0 web <build|start> [app]',
        'Set static file directories (default="{cwd}/public")',
      )
      // TODO remove
      .example('PUBLIC_PATH="" $0 web <build|start> [app]', 'Set webpack publicPath (default="")')
      // TODO remove
      .example('CHUNK_PATH="" $0 web <build|start> [app]', 'Set webpack chunkPath (default="")')
      // TODO remove
      .example('SOURCE_MAP="" $0 web <build|start> [app]', 'Set webpack publicPath (default="")')
      .example('HTTPS=true $0 web start [app]', 'Run dev server to SSL (default=false)')
      .example(
        'HTTPS_KEY=/path/private.pem HTTPS_CERT=/path/key.pem $0 web start [app]',
        'Run dev server to SSL with specific certifications',
      )
      // TODO remove
      .example(
        'TSCONFIG="{cwd}/tsconfig.build.json" $0 web <build|start> [app]',
        'Using another tsconfig (default="{cwd}/tsconfig.json")',
      )
      .example('OUT_DIR=/directory $0 web build [app]', 'Build a webapp to specific directory')
      .wrap(yargs.terminalWidth())
      .help('h')
      .alias('h', 'help')
      .epilog('🚀 Rocket Scripts!').argv
  );
}
