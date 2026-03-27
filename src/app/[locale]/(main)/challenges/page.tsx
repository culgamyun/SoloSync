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
    <AppShell>
      <section>
        <p className='text-[12px] font-semibold tracking-[0.02em] text-primary/80'>
          {locale === 'ko' ? '성장을 위한 발걸음' : 'Practical momentum'}
        </p>
        <h1 className='whitespace-pre-line mt-3 text-balance font-display text-[2.35rem] font-bold leading-[1.02] tracking-[-0.05em] text-foreground'>
          {locale === 'ko' ? `${displayName}님의\n새로운 도전들` : 'Your next real-world\nchallenges'}
        </h1>
        <div className='editorial-rule' />
      </section>

      <div className='no-scrollbar mt-8 flex gap-3 overflow-x-auto pb-2'>
        {filters.map((filter) => {
          const active = filter.key === activeFilter;
          return (
            <Link
              key={filter.key}
              href={filter.key === 'current' ? '/challenges' : `/challenges?status=${filter.key}`}
              className={cn(
                'rounded-full px-5 py-3 text-sm font-semibold shadow-ambient transition',
                active ? 'bg-primary text-primary-foreground' : 'bg-white/78 text-muted-foreground hover:bg-white'
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

      <section className='mt-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,rgba(119,67,64,0.96),rgba(145,76,74,0.98))] shadow-float'>
        <div className='relative px-5 py-6 text-white'>
          <div className='absolute bottom-[-28px] right-[-18px] text-[9rem] font-bold text-white/10'>★</div>
          <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60'>
            {locale === 'ko' ? '다음 연결 추천' : 'Next move'}
          </p>
          <h2 className='whitespace-pre-line mt-3 max-w-[12rem] text-[1.8rem] font-display font-bold leading-[1.02] tracking-[-0.04em]'>
            {locale === 'ko' ? '함께 성장하는\n솔로들의 챌린지 엿보기' : 'See what the coach\nsuggests next'}
          </h2>
          <Button asChild variant='secondary' className='mt-6 bg-white/18 text-white hover:bg-white/24'>
            <Link href='/coach'>{locale === 'ko' ? '코치 열기' : 'Open coach'}</Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
