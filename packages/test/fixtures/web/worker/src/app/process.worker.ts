import { process } from 'app/process';

onmessage = ({ data }: MessageEvent<{ value: number }>) => {
  console.log('process.worker.ts..onmessage()', data);
  postMessage({ value: process(data.value) });
};
