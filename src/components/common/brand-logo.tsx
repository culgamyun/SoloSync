import Image from 'next/image';

import { cn } from '@/lib/utils';

export function BrandLogo({
  className,
  priority = false
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src='/images/solosync-logo-lockup-imagegen-alpha.png'
      alt='SoloSync'
      width={900}
      height={285}
      priority={priority}
      className={cn('h-auto w-[220px]', className)}
    />
  );
}
