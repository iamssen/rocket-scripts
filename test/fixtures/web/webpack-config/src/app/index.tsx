import React from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';

function App() {
  return <Title text="Hello World!" />;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
