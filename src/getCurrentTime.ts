import moment from 'moment';
import chalk from 'chalk';

export = function (): string {
  return chalk.yellow.bold(moment().format('HH:mm:ss'));
};