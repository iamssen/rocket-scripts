import React from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';
import './test.less';
import './test.scss';
//@ts-ignore
import lessStyle from './test.module.less';
//@ts-ignore
import sassStyle from './test.module.scss';

function App() {
  return <Title text="Hello World!" className={lessStyle.underline + ' ' + sassStyle.transform} />;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
