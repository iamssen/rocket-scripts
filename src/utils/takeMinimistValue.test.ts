import minimist, { ParsedArgs } from 'minimist';
import { takeMinimistEveryValues } from './takeMinimistEveryValues';
import { takeMinimistLatestValue } from './takeMinimistLatestValue';

describe('takeLatest()', () => {
  test('get value', () => {
    const argv: ParsedArgs = minimist(['build', 'app', '--size-report=true', '--compress=false', '--size-report=false']);
    expect(argv._).toEqual(['build', 'app']);
    expect(takeMinimistLatestValue(argv['size-report'])).toEqual('false');
    expect(takeMinimistLatestValue(argv['compress'])).toEqual('false');
    expect(takeMinimistLatestValue(argv['static-packages'])).toBeUndefined();
  });
});

describe('takeEvery()', () => {
  test('get value', () => {
    const argv: ParsedArgs = minimist(['build', 'app', '--static-files', 'a b', '--static-files', 'c d']);
    expect(argv._).toEqual(['build', 'app']);
    expect(takeMinimistEveryValues(argv['static-files'])).toEqual('a b c d');
    expect(takeMinimistEveryValues(argv['static-packages'])).toBeUndefined();
  });
});