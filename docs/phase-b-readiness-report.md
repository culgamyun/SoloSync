# Phase B Readiness Report

Last updated: 2026-04-22
Status: shipped on `main`

## 한눈에 보기

Phase B의 목표는 세 가지였습니다.

1. 운영자가 V1 핵심 지표를 쉽게 볼 수 있게 만들기
2. 사용자가 "이번 주 미션이 너무 버겁다"라고 느낄 때 바로 완화할 수 있게 만들기
3. 다음 미션이 덜 뜬금없도록 생활 공간과 부담 포인트를 저장하게 만들기

2026-04-22 기준으로 이 세 가지는 모두 `main` 브랜치에 반영되었고, 원격 Supabase 마이그레이션도 적용되었습니다.

## 무엇을 만들었나

### 1. 리텐션 리포트 가시화

- `public.micro_mission_return_report()`를 직접 SQL로 다시 읽지 않아도 되도록 로컬 리포트 커맨드를 추가했습니다.
- `npm run report:micro-missions`로 실패/스킵 유저의 다음 주 재방문 비율을 확인할 수 있습니다.
- `--json` 옵션으로 raw 결과도 볼 수 있습니다.

### 2. 미션 완화 및 교체 흐름

- 현재 주간 micro-mission에서 바로 다음 조정을 할 수 있게 했습니다.
  - 더 작게
  - 다른 생활 공간으로
  - 더 안전한 한마디로
- 조정은 현재 challenge row를 그대로 갱신하고, 이전/이후 payload는 `challenge_mission_adjustments`에 남기도록 했습니다.
- LLM 재생성이 아니라 deterministic template로 처리해서 속도와 예측 가능성을 확보했습니다.

### 3. 프로필 개인화

- `user_profiles`에 `routine_spaces`, `social_fears`를 추가했습니다.
- `/settings/profile`에서 체크칩으로 생활 공간과 부담 요인을 저장할 수 있게 했습니다.
- 저장된 값은 이후 challenge generation의 Gemini context와 fallback copy에 반영됩니다.

## 왜 중요한가

Phase A가 "주간 social micro-mission을 성립시키는 단계"였다면, Phase B는 "사용자가 도중에 이탈하지 않도록 제어권을 조금씩 돌려주는 단계"였습니다.

이번 번들로 SoloSync는 다음을 할 수 있게 됐습니다.

- 운영자는 핵심 리텐션 지표를 본다
- 사용자는 너무 큰 미션을 바로 줄인다
- 시스템은 사용자의 생활 맥락을 조금 더 안다

즉, "무리해서 수행시키는 앱"이 아니라 "버거우면 줄여주고, 다음엔 더 맞춰주는 앱"에 한 걸음 가까워졌습니다.

## 구현 결과

### 제품 관점

- 실패/스킵 이후에도 제품 안에 머무를 수 있는 완충 장치가 생겼습니다.
- 프로필이 단순 정보 저장을 넘어서 실제 미션 품질에 영향을 주기 시작했습니다.
- 아직 matching/community로 가지 않고도 개인화와 회복 루프의 기반을 확보했습니다.

### 데이터 관점

- 리텐션 확인용 RPC와 리포트 스크립트가 연결되었습니다.
- 조정 이벤트가 별도 테이블에 남아 이후 분석이 가능해졌습니다.
- 프로필 개인화 값이 generation path에 연결되었습니다.

### UX 관점

- "못하겠음"이 막다른 길이 아니라 조정 가능한 상태로 표현됩니다.
- 프로필 입력은 onboarding이 아니라 settings에 두어 첫 사용 부담을 키우지 않았습니다.
- 이전 디자인 QA에서 잡았던 score ring, chip wrap, button wrap, coach navigation 이슈도 함께 정리된 상태입니다.

## 검증 상태

Pass 기준으로 확인된 항목:

- `npm run check`
- `npm run build`
- `npm run test:e2e -- tests/e2e/smoke.spec.ts`
- `npx supabase db push`

추가로 확인된 사실:

- 원격 Supabase 마이그레이션은 `007_profile_personalization.sql`까지 적용됨
- Playwright smoke는 desktop/mobile Chromium 기준 통과

## 현재 남아 있는 한계

- preview/prod 배포 QA는 로컬만큼 반복 가능하게 정리되어 있지 않습니다.
- adjustment/personalization이 실제로 다음 주 리텐션을 얼마나 끌어올리는지 보는 집계는 아직 부족합니다.
- 공개 저널/커뮤니티 아이디어는 여전히 moderation 설계 전이라 보류 상태입니다.

## Post-Phase-B에서 바로 할 일

권장 우선순위는 아래 순서입니다.

1. **관측 가능성 강화**
   - adjustment 사용률
   - personalization 입력률
   - 조정 후 다음 주 복귀율

2. **Social Recovery Loop의 첫 제품화**
   - 실패/스킵 이후 다음 주 재진입 경험을 더 의식적으로 설계

3. **배포/프리뷰 QA 하드닝**
   - 로컬에서만 되는 QA가 아니라 preview에서도 반복 가능한 확인 루틴 확보

## 결론

Phase B는 "기능 3개 추가"보다 더 큰 의미가 있습니다. SoloSync가 이제 처음으로 사용자의 부담을 측정하고, 그 부담에 맞춰 미션을 줄이고, 다음 미션을 약간 더 맞춤화할 수 있게 됐습니다.

다음 단계는 여기에 기능을 더 얹는 것보다, 이 완충 구조가 실제 리텐션을 올리는지 더 잘 보고 더 잘 반복하는 것입니다.
