# .env.local 설정 가이드

이 문서는 SoloSync를 로컬에서 실행할 때 `.env.local`에 어떤 값을 넣어야 하는지 정리한 가이드다.

## 1. 시작 방법

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 채운다. 공개 저장소에 실제 비밀키를 커밋하지 않는다.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ENABLE_APPLE_AUTH=false
NEXT_PUBLIC_DEFAULT_LOCALE=ko
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:hello@solosync.app
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

## 2. 필수 값

### `NEXT_PUBLIC_APP_URL`

- 로컬 개발 주소다.
- 로컬에서는 보통 `http://localhost:3000`을 사용한다.
- 배포 환경에서는 실제 서비스 도메인으로 바꾼다.

### `NEXT_PUBLIC_SUPABASE_URL`

- Supabase 프로젝트 URL이다.
- 형식: `https://<project-ref>.supabase.co`
- 위치: Supabase Dashboard > Project Connect 또는 Settings > API Keys.

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

- 브라우저에서 사용하는 Supabase publishable key다.
- 형식은 보통 `sb_publishable_...`이다.
- 위치: Supabase Dashboard > Settings > API Keys.

### `SUPABASE_SERVICE_ROLE_KEY`

- 서버 전용 Supabase service role key다.
- 절대 브라우저 코드나 공개 문서에 노출하면 안 된다.
- Edge Function, QA 검증, 관리성 작업에서 사용한다.

### `NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL`

- Supabase Edge Functions 호출 기본 URL이다.
- 보통 `NEXT_PUBLIC_SUPABASE_URL + /functions/v1` 형식이다.
- 예: `https://<project-ref>.supabase.co/functions/v1`

### `GEMINI_API_KEY`

- 온보딩 분석, 챌린지 생성, 코칭 응답에 쓰는 Gemini API key다.
- 위치: Google AI Studio > API keys.

### `GEMINI_MODEL`

- 권장 기본값은 `gemini-2.5-flash`다.

### `NEXT_PUBLIC_DEFAULT_LOCALE`

- 기본 언어다.
- 현재 프로젝트 기준 권장값은 `ko`다.

## 3. 선택 값과 연동 설정

### `NEXT_PUBLIC_ENABLE_APPLE_AUTH`

- Apple 로그인 UI 노출 여부다.
- Apple provider 준비 전에는 `false`를 유지한다.
- Supabase Auth Provider 구성이 끝나면 `true`로 바꿀 수 있다.

### `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
### `VAPID_PRIVATE_KEY`

- Web Push용 VAPID key pair다.
- 생성 예시:

```bash
npx web-push generate-vapid-keys
```

- public key는 `NEXT_PUBLIC_VAPID_PUBLIC_KEY`에 넣는다.
- private key는 `VAPID_PRIVATE_KEY`에 넣는다.

### `VAPID_SUBJECT`

- 푸시 발신자 연락처다.
- 보통 이메일 형식을 사용한다.
- 예: `mailto:hello@solosync.app`

### `NEXT_PUBLIC_SENTRY_DSN`

- 클라이언트 에러 수집용 Sentry DSN이다.
- 위치: Sentry Project Settings > Client Keys (DSN).

### `SENTRY_AUTH_TOKEN`

- Sentry 배포와 소스맵 업로드에 쓰는 토큰이다.

### `SENTRY_ORG`

- Sentry organization slug다.

### `SENTRY_PROJECT`

- Sentry project slug다.

## 4. QA 전용 값

### `SOLOSYNC_QA_AUTH_BYPASS`

- 로컬과 테스트에서 로그인 단계를 건너뛰기 위한 값이다.
- `true`로 설정하면 `/api/qa/auth-bypass?next=/ko/home` 같은 경로로 demo user 세션을 만들 수 있다.
- production 환경에서는 라우트가 거부되도록 구현되어 있다.
- Playwright e2e는 이 값을 자동으로 켜고 port `3100`에서 dev server를 띄운다.

## 5. 외부 서비스 준비 순서

### Supabase

1. Supabase 프로젝트를 만든다.
2. Google OAuth를 쓸 경우 Auth > Providers에서 Google을 켠다.
3. Redirect URL을 설정한다.
4. `npx supabase link --project-ref <project-ref>`로 로컬 CLI를 연결한다.
5. `npx supabase db push`로 `supabase/migrations`를 적용한다.
6. Edge Functions를 배포한다.

### Google 로그인

1. Google Cloud Console에서 OAuth client를 만든다.
2. Supabase가 안내하는 redirect URL을 Authorized redirect URI에 추가한다.

### Apple 로그인

1. Apple Developer에서 Sign in with Apple용 Service ID와 Key를 만든다.
2. Supabase Auth Provider 설정을 끝낸다.
3. `NEXT_PUBLIC_ENABLE_APPLE_AUTH=true`로 바꾼다.

### Gemini

1. Google AI Studio에서 API key를 발급한다.
2. `GEMINI_API_KEY`에 넣는다.
3. 필요하면 `GEMINI_MODEL`을 조정한다.

### Web Push

1. VAPID key pair를 만든다.
2. public/private key를 `.env.local`에 넣는다.
3. 배포 환경에서 service worker가 제공되는지 확인한다.

### Sentry

1. Sentry 프로젝트를 만든다.
2. DSN, auth token, org slug, project slug를 확인한다.
3. 값이 없으면 앱은 Sentry 없이도 로컬 개발이 가능하다.

## 6. 최소 로컬 예시

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ENABLE_APPLE_AUTH=false
NEXT_PUBLIC_DEFAULT_LOCALE=ko
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=https://your-project-ref.supabase.co/functions/v1
```

## 7. Preview QA

For repeatable smoke testing on preview deployments:

1. Set `SOLOSYNC_QA_AUTH_BYPASS=true` in the preview environment only.
2. Run:

```bash
npm run qa:preview -- --url https://your-preview-url
```

See `docs/preview-qa-playbook.md` for the full preview QA flow and failure modes.
