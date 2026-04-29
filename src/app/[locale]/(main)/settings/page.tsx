import { Bell, ChevronRight, FileText, Globe, Lock, MoonStar, User2 } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { MotionReveal } from '@/components/motion/reveal';
import { Link } from '@/i18n/navigation';
import { getProfileSnapshot } from '@/lib/server/app-data';

const accountItems = [
  { href: '/settings/language', icon: Globe, fallback: { ko: '언어', en: 'Language' } },
  { href: '/settings/notifications', icon: Bell, fallback: { ko: '알림', en: 'Notifications' } },
  { href: '/settings/profile', icon: User2, fallback: { ko: '프로필', en: 'Profile' } }
] as const;

const legalItems = [
  { href: '/legal/privacy', icon: Lock, label: { ko: '개인정보 처리방침', en: 'Privacy policy' } },
  { href: '/legal/terms', icon: FileText, label: { ko: '이용약관', en: 'Terms of service' } }
] as const;

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const snapshot = await getProfileSnapshot();
  const language = locale === 'en' ? 'en' : 'ko';
  const isKorean = language === 'ko';
  const displayName = snapshot.viewer?.displayName ?? (isKorean ? '민수' : 'Mina');
  const email = snapshot.viewer?.email ?? 'minsu@email.com';

  return (
    <AppShell>
      <MotionReveal as='section' className='text-center'>
        <p className='font-data text-[12px] font-bold uppercase tracking-normal text-primary/70'>
          {isKorean ? '설정' : 'Settings'}
        </p>
        <h1 className='mt-3 break-keep font-display text-[2.2rem] font-bold tracking-normal'>
          {isKorean ? '환경과 보호 설정' : 'Preferences and safety'}
        </h1>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.05}
        className='mt-8 rounded-lg border border-line bg-surface-high p-5 shadow-sanctuary'
      >
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-md border border-primary/15 bg-primary/10 text-[2rem] font-bold text-primary'>
          {displayName.slice(0, 1)}
        </div>
        <h2 className='mt-4 text-center text-[1.3rem] font-bold'>{displayName}</h2>
        <p className='mt-1 text-center text-sm text-muted-foreground'>{email}</p>
        <Link href='/settings/profile' className='mt-4 inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-bold text-primary transition hover:bg-surface-low'>
          {isKorean ? '프로필 편집' : 'Edit profile'}
          <ChevronRight className='h-4 w-4' />
        </Link>
      </MotionReveal>

      <MotionReveal as='section' delay={0.08} className='mt-8 space-y-3'>
        <h2 className='px-2 font-data text-[11px] font-bold uppercase tracking-normal text-muted-foreground'>
          {isKorean ? '환경설정' : 'Preferences'}
        </h2>
        <div className='overflow-hidden rounded-lg border border-line bg-surface-high shadow-ambient'>
          {accountItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className='flex items-center justify-between px-4 py-4 transition hover:bg-surface-low'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface-low text-primary'>
                    <Icon className='h-4 w-4' />
                  </div>
                  <span className='font-medium'>{item.fallback[language]}</span>
                </div>
                <ChevronRight className='h-4 w-4 text-muted-foreground' />
              </Link>
            );
          })}
          <div className='flex items-center justify-between px-4 py-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface-low text-primary'>
                <MoonStar className='h-4 w-4' />
              </div>
              <span className='font-medium'>{isKorean ? '다크 모드' : 'Dark mode'}</span>
            </div>
            <span className='rounded bg-surface-low px-3 py-1 text-xs font-bold text-muted-foreground'>
              {isKorean ? '준비 중' : 'Soon'}
            </span>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.11} className='mt-8 space-y-3'>
        <h2 className='px-2 font-data text-[11px] font-bold uppercase tracking-normal text-muted-foreground'>
          {isKorean ? '정보' : 'Information'}
        </h2>
        <div className='overflow-hidden rounded-lg border border-line bg-surface-high shadow-ambient'>
          {legalItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className='flex items-center justify-between px-4 py-4 transition hover:bg-surface-low'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface-low text-primary'>
                    <Icon className='h-4 w-4' />
                  </div>
                  <span className='font-medium'>{item.label[language]}</span>
                </div>
                <ChevronRight className='h-4 w-4 text-muted-foreground' />
              </Link>
            );
          })}
        </div>
      </MotionReveal>
    </AppShell>
  );
}
