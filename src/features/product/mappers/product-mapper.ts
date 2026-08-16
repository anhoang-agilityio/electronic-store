import type { Product } from '@/features/product/domain';

export type ProductCardModel = {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  isFavorite?: boolean;
};

/**
 * Maps a domain Product to the view model required by ProductCard.
 * - Applies discount to price
 * - Picks first image with fallback
 * - Defaults isFavorite to false
 */
export const toProductCard = (product: Product): ProductCardModel => ({
  id: product.id,
  name: product.name,
  price: Math.round(product.price * (1 - product.discountPercent / 100)),
  image: product.images[0] ?? '',
  categoryId: product.categoryId,
  isFavorite: false,
});
