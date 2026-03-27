'use client';

import { useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const supabase = createClient();

    let active = true;

    setLoading(true);
    supabase.auth.getUser().then(({ data }) => {
      if (!active) {
        return;
      }

      setSession(data.user?.id ?? null, data.user?.email ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user.id ?? null, session?.user.email ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setLoading, setSession]);

  return useAuthStore();
}
