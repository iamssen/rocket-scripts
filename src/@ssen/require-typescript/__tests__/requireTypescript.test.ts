import path from 'path';
import { requireTypescript } from '@ssen/require-typescript';

describe('requireTypescript', () => {
  test.each(['basic', 'js'])('should get exports from %s', (dir: string) => {
    const { hello } = requireTypescript<{ hello: number }>(
      path.join(process.cwd(), `test/fixtures/require-typescript/${dir}/hello`),
    );
    expect(hello).toBe(1);

    const { hello2 } = requireTypescript<{ hello2: number }>(
      path.join(process.cwd(), `test/fixtures/require-typescript/${dir}/with-import`),
    );
    expect(hello2).toBe(2);

    const { hello3 } = requireTypescript<{ hello3: number }>(
      path.join(process.cwd(), `test/fixtures/require-typescript/${dir}/with-module`),
    );
    expect(hello3).toBe(1);

    const { default: func } = requireTypescript<{ default: (a: number, b: number) => number }>(
      path.join(process.cwd(), `test/fixtures/require-typescript/${dir}/func`),
    );
    expect(func(1, 2)).toBe(3);
  });

  test('should get exports with index file', () => {
    const { hello } = requireTypescript<{ hello: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/index/hello'),
    );
    expect(hello).toBe(1);
  });

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

  test('should get javascript exports', () => {
    const { hello } = requireTypescript<{ hello: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/js/hello.js'),
    );
    expect(hello).toBe(1);

    const { hello2 } = requireTypescript<{ hello2: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/js/with-import.js'),
    );
    expect(hello2).toBe(2);

    const { hello3 } = requireTypescript<{ hello3: number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/js/with-module.js'),
    );
    expect(hello3).toBe(1);

    const { default: func } = requireTypescript<{ default: (a: number, b: number) => number }>(
      path.join(process.cwd(), 'test/fixtures/require-typescript/js/func.js'),
    );
    expect(func(1, 2)).toBe(3);
  });
});
