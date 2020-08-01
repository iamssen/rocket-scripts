import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

function App() {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/assets/book-opened.svg`)
      .then((res) => res.text())
      .then(setResult);
  }, []);

  return <div dangerouslySetInnerHTML={result ? { __html: result } : undefined} />;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
