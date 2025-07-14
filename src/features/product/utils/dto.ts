import type { ProductCardProps } from '@/features/product/components/product-card';
import type { Product as ApiProduct } from '@/types/api';

type ProductCardInput = ProductCardProps['product'];

// Adapter function to convert API Product to ProductCard Input
export const adaptApiProductToProductCard = (
  apiProduct: ApiProduct,
): ProductCardInput => ({
  id: apiProduct.id,
  name: apiProduct.name,
  price: Math.round(apiProduct.price * (1 - apiProduct.discountPercent / 100)),
  image: apiProduct.images[0] ?? '',
  categoryId: apiProduct.categoryId,
  isFavorite: false,
});
