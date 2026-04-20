# 체크포인트 - Phase B Retention Report 구현

날짜: 2026-04-20

## 작업

Phase B Readiness의 첫 번째 구현 slice인 5A Retention report visibility를 구현했다.

## 변경 사항

- `scripts/micro-mission-return-report.mjs` 추가
  - `.env.local` 또는 shell env에서 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 읽는다.
  - `public.micro_mission_return_report()` RPC를 호출한다.
  - 기본 출력은 사람이 읽기 좋은 table이다.
  - `--json` 옵션은 raw JSON을 출력한다.
  - env 누락, URL 오류, RPC 오류를 명확한 메시지와 non-zero exit code로 처리한다.
- `package.json`에 `npm run report:micro-missions` 추가
- `tests/unit/micro-mission-return-report.test.mjs` 추가
- `README.md`, `ENV_LOCAL_SETUP.md`에 report 명령 문서화
- `phase-b-readiness.plan.md`, `weekly-micro-mission-worklog.md`를 5A 구현 상태로 업데이트

## 검증

필수 검증:

- `npm run test -- tests/unit/micro-mission-return-report.test.mjs`
- `npm run check`
- `npm run build`
- `node scripts/micro-mission-return-report.mjs --help`

원격 Supabase env가 준비된 shell에서는 다음 수동 검증도 권장한다.

```bash
npm run report:micro-missions
npm run report:micro-missions -- --json
```

## 다음 단계

다음 구현 slice는 5B Smaller mission and swap mission이다.

추천 브랜치:

- `codex/mission-adjustments`
