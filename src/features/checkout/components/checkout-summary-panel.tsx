'use client';

import React from 'react';

import { useCurrentCheckout } from '@/features/checkout/hooks/use-checkout';

import { CheckoutProductCard } from './checkout-product-card';

export function CheckoutSummaryPanel() {
  const checkout = useCurrentCheckout();
  const products = checkout?.products ?? [];
  const address = checkout?.address;
  const shipment = checkout?.shipment;
  const subtotal = checkout?.getSubtotal() ?? 0;
  const estimatedTax = checkout?.getEstimatedTax() ?? 0;
  const shippingFee = checkout?.getShippingFee() ?? 0;
  const total = checkout?.getTotal() ?? 0;

  return (
    <div className="flex flex-col gap-6 rounded-xl border p-8 w-full">
      <h1 className="font-medium text-xl mb-2">Summary</h1>
      <div className="flex flex-col gap-4">
        {products.length > 0 ? (
          products.map((item, index) => (
            <CheckoutProductCard
              key={`${item.product.id}-${index}`}
              product={{
                image: item.product.image,
                name: item.product.name,
                price: item.getSubtotal().toString(),
              }}
            />
          ))
        ) : (
          <div className="text-destructive">No products in checkout</div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Address</div>
          <div className="bg-input rounded-md py-3 px-4 text-base">
            {address ? (
              address.address
            ) : (
              <span className="text-destructive">No address selected</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">
            Shipment method
          </div>
          <div className="bg-input rounded-md py-3 px-4 text-base">
            {shipment ? (
              shipment.description
            ) : (
              <span className="text-destructive">No shipment selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated Tax</span>
          <span>${estimatedTax}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated shipping & Handling</span>
          <span>${shippingFee}</span>
        </div>
        <div className="flex justify-between items-center font-medium mt-2">
          <span>Total</span>
          <span className="font-bold text-lg">${total}</span>
        </div>
      </div>
    </div>
  );
}
