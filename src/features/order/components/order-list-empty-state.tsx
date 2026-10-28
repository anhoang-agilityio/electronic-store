import { Package } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

export function OrderListEmptyState() {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-4">
      <Package
        className="size-30 text-muted-foreground mb-4"
        aria-hidden="true"
      />
      <h2 className="text-xl font-bold mb-2 text-center">
        You haven&apos;t placed any orders yet
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        Your orders will show up here once you check out
      </p>
      <Button size="xl" asChild>
        <Link href={paths.home.getHref()}>Start shopping</Link>
      </Button>
    </section>
  );
}
