# .env.local Setup Guide

이 문서는 SoloSync 로컬 개발용 `.env.local`에 어떤 값을 넣어야 하는지 정리한 가이드입니다.

## 1. 시작 방법

프로젝트 루트에 `.env.local` 파일을 만들고 아래 키를 채웁니다.

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

## 2. 필수값

### `NEXT_PUBLIC_APP_URL`
- 로컬 개발 주소입니다.
- 로컬에서는 `http://localhost:3000` 사용.
- 배포 환경에서는 실제 서비스 도메인으로 바꿉니다.

### `NEXT_PUBLIC_SUPABASE_URL`
- Supabase 프로젝트 URL입니다.
- 형식: `https://<project-ref>.supabase.co`
- 위치:
  - Supabase Dashboard > Project Connect
  - 또는 Settings > API Keys

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- 브라우저에서 사용하는 Supabase publishable key입니다.
- 형식: 보통 `sb_publishable_...`
- 위치:
  - Supabase Dashboard > Settings > API Keys

### `SUPABASE_SERVICE_ROLE_KEY`
- 서버 전용 Supabase key입니다.
- 절대 브라우저에 노출하면 안 됩니다.
- 위치:
  - Supabase Dashboard > Settings > API Keys

### `NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL`
- Supabase Edge Functions 호출 기본 URL입니다.
- 보통 직접 발급하는 값이 아니라 아래처럼 만듭니다.
- 형식: `https://<project-ref>.supabase.co/functions/v1`
- 즉, `NEXT_PUBLIC_SUPABASE_URL + /functions/v1`

### `GEMINI_API_KEY`
- 온보딩 분석, 챌린지 생성, 코칭 응답에 쓰는 Gemini API key입니다.
- 위치:
  - Google AI Studio > API keys

### `GEMINI_MODEL`
- 기본값 그대로 사용하면 됩니다.
- 권장값: `gemini-2.5-flash`

### `NEXT_PUBLIC_DEFAULT_LOCALE`
- 기본 언어 설정입니다.
- 현재 프로젝트 기준 `ko` 사용.

## 3. 선택값 또는 후속 설정

### `NEXT_PUBLIC_ENABLE_APPLE_AUTH`
- Apple 로그인 UI 노출 여부입니다.
- 준비 전: `false`
- Apple provider 구성 후: `true`

### `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
### `VAPID_PRIVATE_KEY`
- Web Push용 VAPID 키입니다.
- 직접 생성합니다.
- 예시 명령어:

```bash
npx web-push generate-vapid-keys
```

- 출력된 public key를 `NEXT_PUBLIC_VAPID_PUBLIC_KEY`에 넣고,
- private key를 `VAPID_PRIVATE_KEY`에 넣습니다.

### `VAPID_SUBJECT`
- 푸시 발신자 식별자입니다.
- 보통 이메일 형식 사용.
- 예시: `mailto:hello@solosync.app`

### `NEXT_PUBLIC_SENTRY_DSN`
- 클라이언트 에러 수집용 DSN입니다.
- 위치:
  - Sentry Project Settings > Client Keys (DSN)

### `SENTRY_AUTH_TOKEN`
- Sentry 배포/소스맵 업로드 등에 쓰는 토큰입니다.
- 위치:
  - Sentry에서 auth token 생성

### `SENTRY_ORG`
- Sentry organization slug입니다.
- 보통 Sentry URL에 보이는 org 이름을 사용합니다.

### `SENTRY_PROJECT`
- Sentry project slug입니다.
- 보통 Sentry 프로젝트 설정 URL에 보이는 project 이름을 사용합니다.

## 4. 같이 해야 하는 외부 설정

### Supabase
- 프로젝트 생성 또는 사용할 프로젝트 ref 확정
- Auth > Providers에서 Google 활성화
- Redirect URL 설정
- Edge Functions 배포 준비

### Google 로그인
- Google Cloud Console에서 OAuth client 생성
- Supabase가 안내하는 redirect URL을 Authorized redirect URI에 추가

### Apple 로그인
- Apple Developer에서 Sign in with Apple용 Service ID / Key 생성
- Supabase Auth Provider 설정 완료 후 `NEXT_PUBLIC_ENABLE_APPLE_AUTH=true`

### Gemini
- Google AI Studio에서 API key 발급

### Web Push
- VAPID 키 생성

### Sentry
- 프로젝트 생성
- DSN, auth token, org slug, project slug 확인

## 5. 최소 권장 세팅 순서

1. `.env.local` 생성
2. `NEXT_PUBLIC_SUPABASE_URL` 입력
3. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 입력
4. `SUPABASE_SERVICE_ROLE_KEY` 입력
5. `NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL` 입력
6. `GEMINI_API_KEY` 입력
7. `NEXT_PUBLIC_DEFAULT_LOCALE=ko` 유지
8. `NEXT_PUBLIC_ENABLE_APPLE_AUTH=false` 유지
9. 이후 필요하면 VAPID/Sentry 추가

## 6. 로컬 개발 최소 예시

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
