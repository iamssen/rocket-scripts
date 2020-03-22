import path from 'path';
import { RuleSetLoader } from 'webpack';
import RuleSet from 'webpack/lib/RuleSet';

const cwd: string = __dirname;

function match(ruleSet: RuleSet, resource: string) {
  return ruleSet
    .exec({ resource })
    .filter((r) => r.type === 'use')
    .map((r) => r.value as RuleSetLoader)
    .map((r) => {
      if (!r.options) return r.loader;
      if (typeof r.options === 'string') return r.loader + '?' + r.options;
      return r.loader + '?' + JSON.stringify(r.options);
    });
}

describe('webpack/lib/RuleSet', () => {
  test('include - not : include 조건에서 not 을 뺌', () => {
    const ruleSet: RuleSet = new RuleSet([
      {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        include: {
          include: path.join(cwd, 'src'),
          not: [/\.worker\.(js|jsx|mjs|ts|tsx)$/],
        },
        loader: 'babel',
      },
    ]);

    function test(filePath: string, expected: string[]) {
      expect(match(ruleSet, path.join(cwd, filePath))).toEqual(expected);
    }

    test('test/test.js', []);
    test('src/app/test.js', ['babel']);
    test('src/app/worker.js', ['babel']);
    test('src/app/test.worker.js', []);
  });

  test('oneOf [test ∩ include] : test와 include가 동시에 만족되는 항목 중 우선 순위로 하나가 선택됨', () => {
    const ruleSet: RuleSet = new RuleSet([
      {
        oneOf: [
          {
            test: /\.worker\.(js|jsx|mjs|ts|tsx)$/,
            include: path.join(cwd, 'src'),
            use: ['worker', 'babel'],
          },
          {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            include: path.join(cwd, 'src'),
            loader: 'babel',
          },
          {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            loader: '-',
          },
        ],
      },
    ]);

    function test(filePath: string, expected: string[]) {
      expect(match(ruleSet, path.join(cwd, filePath))).toEqual(expected);
    }

    test('src/app/test.worker.js', ['worker', 'babel']);
    test('src/app/test.js', ['babel']);
    test('src/app/worker.js', ['babel']);
    test('test/test.js', ['-']);
    test('node_modules/some-module/test.js', ['-']);
    test('test/test.json', []);
  });

  test('Style 선택 구조', () => {
    const ruleSet: RuleSet = new RuleSet([
      {
        oneOf: [
          {
            test: /\.module\.css$/,
            use: ['module', 'css'],
          },
          {
            test: /\.css$/,
            use: ['css'],
          },
          {
            test: /\.module\.(scss|sass)$/,
            use: ['module', 'sass'],
          },
          {
            test: /\.(scss|sass)$/,
            use: ['sass'],
          },
          {
            test: /\.module\.less$/,
            use: ['module', 'less'],
          },
          {
            test: /\.less$/,
            use: ['less'],
          },
        ],
      },
    ]);

    function test(filePath: string, expected: string[]) {
      expect(match(ruleSet, path.join(cwd, filePath))).toEqual(expected);
    }

    test('src/app/style.css', ['css']);
    test('src/app/style.module.css', ['module', 'css']);
    test('src/app/style.scss', ['sass']);
    test('src/app/style.module.scss', ['module', 'sass']);
    test('src/app/style.sass', ['sass']);
    test('src/app/style.module.sass', ['module', 'sass']);
    test('src/app/style.less', ['less']);
    test('src/app/style.module.less', ['module', 'less']);

    test('node_modules/module/style.less', ['less']);
  });

  test('Zeroconfig 전체 RuleSet Test', () => {
    const ruleSet: RuleSet = new RuleSet([
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            use: ['url'],
          },
          {
            test: /\.worker\.(ts|tsx|js|mjs|jsx)$/,
            include: path.join(cwd, 'src'),
            use: ['worker', 'babel'],
          },
          {
            test: /\.(ts|tsx|js|mjs|jsx)$/,
            include: path.join(cwd, 'src'),
            use: ['babel'],
          },
          {
            test: /\.(html|ejs|txt|md)$/,
            use: ['raw'],
          },
          {
            test: /\.module\.css$/,
            use: ['module', 'css'],
          },
          {
            test: /\.css$/,
            use: ['css'],
          },
          {
            test: /\.module\.(scss|sass)$/,
            use: ['module', 'sass'],
          },
          {
            test: /\.(scss|sass)$/,
            use: ['sass'],
          },
          {
            test: /\.module\.less$/,
            use: ['module', 'less'],
          },
          {
            test: /\.less$/,
            use: ['less'],
          },
          {
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
            use: ['file'],
          },
        ],
      },
    ]);

    function test(filePath: string, expected: string[]) {
      expect(match(ruleSet, path.join(cwd, filePath))).toEqual(expected);
    }

    // url
    test('node_modules/module/image.gif', ['url']);
    test('src/app/image.png', ['url']);

    // script
    test('src/app/test.worker.js', ['worker', 'babel']);
    test('src/app/test.js', ['babel']);
    test('src/app/worker.js', ['babel']);
    test('test/test.js', []);
    test('node_modules/some-module/test.js', []);

    // style
    test('src/app/style.css', ['css']);
    test('src/app/style.module.css', ['module', 'css']);
    test('src/app/style.scss', ['sass']);
    test('src/app/style.module.scss', ['module', 'sass']);
    test('src/app/style.sass', ['sass']);
    test('src/app/style.module.sass', ['module', 'sass']);
    test('src/app/style.less', ['less']);
    test('src/app/style.module.less', ['module', 'less']);
    test('node_modules/module/style.less', ['less']);

    // file
    test('src/app/file.mp3', ['file']);
    test('node_modules/module/file.xls', ['file']);

    // etc
    test('test/test.json', []);
  });
});
