import nodemon from 'nodemon';

export interface ElectronServerParams {
  dir: string;
  main: string;
  argv: string[];
}

export class ElectronServer {
  private instance: typeof nodemon | null = null;

  constructor({ main, dir, argv }: ElectronServerParams) {
    this.instance = nodemon({
      watch: [main],
      exec: `npx electron ${argv.join(' ')} ${main}`,
      cwd: dir,
    });
  }

  public restart = () => {
    this.instance?.emit('restart');
  };

  public close = () => {
    this.instance?.emit('quit');
    this.instance = null;
  };
}
