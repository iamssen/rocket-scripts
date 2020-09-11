import { a } from 'a';
import { b } from 'b';
import { c } from 'c';
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
