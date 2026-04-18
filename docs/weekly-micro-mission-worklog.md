# 주간 마이크로 미션 작업 기록

마지막 업데이트: 2026-04-18

## 이어서 작업하는 법

새 세션이나 다른 에이전트가 이어받을 때는 아래 순서로 확인한다.

1. `docs/01-plan/weekly-micro-mission-roadmap.md`
2. 이 파일
3. `docs/checkpoints/`의 최신 체크포인트
4. `git status --short`
5. 관련 diff

관련 문서:

- 로드맵: `docs/01-plan/weekly-micro-mission-roadmap.md`
- 구현 계획: `docs/01-plan/features/weekly-micro-mission-v1.plan.md`
- 승인된 오피스아워 산출물: `.gstack/projects/solosync/culga-main-design-20260416-221409.md`
- 디자인 시스템: `DESIGN.md`

## 현재 슬라이스 상태

현재 활성 슬라이스는 Slice 5, Phase B 준비와 검증 정리다. 이 중 “실패/스킵 후 다음 주 복귀 지표”의 DB report 기반과 마이크로 미션 회고 저장 focused tests는 구현됐다.

Slice 2-4는 워킹트리에 구현되어 있지만 아직 커밋되지 않았다. Windows에서 백그라운드 `node` 프로세스를 띄우는 시도가 오래 멈췄기 때문에 서버 자동 기동 경로는 포기했고, 사용자가 직접 3001번 포트를 열어준 뒤 로컬 Chrome 기반 QA를 진행했다.

현재 워킹트리는 의도적으로 더럽다. 관련 없는 변경을 되돌리지 말고, 실제 코드 상태는 항상 `git status`와 diff로 확인한다.

## 구현된 것

- Office Hours에서 주간 마이크로 미션 방향을 승인했다.
- V1 구현 계획을 만들었다.
- 로드맵과 작업 기록을 만들었다.
- 엔지니어링 리뷰를 완료하고 V1 아키텍처 방향을 확정했다.
- gstack 엔지니어링 리뷰 테스트 계획 산출물을 만들었다.
- `supabase/migrations/004_micro_social_missions.sql`을 추가했다.
- `ChallengeRecord`, Supabase 타입, 앱 매핑, 챌린지 생성 fallback 데이터에 마이크로 사회적 미션 필드를 추가했다.
- `challenge_reflections.outcome`에 `greeted`, `said_line`, `could_not_do_it` 결과를 저장하도록 했다.
- 데모 챌린지 데이터를 한국어 생활권 마이크로 미션으로 바꿨다.
- 챌린지 목록, 상세, 회고 화면에서 미션 맥락, 안전한 한마디, 최소 성공, 걱정, 실패 후 해석을 보여주도록 했다.
- 한국어 마이크로 미션 상세/회고 페이지에 대한 Playwright smoke assertion을 추가했다.
- Supabase client wrapper, `LocaleIndexPage`, Vitest e2e 제외, 서버 컴포넌트 차트 import 관련 타입/빌드 문제를 고쳤다.
- 로그인 없이 데모 모드로 들어갈 수 있는 개발 전용 QA auth bypass를 추가했다.
  - 예: `http://localhost:3001/api/qa/auth-bypass?next=/ko/home`
