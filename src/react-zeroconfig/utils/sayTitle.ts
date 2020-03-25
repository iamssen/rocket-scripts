import chalk from 'chalk';
import moment from 'moment';

export function sayTitle(title: string) {
  console.log('');
  console.log(moment().format('HH:mm:ss'), ':', chalk.bold(title));
  console.log('='.repeat(50) + '-'.repeat(25));
}
