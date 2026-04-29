# SoloSync 보안 및 운영 증빙

마지막 업데이트: 2026-04-29

## 목적

이 문서는 SoloSync 포트폴리오 리뷰에서 “보안과 운영을 고려해 만든 앱”임을 코드, 테스트, 명령 결과로 설명하기 위한 짧은 증빙 기록이다. 전문 보안 감사 보고서가 아니라, 현재 브랜치에서 자동으로 재실행 가능한 검증 항목을 모은 문서다.

## 현재 증빙 항목

### QA auth bypass 차단

- QA auth bypass는 `SOLOSYNC_QA_AUTH_BYPASS=true`가 있을 때만 켜진다.
- `src/lib/qa/runtime.ts`는 `VERCEL_ENV=production` 또는 실제 production runtime에서 bypass를 허용하지 않는다.
- `tests/unit/qa-runtime.test.ts`가 preview, local/test, real production 분기를 검증한다.

재실행 명령:

```bash
npm run test -- tests/unit/qa-runtime.test.ts
```

### Service role key client leakage 방지

- `SUPABASE_SERVICE_ROLE_KEY`는 server env schema, server-only AI proxy, reporting script, Supabase Edge Function에서만 사용한다.
- `src/lib/ai/client.ts`는 `server-only` import로 client bundle import를 차단한다.
- `scripts/security-client-env-guard.mjs`는 `src` 아래 service role key 참조 위치를 검사하고, 허용된 파일이 server-only 보호 없이 key를 쓰면 실패한다.

재실행 명령:

```bash
npm run security:client-env
```

### Supabase RLS coverage

- user-owned table 11개에 대해 `enable row level security`와 policy 존재를 검사한다.
- 검사 대상:
  - `users`
  - `user_profiles`
  - `challenges`
  - `challenge_reflections`
  - `social_health_scores`
  - `coaching_sessions`
  - `coaching_messages`
  - `streaks`
  - `push_subscriptions`
  - `weekly_check_ins`
  - `challenge_mission_adjustments`

재실행 명령:

```bash
npm run security:rls
```

### Dependency audit

- production dependency audit는 `npm audit --omit=dev`로 확인한다.
- 현재 `npm run security:check`는 client env guard, RLS coverage, production dependency audit를 한 번에 실행한다.

재실행 명령:

```bash
npm run security:check
```

## 현재 통과 결과

2026-04-29 로컬 검증:

- `npm run security:client-env` 통과
- `npm run security:rls` 통과, user-owned table 11개 확인
- `npm audit --omit=dev` 통과, 0 vulnerabilities
- `npm run security:check` 통과

## 남은 보안/운영 backlog

- CSP는 즉시 enforce하지 않고 report-only로 먼저 관찰한 뒤 적용한다.
- 실제 Vercel preview URL을 확보한 뒤 `npm run qa:preview -- --url https://...`를 한 번 더 실행한다.
- Sentry/OpenTelemetry dynamic dependency build warning은 known warning으로 유지하되, 배포 전 별도 조사한다.
- GitHub Actions가 추가되면 third-party action SHA pinning과 CODEOWNERS를 검토한다.
- production canary 또는 uptime smoke는 실제 배포 설정이 정리된 뒤 추가한다.
