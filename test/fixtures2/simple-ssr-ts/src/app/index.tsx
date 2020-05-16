import React from 'react';
import { hydrate } from 'react-dom';
import { App } from './app';

require('react-app-polyfill/ie11');

hydrate((
  <App initialState={window.__INITIAL_STATE__}/>
), document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}