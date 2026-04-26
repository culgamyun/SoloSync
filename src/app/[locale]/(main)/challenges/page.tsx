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
        <p className='font-data text-[12px] font-bold tracking-normal text-primary/80'>
          {locale === 'ko' ? '성장을 위한 발걸음' : 'Practical momentum'}
        </p>
        <h1 className='mt-3 whitespace-pre-line break-keep text-balance font-display text-[2.35rem] font-bold leading-[1.04] tracking-normal text-foreground'>
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
                'whitespace-nowrap rounded-md border px-5 py-3 text-sm font-bold transition',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-line bg-surface-high text-muted-foreground hover:bg-surface-low'
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

      <section className='mt-8 overflow-hidden rounded-lg border border-primary bg-primary shadow-float'>
        <div className='relative px-5 py-6 text-primary-foreground'>
          <div className='absolute bottom-[-28px] right-[-18px] text-[9rem] font-bold text-white/10'>★</div>
          <p className='font-data text-[11px] font-bold uppercase tracking-normal text-white/60'>
            {locale === 'ko' ? '다음 연결 추천' : 'Next move'}
          </p>
          <h2 className='mt-3 max-w-[12rem] whitespace-pre-line break-keep font-display text-[1.8rem] font-bold leading-[1.04] tracking-normal'>
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
