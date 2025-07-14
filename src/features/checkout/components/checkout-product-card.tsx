import Image from 'next/image';
import React from 'react';

type CheckoutProduct = {
  image: string;
  name: string;
  price: string;
};

type CheckoutProductCardProps = {
  product: CheckoutProduct;
};

export function CheckoutProductCard({ product }: CheckoutProductCardProps) {
  const { image, name, price } = product;
  return (
    <div className="flex items-center gap-4 bg-input rounded-xl p-4 pr-0 w-full">
      {/* Product Image */}
      <div className="relative flex-shrink-0 size-10 rounded overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      {/* Product Info */}
      <span className="flex-1 font-medium truncate">{name}</span>
      <span className="font-bold whitespace-nowrap pr-6">${price}</span>
    </div>
  );
}
