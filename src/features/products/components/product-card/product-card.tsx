'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    isFavorite?: boolean;
  };
  onFavoriteToggle?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
};

export function ProductCard({
  product,
  onFavoriteToggle,
  onAddToCart,
}: ProductCardProps) {
  const handleFavoriteClick = () => {
    onFavoriteToggle?.(product.id);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product.id);
  };

  return (
    <div className="bg-card text-card-foreground rounded-md pt-13 pb-4 px-6 shadow-sm relative">
      {/* Top Section with Like Button */}
      <Button
        variant="ghost"
        size="icon-circle"
        className="text-muted-foreground cursor-not-allowed absolute top-2 right-2"
        onClick={handleFavoriteClick}
      >
        <Heart className="size-6" />
      </Button>
      <div className="flex flex-col gap-1 items-center">
        {/* Product Image */}
        <div className="w-3/5 max-w-40 aspect-square relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Product Info and Button */}
        <div className="space-y-4 text-center">
          {/* Product Info */}
          <h3 className="text-black font-medium leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-black font-semibold text-xl">
            ${product.price.toLocaleString()}
          </p>
          {/* Buy Now Button */}
          <Button size="md" className="w-full" onClick={handleAddToCart}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
