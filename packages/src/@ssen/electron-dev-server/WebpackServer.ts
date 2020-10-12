import { BehaviorSubject, combineLatest } from 'rxjs';
import webpack, {
  Compiler,
  Configuration as WebpackConfiguration,
  Stats,
} from 'webpack';
import { WebpackServerStatus, WebpackStats } from './types';

export type WatchParams = Parameters<Compiler['watch']>;
export type WatchOptions = WatchParams[0];
export type Watching = ReturnType<Compiler['watch']>;

export interface WebpackServerParams {
  mainWebpackConfig: WebpackConfiguration;
  mainWebpackWatchOptions: WatchOptions;
  rendererWebpackConfig: WebpackConfiguration;
  rendererWebpackWatchOptions: WatchOptions;
}

export class WebpackServer {
  readonly mainCompiler: Compiler;
  readonly rendererCompiler: Compiler;

  private mainWatching: Watching;
  private rendererWatching: Watching;

  private readonly statusSubject: BehaviorSubject<WebpackServerStatus>;
  private readonly mainWebpackStatusSubject: BehaviorSubject<WebpackStats>;
  private readonly rendererWebpackStatusSubject: BehaviorSubject<WebpackStats>;

  private readonly startResolvers: Set<() => void> = new Set();
  private readonly closeResolvers: Set<() => void> = new Set();

  constructor({
    mainWebpackConfig,
    rendererWebpackConfig,
    mainWebpackWatchOptions,
    rendererWebpackWatchOptions,
  }: WebpackServerParams) {
    this.mainCompiler = webpack(mainWebpackConfig);
    this.rendererCompiler = webpack(rendererWebpackConfig);

    this.statusSubject = new BehaviorSubject<WebpackServerStatus>(
      WebpackServerStatus.STARTING,
    );

    this.mainWebpackStatusSubject = new BehaviorSubject<WebpackStats>({
      status: 'waiting',
    });

    this.mainCompiler.hooks.invalid.tap('invalid', () => {
      this.mainWebpackStatusSubject.next({
        status: 'invalid',
      });
    });

    this.mainWatching = this.mainCompiler.watch(
      mainWebpackWatchOptions,
      (error?: Error, stats?: Stats) => {
        if (error) {
          throw error;
        } else if (stats) {
          console.log(
            stats.toString({
              colors: false,
            }),
          );

          this.mainWebpackStatusSubject.next({
            status: 'done',
            statsData: stats,
          });
        } else {
          throw new Error('No error and stats');
        }
      },
    );

    this.rendererWebpackStatusSubject = new BehaviorSubject<WebpackStats>({
      status: 'waiting',
    });

    this.rendererCompiler.hooks.invalid.tap('invalid', () => {
      this.rendererWebpackStatusSubject.next({
        status: 'invalid',
      });
    });

    this.rendererWatching = this.rendererCompiler.watch(
      rendererWebpackWatchOptions,
      (error?: Error, stats?: Stats) => {
        if (error) {
          throw error;
        } else if (stats) {
          console.log(
            stats.toString({
              colors: false,
            }),
          );

          this.rendererWebpackStatusSubject.next({
            status: 'done',
            statsData: stats,
          });
        } else {
          throw new Error('No error and stats');
        }
      },
    );

    const startSubscription = combineLatest([
      this.mainWebpackStatusSubject,
      this.rendererWebpackStatusSubject,
    ]).subscribe(([main, renderer]) => {
      if (main.status !== 'waiting' && renderer.status !== 'waiting') {
        startSubscription.unsubscribe();
        this.onStart();
      }
    });
  }

  public status = () => this.statusSubject.asObservable();

  public mainWebpackStats = () => this.mainWebpackStatusSubject.asObservable();

  public rendererWebpackStats = () =>
    this.rendererWebpackStatusSubject.asObservable();

  public waitUntilStart = () =>
    new Promise<void>((resolve) => {
      if (this.statusSubject.getValue() >= WebpackServerStatus.STARTED) {
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

    this.statusSubject.next(WebpackServerStatus.STARTED);
  };

  public close = () => {
    if (this.statusSubject.getValue() !== WebpackServerStatus.STARTED) {
      return;
    }

    this.statusSubject.next(WebpackServerStatus.CLOSING);

    let mainClosed: boolean = false;
    let rendererClosed: boolean = false;

    this.mainWatching.close(() => {
      mainClosed = true;

      if (mainClosed && rendererClosed) {
        this.onClose();
      }
    });

    this.rendererWatching.close(() => {
      rendererClosed = true;

      if (mainClosed && rendererClosed) {
        this.onClose();
      }
    });
  };

  public waitUntilClose = () =>
    new Promise<void>((resolve) => {
      if (
        this.statusSubject.isStopped ||
        this.statusSubject.getValue() >= WebpackServerStatus.CLOSED
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

    this.mainWebpackStatusSubject.unsubscribe();
    this.rendererWebpackStatusSubject.unsubscribe();

    this.statusSubject.next(WebpackServerStatus.CLOSED);

    this.statusSubject.unsubscribe();
  };
}
