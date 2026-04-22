import { updateProfileAction } from '@/actions/settings';
import { AppShell } from '@/components/common/app-shell';
import { MobileHeader } from '@/components/common/mobile-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { comfortOptions } from '@/lib/constants/social';
import { routineSpaceOptions, socialFearOptions } from '@/lib/challenges/profile-personalization';
import { getProfileSnapshot } from '@/lib/server/app-data';

export default async function ProfileSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getProfileSnapshot();
  const language = locale === 'en' ? 'en' : 'ko';
  const selectedRoutineSpaces = new Set(snapshot.profile?.routineSpaces ?? []);
  const selectedSocialFears = new Set(snapshot.profile?.socialFears ?? []);

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
            <Label>{language === 'ko' ? '시간대' : 'Timezone'}</Label>
            <Input name='timezone' defaultValue={snapshot.viewer?.timezone ?? 'UTC'} />
          </div>

          <div>
            <Label>{language === 'ko' ? '현재 부담 정도' : 'Comfort level'}</Label>
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

          <section className='space-y-3 rounded-xl border border-line bg-surface-high p-4'>
            <div>
              <h2 className='font-display text-[1.1rem] font-bold tracking-normal'>
                {language === 'ko' ? '자주 지나는 생활 공간' : 'Routine spaces'}
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                {language === 'ko'
                  ? '미션이 너무 뜬금없지 않게, 이미 지나치는 공간을 골라주세요.'
                  : 'Pick the places that are already part of your week.'}
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {routineSpaceOptions.map((option) => (
                <label key={option.value} className='block cursor-pointer'>
                  <input
                    type='checkbox'
                    name='routineSpaces'
                    value={option.value}
                    defaultChecked={selectedRoutineSpaces.has(option.value)}
                    className='peer sr-only'
                  />
                  <span className='inline-flex min-h-11 items-center whitespace-nowrap rounded-md border border-line bg-surface-low px-4 py-2 text-sm font-semibold text-muted-foreground transition peer-checked:border-primary/30 peer-checked:bg-primary/10 peer-checked:text-primary'>
                    {option.label[language]}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className='space-y-3 rounded-xl border border-line bg-surface-high p-4'>
            <div>
              <h2 className='font-display text-[1.1rem] font-bold tracking-normal'>
                {language === 'ko' ? '가장 부담되는 순간' : 'Social fears'}
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                {language === 'ko'
                  ? '상담처럼 깊게 적지 않아도 됩니다. 미션 톤을 맞추는 데만 씁니다.'
                  : 'This is only used to tune the tone of future missions.'}
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {socialFearOptions.map((option) => (
                <label key={option.value} className='block cursor-pointer'>
                  <input
                    type='checkbox'
                    name='socialFears'
                    value={option.value}
                    defaultChecked={selectedSocialFears.has(option.value)}
                    className='peer sr-only'
                  />
                  <span className='inline-flex min-h-11 items-center whitespace-nowrap rounded-md border border-line bg-surface-low px-4 py-2 text-sm font-semibold text-muted-foreground transition peer-checked:border-observation/30 peer-checked:bg-observation/16 peer-checked:text-foreground'>
                    {option.label[language]}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <Button type='submit' className='w-full'>
            {language === 'ko' ? '저장' : 'Save'}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
