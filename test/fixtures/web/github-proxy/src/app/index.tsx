import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

function App() {
  const [result, setResult] = useState<object | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`/api/users/iamssen/repos`)
      .then((res) => res.json())
      .then(setResult)
      .catch((error) => setError(error));
  }, []);

  return (
    <>
      {result && (
        <pre>
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      )}
      {error && <div>{error.toString()}</div>}
    </>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
