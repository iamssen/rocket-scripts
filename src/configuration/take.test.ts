import minimist, { ParsedArgs } from 'minimist';
import { takeEvery } from './takeEvery';
import { takeLatest } from './takeLatest';

describe('takeLatest()', () => {
  test('get value', () => {
    const argv: ParsedArgs = minimist(['build', 'app', '--size-report=true', '--compress=false', '--size-report=false']);
    expect(argv._).toEqual(['build', 'app']);
    expect(takeLatest(argv['size-report'])).toEqual('false');
    expect(takeLatest(argv['compress'])).toEqual('false');
    expect(takeLatest(argv['static-packages'])).toBeUndefined();
  });
});

describe('takeEvery()', () => {
  test('get value', () => {
    const argv: ParsedArgs = minimist(['build', 'app', '--static-files', 'a b', '--static-files', 'c d']);
    expect(argv._).toEqual(['build', 'app']);
    expect(takeEvery(argv['static-files'])).toEqual('a b c d');
    expect(takeEvery(argv['static-packages'])).toBeUndefined();
  });
});