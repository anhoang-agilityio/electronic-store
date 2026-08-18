'use client';

import { create } from 'zustand';

type SessionStore = {
  currentUserId: string | null;
  setCurrentUser: (userId: string) => void;
  clearCurrentUser: () => void;
};

export const useSessionStore = create<SessionStore>()((set) => ({
  currentUserId: null,
  setCurrentUser: (currentUserId) => set({ currentUserId }),
  clearCurrentUser: () => set({ currentUserId: null }),
}));
