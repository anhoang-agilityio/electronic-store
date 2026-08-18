export function getDiscountedPrice(
  price: number,
  discountPercent: number,
): number {
  if (discountPercent <= 0) return Math.round(price);

  return Math.round(price * (1 - discountPercent / 100));
}
