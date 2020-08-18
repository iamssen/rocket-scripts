import React, { useState } from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';

function App() {
  const [num, setNum] = useState<number>(0);

  return (
    <div>
      <Title text={`Count = ${num}`} />
      <button onClick={() => setNum((prev) => prev + 1)}>Increase</button>
    </div>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
