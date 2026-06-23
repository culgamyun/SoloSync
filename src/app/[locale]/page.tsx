import Image from 'next/image';
import { ArrowRight, Bell, CalendarCheck2, Download, HeartHandshake, MessageCircleHeart } from 'lucide-react';

import { BrandLogo } from '@/components/common/brand-logo';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

type LocaleIndexPageProps = {
  params: Promise<{ locale: string }>;
};

const koCopy = {
  eyebrow: '관계 루틴 형성 앱',
  headline: '관계를 챙기는 일을 매일의 작은 루틴으로.',
  body: 'SoloSync는 안부, 대화, 기록을 부담 없는 미션으로 바꿔서 가까운 사람과의 연결을 미루지 않게 돕습니다.',
  cta: '다운로드',
  secondaryCta: '루틴 먼저 보기',
  trust: '무료로 시작 · PWA 설치 지원',
  routineTitle: '오늘 할 일은 세 가지면 충분해요.',
  routineBody: '큰 결심 대신 바로 보낼 수 있는 한 문장, 짧은 대화 주제, 고마웠던 일 하나를 남깁니다.',
  proofTitle: '관계별로 다른 리듬을 기억합니다.',
  proofBody: '연인, 가족, 친구에게 같은 알림을 보내지 않습니다. 자주 놓치는 관계와 편한 시간대를 기준으로 이번 주 루틴을 조정합니다.',
  finalTitle: '오늘 미루지 않을 관계 하나를 정해보세요.',
  finalBody: '설치하고 첫 루틴을 고르면, SoloSync가 이번 주에 실행 가능한 작은 행동부터 제안합니다.'
};

const enCopy = {
  eyebrow: 'Relationship routine app',
  headline: 'Turn care into a small daily routine.',
  body: 'SoloSync turns check-ins, conversation prompts and reflection into lightweight missions that keep real relationships from slipping.',
  cta: 'Download',
  secondaryCta: 'Preview routines',
  trust: 'Free to start · PWA install ready',
  routineTitle: 'Three small actions are enough for today.',
  routineBody: 'Instead of a big promise, send one line, open one conversation and save one moment of gratitude.',
  proofTitle: 'Every relationship gets its own rhythm.',
  proofBody: 'SoloSync does not send the same reminder to a partner, family member and friend. It adapts to the people you miss and the hours that actually work.',
  finalTitle: 'Pick one relationship you will not postpone today.',
  finalBody: 'Install SoloSync and choose your first routine. The app starts with the smallest action you can realistically do this week.'
};

const relationshipModes = [
  { labelKo: '연인', labelEn: 'Partner', detailKo: '고마웠던 일 기록', detailEn: 'Save one grateful moment' },
  { labelKo: '가족', labelEn: 'Family', detailKo: '짧은 안부 전화', detailEn: 'Make a quick check-in call' },
  { labelKo: '친구', labelEn: 'Friend', detailKo: '주말 대화 제안', detailEn: 'Suggest a weekend chat' }
];

const routineItems = [
  { icon: HeartHandshake, titleKo: '아침 안부', titleEn: 'Morning check-in', metaKo: '1분', metaEn: '1 min' },
  { icon: MessageCircleHeart, titleKo: '대화 주제', titleEn: 'Conversation prompt', metaKo: '오늘 저녁', metaEn: 'Tonight' },
  { icon: CalendarCheck2, titleKo: '주간 약속', titleEn: 'Weekly plan', metaKo: '토요일', metaEn: 'Saturday' }
];

