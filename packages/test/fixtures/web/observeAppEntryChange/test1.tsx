import React from 'react';
import { render } from 'react-dom';

export function Test() {
  return (
    <div>...</div>
  );
}

render(<Test/>, document.querySelector('#app'));