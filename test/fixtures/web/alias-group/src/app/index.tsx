import { a } from '@group/a';
import { b } from '@group/b';
import { c } from '@group/c';
import React from 'react';
import { render } from 'react-dom';

function App() {
  return <h1>{[a, b, c].join('')}</h1>;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
