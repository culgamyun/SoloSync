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
    <AppShell contentClassName='bg-[#fbf6ed] px-5 pb-32 pt-5'>
      <MotionReveal as='section'>
        <p className='font-data text-[12px] font-bold uppercase text-accent'>
          {isKorean ? '설정' : 'Settings'}
        </p>
        <h1 className='mt-4 break-keep font-display text-[2.35rem] font-bold leading-[1.04] text-[#22251f]'>
          {isKorean ? '내 루틴에 맞게\n조정하기' : 'Tune SoloSync\nto your rhythm'}
        </h1>
        <p className='mt-3 text-[15px] leading-7 text-[#777268]'>{isKorean ? '언어, 알림, 프로필을 한곳에서 관리합니다.' : 'Manage language, nudges and profile context in one place.'}</p>
      </MotionReveal>

      <MotionReveal
        as='section'
        delay={0.05}
        className='mt-8 rounded-lg border border-[#e8ded2] bg-white/74 p-5 shadow-float'
      >
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5ded6] text-[2rem] font-bold text-accent'>
          {displayName.slice(0, 1)}
        </div>
        <h2 className='mt-4 text-center text-[1.3rem] font-bold text-[#22251f]'>{displayName}</h2>
        <p className='mt-1 text-center text-sm text-[#777268]'>{email}</p>
        <Link href='/settings/profile' className='mx-auto mt-4 inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-bold text-accent transition hover:bg-accent/10'>
          {isKorean ? '프로필 편집' : 'Edit profile'}
          <ChevronRight className='h-4 w-4' />
        </Link>
      </MotionReveal>

      <MotionReveal as='section' delay={0.08} className='mt-8 space-y-3'>
        <h2 className='px-2 font-data text-[11px] font-bold uppercase text-[#8e877c]'>
          {isKorean ? '환경설정' : 'Preferences'}
        </h2>
        <div className='overflow-hidden rounded-lg border border-[#e8ded2] bg-white/74 shadow-ambient'>
          {accountItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className='flex items-center justify-between px-4 py-4 transition hover:bg-white'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#e7eade] text-[#62705d]'>
                    <Icon className='h-4 w-4' />
                  </div>
                  <span className='font-medium text-[#22251f]'>{item.fallback[language]}</span>
                </div>
                <ChevronRight className='h-4 w-4 text-[#9b9488]' />
              </Link>
            );
          })}
          <div className='flex items-center justify-between px-4 py-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#f4e4cf] text-[#9a7445]'>
                <MoonStar className='h-4 w-4' />
              </div>
              <span className='font-medium text-[#22251f]'>{isKorean ? '다크 모드' : 'Dark mode'}</span>
            </div>
            <span className='rounded bg-[#f4e4cf] px-3 py-1 text-xs font-bold text-[#9a7445]'>
              {isKorean ? '준비 중' : 'Soon'}
            </span>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as='section' delay={0.11} className='mt-8 space-y-3'>
        <h2 className='px-2 font-data text-[11px] font-bold uppercase text-[#8e877c]'>
          {isKorean ? '정보' : 'Information'}
        </h2>
        <div className='overflow-hidden rounded-lg border border-[#e8ded2] bg-white/74 shadow-ambient'>
          {legalItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className='flex items-center justify-between px-4 py-4 transition hover:bg-white'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#f5ded6] text-accent'>
                    <Icon className='h-4 w-4' />
                  </div>
                  <span className='font-medium text-[#22251f]'>{item.label[language]}</span>
                </div>
                <ChevronRight className='h-4 w-4 text-[#9b9488]' />
              </Link>
            );
          })}
        </div>
      </MotionReveal>
    </AppShell>
  );
}
