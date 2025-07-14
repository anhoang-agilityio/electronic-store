'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useUserStore } from '@/stores/user-store';

/**
 * useAuthStore
 *
 * This hook synchronizes the authentication state from NextAuth with the app's internal user store.
 * - When the user successfully logs in (session.user.id exists), it automatically calls setCurrentUser to store the userId.
 * - When the user logs out (session.user.id is missing), it automatically calls clearCurrentUser to remove the userId from the store.
 *
 */
const useAuthStore = () => {
  const { data: session, status } = useSession();
  const { setCurrentUser, clearCurrentUser } = useUserStore();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user?.id) {
      // User is logged in, set current user
      setCurrentUser(session.user.id);
    } else {
      // User is not logged in, clear current user
      clearCurrentUser();
    }
  }, [session?.user?.id, status, setCurrentUser, clearCurrentUser]);
};

export function AuthStoreSyncer() {
  useAuthStore();
  return null;
}
