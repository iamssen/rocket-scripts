onmessage = (event: MessageEvent<ImageData>) => {
  const imageData = event.data;
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

  postMessage(imageData, [imageData.data.buffer]);
};
