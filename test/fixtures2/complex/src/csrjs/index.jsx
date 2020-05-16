import { App } from 'app';
import React from 'react';
import { render } from 'react-dom';

require('react-app-polyfill/ie11');

render(<App/>, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}