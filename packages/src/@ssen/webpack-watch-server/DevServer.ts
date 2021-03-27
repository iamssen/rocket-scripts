import { BehaviorSubject } from 'rxjs';
import webpack, {
  Configuration as WebpackConfiguration,
  MultiCompiler,
  MultiStats,
} from 'webpack';
import { DevServerStatus, WebpackStats } from './types';

export type WatchParams = Parameters<MultiCompiler['watch']>;
export type WatchOptions = WatchParams[0];
export type Watching = ReturnType<MultiCompiler['watch']>;

export interface DevServerParams {
  webpackConfigs: WebpackConfiguration[];
  watchOptions?: WatchOptions;
}

export class DevServer {
  readonly compiler: MultiCompiler;

  private watching: Watching;

  private readonly statusSubject: BehaviorSubject<DevServerStatus>;
  private readonly webpackStatusSubject: BehaviorSubject<WebpackStats>;

  private readonly startResolvers: Set<() => void> = new Set();
  private readonly closeResolvers: Set<() => void> = new Set();

  constructor({ webpackConfigs, watchOptions = {} }: DevServerParams) {
    this.compiler = webpack(webpackConfigs);

    this.statusSubject = new BehaviorSubject<DevServerStatus>(
      DevServerStatus.STARTING,
    );

    this.webpackStatusSubject = new BehaviorSubject<WebpackStats>({
      status: 'waiting',
    });

    this.compiler.hooks.invalid.tap('invalid', () => {
      this.webpackStatusSubject.next({
        status: 'invalid',
      });
    });

    this.watching = this.compiler.watch(
      watchOptions,
      (error?: Error, stats?: MultiStats) => {
        if (error) {
          throw error;
        } else if (stats) {
          console.log(
            stats.toString({
              colors: false,
            }),
          );

          this.webpackStatusSubject.next({
            status: 'done',
            statsData: stats,
          });
        } else {
          throw new Error('No error and stats');
        }
      },
    );

    const startSubscription = this.webpackStatusSubject.subscribe(
      (stats: WebpackStats) => {
        if (stats.status !== 'waiting') {
          startSubscription.unsubscribe();
          this.onStart();
        }
      },
    );
  }

  public status = () => this.statusSubject.asObservable();

  public webpackStats = () => this.webpackStatusSubject.asObservable();

  public waitUntilStart = () =>
    new Promise<void>((resolve) => {
      if (this.statusSubject.getValue() >= DevServerStatus.STARTED) {
        resolve();
      } else {
        this.startResolvers.add(resolve);
      }
    });

  private onStart = () => {
    for (const resolve of this.startResolvers) {
      resolve();
    }
    this.startResolvers.clear();

    this.statusSubject.next(DevServerStatus.STARTED);
  };

  public close = () => {
    if (this.statusSubject.getValue() !== DevServerStatus.STARTED) {
      return;
    }

    this.statusSubject.next(DevServerStatus.CLOSING);

    this.watching.close(() => {
      this.onClose();
    });
  };

  public waitUntilClose = () =>
    new Promise<void>((resolve) => {
      if (
        this.statusSubject.isStopped ||
        this.statusSubject.getValue() >= DevServerStatus.CLOSED
      ) {
        resolve();
      } else {
        this.closeResolvers.add(resolve);
      }
    });

  private onClose = () => {
    for (const resolve of this.closeResolvers) {
      resolve();
    }
    this.closeResolvers.clear();

    this.webpackStatusSubject.unsubscribe();

    this.statusSubject.next(DevServerStatus.CLOSED);

    this.statusSubject.unsubscribe();
  };
}
