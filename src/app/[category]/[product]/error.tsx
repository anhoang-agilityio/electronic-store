'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';

export default function ProductPageError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
      <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
      <p className="mb-6 text-base text-muted-foreground">
        Sorry, there was a problem loading the product. Please try again.
      </p>
      <div className="flex gap-4">
        <Button className="px-6 py-2" size="xl" onClick={() => reset()}>
          Reload page
        </Button>
        <Button
          variant="outline"
          size="xl"
          className="px-6 py-2"
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
