import { format } from 'date-fns';

export function isolate() {
  return 'isolate ' + format(1596258181790, 'yyyy-MM-dd hh:mm:ss');
}
