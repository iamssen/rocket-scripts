import { BackgroundColor, ForegroundColor } from 'chalk';
import { Text, TextProps } from 'ink';
import React from 'react';

export interface PadTextProps
  extends Omit<TextProps, 'children' | 'color' | 'backgroundColor'> {
  title: string;
  children: string;
  indent?: number;
  titleWidth?: number;
  color?: typeof ForegroundColor;
  backgroundColor?: typeof BackgroundColor;
}

export function PadText({
  title,
  children,
  indent = 1,
  titleWidth = 7,
  ...textProps
}: PadTextProps) {
  return (
    <Text {...textProps}>
      {' '.repeat(indent)}
      {title.padEnd(titleWidth, ' ')} : {children}
    </Text>
  );
}
