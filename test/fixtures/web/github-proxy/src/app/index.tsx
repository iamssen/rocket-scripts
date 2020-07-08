import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

function App() {
  const [repositories, setRepositories] = useState<{ full_name: string }[] | null>(null);

  useEffect(() => {
    fetch(`/api/users/iamssen/repos`)
      .then((res) => res.json())
      .then(setRepositories);
  }, []);

  return (
    <pre>
      <code>
        {JSON.stringify(
          repositories?.map(({ full_name }) => full_name),
          null,
          2,
        )}
      </code>
    </pre>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
