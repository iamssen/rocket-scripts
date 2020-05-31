export type UpperString = string;

/**
 * hello
 * @param text
 */
export default function (text: string): UpperString {
  return text.toUpperCase();
}