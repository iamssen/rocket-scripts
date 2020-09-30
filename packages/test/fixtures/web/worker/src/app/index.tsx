import React, { ChangeEvent, useCallback, useRef } from 'react';
import { render } from 'react-dom';
import MyWorker from './process.worker.ts';

function App() {
  const canvas1 = useRef<HTMLCanvasElement>(null);
  const canvas2 = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((imageData: ImageData) => {
    if (!canvas2.current) return;

    const ctx2 = canvas2.current.getContext('2d');

    if (!ctx2) return;

    const w = imageData.width;
    const h = imageData.height;
    const data = imageData.data;

    let x = -1;
    let y;

    while (++x < w) {
      y = -1;
      while (++y < h) {
        const index = (x + y * w) * 4;
        data[index] = data[index + 1] * 1.6;
      }
    }

    canvas2.current.width = imageData.width;
    canvas2.current.height = imageData.height;

    ctx2.putImageData(imageData, 0, 0);
  }, []);

  const drawWithWorker = useCallback((imageData: ImageData) => {
    const worker = new Worker('worker.js');

    worker.addEventListener('message', ({ data }: MessageEvent<ImageData>) => {
      const imageData = data;

      if (!canvas2.current) return;

      const ctx2 = canvas2.current.getContext('2d');

      if (!ctx2) return;

      canvas2.current.width = imageData.width;
      canvas2.current.height = imageData.height;

      ctx2.putImageData(imageData, 0, 0);
    });

    worker.postMessage(imageData, [imageData.data.buffer]);
  }, []);

  const drawWithWebpackWorker = useCallback((imageData: ImageData) => {
    const worker: Worker = new MyWorker();

    worker.addEventListener('message', ({ data }: MessageEvent<ImageData>) => {
      const imageData = data;

      if (!canvas2.current) return;

      const ctx2 = canvas2.current.getContext('2d');

      if (!ctx2) return;

      canvas2.current.width = imageData.width;
      canvas2.current.height = imageData.height;

      ctx2.putImageData(imageData, 0, 0);
    });

    worker.postMessage(imageData, [imageData.data.buffer]);
  }, []);

  const onFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (!canvas1.current) return;

    const ctx1 = canvas1.current.getContext('2d');

    if (!ctx1) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const bitmap: ImageBitmap = await createImageBitmap(file);

    canvas1.current.width = bitmap.width;
    canvas1.current.height = bitmap.height;

    ctx1.drawImage(bitmap, 0, 0);

    const imageData: ImageData = ctx1.getImageData(
      0,
      0,
      bitmap.width,
      bitmap.height,
    );

    //draw(imageData);
    //drawWithWorker(imageData);
    drawWithWebpackWorker(imageData);
  }, []);

  return (
    <div>
      <div>
        <input
          type="file"
          accept="image/*"
          name="input"
          id="input"
          onChange={onFileChange}
        />
        <label htmlFor="input">Choose File</label>
      </div>

      <canvas ref={canvas1}></canvas>
      <canvas ref={canvas2}></canvas>
    </div>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
