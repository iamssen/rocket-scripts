import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export interface ElectronServerParams {
  dir: string;
  main: string;
  argv: string[];
}

export class ElectronServer {
  private proc: ChildProcessWithoutNullStreams | null = null;

  constructor(private params: ElectronServerParams) {
    this.start();
  }

  public start = () => {
    const { main, dir, argv } = this.params;
    this.proc = spawn(`npx electron ${argv.join(' ')} ${main}`, { cwd: dir, detached: true, shell: true });
  };

  public restart = () => {
    this.close();
    this.start();
  };

  public close = () => {
    this.proc?.kill();
  };
}
