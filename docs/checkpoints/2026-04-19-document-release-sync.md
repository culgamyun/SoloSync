# 체크포인트 - 문서 릴리즈 동기화

날짜: 2026-04-19

## 작업 배경

Weekly Micro-Mission V1과 post-merge QA hardening이 모두 main에 머지된 뒤, 문서 릴리즈 동기화를 진행했다.

이전 문서 중 일부는 한글이 mojibake 상태로 깨져 있어 다음 작업자가 로드맵, 워크로그, 디자인 시스템을 신뢰하기 어려웠다.

## 변경 사항

- `README.md`를 현재 제품 상태에 맞게 갱신했다.
  - Weekly micro-mission V1 surface
  - QA auth bypass
  - return report RPC
  - 주요 명령어와 문서 진입점
- `ENV_LOCAL_SETUP.md`를 정상 한글로 복구했다.
  - Supabase, Gemini, VAPID, Sentry, QA bypass 설정을 정리했다.
- `DESIGN.md`를 정상 한글 source of truth로 복구했다.
  - Urban Field Notes
  - Data-Driven Accent
  - 컴포넌트 guardrail
  - 일지/익명 응원 댓글 후보 기능의 moderation 원칙
- `docs/01-plan/weekly-micro-mission-roadmap.md`를 현재 shipped state 기준으로 갱신했다.
- `docs/weekly-micro-mission-worklog.md`를 현재 실행 상태와 다음 backlog 중심으로 갱신했다.
- `docs/01-plan/features/weekly-micro-mission-v1.plan.md`를 shipped implementation plan으로 정리했다.
- `CLAUDE.md`에 에이전트가 읽어야 할 source-of-truth 문서, 명령어, QA auth bypass, Supabase notes를 추가했다.

## 현재 상태

- V1 feature and QA hardening are merged to main.
- Active next product slice is still Phase B readiness.
- Recommended next implementation work:
  1. deployment/preview QA setup,
  2. human-readable retention report inspection,
  3. `.eslintignore` cleanup into `eslint.config.mjs`.

## 검증

문서 변경 후 다음 검증을 진행한다:

- `git diff --check`
- 필요 시 `npm run check`

## 주의

기존 과거 checkpoint 중 일부는 여전히 mojibake일 수 있다. 이번 작업에서는 장기 source-of-truth 문서와 현재 handoff 문서를 우선 복구했다.
