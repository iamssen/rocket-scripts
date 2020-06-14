import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

const cwd: string = process.cwd();

export function run() {
  return yargs
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
