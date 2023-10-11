import { addMinutes, format } from 'date-fns';

export function formatUTCDate(date?: string) {
  const value = new Date(date ?? '');
  return new Date(format(addMinutes(value, value.getTimezoneOffset()), 'yyyy-MM-dd HH:mm:ss')).toISOString();
}
