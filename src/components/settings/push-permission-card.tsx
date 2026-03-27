'use client';

import { BellOff, BellRing, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushPermissionCard() {
  const { supported, permission, loading, subscribe, unsubscribe } = usePushNotifications();

  if (!supported) {
    return (
      <div className='rounded-[2rem] bg-white/80 p-5 shadow-ambient'>
        <div className='flex items-center gap-3'>
          <BellOff className='h-5 w-5 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Push notifications are not supported on this device.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-peach/45 text-primary'>
              <BellRing className='h-5 w-5' />
            </div>
            <div>
              <h3 className='font-bold text-foreground'>Weekly nudges</h3>
              <p className='text-sm text-muted-foreground'>Permission: {permission}</p>
            </div>
          </div>
          <div className='rounded-[1.4rem] bg-surface-low px-4 py-3 text-sm text-muted-foreground'>
            챌린지 알림, 주간 리포트, 코치 팁을 같은 흐름으로 묶어 보냅니다.
          </div>
        </div>
        {permission === 'granted' ? (
          <Button variant='ghost' onClick={() => void unsubscribe()}>
            Disable
          </Button>
        ) : (
          <Button onClick={() => void subscribe()} disabled={loading}>
            Enable push
          </Button>
        )}
      </div>
      <div className='mt-4 flex items-center gap-2 text-[12px] font-semibold text-secondary'>
        <ShieldCheck className='h-4 w-4' />
        Only active subscriptions receive reminders.
      </div>
    </div>
  );
}
