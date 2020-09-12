import { filterReactEnv } from '@rocket-scripts/web/utils/filterReactEnv';

describe('filterReactEnv()', () => {
  test('should filter REACT_APP_* envs', () => {
    // Arrange
    const envs: NodeJS.ProcessEnv = {
      NODE_ENV: 'development',
      REACT_APP_HELLO: 'hello',
      APP_HELLO: 'hello',
      FOO: 'bar',
    };

    // Act
    const result: NodeJS.ProcessEnv = filterReactEnv(envs);

    // Assert
    expect(result['NODE_ENV']).toBeUndefined();
    expect(result['REACT_APP_HELLO']).toBe('hello');
    expect(result['APP_HELLO']).toBe('hello');
    expect(result['FOO']).toBeUndefined();
  });
});
