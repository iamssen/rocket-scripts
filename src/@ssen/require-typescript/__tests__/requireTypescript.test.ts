import path from 'path';
import { requireTypescript } from '../';

describe('requireTypescript', () => {
  test('should get typescript exports', () => {
    const { hello } = requireTypescript<{ hello: number }>(path.join(__dirname, '../__fixtures__/hello.ts'));
    expect(hello).toBe(1);

    const { hello2 } = requireTypescript<{ hello2: number }>(path.join(__dirname, '../__fixtures__/with-import.ts'));
    expect(hello2).toBe(2);

    const { hello3 } = requireTypescript<{ hello3: number }>(path.join(__dirname, '../__fixtures__/with-module.ts'));
    expect(hello3).toBe(1);

    const { default: func } = requireTypescript<{ default: (a: number, b: number) => number }>(
      path.join(__dirname, '../__fixtures__/func.ts'),
    );
    expect(func(1, 2)).toBe(3);
  });
});
