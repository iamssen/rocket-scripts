import { Stats } from 'webpack';

export enum DevServerStatus {
  STARTING,
  STARTED,
  CLOSING,
  CLOSED,
}

export type WebpackStats =
  | {
      status: 'waiting' | 'invalid';
    }
  | {
      status: 'done';
      statsData: Stats;
    };
