import { IntlMessageFormat } from 'intl-messageformat';

/**
 * icu format based https://formatjs.io/docs/intl-messageformat
 * @param text source text (e.g. "Hello, {name}!")
 * @param vars variables (e.g. { name: "Jane" })
 * @return formatted text (e.g. "Hello, Jane!")
 */
export function icuFormat(text: string, vars: Record<string, string | number>): string {
  const { format } = new IntlMessageFormat(text);
  const result: string | number | (string | number)[] = format(vars);
  return Array.isArray(result) ? result.join(' ') : result.toString();
}
