//tslint:disable-next-line:no-any
export function takeLatest(value: any): any {
  return Array.isArray(value) ? value.pop() : value;
}