- 로컬 Chrome으로 home, challenges, challenge detail, reflection 화면의 빠른 시각 QA를 진행했다.
- 한국어 큰 제목이 어색하게 끊기는 문제와 하단 탭바가 nested challenge 화면을 가리는 문제를 고쳤다.
- 사용자 스크린샷 기반으로 compact score ring delta 겹침, 챌린지 카드 칩/XP/title 줄바꿈 문제를 고쳤다.
- 챌린지 카드 액션 버튼이 두 줄로 떨어지지 않게 액션 row를 non-wrapping으로 정리하고 상태별 필요한 액션만 보이게 했다.
- `/coach` 화면은 하단 네비게이션이 숨겨지기 때문에 좌상단 home/back 진입점을 추가했다.
- home, challenges, challenge detail, reflection, coach, progress, settings를 360px, 390px, desktop 폭에서 한 차례 더 디자인 리뷰했다.
- 코치 quick reply와 edge function 미설정 fallback 문구를 한국어 QA에 맞게 정리했다.
- 코치 헤더의 동작하지 않는 세 점 아이콘을 제거했다.
- `DESIGN.md`를 만들고 Urban Field Notes의 Data-Driven Accent 팔레트를 공식 디자인 시스템으로 채택했다.
- 글로벌 토큰, 핵심 UI primitive, home, challenges, challenge detail/reflection, coach, progress, settings, bottom navigation에 디자인 시스템 1차 구현 패스를 적용했다.
- “감정 일기처럼 오늘의 일지를 기록하고, 비공개면 AI만, 공개면 익명 유저 응원 댓글까지 받는 기능”을 향후 후보 아이디어로 기록했다.
- 비공개/공개 일지 아이디어에 대해 욕설, 비난, 조롱, 과도한 부정 워딩, 위험 표현 moderation guardrail을 `DESIGN.md`에도 추가했다.
- 비커밋 design-review pass를 진행하고 다음 시각 이슈를 고쳤다.
  - 44px 모바일 터치 타깃
  - settings/progress에 남아 있던 예전 둥근 wellness 카드 표면
  - bottom nav의 과한 radius
  - 챌린지 field callout의 컬러 왼쪽 border
- `DESIGN.md`에 남아 있던 깨진 한국어 핵심 용어를 복구했다.
- `public.micro_mission_return_report()` SQL report 함수를 추가했다.
  - 마이크로 미션을 스킵했거나 `could_not_do_it`으로 회고한 사용자 cohort를 주차별로 집계한다.
  - 다음 주 챌린지 활동 또는 주간 체크인이 있으면 “다음 주 복귀”로 본다.
  - RLS가 적용되는 `security invoker` 함수라 authenticated 사용자는 자신의 접근 범위 안에서, service role은 전체 집계를 볼 수 있다.
- Supabase 타입 정의에 `micro_mission_return_report` RPC return type을 추가했다.
- `submitReflectionAction` focused unit test를 추가했다.
  - `could_not_do_it` 결과가 `challenge_reflections.outcome`으로 저장되는지 검증한다.
  - 실패/미수행 회고도 reflection XP를 받고 streak upsert가 이어지는지 검증한다.
  - 알 수 없는 outcome 값은 DB check constraint에 걸리지 않도록 `null`로 정규화되는지 검증한다.
  - demo data request에서는 Supabase write를 하지 않는지 검증한다.
- focused review pass에서 회고 outcome 기본값을 제거하고 필수 선택으로 바꿨다.
  - 이전에는 첫 번째 outcome인 `greeted`가 기본 선택되어, 사용자가 선택하지 않고 저장하면 성공으로 기록될 수 있었다.
- focused review pass에서 챌린지 상세 화면의 상태 버튼 조건을 목록 화면과 맞췄다.
  - `pending`/`skipped`는 시작 가능, `in_progress`만 완료 가능, `completed`/`skipped`는 건너뛰기 버튼을 숨긴다.

## 검증 상태

최근까지 아래 명령들이 통과했다.

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

최근 design-review pass 이후에도 아래 명령들이 통과했다.

- `npm run typecheck`
- `npm run lint`
- `npm run test`

브라우저 검증:

- 로컬 Chrome headless로 `localhost:3001` 화면을 촬영했다.
- design-review pass 2: 7개 route를 360px, 390px, desktop 폭에서 확인했다.
- design-review pass 3: home, challenges, challenge detail, reflection, coach, progress, settings를 390px에서 확인했다.
- 390px 기준 reviewed routes에서 가로 스크롤이 없음을 확인했다.
- 390px 기준 visible touch target 미달이 없음을 확인했다.
- `micro_mission_return_report` 추가 후 `npm run typecheck`, `npm run lint`, `npm run test`가 통과했다.
- `submitReflectionAction` focused tests와 focused review fixes 추가 후 `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check -- src\app\[locale]\(main)\challenges\[id]\page.tsx src\app\[locale]\(main)\challenges\[id]\reflect\page.tsx tests\unit\challenge-reflection-action.test.ts docs\weekly-micro-mission-worklog.md docs\checkpoints\2026-04-18-micro-mission-reflection-tests.md`가 통과했다.
- Playwright managed Chromium을 설치하고 `playwright.config.ts`에 자체 dev server 설정을 추가했다.
  - e2e는 `3100` 포트에서 `SOLOSYNC_QA_AUTH_BYPASS=true`로 QA demo mode 서버를 띄운다.
  - 기존 3000/3001 포트 상태에 의존하지 않도록 했다.
