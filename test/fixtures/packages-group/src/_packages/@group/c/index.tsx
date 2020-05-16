import b, { UpperString } from '@group/b';
import React from 'react';

export function getText(): UpperString {
  return b('c component');
}

export default function () {
  const text: UpperString = getText();
  return <div style={{border: '10px solid gray'}}>{text}</div>;
}