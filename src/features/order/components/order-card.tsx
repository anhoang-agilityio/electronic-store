import Image from 'next/image';
import Link from 'next/link';

import { paths } from '@/config/paths';
import type { Order } from '@/types/store';

type OrderCardProps = {
  order: Order;
};

const MAX_THUMBNAILS = 3;

export function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const thumbnails = order.items.slice(0, MAX_THUMBNAILS);
  const extra = order.items.length - thumbnails.length;

  return (
    <Link
      href={paths.orders.detail(order.id).getHref()}
      className="flex flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        <div className="font-bold">Order {order.number}</div>
        <div className="text-sm text-gray-600">
          <time dateTime={order.createdAt}>
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              dateStyle: 'long',
            })}
          </time>
          {' · '}
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {thumbnails.map((item) => (
            <div
              key={item.product.id}
              className="relative size-12 overflow-hidden rounded bg-input"
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ))}
          {extra > 0 && (
            <span className="text-sm font-medium text-gray-600">+{extra}</span>
          )}
        </div>
        <div className="text-lg font-bold whitespace-nowrap">
          ${order.totals.total.toLocaleString()}
        </div>
      </div>
    </Link>
  );
}