- `npm run test:e2e`가 통과했다.
  - Chromium desktop/mobile 프로젝트에서 36개 테스트가 모두 통과했다.
  - smoke routes와 한국어 마이크로 미션 상세/회고 copy assertion을 검증했다.
- e2e 설정 변경 후 `npm run typecheck`, `npm run lint`, `git diff --check -- playwright.config.ts docs\weekly-micro-mission-worklog.md`가 통과했다.

아직 실행하지 않은 것:

- 커밋 전 전체 dirty diff 최종 review

막혔거나 건너뛴 것:

- Windows에서 `Start-Process`, `cmd start /b`를 통한 dev server 자동 기동이 실패하거나 장시간 멈췄다.
- 이후 확인에서 남아 있는 SoloSync `node.exe` 프로세스는 없었다.
- 사용자가 이 경로에 시간을 더 쓰지 말고 넘어가도 된다고 승인했다.
- `npm run lint`와 `npm run build`는 통과하지만 기존 `.eslintignore` 관련 ESLint 9 경고가 표시된다.
- `npm run build`는 통과하지만 Sentry/OpenTelemetry 쪽 기존 webpack warning이 표시된다.
- 과거 design QA 스크린샷은 Playwright managed Chromium 설치 전이라 로컬 Chrome 실행 파일로 찍었다.
- 개발 스크린샷의 Next dev indicator bubble은 제품 UI 문제로 보지 않는다.
- 2026-04-17 원격 Supabase 적용 시도:
  - `npx supabase`는 실행되지만 로컬 Supabase CLI profile은 로그인되어 있지 않다.
  - repo 안에 `supabase/config.toml`이나 `.temp/project-ref` 링크 정보가 없다.
  - `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_URL`, `DATABASE_URL`, `POSTGRES_URL` 환경변수는 현재 shell에 없다.
  - `.env`의 공개 Supabase URL에서 project ref는 확인했지만, DDL 적용에 필요한 access token 또는 DB password가 없어 `db push`를 진행하지 않았다.
  - service role 기반 비파괴 probe 결과, 현재 `.env`가 가리키는 원격 프로젝트의 REST schema cache에는 `public.challenges`, `public.challenge_reflections`, `public.micro_mission_return_report()`가 없다. 따라서 해당 원격은 004만 빠진 상태가 아니라 앱 base schema도 적용되지 않은 상태로 보인다.
- 2026-04-18 사용자가 Supabase CLI login/link를 완료한 뒤 `npx supabase db push`를 실행했으나 `001_initial_schema.sql` 첫 statement에서 `syntax error at or near "create"`가 발생했다.
  - root cause는 `001_initial_schema.sql`, `002_rls_policies.sql`, `003_functions.sql` 맨 앞의 UTF-8 BOM 바이트였다.
  - 세 migration 파일의 BOM만 제거했고, `004_micro_social_missions.sql`에는 BOM이 없음을 확인했다.
  - `git diff --check -- supabase\migrations\001_initial_schema.sql supabase\migrations\002_rls_policies.sql supabase\migrations\003_functions.sql`가 통과했다.
  - 비대화형 Codex shell에서는 DB password prompt를 받을 수 없어 `npx supabase db push --dry-run`은 `SUPABASE_DB_PASSWORD` 인증 단계에서 멈췄다. 사용자의 PowerShell에서 다시 push해야 한다.
- 2026-04-18 사용자가 다시 `npx supabase db push`를 실행해 `001`-`004` migrations 적용을 완료했다.
  - `pgcrypto` extension already exists notice와 `on_auth_user_created` trigger does not exist notice는 정보성 알림으로 보고 문제 없음으로 판단했다.
  - `npx supabase migration list --linked`에서 `001`, `002`, `003`, `004`가 Local/Remote 양쪽에 표시됨을 확인했다.
  - service role probe에서 `challenges`의 micro mission columns, `challenge_reflections.outcome`, `micro_mission_return_report()` RPC가 모두 `ok: true`로 응답했다.
  - 아직 샘플 데이터가 없어 `micro_mission_return_report()` 결과는 빈 배열이다.
