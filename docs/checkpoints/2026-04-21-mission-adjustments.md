# 체크포인트 - 5B 미션 조정 구현

날짜: 2026-04-21

## 작업

Phase B Readiness의 두 번째 구현 slice인 5B Smaller mission and swap mission을 로컬에서 구현했다.

## 변경 사항

- `supabase/migrations/006_phase_b_readiness.sql` 추가
  - `challenge_mission_adjustments` 테이블 생성
  - `request_type` 제약, 인덱스, RLS 정책 추가
- `src/lib/challenges/micro-mission-adjustments.ts` 추가
  - `smaller`, `different_space`, `safer_line` deterministic 조정 로직 구현
  - 이전/이후 미션 snapshot 생성 헬퍼 추가
- `src/actions/challenges.ts`
  - `adjustMicroMissionAction` 추가
  - owned challenge 검증, completed 차단, adjustment event insert, challenge row update, redirect feedback 처리
- `src/app/[locale]/(main)/challenges/[id]/page.tsx`
  - "너무 크다면" 조정 섹션 추가
  - 조정 성공/오류 배너 추가
  - demo/QA mode에서 redirect 후 조정된 미션 미리보기 지원
- 테스트 추가
  - `tests/unit/micro-mission-adjustment.test.ts`
  - `tests/unit/challenge-adjustment-action.test.ts`
  - `tests/e2e/smoke.spec.ts`에 mission adjustment smoke 추가

## 검증

- `npm run test -- tests/unit/micro-mission-adjustment.test.ts tests/unit/challenge-adjustment-action.test.ts`
- `npm run check`
- `npm run build`
- `npm run test:e2e -- tests/e2e/smoke.spec.ts`

## 남은 것

- remote Supabase에 `006_phase_b_readiness.sql` 적용 및 검증
- 다음 slice인 5C Routine space / social fear personalization 구현
