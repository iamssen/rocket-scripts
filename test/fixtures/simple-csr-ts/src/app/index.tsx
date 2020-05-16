import React from 'react';
import { render } from 'react-dom';

require('react-app-polyfill/ie11');

function App() {
  return (
    <div>Hello World!</div>
  );
}

render(<App/>, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}