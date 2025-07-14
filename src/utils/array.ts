/**
 * Chunks an array into smaller arrays of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns Array of chunks
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
