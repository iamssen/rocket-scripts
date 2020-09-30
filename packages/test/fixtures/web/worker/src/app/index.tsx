import { process } from 'app/process';
import React, { useCallback, useState } from 'react';
import { render } from 'react-dom';
import { Animation } from './Animation';
import ProcessWorker from './process.worker.ts';

const n: number = 3000000000;

function App() {
  const [sum, setSum] = useState<number>(0);

  const inlineProcess = useCallback(() => {
    setSum(process(n));
  }, []);

  const workerProcess = useCallback(() => {
    setSum(0);

    const worker: Worker = new ProcessWorker();

    worker.addEventListener(
      'message',
      ({ data }: MessageEvent<{ value: number }>) => {
        setSum(data.value);
        worker.terminate();
      },
    );

    worker.postMessage({ value: n });
  }, []);

  return (
    <>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}
      >
        {sum}
        <button onClick={inlineProcess}>Process on Inline</button>
        <button onClick={workerProcess}>Process on Worker</button>
      </div>
      <Animation />
    </>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
