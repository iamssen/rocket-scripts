import path from 'path';
import yargs from 'yargs';
import fs from 'fs';

const cwd: string = process.cwd();

export function run() {
  return yargs
    .command('packages <build|publish>', 'Package Management', (yargs) => {
      const [, command] = yargs.argv._;

      let error: string | null = null;

      if (!command) {
        error = '<build|publish> is required';
      } else if (command !== 'build' && command !== 'publish') {
        error = '<build|publish> must be "build" or "publish"';
      }

      yargs.command('build', 'Build packages', () => {
        if (!error) {
          require('@react-zeroconfig/packages/commands').build({
            cwd,
            env: process.env,
            commands: [],
          });
        }
      });

      yargs.command('publish', 'Publish packages', () => {
        if (!error) {
          require('@react-zeroconfig/packages/commands').publish({
            cwd,
            env: process.env,
            commands: [],
          });
        }
      });

      yargs
        .example('TSCONFIG=tsconfig.package.json $0 packages build', 'Build packages with specific tsconfig.json')
        .example('OUT_DIR=/directory $0 packages build', 'Build packages to specific directory')
        .example('OUT_DIR=/directory $0 packages publish', 'And you must publish with same OUT_DIR option')
        .example('FORCE_PUBLISH=true $0 packages publish', 'Publish packages without user selection')
        .example('FORCE_TAG=e2e $0 packages publish', 'Publish packages with custom tag')
        .example('FORCE_REGISTRY=http://localhost:4873/ $0 packages publish', 'Publish packages with custom registry');

      if (error) {
        yargs.showHelp();
        console.log('');
        console.error(error);
      }
    })
    .command('web <build|start> [app]', 'Web App', (yargs) => {
      const [, command, app] = yargs.argv._;

      let error: string | null = null;

      if (!command) {
        error = '<build|start> is required';
      } else if (command !== 'build' && command !== 'start') {
        error = '<build|start> must be "build" or "start"';
      } else if (!app) {
        error = '[app] is required';
      } else if (!fs.existsSync(path.join(cwd, 'src', app)) || !fs.statSync(path.join(cwd, 'src', app))) {
      }

      yargs
        .positional('app', {
          describe: 'Directory name of src/[app]',
          type: 'string',
        })
        .example('OUT_DIR=/directory $0 web build [app]', 'Build a webapp to specific directory');

      yargs.command('build [app]', 'Build webapp', (yargs) => {
        if (!error) {
          console.log('index.ts..() build app', yargs.argv);
        }
      });

      yargs.command('start [app]', 'Build webapp', (yargs) => {
        if (!error) {
          console.log('index.ts..() start app', yargs.argv);
        }
      });

      if (error) {
        yargs.showHelp();
        console.log('');
        console.error(error);
      }
    })
    .demandCommand()
    .wrap(yargs.terminalWidth())
    .help('h')
    .alias('h', 'help')
    .epilog('🚀 React Zeroconfig').argv;
}
