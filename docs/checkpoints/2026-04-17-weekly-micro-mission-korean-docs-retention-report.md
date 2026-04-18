# 체크포인트 - 한국어 문서 정리와 복귀 지표 리포트

날짜: 2026-04-17

## 사용자 요청

`docs/weekly-micro-mission-worklog.md`와 `DESIGN.md`를 한글로 정리하고, 다음 작업으로 넘어가자고 요청했다.

## 문서 정리

- `docs/weekly-micro-mission-worklog.md`를 한국어 작업 기록으로 재작성했다.
- `DESIGN.md`를 한국어 디자인 시스템 문서로 재작성했다.
- `DESIGN.md`에는 Urban Field Notes, Data-Driven Accent 팔레트, UI 원칙, 컴포넌트 지침, 일지/커뮤니티 가드레일을 한국어로 정리했다.

## 다음 작업으로 진행한 것

Slice 5의 핵심 작업인 “실패/스킵 후 다음 주 복귀 지표” 기반을 추가했다.

변경 사항:

- `supabase/migrations/004_micro_social_missions.sql`
  - `public.micro_mission_return_report()` SQL report 함수 추가
  - 마이크로 미션을 스킵했거나 `could_not_do_it`으로 회고한 사용자를 주차별 cohort로 집계
  - 다음 주 챌린지 활동 또는 주간 체크인이 있으면 복귀로 계산
  - 관련 index 추가
  - authenticated/service_role 실행 권한 추가
- `src/lib/supabase/types.ts`
  - `micro_mission_return_report` RPC return type 추가
- `docs/weekly-micro-mission-worklog.md`
  - 복귀 지표 report가 구현됐음을 반영

## 검증

통과:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `git diff --check -- DESIGN.md docs\weekly-micro-mission-worklog.md supabase\migrations\004_micro_social_missions.sql src\lib\supabase\types.ts`

주의:

- `npm run lint`는 통과하지만 기존 `.eslintignore` 관련 ESLint 9 경고가 계속 표시된다.
- SQL migration은 실제 Supabase DB에 아직 적용하지 않았다.

## 다음 추천 작업

1. `004_micro_social_missions.sql`을 실제 Supabase 프로젝트에 적용한다.
2. 샘플 데이터나 staging 데이터로 `select * from public.micro_mission_return_report();` 결과를 확인한다.
3. Playwright managed browser를 설치/설정한 뒤 `npm run test:e2e`를 실행한다.
