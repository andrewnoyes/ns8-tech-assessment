export function unixTimestamp(date?: Date): number {
  return Math.round((date || new Date()).getTime() / 1000); // getTime() is in ms, unix epoch is in seconds
}
