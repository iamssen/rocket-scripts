import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import electron from 'electron';

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
    //@ts-ignore
    this.proc = spawn(electron, [...argv, main], { cwd: dir, shell: true });
  };

  public restart = () => {
    this.close();
    this.start();
  };

  public close = () => {
    this.proc?.kill();
  };
}
