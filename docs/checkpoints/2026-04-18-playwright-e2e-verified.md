# 체크포인트 - Playwright e2e 검증 완료

날짜: 2026-04-18

## 사용자 요청

Supabase report 숫자 검증 이후 남은 검증 공백이었던 Playwright managed browser 기반 e2e를 진행했다.

## 변경 사항

- Playwright managed Chromium을 설치했다.
- `playwright.config.ts`에 `webServer` 설정을 추가했다.
  - 테스트 서버는 `3100` 포트에서 실행된다.
  - `SOLOSYNC_QA_AUTH_BYPASS=true`로 QA demo mode를 사용한다.
  - `NEXT_TELEMETRY_DISABLED=1`을 함께 설정한다.
  - 기존 `3000`/`3001` 포트 상태에 의존하지 않는다.

## 검증

통과:

- `npm run test:e2e`
  - Chromium desktop/mobile 프로젝트에서 36개 테스트 통과
  - smoke routes 통과
  - 한국어 마이크로 미션 상세 copy assertion 통과
  - 한국어 마이크로 미션 회고 copy assertion 통과
- `npm run typecheck`
- `npm run lint`
- `git diff --check -- playwright.config.ts docs\weekly-micro-mission-worklog.md`

주의:

- e2e webServer 로그에 Sentry/OpenTelemetry의 기존 webpack warning이 반복 표시되지만, 테스트 exit code는 0이다.
- `npm run lint`는 기존 `.eslintignore` 관련 ESLint 9 경고를 계속 표시하지만, exit code는 0이다.

## 다음 단계

1. 커밋 전 전체 dirty diff를 최종 review한다.
2. QA auth bypass를 로컬 전용 테스트 convention으로 문서화할지 결정한다.
3. `.eslintignore`를 `eslint.config.mjs`의 `ignores`로 옮길지 결정한다.
