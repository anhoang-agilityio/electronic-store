'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { paths } from '@/config/paths';
import type { CartProductSnapshotData } from '@/features/cart/domain';
import { useCartActions } from '@/features/cart/hooks/use-cart-actions';
import { useSessionStore } from '@/features/session/store/session-store';

export type AddToCartProps = {
  product: CartProductSnapshotData;
};

export function AddToCart({ product }: AddToCartProps) {
  const { data: session } = useSession();
  const { addItem } = useCartActions();
  const setCurrentUser = useSessionStore((state) => state.setCurrentUser);
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);

  const handleAddToCart = () => {
    if (!session?.user?.id) {
      setShowDialog(true);
      return;
    }

    setCurrentUser(session.user.id);
    void addItem(product).then((added) => {
      if (added) toast.success(`Added "${product.name}" to cart!`);
    });
  };

  const handleConfirmLogin = () => {
    setShowDialog(false);
    router.push(
      `${paths.auth.signin.getHref()}?callbackUrl=${encodeURIComponent(pathname)}`,
    );
  };

  return (
    <>
      <Button size="xl" className="w-full" onClick={handleAddToCart}>
        Add to Cart
      </Button>
      <ConfirmationDialog
        open={showDialog}
        title="Sign in required"
        description="You need to sign in to add products to your cart. Go to the sign-in page?"
        confirmText="Sign in"
        cancelText="Cancel"
        onConfirm={handleConfirmLogin}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}
