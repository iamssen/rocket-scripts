import chalk from 'chalk';
import moment from 'moment';

export = function (): string {
  return chalk.yellow.bold(moment().format('HH:mm:ss'));
};