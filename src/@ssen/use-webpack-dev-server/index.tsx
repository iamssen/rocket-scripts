import { useEffect, useMemo } from 'react';
import { Compiler } from 'webpack';
import WebpackDevServer, { Configuration } from 'webpack-dev-server';

const delay: number = 2000;

type Command =
  | {
      type: 'start';
      port: number;
      hostname: string;
      compiler: Compiler;
      config: Configuration;
    }
  | {
      type: 'destroy';
    };

type Status = 'initial' | 'starting' | 'started' | 'destroying' | 'destroyed';

export class DevServer {
  private command: Command | null = null;
  private status: Status = 'initial';
  private devServer: WebpackDevServer | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  start = (port: number, hostname: string, compiler: Compiler, config: Configuration) => {
    if (this.command?.type === 'destroy') {
      throw new Error('server already destroyed! do not call start() after destroy()');
    } else if (this.status === 'destroying' || this.status === 'destroyed') {
      return;
    }

    this.command = {
      type: 'start',
      port,
      hostname,
      compiler,
      config,
    };

    switch (this.status) {
      case 'initial':
      case 'started':
        if (!this.timeoutId) {
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.process();
          }, delay);
        }
        break;
    }
  };

  destroy = () => {
    if (this.status === 'destroying' || this.status === 'destroyed') {
      return;
    }

    const status: Status = this.status;

    this.command = { type: 'destroy' };

    switch (status) {
      case 'started':
        if (!this.timeoutId) {
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.process();
          }, delay);
        }
        break;
    }
  };

  process = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (!this.command) return;

    if (this.command.type === 'destroy') {
      if (this.devServer) {
        this.status = 'destroying';
        this.devServer.close(() => {
          this.status = 'destroyed';
          this.devServer = null;
          this.command = null;
        });
      }
    } else if (this.command.type === 'start') {
      this.status = 'starting';
      console.log('index.tsx..process() starting...');

      if (this.devServer) {
        this.devServer.close(() => {
          this.devServer = null;
          this.process();
        });
      } else {
        const { port, hostname, config, compiler } = this.command;
        this.command = null;
        this.devServer = new WebpackDevServer(compiler, config);
        this.devServer.listen(port, hostname, (err) => {
          if (err) throw err;
          console.log('index.tsx..process() started!!!');
          this.status = 'started';
          this.process();
        });
      }
    }
  };
}

export function useWebpackDevServer(
  port: number,
  hostname: string,
  compiler: Compiler | null,
  config: Configuration | null,
) {
  const devServer = useMemo(() => new DevServer(), []);

  useEffect(() => {
    if (compiler && config) {
      devServer.start(port, hostname, compiler, config);
    }
  }, [compiler, config, devServer, hostname, port]);

  useEffect(() => {
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

    function shutdown() {
      devServer.destroy();
      process.exit();
    }

    for (const signal of signals) {
      process.on(signal, shutdown);
    }

    return () => {
      devServer.destroy();

      for (const signal of signals) {
        process.off(signal, shutdown);
      }
    };
  }, [devServer]);
}
