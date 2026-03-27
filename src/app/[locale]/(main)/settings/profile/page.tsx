import { updateProfileAction } from '@/actions/settings';
import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { comfortOptions } from '@/lib/constants/social';
import { getProfileSnapshot } from '@/lib/server/app-data';

export default async function ProfileSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getProfileSnapshot();
  const language = locale === 'en' ? 'en' : 'ko';

  return (
    <AppShell padded={false} header={<MobileHeader title={language === 'ko' ? '프로필' : 'Profile'} backHref='/settings' centered />}>
      <div className='px-5 pb-10 pt-6'>
        <form action={updateProfileAction} className='space-y-5 rounded-[2rem] bg-white/84 p-5 shadow-ambient'>
          <input type='hidden' name='locale' value={locale} />
          <div>
            <Label>{language === 'ko' ? '표시 이름' : 'Display name'}</Label>
            <Input name='displayName' defaultValue={snapshot.viewer?.displayName ?? ''} />
          </div>
          <div>
            <Label>{language === 'ko' ? '도시' : 'City'}</Label>
            <Input name='city' defaultValue={snapshot.profile?.city ?? ''} />
          </div>
          <div>
            <Label>{language === 'ko' ? '타임존' : 'Timezone'}</Label>
            <Input name='timezone' defaultValue={snapshot.viewer?.timezone ?? 'UTC'} />
          </div>
          <div>
            <Label>{language === 'ko' ? '편안함 수준' : 'Comfort level'}</Label>
            <select
              name='comfortLevel'
              defaultValue={snapshot.profile?.comfortLevel ?? 'medium'}
              className='flex h-14 w-full rounded-[1.3rem] border border-transparent bg-white/92 px-5 py-3 text-[15px] text-foreground shadow-ambient outline-none'
            >
              {comfortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[language]}
                </option>
              ))}
            </select>
          </div>
          <Button type='submit' className='w-full'>
            {language === 'ko' ? '저장' : 'Save'}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
