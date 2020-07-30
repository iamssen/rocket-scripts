import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

function App() {
  const [result, setResult] = useState<object | null>(null);

  useEffect(() => {
    fetch(`/api/frontend-fixtures/package.json`)
      .then((res) => res.json())
      .then(setResult);
  }, []);

  return (
    <>
      {result && (
        <pre>
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      )}
    </>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
