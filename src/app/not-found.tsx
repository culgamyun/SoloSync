import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <main className='mx-auto flex min-h-screen max-w-screen-sm flex-col items-center justify-center gap-4 px-6 text-center'>
      <FileQuestion className='h-12 w-12 text-primary' />
      <div className='space-y-2'>
        <h1 className='font-display text-3xl font-semibold'>Page not found</h1>
        <p className='text-muted-foreground'>The page you requested does not exist or may require a different locale.</p>
      </div>
    </main>
  );
}
