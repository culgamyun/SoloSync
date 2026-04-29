# SoloSync

SoloSync는 Next.js와 Supabase 기반의 hosted-first PWA입니다. 제품의 현재 초점은 AI 기반 소셜 헬스 코치이며, 핵심 사용 경험은 매주 하나의 작은 관계 루틴을 실행하는 weekly micro-mission입니다. 졸업, 이사, 전역, 이직 이후 관계가 얕아진 사람이 일상 공간에서 부담 낮은 사회적 연습을 다시 시작하도록 돕습니다.

이 제품은 데이팅, 모임 매칭, 친구 추천, 치료 앱이 아닙니다. 사용자가 안전한 한 문장을 고르고, 아주 작은 행동을 시도하고, 미션이 실제로 일어나지 않았더라도 수치심 없이 회고하도록 돕습니다. 목표는 "내 삶은 관계적으로 막혔다"는 생각에 대한 작은 반례를 하나씩 만드는 것입니다.

## 현재 제품 범위

- 챌린지 목록, 상세, 회고 플로우 안의 weekly micro-mission
- 미션 맥락, safe line, minimum win, fear, reframe 필드
- `greeted`, `said_line`, `could_not_do_it` 회고 결과
- Supabase가 설정되지 않았을 때 동작하는 demo fallback 데이터
- 브라우저와 Playwright 검증을 위한 개발 전용 QA auth bypass
- "실패/스킵 후 다음 주에 돌아온 사용자"를 보는 return report RPC

## 기술 스택

- Next.js App Router + TypeScript strict
- Tailwind CSS + 가벼운 shadcn-style UI primitives
- next-intl (`ko` / `en`)
- Supabase Auth / Postgres / Edge Functions
- AI 점수화, 코칭, 챌린지 생성을 위한 Gemini
- 온보딩 draft 상태를 위한 Zustand
- 점수 히스토리를 위한 Recharts
- Web Push service worker
- Vitest와 Playwright

## 설정

1. `.env.example`을 `.env.local`로 복사하고 Supabase, Gemini, 선택 VAPID/Sentry 값을 채웁니다.
2. `npm install`로 의존성을 설치합니다.
3. Supabase 프로젝트에 `supabase/migrations`의 SQL 파일을 적용하거나, 프로젝트를 link한 뒤 `npx supabase db push`를 실행합니다.
4. `supabase/functions` 아래의 Edge Functions를 배포합니다.
5. `npm run dev`로 로컬 개발 서버를 실행합니다.

자세한 로컬 환경 설정은 `ENV_LOCAL_SETUP.md`를 참고하세요.

## 포트폴리오 데모 경로

로컬 포트폴리오 walkthrough는 `/ko/welcome`에서 시작해 login을 지나 home, challenges, mission detail, reflection, progress, settings 순서로 보면 좋습니다. Supabase 프로젝트가 설정되어 있지 않아도 SoloSync는 demo 데이터를 제공하므로 weekly micro-mission 경험을 바로 둘러볼 수 있습니다.

실제 인증 없이 브라우저나 Playwright로 검증하려면 local 또는 preview 환경에서만 `SOLOSYNC_QA_AUTH_BYPASS=true`를 설정하고 `/api/qa/auth-bypass?next=/ko/home`을 여세요. 이 bypass는 production runtime에서 명시적으로 차단되며, 실제 production 데모에는 절대 활성화하면 안 됩니다.

## 주요 명령어

- `npm run dev` - 로컬 Next.js 서버를 실행합니다.
- `npm run check` - lint, typecheck, unit test를 한 번에 실행합니다.
- `npm run test:e2e` - 3100번 포트의 QA auth-bypass 개발 서버를 대상으로 Playwright를 실행합니다.
- `npm run test:e2e:smoke` - 안정적인 로컬 Chromium smoke flow를 실행합니다.
- `npm run test:e2e:portfolio` - 접근성/포트폴리오 데모 플로우를 Chromium으로 검증합니다.
- `npm run qa:preview -- --url https://...` - preview URL을 대상으로 smoke flow를 실행합니다.
- `npm run security:check` - service role key client 노출, Supabase RLS coverage, production dependency audit를 확인합니다.
- `npm run build` - production Next.js build를 생성합니다.

## 주요 경로

- `src/app/[locale]` - locale별 앱 라우트
- `src/actions` - 온보딩, 챌린지, 회고, 설정 server actions
- `src/lib/server/app-data.ts` - demo fallback과 서버 데이터 조회
- `src/lib/server/demo-mode.ts` - QA/demo-mode 사용자 컨텍스트
- `src/app/api/qa/auth-bypass/route.ts` - non-production QA login bypass
- `supabase/migrations` - schema, RLS, helper functions, return report RPC
- `supabase/functions` - AI, 점수화, 챌린지, 알림 Edge Functions
- `tests/e2e/smoke.spec.ts` - localized app shell과 micro-mission 경로 smoke coverage

## 프로젝트 문서

- `DESIGN.md` - SoloSync 디자인 시스템과 제품 UI guardrails
- `docs/01-plan/weekly-micro-mission-roadmap.md` - 제품 방향과 우선순위
- `docs/weekly-micro-mission-worklog.md` - 현재 실행 상태와 backlog
- `docs/01-plan/features/weekly-micro-mission-v1.plan.md` - 구현 계획과 엔지니어링 결정
- `docs/checkpoints/` - 날짜별 handoff snapshot
- `docs/preview-qa-playbook.md` - 반복 가능한 local/preview QA flow
- `docs/security-ops-proof.md` - 포트폴리오용 보안 및 운영 증빙

## 참고 사항

- Supabase env vars가 없으면 앱은 demo 데이터로 fallback되어 UI를 계속 탐색할 수 있습니다.
- `SOLOSYNC_QA_AUTH_BYPASS=true`는 local/test 환경에서만 사용하세요. Production은 bypass route를 거부합니다.
- Preview smoke에서도 `SOLOSYNC_QA_AUTH_BYPASS=true`를 사용할 수 있지만, preview deployment에서만 허용하고 실제 production에는 쓰지 않습니다.
- Apple auth는 `NEXT_PUBLIC_ENABLE_APPLE_AUTH`로 feature-gate되어 있습니다.
- Push notification은 유효한 VAPID keys와 배포된 service worker가 필요합니다.