export default async function LocaleIndexPage({ params }: LocaleIndexPageProps) {
  const { locale } = await params;
  const isKorean = locale === 'ko';
  const copy = isKorean ? koCopy : enCopy;

  return (
    <main className='min-h-screen overflow-hidden bg-[#f8f5ef] text-[#22251f]'>
      <section className='relative flex min-h-[88svh] w-full items-stretch overflow-hidden'>
        <Image
          src='/images/landing/relationship-routine-hero.png'
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover object-[38%_center] sm:object-[58%_center]'
        />
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(248,245,239,0.96)_0%,rgba(248,245,239,0.78)_52%,rgba(248,245,239,0.42)_100%)] sm:hidden' />
        <div className='absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(248,245,239,0.98)_0%,rgba(248,245,239,0.84)_30%,rgba(248,245,239,0.25)_58%,rgba(248,245,239,0.06)_100%)] sm:block' />
        <div className='absolute inset-x-0 top-0 z-10'>
          <nav className='mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10'>
            <BrandLogo priority className='w-[170px] sm:w-[208px]' />
            <Button asChild size='sm' className='rounded-lg bg-[#126b5a] hover:bg-[#105f50]'>
              <Link href='/welcome'>
                <Download className='h-4 w-4' aria-hidden />
                {copy.cta}
              </Link>
            </Button>
          </nav>
        </div>

        <div className='relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pb-16 pt-28 sm:px-8 lg:px-10'>
          <div className='max-w-[39rem] animate-rise'>
            <p className='font-data text-xs font-bold uppercase text-[#a85642]'>{copy.eyebrow}</p>
            <h1 className='mt-5 text-balance font-display text-[2.82rem] font-bold leading-[1.03] text-[#1f241f] [word-break:keep-all] sm:text-[4.6rem] sm:leading-[0.98] lg:text-[5.6rem]'>
              {copy.headline}
            </h1>
            <p className='mt-6 max-w-[31rem] text-[1rem] font-medium leading-7 text-[#4f564d] [word-break:keep-all] sm:text-[1.18rem] sm:leading-8'>
              {copy.body}
            </p>
            <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='lg' className='min-h-14 rounded-lg bg-[#126b5a] px-7 text-[1.04rem] hover:bg-[#105f50]'>
                <Link href='/welcome'>
                  <Download className='h-5 w-5' aria-hidden />
                  {copy.cta}
                </Link>
              </Button>
              <Button
                asChild
                variant='secondary'
                size='lg'
                className='min-h-14 rounded-lg border-[#d8cec0] bg-white/72 px-7 text-[1.04rem] text-[#242720] hover:bg-white'
              >
                <a href='#routine'>
                  {copy.secondaryCta}
                  <ArrowRight className='h-5 w-5' aria-hidden />
                </a>
              </Button>
            </div>
            <div className='mt-5 flex items-center gap-2 text-sm font-semibold text-[#687067]'>
              <Bell className='h-4 w-4 text-[#a85642]' aria-hidden />
              {copy.trust}
            </div>
          </div>
        </div>
      </section>

      <section
        id='routine'
        className='relative border-y border-[#ded6ca] bg-[#fffdf8] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 lg:px-10 lg:py-24'
      >
        <div className='mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <p className='font-data text-xs font-bold uppercase text-[#126b5a]'>
              {isKorean ? 'Daily rhythm' : 'Daily rhythm'}
            </p>
            <h2 className='mt-4 max-w-[34rem] text-balance font-display text-4xl font-bold leading-tight text-[#20251f] [word-break:keep-all] sm:text-5xl'>
              {copy.routineTitle}
            </h2>
            <p className='mt-5 max-w-[30rem] text-lg leading-8 text-[#5d645b] [word-break:keep-all]'>{copy.routineBody}</p>
            <div className='mt-10 divide-y divide-[#ded6ca] border-y border-[#ded6ca]'>
              {routineItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.titleEn} className='grid grid-cols-[2.75rem_1fr_auto] items-center gap-4 py-5'>
                    <span className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#f2ded5] text-[#a85642]'>
                      <Icon className='h-5 w-5' aria-hidden />
                    </span>
                    <span className='text-base font-bold text-[#242720]'>{isKorean ? item.titleKo : item.titleEn}</span>
                    <span className='font-data text-xs font-bold uppercase text-[#7b8378]'>
                      {isKorean ? item.metaKo : item.metaEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='relative mx-auto w-full max-w-[640px] lg:mr-0'>
            <div className='relative aspect-[1.32] overflow-hidden rounded-lg border border-[#ded6ca] bg-[#f7efe5] shadow-float'>
              <Image
                src='/images/landing/routine-app-mockup.png'
                alt={isKorean ? 'SoloSync 앱 루틴 화면 목업' : 'SoloSync routine app mockup'}
                fill
                sizes='(max-width: 1024px) 92vw, 640px'
                className='object-cover'
              />
            </div>
            <div className='absolute -bottom-8 left-4 right-4 rounded-lg border border-[#ded6ca] bg-white/94 p-4 shadow-ambient backdrop-blur sm:left-auto sm:right-8 sm:w-[22rem]'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm font-bold text-[#20251f]'>{isKorean ? '오늘의 관계 루틴' : "Today's relationship routine"}</p>
                  <p className='mt-1 text-sm text-[#687067]'>{isKorean ? '가장 쉬운 행동부터 제안' : 'Start with the easiest action'}</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-[#126b5a] font-data text-sm font-bold text-white'>
                  3/4
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#f8f5ef] px-5 py-24 sm:px-8 lg:px-10 lg:py-32'>
        <div className='mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end'>
          <div>
            <h2 className='max-w-[35rem] text-balance font-display text-4xl font-bold leading-tight text-[#20251f] [word-break:keep-all] sm:text-5xl'>
              {copy.proofTitle}
            </h2>
            <p className='mt-5 max-w-[34rem] text-lg leading-8 text-[#5d645b] [word-break:keep-all]'>{copy.proofBody}</p>
          </div>
          <div className='divide-y divide-[#d9d0c2] border-y border-[#d9d0c2]'>
            {relationshipModes.map((mode, index) => (
              <div key={mode.labelEn} className='grid grid-cols-[3rem_1fr] gap-5 py-7 sm:grid-cols-[4.5rem_1fr]'>
                <span className='font-data text-sm font-bold text-[#a85642]'>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className='text-2xl font-bold text-[#20251f]'>{isKorean ? mode.labelKo : mode.labelEn}</h3>
                  <p className='mt-2 text-base leading-7 text-[#5d645b]'>{isKorean ? mode.detailKo : mode.detailEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-[#126b5a] px-5 py-20 text-white sm:px-8 lg:px-10'>
        <div className='mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-[44rem]'>
            <h2 className='text-balance font-display text-4xl font-bold leading-tight [word-break:keep-all] sm:text-5xl'>
              {copy.finalTitle}
            </h2>
            <p className='mt-5 max-w-[34rem] text-lg leading-8 text-white/78 [word-break:keep-all]'>{copy.finalBody}</p>
          </div>
          <Button
            asChild
            size='lg'
            className='min-h-14 rounded-lg border-white bg-white px-8 text-[1.04rem] text-[#126b5a] hover:bg-[#fff7ec]'
          >
            <Link href='/welcome'>
              <Download className='h-5 w-5' aria-hidden />
              {copy.cta}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
