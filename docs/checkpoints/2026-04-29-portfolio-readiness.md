# 체크포인트 - 포트폴리오 readiness 감사

날짜: 2026-04-29

## 결론

SoloSync는 채용 또는 클라이언트 리뷰용 포트폴리오 데모에 꽤 근접했습니다. 현재 브랜치는 작은 관계 루틴을 위한 weekly micro-mission이라는 제품 초점을 일관되게 보여줍니다. 데이팅, 치료, 범용 AI wrapper처럼 보이기보다, 일상 공간에서 부담 낮은 관계 행동을 하나씩 실행하도록 돕는 앱으로 읽힙니다.

처음 보는 리뷰어도 로컬에서 welcome, login/demo bypass, home, challenge list, mission detail, reflection, progress, settings를 지나 핵심 루프까지 도달할 수 있습니다.

전체 readiness: 8.6 / 10

## 점수

- 코드 건강도: 9.5 / 10
  - `lint`, `typecheck`, unit test, build, 통합 `check`, smoke E2E가 통과합니다.
  - 로컬 생성 폴더가 더 이상 ESLint, TypeScript, Vitest 대상을 오염시키지 않습니다.
- 비주얼과 UX: 8.5 / 10
  - Welcome과 주요 앱 화면에서 weekly micro-mission 정체성이 명확하게 드러납니다.
  - 모바일/데스크톱 샘플에서 console error와 horizontal overflow가 발견되지 않았습니다.
  - Demo fallback 챌린지 문구가 일관되게 한국어로 정리되었습니다.
- 기능 QA: 8.7 / 10
  - Smoke coverage가 localized shell, mission detail, reflection controls, profile chips, recovery check-in, demo mission scaling을 검증합니다.
  - Supabase가 없는 demo mode와 QA auth bypass가 로컬 리뷰에 사용할 수 있는 상태입니다.
- 보안과 운영: 8.2 / 10
  - Production QA bypass는 runtime helper로 차단되고 unit test로 커버됩니다.
  - Service role 사용은 서버 코드 또는 script 전용이며, tracked app code에서 브라우저 client로 직접 노출되는 경로는 발견되지 않았습니다.
  - 사용자 소유 Supabase 테이블에는 RLS와 owner policy가 적용되어 있습니다.
  - Lockfile 업데이트와 PostCSS override 이후 dependency audit가 깨끗합니다.

## 적용한 수정

- `.codex-temp/`, `~/`, `test-results/`가 lint/test/typecheck tooling에 섞이지 않도록 repo-local ignore를 추가했습니다.
- ESLint flat config가 ignore를 담당하도록 오래된 `.eslintignore`를 제거했습니다.
- 남아 있던 영어 demo fallback 챌린지 title, description, conversation starters를 한국어로 바꿨습니다.
- 현재 앱 이미지가 local asset이므로 `next/image`의 wildcard remote host 허용을 제거했습니다.
- Camera, microphone, geolocation을 막는 제한적 `Permissions-Policy` header를 추가했습니다.
- `npm audit fix`로 lockfile을 갱신하고, PostCSS override를 추가해 `npm audit --omit=dev`가 0 vulnerabilities가 되도록 했습니다.
- README에 local/demo auth 안내와 production bypass 경고를 포함한 포트폴리오 데모 경로를 추가했습니다.

## 검증

- `npm audit --omit=dev` - 통과, 0 vulnerabilities
- `npm run lint` - 통과
- `npm run typecheck` - 통과
- `npm run test` - 통과, 11 files / 49 tests
- `npm run build` - 통과, 알려진 Sentry/OpenTelemetry 및 next-intl dynamic import warning 있음
- `npm run check` - 통과
- `npm run test:e2e:smoke` - 통과, 21 tests

추가 브라우저 샘플링:

- 모바일과 데스크톱 스크린샷을 `test-results/portfolio-readiness/` 아래에 캡처했습니다.
- Welcome, login, home, challenges, mission detail, reflection, progress, settings를 확인했습니다.
- 샘플 점검에서 horizontal overflow, browser console error, 남은 영어 demo challenge copy가 발견되지 않았습니다.

## 보안 메모

- QA bypass route는 `SOLOSYNC_QA_AUTH_BYPASS=true`이고 runtime이 non-production일 때만 동작하며, 그 외에는 404를 반환합니다.
- `VERCEL_ENV=production`과 `NODE_ENV=production` production case는 `isQaBypassAllowedRuntime`에서 거부됩니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 server-only AI proxy code, reporting scripts, Supabase functions, docs, tests, env examples에만 등장합니다. Tracked app code에서 browser client로 전달되지 않습니다.
- Initial user-owned tables와 `challenge_mission_adjustments`에는 RLS가 활성화되어 있으며, policy는 `auth.uid()` ownership 또는 session-owner join을 사용합니다.

## 남은 backlog

- Google Fonts, Sentry, Next scripts, inline styles 영향을 확인한 뒤 CSP를 먼저 report-only mode로 추가하고 이후 enforce합니다.
- Privacy와 performance를 위해 `next/font` 기반 self-hosted font 전환을 검토합니다.
- Keyboard traversal, focus visibility, touch target 측정을 포함한 자동 accessibility pass를 추가합니다.
- Reflection 제출과 duplicate reflection/idempotency 동작을 E2E에서 더 직접 검증합니다.
- 앱을 공개적으로 보여주기 전에 실제 Vercel preview URL을 대상으로 smoke pass를 한 번 실행합니다.
- 반복되는 Sentry/OpenTelemetry dynamic dependency build warning을 조사해 설정으로 줄이거나 문서화합니다.
- Supply-chain hardening을 포트폴리오에서 강조하려면 GitHub Actions를 commit SHA로 pinning합니다.

## 데모 경로

1. `npm install`로 의존성을 설치합니다.
2. `npm run dev`로 앱을 실행합니다.
3. `/ko/welcome`을 열고 welcome, login, home, challenges, mission detail, reflection, progress, settings 순서로 확인합니다.
4. 실제 인증 없는 local review가 필요하면 `SOLOSYNC_QA_AUTH_BYPASS=true`로 실행한 뒤 `/api/qa/auth-bypass?next=/ko/home`에 접속합니다.

