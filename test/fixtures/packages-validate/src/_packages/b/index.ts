import moment from 'moment';

export type UpperString = string;

export default function (text: string): UpperString {
  return text.toUpperCase();
}