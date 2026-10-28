'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useUserStore } from '@/stores/user-store';
import type { Order } from '@/types/store';

type BuyAgainButtonProps = {
  order: Order;
  size?: React.ComponentProps<typeof Button>['size'];
  className?: string;
};

// Keeps the button disabled long enough to swallow rapid double clicks
const COOLDOWN_MS = 1000;

export function BuyAgainButton({
  order,
  size,
  className,
}: BuyAgainButtonProps) {
  const router = useRouter();
  const addToCart = useUserStore((s) => s.addToCart);
  const [cooldown, setCooldown] = useState(false);
  // A ref blocks a second click that lands before the disabled state re-renders
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleBuyAgain = () => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setCooldown(true);
    timerRef.current = setTimeout(() => {
      lockedRef.current = false;
      setCooldown(false);
    }, COOLDOWN_MS);

    // TODO(#13): use the current product price instead of the order snapshot
    // once a cheap client-side price lookup exists. Until then the snapshot
    // price is added, as stored on the order.
    for (const { product, quantity } of order.items) {
      addToCart(product, quantity);
    }

    const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
    toast.success(
      `${count} ${count === 1 ? 'item' : 'items'} added to your cart`,
      {
        action: {
          label: 'View cart',
          onClick: () => router.push(paths.cart.getHref()),
        },
      },
    );
  };

  return (
    <Button
      type="button"
      size={size}
      className={className}
      disabled={cooldown}
      onClick={handleBuyAgain}
    >
      Buy again
    </Button>
  );
}
