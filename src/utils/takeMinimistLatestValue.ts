export function takeMinimistLatestValue(value: undefined | string | string[]): string | undefined {
  return Array.isArray(value) ? value.pop() : value;
}