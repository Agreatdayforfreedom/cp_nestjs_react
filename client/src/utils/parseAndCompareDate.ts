export function parseAndCompareDate(
  created_at: string,
  updated_at: string,
): string {
  // convert to date
  const d1 = new Date(created_at);
  const d2 = new Date(updated_at);

  if (d1.getTime() === d2.getTime()) {
    return `${d1.toDateString()}, ${d1.toLocaleTimeString()}`;
  } else {
    return `Last updated ${d2.toDateString()}, ${d2.toLocaleTimeString()}`;
  }
}
