export function process(length: number): number {
  let sum: number = 0;
  let i: number = length;
  while (--i >= 0) {
    sum += i;
  }
  return sum;
}
