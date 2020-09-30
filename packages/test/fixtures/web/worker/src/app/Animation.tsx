import React, { useEffect, useRef } from 'react';

const width: number = 500;
const height: number = 300;

export function Animation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stop = false;

    const ctx = canvasRef.current?.getContext('2d')!;

    function draw() {
      const t: number = (Date.now() / 2000) % 1;
      const w: number = t * width;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.rect(0, 0, w, height);
      ctx.fill();
      ctx.closePath();

      if (!stop) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);

    return () => {
      stop = true;
    };
  }, []);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
