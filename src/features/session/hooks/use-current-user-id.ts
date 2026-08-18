'use client';

import { useSessionStore } from '../store/session-store';

export function useCurrentUserId(): string | null {
  return useSessionStore((state) => state.currentUserId);
}
