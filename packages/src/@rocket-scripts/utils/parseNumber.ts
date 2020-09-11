export function parseNumber(source: unknown): number | undefined {
  const n: number = typeof source === 'number' ? source : Number(source);
  return !isNaN(n) ? n : undefined;
}