- 2026-04-18 service role 기반 임시 샘플 데이터로 `micro_mission_return_report()` 숫자를 검증했다.
  - 임시 auth user 3명을 생성했다.
  - 같은 실패 주차에 `could_not_do_it` 1명, `skipped` 2명을 만들었다.
  - 다음 주 activity는 2명에게만 만들었다. 1명은 다음 주 challenge activity, 1명은 weekly check-in, 1명은 미복귀.
  - report 결과는 `failed_or_skipped_users=3`, `returned_next_week_users=2`, `next_week_return_rate=0.6667`로 기대값과 일치했다.
  - 검증 후 auth user 3명을 삭제했고 cascade cleanup으로 남은 challenges/reflections/check-ins가 각각 0개임을 확인했다.
  - cleanup 이후 `micro_mission_return_report()`가 다시 빈 배열을 반환함을 확인했다.

## 활성 백로그

- QA auth bypass를 로컬 전용 테스트 convention으로 문서화할지 결정한다.
- `.eslintignore`를 제거하고 `eslint.config.mjs`의 `ignores`로 옮길지 결정한다.
- `tsconfig.tsbuildinfo`를 계속 추적할지, 별도 정리로 ignore/reset할지 결정한다.
- 일지 기능 후보:
  - 오늘의 일지를 감정 일기처럼 기록한다.
  - 기본은 비공개이며 AI만 댓글/해석을 제공한다.
  - 명시적으로 공개하면 익명 유저들이 짧은 응원 댓글을 남길 수 있다.
  - 공개 기능은 익명성 설계, 욕설/비난/조롱/과도한 부정 워딩 필터링, 신고/차단, 위험 표현 escalation이 준비되기 전에는 만들지 않는다.
  - core micro-mission loop가 검증되기 전에는 공개 피드가 제품의 중심이 되면 안 된다.
- Phase B는 “실패 후에도 다음 주 돌아오는 비율” 데이터가 생긴 뒤 계획한다.

## 로드맵 이후 결정

- 사용자가 Office Hours 설계를 승인했다.
- 사용자는 A에서 B로 가는 경로를 선호한다고 밝혔다.
- 엔지니어링 리뷰에서 명시적인 nullable challenge column과 reflection outcome을 선택했다.
- `challenge.status`는 lifecycle로 유지하고, `challenge_reflections.outcome`이 실제 사회적 결과를 기록한다.
- UI와 회고 경로가 강하게 묶여 있어 Slice 2-4를 한 번에 구현했다.
- 사용자가 3001번 포트를 직접 열어 로컬 디자인 QA가 가능해졌다.
- 워킹트리가 의도적으로 더러운 동안에는 quick design QA를 비커밋 방식으로 진행한다.
- 전체 atomic design-review는 V1 작업이 정리/커밋된 뒤 다시 하는 것이 안전하다.
- 다음 권장 작업은 V1 hardening이다.
  - `micro_mission_return_report()`를 실제 Supabase에 적용하고 샘플 데이터로 검증
  - focused tests
  - 이후 한 번의 리뷰 pass
- 2026-04-17 현재 shell에서는 Supabase 원격 DDL 적용 권한이 없어 migration 적용은 패스했다. 다음 사람이 이어갈 때는 먼저 `supabase login` 또는 `SUPABASE_ACCESS_TOKEN`/DB URL을 준비해야 한다.
- 2026-04-18 `submitReflectionAction` focused tests를 추가한 뒤, 비커밋 focused review pass에서 outcome 기본 선택 문제와 상세 화면 상태 버튼 조건 문제를 고쳤다.
- 2026-04-18 Supabase push 실패 원인은 migration SQL 문법 자체가 아니라 기존 migration 파일의 BOM 인코딩 문제로 판단하고 제거했다.
- 2026-04-18 실제 원격 Supabase에 `001`-`004` migrations가 적용되었고, report RPC 존재까지 확인했다.
- 2026-04-18 report RPC 숫자 검증도 완료했다.
- 2026-04-18 Playwright managed Chromium 기반 e2e도 통과했다. 다음 검증 공백은 커밋 전 전체 dirty diff 최종 review다.

## 추적 규칙

앞으로 나온 아이디어 후보는 즉시 이 파일의 활성 백로그에 기록한다. 아이디어의 우선순위나 전략적 의미가 바뀌면 로드맵도 함께 업데이트한다.
