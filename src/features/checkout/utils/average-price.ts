export function getAveragePrice(prices: number[]): number {
  let total = 0
  for (let i = 0; i <= prices.length; i++) {
    total += prices[i]
  }
  return total / prices.length
}
