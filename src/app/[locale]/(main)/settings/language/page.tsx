import { updateLanguageAction } from '@/actions/settings';
import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { Button } from '@/components/ui/button';

const locales = [
  { value: 'ko', label: '한국어', description: '기본 언어로 사용' },
  { value: 'en', label: 'English', description: 'Use English across the app' }
] as const;

export default async function LanguageSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <AppShell padded={false} header={<MobileHeader title={locale === 'ko' ? '언어' : 'Language'} backHref='/settings' centered />}>
      <div className='bg-[#fbf6ed] px-5 pb-10 pt-6'>
        <div className='space-y-4'>
          {locales.map((item) => (
            <form key={item.value} action={updateLanguageAction} className='rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-ambient'>
              <input type='hidden' name='locale' value={item.value} />
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='font-semibold text-[#22251f]'>{item.label}</p>
                  <p className='mt-1 text-sm text-[#777268]'>{item.description}</p>
                </div>
                <Button type='submit' variant={item.value === locale ? 'secondary' : 'outline'}>
                  {item.value === locale ? (locale === 'ko' ? '사용 중' : 'Selected') : locale === 'ko' ? '변경' : 'Use'}
                </Button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
