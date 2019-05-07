//tslint:disable-next-line:no-any
export function takeMinimistLatestValue(value: any): any {
  return Array.isArray(value) ? value.pop() : value;
}