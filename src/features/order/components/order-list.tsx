'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { paths } from '@/config/paths';
import { OrderCard } from '@/features/order/components/order-card';
import { OrderListEmptyState } from '@/features/order/components/order-list-empty-state';
import { useOrdersReady } from '@/features/order/hooks/use-orders-ready';
import { useCurrentOrders } from '@/stores/user-store';

function OrderListSkeleton() {
  return (
    <main
      className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10"
      aria-busy="true"
    >
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </main>
  );
}

export function OrderList() {
  const { session, ready } = useOrdersReady();
  const orders = useCurrentOrders();

  if (!ready) {
    return <OrderListSkeleton />;
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not authenticated</h1>
          <Button asChild>
            <Link href={paths.auth.signin.getHref()}>Sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold">My orders</h1>
      {orders.length === 0 ? (
        <OrderListEmptyState />
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
