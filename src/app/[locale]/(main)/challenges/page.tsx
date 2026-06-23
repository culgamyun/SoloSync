import { ArrowRight, CalendarCheck2, MessageCircleHeart, Sparkles } from 'lucide-react';

import { AppShell } from '@/components/common/app-shell';
import { ChallengeList } from '@/components/challenges/challenge-list';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getChallengesSnapshot, getViewer } from '@/lib/server/app-data';
import { cn } from '@/lib/utils';
import type { ChallengeRecord } from '@/types/challenge';

const filters = [
  { key: 'current', label: { ko: '이번 주', en: 'Current' } },
  { key: 'completed', label: { ko: '완료', en: 'Completed' } },
  { key: 'skipped', label: { ko: '건너뜀', en: 'Skipped' } },
  { key: 'all', label: { ko: '전체', en: 'All' } }
] as const;

export default async function ChallengesPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const viewer = await getViewer();
  const activeFilter = resolvedSearchParams.status ?? 'current';
  const challenges = await getChallengesSnapshot();
  const filtered =
    activeFilter === 'completed'
      ? challenges.filter((challenge: ChallengeRecord) => challenge.status === 'completed')
      : activeFilter === 'skipped'
        ? challenges.filter((challenge: ChallengeRecord) => challenge.status === 'skipped')
        : activeFilter === 'all'
          ? challenges
          : challenges.filter((challenge: ChallengeRecord) => ['pending', 'in_progress'].includes(challenge.status));
  const displayName = viewer?.displayName ?? (locale === 'ko' ? '당신' : 'you');

  return (
    <AppShell contentClassName='bg-[#fbf6ed] px-5 pb-32 pt-5'>
      <section className='relative overflow-hidden rounded-lg bg-[#8f9b84] px-5 py-5 text-white shadow-float'>
        <div className='absolute -right-8 -top-12 h-28 w-28 rounded-full border border-white/18' />
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/86 text-[#8f9b84] shadow-sm'>
            <CalendarCheck2 className='h-5 w-5' aria-hidden />
          </div>
          <p className='font-data text-[12px] font-bold uppercase text-white/74'>
            {locale === 'ko' ? '이번 주 루틴' : 'Weekly routine'}
          </p>
        </div>
        <h1 className='mt-5 whitespace-pre-line break-keep text-balance font-display text-[1.82rem] font-bold leading-[1.06] text-white'>
          {locale === 'ko' ? `${displayName}님의\n관계 미션` : 'Your relationship\nmissions'}
        </h1>
        <p className='mt-3 max-w-[18rem] text-[13px] leading-5 text-white/82'>
          {locale === 'ko'
            ? '오늘 할 수 있는 가장 작은 연결부터 고르세요.'
            : 'Choose the smallest connection you can make today.'}
        </p>
      </section>

      <div className='no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2'>
        {filters.map((filter) => {
          const active = filter.key === activeFilter;
          return (
            <Link
              key={filter.key}
              href={filter.key === 'current' ? '/challenges' : `/challenges?status=${filter.key}`}
              className={cn(
                'whitespace-nowrap rounded-md border px-5 py-3 text-sm font-bold transition',
                active
                  ? 'border-accent bg-accent text-white shadow-ambient'
                  : 'border-[#e5dbcf] bg-white/72 text-[#777268] hover:bg-white'
              )}
            >
              {filter.label[locale === 'en' ? 'en' : 'ko']}
            </Link>
          );
        })}
      </div>

      <div className='mt-5'>
        <ChallengeList challenges={filtered} locale={locale} variant='list' />
      </div>

      <section className='mt-8 overflow-hidden rounded-lg border border-[#e8ded2] bg-white/74 shadow-float'>
        <div className='relative px-5 py-6 text-[#22251f]'>
          <div className='absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5ded6] text-accent'>
            <Sparkles className='h-6 w-6' aria-hidden />
          </div>
          <p className='font-data text-[11px] font-bold uppercase text-accent'>
            {locale === 'ko' ? '다음 연결 추천' : 'Next move'}
          </p>
          <h2 className='mt-3 max-w-[15rem] whitespace-pre-line break-keep font-display text-[1.75rem] font-bold leading-[1.08]'>
            {locale === 'ko' ? '막히면 코치가\n더 작은 버전으로 줄여줘요' : 'If it feels heavy,\nthe coach scales it down'}
          </h2>
          <Button asChild variant='secondary' className='mt-6 rounded-lg border-[#e8ded2] bg-[#fffaf2] text-[#22251f] hover:bg-white'>
            <Link href='/coach'>
              <MessageCircleHeart className='h-4 w-4' aria-hidden />
              {locale === 'ko' ? '코치 열기' : 'Open coach'}
              <ArrowRight className='h-4 w-4' aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
