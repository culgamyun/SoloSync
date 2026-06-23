'use client';

import { BellOff, BellRing, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushPermissionCard() {
  const { supported, permission, loading, subscribe, unsubscribe } = usePushNotifications();

  if (!supported) {
    return (
      <div className='rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'>
        <div className='flex items-center gap-3'>
          <BellOff className='h-5 w-5 text-[#777268]' />
          <p className='text-sm text-[#777268]'>Push notifications are not supported on this device.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'>
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#f5ded6] text-accent'>
              <BellRing className='h-5 w-5' />
            </div>
            <div>
              <h3 className='font-bold text-[#22251f]'>Weekly nudges</h3>
              <p className='text-sm text-[#777268]'>Permission: {permission}</p>
            </div>
          </div>
          <div className='rounded-md bg-[#fffaf2] px-4 py-3 text-sm text-[#777268]'>
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
      <div className='mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#62705d]'>
        <ShieldCheck className='h-4 w-4' />
        Only active subscriptions receive reminders.
      </div>
    </div>
  );
}
