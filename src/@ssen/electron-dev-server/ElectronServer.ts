import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { watch } from 'chokidar';
import electron from 'electron';
import { FSWatcher } from 'fs';

export interface ElectronServerParams {
  dir: string;
  main: string;
  argv: string[];
}

export class ElectronServer {
  private proc: ChildProcessWithoutNullStreams | null = null;
  private watcher: FSWatcher | null = null;

  constructor(private params: ElectronServerParams) {
    this.startProc();
    this.watcher = watch(params.main).on('change', this.restart);
  }

  public restart = () => {
    this.proc?.kill();
    this.startProc();
  };

  public close = () => {
    this.proc?.kill();
    this.proc = null;

    this.watcher?.close();
    this.watcher = null;
  };

  private startProc = () => {
    const { main, dir, argv } = this.params;

    //@ts-ignore
    this.proc = spawn(electron, [...argv, main], { cwd: dir, shell: true });
  };
}
