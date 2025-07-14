'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    categoryId: string;
    isFavorite?: boolean;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push(
      paths.category(product.categoryId).product(product.id).getHref(),
    );
  };

  return (
    <div className="size-full bg-card text-card-foreground rounded-md pt-13 pb-4 px-6 shadow-sm relative">
      {/* Like Button */}
      <Button
        variant="ghost"
        size="icon-circle"
        className="text-muted-foreground cursor-not-allowed absolute top-2 right-2"
        disabled
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
        <div className="space-y-4 text-center w-full">
          {/* Product Info */}
          <h3 className="font-medium line-clamp-2 leading-6 h-12">
            {product.name}
          </h3>
          <p className="font-semibold text-xl">
            ${product.price.toLocaleString()}
          </p>
          {/* Buy Now Button */}
          <Button size="md" className="w-full" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
