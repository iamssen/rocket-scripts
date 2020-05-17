export function flatPackageName(name: string): string {
  return /^@/.test(name) ? name.substr(1).split('/').join('__') : name;
}
