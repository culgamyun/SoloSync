'use client';

import { Apple, Chrome } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { publicEnv } from '@/lib/env';

export function OauthButtons({ locale }: { locale: string }) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const t = useTranslations('auth');

  const handleOauth = async (provider: 'google' | 'apple') => {
    setIsPending(true);
    setErrorMessage('');

    try {
      if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        window.location.href = `/${locale}/home`;
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/${locale}/callback`,
          skipBrowserRedirect: true
        }
      });

      if (error) {
        setErrorMessage(locale === 'ko' ? '로그인을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.' : 'Could not start sign-in. Please try again.');
        setIsPending(false);
        return;
      }

      if (!data.url) {
        setErrorMessage(locale === 'ko' ? '로그인 주소를 받지 못했어요. 설정을 확인해 주세요.' : 'No sign-in URL was returned. Please check the auth settings.');
        setIsPending(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      setErrorMessage(locale === 'ko' ? '로그인을 시작하지 못했어요. 네트워크 상태를 확인해 주세요.' : 'Could not start sign-in. Please check your connection.');
      setIsPending(false);
    }
  };

  return (
    <div className='space-y-3'>
      <Button type='button' className='w-full justify-between rounded-[1.5rem] px-5' size='lg' onClick={() => void handleOauth('google')} disabled={isPending}>
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
          type='button'
          onClick={() => void handleOauth('apple')}
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
      {errorMessage ? (
        <p className='rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger' role='alert'>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
