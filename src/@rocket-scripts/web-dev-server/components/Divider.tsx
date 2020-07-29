import { BackgroundColor, ForegroundColor } from 'chalk';
import { Text, TextProps } from 'ink';
import React from 'react';

export interface DividerProps extends Omit<TextProps, 'children' | 'color' | 'backgroundColor'> {
  indent?: number;
  children: string;
  width?: number;
  color?: typeof ForegroundColor;
  backgroundColor?: typeof BackgroundColor;
}

export function Divider({
  indent = 1,
  children,
  width = process.stdout.columns - 9,
  ...textProps
}: DividerProps) {
  return (
    <>
      <Text {...textProps}> {`\n${'='.repeat(indent)}${(' ' + children + ' ').padEnd(width, '=')}\n`}</Text>
    </>
  );
}
