import { MultiStats } from 'webpack';

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
      statsData: MultiStats;
    };

export type TimeMessage = {
  time: number;
  level: 'log' | 'info' | 'warn' | 'debug' | 'error';
  message: string;
};
