'use client';

import { CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { paths } from '@/config/paths';
import { CheckoutProductCard } from '@/features/checkout/components/checkout-product-card';
import { useOrder, useUserStore } from '@/stores/user-store';

type OrderDetailProps = {
  orderId: string;
  placed?: boolean;
};

const subscribeToHydration = (onChange: () => void) =>
  useUserStore.persist.onFinishHydration(onChange);
const getHydrated = () => useUserStore.persist.hasHydrated();
const getServerHydrated = () => false;

const formatPlacedAt = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

function OrderDetailSkeleton() {
  return (
    <main
      className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10"
      aria-busy="true"
    >
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
      <div className="bg-input rounded-md py-3 px-4 text-base">{children}</div>
    </div>
  );
}

export function OrderDetail({ orderId, placed = false }: OrderDetailProps) {
  const { data: session, status } = useSession();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrated,
    getServerHydrated,
  );
  const currentUserId = useUserStore((s) => s.currentUserId);
  const order = useOrder(orderId);

  // The session user is synced into the store after sign-in, so wait for both
  const storeReady =
    hydrated && (!session?.user?.id || currentUserId === session.user.id);

  if (status === 'loading' || !storeReady) {
    return <OrderDetailSkeleton />;
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

  if (!order) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Order not found</h1>
          <p className="text-gray-600 mb-4">
            We could not find this order. It may belong to another account.
          </p>
          <Button asChild>
            <Link href={paths.orders.getHref()}>Back to my orders</Link>
          </Button>
        </div>
      </main>
    );
  }

  const { totals, address, shipment, promoCode } = order;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10">
      {placed && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
        >
          <CircleCheck className="size-6 shrink-0" aria-hidden="true" />
          <p className="font-medium">Thanks! Your order has been placed.</p>
        </div>
      )}

      <header>
        <h1 className="text-2xl font-bold">Order {order.number}</h1>
        <p className="text-gray-600">
          Placed on{' '}
          <time dateTime={order.createdAt}>
            {formatPlacedAt(order.createdAt)}
          </time>
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-label="Items">
        {order.items.map((item) => (
          <CheckoutProductCard
            key={item.product.id}
            product={{
              image: item.product.image,
              name: item.product.name,
              quantity: item.quantity,
              price: (item.product.price * item.quantity).toLocaleString(),
            }}
          />
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Section title="Shipping address">
          <div className="font-medium">{address.title}</div>
          <div>{address.address}</div>
          <div className="text-gray-600">{address.phone}</div>
        </Section>
        <Section title="Shipment method">{shipment.description}</Section>
        {promoCode && <Section title="Promo code">{promoCode.code}</Section>}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border p-6">
        <div className="flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span>${totals.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Tax</span>
          <span>${totals.tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Shipping</span>
          <span>${totals.shipping.toLocaleString()}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Discount</span>
            <span>-${totals.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-3 text-lg font-bold">
          <span>Total</span>
          <span>${totals.total.toLocaleString()}</span>
        </div>
      </section>

      <Button asChild variant="outline">
        <Link href={paths.orders.getHref()}>Back to my orders</Link>
      </Button>
    </main>
  );
}
