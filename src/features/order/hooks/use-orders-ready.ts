import { useSession } from 'next-auth/react';
import { useSyncExternalStore } from 'react';

import { useUserStore } from '@/stores/user-store';

const subscribeToHydration = (onChange: () => void) =>
  useUserStore.persist.onFinishHydration(onChange);
const getHydrated = () => useUserStore.persist.hasHydrated();
const getServerHydrated = () => false;

/**
 * True once the session has resolved, the persisted store is hydrated and the
 * session user has been synced into the store (it happens after sign-in).
 */
export function useOrdersReady() {
  const { data: session, status } = useSession();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrated,
    getServerHydrated,
  );
  const currentUserId = useUserStore((s) => s.currentUserId);

  const storeReady =
    hydrated && (!session?.user?.id || currentUserId === session.user.id);

  return { session, ready: status !== 'loading' && storeReady };
}
