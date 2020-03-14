import semver from 'semver';
import { validateAppDependencies } from './validateAppDependencies';

describe('validateAppDependencies()', () => {
  test('semver.intersects test', () => {
    expect(semver.intersects('^16.8.2', '^16.8.6')).toBeTruthy();
    expect(semver.intersects('^16.8.2', '^17.1.0')).toBeFalsy();
    expect(semver.intersects('>=16.8.2', '^17.1.0')).toBeTruthy();
    expect(semver.intersects('*', '^17.1.0')).toBeTruthy();
  });
  
  test('should be working normally', () => {
    expect(() => validateAppDependencies({
      projectPackageJson: {
        dependencies: {
          react: '^16.8.6',
        },
      },
      appPackageJson: {
        dependencies: {
          react: '^16.8.2',
        },
      },
    })).not.toThrow();
    
    expect(() => validateAppDependencies({
      projectPackageJson: {
        dependencies: {
          react: '^17.8.6',
        },
      },
      appPackageJson: {
        dependencies: {
          react: '^16.1.0',
        },
      },
    })).toThrow();
    
    expect(() => validateAppDependencies({
      projectPackageJson: {
        dependencies: {
          react: '^17.1.2',
        },
      },
      appPackageJson: {
        dependencies: {
          react: '>=16.8.2',
        },
      },
    })).not.toThrow();
  
    expect(() => validateAppDependencies({
      projectPackageJson: {
        dependencies: {
          react: '^17.1.2',
        },
      },
      appPackageJson: {
        dependencies: {
          react: '*',
        },
      },
    })).not.toThrow();
  });
});