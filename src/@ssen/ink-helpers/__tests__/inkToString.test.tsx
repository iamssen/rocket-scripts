import { inkToString } from '@ssen/ink-helpers';
import chalk from 'chalk';
import { Color, Text } from 'ink';
import React from 'react';

describe('inkToString()', () => {
  test('should get text', () => {
    expect(
      inkToString(
        <>
          <Text>Hello</Text>
          <Text>World</Text>
          <Text>Foo</Text>
        </>,
      ),
    ).toBe('Hello\nWorld\nFoo\n');

    expect(
      inkToString(
        <>
          <Color bold>Hello</Color>
          <Color blue>World</Color>
        </>,
      ),
    ).toBe(`${chalk.bold('Hello')}\n${chalk.blue('World')}\n`);

    expect(
      inkToString(
        <>
          <Text>{`${chalk.bold('Hello')}\n${chalk.blue('World')}`}</Text>
        </>,
      ),
    ).toBe(`${chalk.bold('Hello')}\n${chalk.blue('World')}\n`);
  });
});
