'use client';

import { Apple, Chrome } from 'lucide-react';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { publicEnv } from '@/lib/env';

export function OauthButtons({ locale }: { locale: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('auth');

  const handleOauth = (provider: 'google' | 'apple') => {
    startTransition(async () => {
      if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        window.location.href = `/${locale}/home`;
        return;
      }

      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/${locale}/callback`
        }
      });
    });
  };

  return (
    <div className='space-y-3'>
      <Button className='w-full justify-between rounded-[1.5rem] px-5' size='lg' onClick={() => handleOauth('google')} disabled={isPending}>
        <span className='flex items-center gap-3'>
          <Chrome className='h-4 w-4' />
          {t('google')}
        </span>
        <span className='text-sm opacity-80'>→</span>
      </Button>
      {publicEnv.NEXT_PUBLIC_ENABLE_APPLE_AUTH === 'true' ? (
        <Button
          className='w-full justify-between rounded-[1.5rem] px-5'
          size='lg'
          variant='outline'
          onClick={() => handleOauth('apple')}
          disabled={isPending}
        >
          <span className='flex items-center gap-3'>
            <Apple className='h-4 w-4' />
            {t('apple')}
          </span>
          <span className='text-sm opacity-80'>→</span>
        </Button>
      ) : (
        <p className='px-1 text-sm text-muted-foreground'>{t('appleSoon')}</p>
      )}
    </div>
  );
}
