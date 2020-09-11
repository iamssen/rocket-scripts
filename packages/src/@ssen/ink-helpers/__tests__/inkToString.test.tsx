import { inkToString } from '@ssen/ink-helpers';
import chalk from 'chalk';
import { Text } from 'ink';
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
          <Text bold>Hello</Text>
          <Text color="blue">World</Text>
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
