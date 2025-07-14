import { SquareX } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function CartEmptyState() {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-4">
      <SquareX className="size-30 text-muted-foreground mb-4" />
      <h1 className="text-xl font-bold mb-2 text-center">Your cart is empty</h1>
      <p className="text-gray-500 mb-6 text-center">
        Add products to your cart to start shopping
      </p>
      <Button size="xl" asChild>
        <Link href={paths.home.getHref()}>Back to Home</Link>
      </Button>
    </section>
  );
}
