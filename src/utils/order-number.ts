// Excludes easily confused characters (0/O, 1/I)
const ORDER_NUMBER_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ORDER_NUMBER_LENGTH = 6;

/**
 * Generates a short, human-readable order number, e.g. "ES-7F3K2Q"
 */
export function generateOrderNumber(): string {
  const values = new Uint32Array(ORDER_NUMBER_LENGTH);
  crypto.getRandomValues(values);
  const suffix = Array.from(
    values,
    (value) => ORDER_NUMBER_CHARS[value % ORDER_NUMBER_CHARS.length],
  ).join('');
  return `ES-${suffix}`;
}
