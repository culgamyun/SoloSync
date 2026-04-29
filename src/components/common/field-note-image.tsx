import Image from 'next/image';

import { cn } from '@/lib/utils';

type FieldNoteImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function FieldNoteImage({
  src,
  alt = '',
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 430px) 90vw, 380px'
}: FieldNoteImageProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-line bg-surface-high shadow-ambient',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn('object-cover', imageClassName)}
      />
    </div>
  );
}
