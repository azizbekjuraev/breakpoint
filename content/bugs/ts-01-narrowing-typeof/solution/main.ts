export function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return String(value);
}
