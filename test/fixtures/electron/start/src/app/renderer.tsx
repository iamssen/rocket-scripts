import React from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';

const text: string = window.hello.world();

function App() {
  return <Title text={text} />;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
