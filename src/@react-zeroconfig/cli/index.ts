import yargs from 'yargs';

const cwd: string = process.cwd();

console.log('index.ts..()', cwd);

export function run() {
  return yargs
    .command('packages <build|publish>', 'Package management', (yargs) => {
      yargs
        .command('build', 'Build packages', () => {
          console.log('index.ts..() packages build');
          require('@react-zeroconfig/packages/commands').build({
            cwd,
            env: process.env,
            commands: [],
          });
        })
        .demandCommand();

      yargs
        .command('publish', 'Publish packages', () => {
          console.log('index.ts..() packages publish');
          require('@react-zeroconfig/packages/commands').publish({
            cwd,
            env: process.env,
            commands: [],
          });
        })
        .demandCommand();

      yargs
        .example('TSCONFIG=tsconfig.package.json $0 packages build', 'Build packages with specific tsconfig.json')
        .example('OUT_DIR=/directory $0 packages build', 'Build packages to specific directory')
        .example('OUT_DIR=/directory $0 packages publish', 'And you must publish with same OUT_DIR option')
        .example('FORCE_PUBLISH=true $0 packages publish', 'Publish packages without user selection')
        .example('FORCE_TAG=e2e $0 packages publish', 'Publish packages with custom tag')
        .example('FORCE_REGISTRY=http://localhost:4873/ $0 packages publish', 'Publish packages with custom registry');
    })
    .demandCommand()
    .wrap(yargs.terminalWidth())
    .help('h')
    .alias('h', 'help')
    .epilog('🚀 React Zeroconfig').argv;
}
