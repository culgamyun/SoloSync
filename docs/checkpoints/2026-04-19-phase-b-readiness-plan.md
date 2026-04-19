# 체크포인트 - Phase B Readiness 계획 잠금

날짜: 2026-04-19

## 요청

사용자가 다음 세 작업을 모두 진행해야 할 작업으로 보고, Phase B Readiness 묶음으로 roadmap/worklog에 반영한 뒤 `plan-eng-review`와 `plan-design-review`로 구현 계획을 잠가달라고 요청했다.

대상 작업:

1. Retention report 확인 기능
2. 더 작은 미션 요청 / 미션 바꾸기
3. 루틴 공간 / 두려움 기반 개인화

## 결과

새 계획 파일을 만들었다:

- `docs/01-plan/features/phase-b-readiness.plan.md`

업데이트한 문서:

- `docs/01-plan/weekly-micro-mission-roadmap.md`
- `docs/weekly-micro-mission-worklog.md`

## 잠긴 구현 순서

1. **5A Retention report visibility**
   - `micro_mission_return_report()`를 조회하는 내부/local script를 먼저 만든다.
   - 앱 내부 admin page는 admin role이 생기기 전까지 만들지 않는다.

2. **5B Smaller mission and swap mission**
   - 사용자가 현재 micro-mission을 더 작게, 다른 장소로, 더 안전한 한마디로 바꿀 수 있게 한다.
   - 현재 challenge row는 in-place update한다.
   - 이전/이후 payload는 `challenge_mission_adjustments` event table에 남긴다.
   - 첫 구현은 LLM이 아니라 deterministic template로 한다.

3. **5C Routine space and fear personalization**
   - `user_profiles`에 `routine_spaces`, `social_fears` 배열을 추가한다.
   - profile settings에서 lightweight chip으로 선택하게 한다.
   - future challenge generation과 fallback에 반영한다.

## Review 결정

Engineering review:

- Admin web UI 대신 internal script를 선택했다.
- Challenge adjustment는 `challenge_reflections`가 아니라 별도 event table에 기록한다.
- Preferences는 `barriers/goals`에 섞지 않고 명시적 필드로 둔다.
- 22개 planned test path를 plan에 기록했다.

Design review:

- 초기 design completeness 6/10에서 9/10으로 보강했다.
- Adjustment controls는 primary action 옆이 아니라 mission explanation 아래의 relief valve로 둔다.
- "포기/실패/난이도 하향" 같은 표현을 금지했다.
- Profile preference UI는 therapy intake가 아니라 practical field-note chip 형태로 둔다.

## 다음 단계

다음 구현 브랜치 추천:

- `codex/phase-b-retention-report`

첫 구현 범위:

- `scripts/micro-mission-return-report.mjs`
- `package.json` script
- README 또는 ENV 문서 보강
- script formatting/error tests where practical

그 다음 브랜치:

- `codex/mission-adjustments`
- `codex/micro-mission-preferences`
