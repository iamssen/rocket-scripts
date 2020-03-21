import { test as filesizeTest } from '../';

describe('filesize-test', () => {
  test('test()', () => {
    const cwd: string = __dirname;

    expect(() =>
      filesizeTest(
        {
          'browser/app.*.js': {
            maxSize: 1776,
          },
          'browser/vendor.*.js': {
            maxSize: 129353,
          },
        },
        { cwd },
      ),
    ).not.toThrow();

    expect(() =>
      filesizeTest(
        {
          'browser/app.*.js': {
            maxSize: 1774,
          },
        },
        { cwd },
      ),
    ).toThrow();

    expect(() =>
      filesizeTest(
        {
          'browser/vendor.*.js': {
            maxSize: 129351,
          },
        },
        { cwd },
      ),
    ).toThrow();

    expect(() =>
      filesizeTest(
        {
          'browser/app.*.js': {
            maxGzipSize: 856,
          },
          'browser/vendor.*.js': {
            maxGzipSize: 40272,
          },
        },
        { cwd },
      ),
    ).not.toThrow();

    expect(() =>
      filesizeTest(
        {
          'browser/app.*.js': {
            maxGzipSize: 854,
          },
        },
        { cwd },
      ),
    ).toThrow();

    expect(() =>
      filesizeTest(
        {
          'browser/vendor.*.js': {
            maxGzipSize: 40270,
          },
        },
        { cwd },
      ),
    ).toThrow();
  });
});
