export function takeEvery(value: undefined | string | string[]): undefined | string {
  return Array.isArray(value)
    ? value.join(' ')
    : value;
}