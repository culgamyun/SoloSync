'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

export function ReflectionSubmitButton({ locale }: { locale: string }) {
  const { pending } = useFormStatus();
  const isKorean = locale === 'ko';

  return (
    <Button type='submit' className='w-full' disabled={pending} aria-live='polite'>
      {pending ? <Loader2 className='h-4 w-4 animate-spin motion-reduce:animate-none' aria-hidden='true' /> : null}
      {pending ? (isKorean ? '저장 중...' : 'Saving...') : isKorean ? '회고 저장' : 'Save reflection'}
    </Button>
  );
}
