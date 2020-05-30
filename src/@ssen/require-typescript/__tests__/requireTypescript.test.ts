import path from 'path';
import { requireTypescript } from '@ssen/require-typescript';

describe('requireTypescript', () => {
  test('should get typescript exports', () => {
    const { hello } = requireTypescript<{ hello: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/basic/hello.ts'),
    );
    expect(hello).toBe(1);

    const { hello2 } = requireTypescript<{ hello2: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/basic/with-import.ts'),
    );
    expect(hello2).toBe(2);

    const { hello3 } = requireTypescript<{ hello3: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/basic/with-module.ts'),
    );
    expect(hello3).toBe(1);

    const { default: func } = requireTypescript<{ default: (a: number, b: number) => number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/basic/func.ts'),
    );
    expect(func(1, 2)).toBe(3);
  });
});
