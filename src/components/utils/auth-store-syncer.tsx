'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useSessionStore } from '@/features/session/store/session-store';

/**
 * Synchronizes the NextAuth session with the app's client-side session store.
 */
const useAuthStore = () => {
  const { data: session, status } = useSession();
  const setCurrentUser = useSessionStore((state) => state.setCurrentUser);
  const clearCurrentUser = useSessionStore((state) => state.clearCurrentUser);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user?.id) {
      setCurrentUser(session.user.id);
    } else {
      clearCurrentUser();
    }
  }, [session?.user?.id, status, setCurrentUser, clearCurrentUser]);
};

export function AuthStoreSyncer() {
  useAuthStore();
  return null;
}
