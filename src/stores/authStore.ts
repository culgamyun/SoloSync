import { create } from 'zustand';

import { isSupabaseConfigured } from '@/lib/env';

type AuthState = {
  userId: string | null;
  email: string | null;
  configured: boolean;
  loading: boolean;
  setSession: (userId: string | null, email: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  configured: isSupabaseConfigured(),
  loading: false,
  setSession: (userId, email) => set({ userId, email }),
  setLoading: (loading) => set({ loading })
}));
