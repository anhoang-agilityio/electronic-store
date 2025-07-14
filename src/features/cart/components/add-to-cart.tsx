'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useUserStore } from '@/stores/user-store';
import type { CartItem } from '@/types/store';

export type AddToCartProps = {
  product: CartItem['product'];
};

export function AddToCart({ product }: AddToCartProps) {
  const { data: session } = useSession();
  const addToCart = useUserStore((s) => s.addToCart);
  const setCurrentUser = useUserStore((s) => s.setCurrentUser);
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);

  const handleAddToCart = () => {
    if (session?.user?.id) {
      setCurrentUser(session.user.id);
      addToCart(product);
      toast.success(`Added "${product.name}" to cart!`);
    } else {
      setShowDialog(true);
    }
  };

  const handleConfirmLogin = () => {
    setShowDialog(false);
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
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
