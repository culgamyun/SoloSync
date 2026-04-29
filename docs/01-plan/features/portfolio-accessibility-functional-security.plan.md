# 포트폴리오 접근성 · 기능 데모 · 보안 증빙 계획

마지막 업데이트: 2026-04-29
상태: 구현 및 로컬 검증 완료

## 목표

7A/7B에서 SoloSync의 field-note 비주얼 정체성과 모션 완성도를 올렸으므로, 다음 단계는 포트폴리오 리뷰 기준에서 “보기 좋다”를 넘어 “쓸 수 있고, 검증되어 있고, 보안 의식이 보인다”까지 끌어올리는 것이다.

진행 순서는 고정한다.

1. 7C 접근성 및 사용성 폴리시
2. 7D 포트폴리오 데모 플로우 강화
3. 7E 보안 및 운영 증빙

## 7C 접근성 및 사용성 폴리시

### 목적

키보드 사용자, 스크린 리더 사용자, 모바일 터치 사용자 모두가 핵심 루틴을 막힘 없이 이해하고 완료할 수 있게 한다. 시각적으로는 현재 디자인 언어를 유지하되, focus 상태와 선택 상태를 더 명확하게 만든다.

### 적용 화면

- welcome
- login 또는 QA auth bypass 진입
- home
- challenges
- challenge detail
- reflection
- progress
- settings

### 작업 항목

- 키보드 tab 순서를 점검하고, 주요 버튼/링크/폼 컨트롤이 자연스러운 순서로 이동되는지 확인한다.
- bottom navigation의 현재 탭이 시각적으로도, 스크린 리더 관점에서도 드러나도록 `aria-current` 또는 동등한 표현을 확인한다.
- icon-only 또는 icon-heavy 버튼에 `aria-label`이 빠진 곳이 없는지 점검한다.
- reflection outcome, mood, difficulty radio card의 선택 상태와 focus 상태를 명확히 한다.
- mission adjustment 버튼, challenge card CTA, submit 버튼의 focus-visible 스타일을 보강한다.
- 44px 미만 touch target 후보를 찾아 수정한다.
- 색 대비가 애매한 muted text, chip, status badge를 확인한다.
- `prefers-reduced-motion` 상태에서도 정보 접근과 조작 가능성이 유지되는지 확인한다.

### 비범위

- 전체 디자인 시스템 재작성
- 색상 팔레트 대규모 변경
- 접근성 자동화 도구를 이유로 UX를 기계적으로 바꾸는 작업

### 수용 기준

- 주요 데모 경로를 키보드만으로 이동하고 제출할 수 있다.
- focus ring이 보이며, 기존 field-note 디자인을 해치지 않는다.
- 하단 nav의 현재 위치가 시각적/의미적으로 모두 명확하다.
- reflection 선택 카드에서 선택 상태, hover/tap, focus 상태가 충돌하지 않는다.
- 모바일 390px에서 버튼과 탭 라벨이 겹치지 않는다.

## 7D 포트폴리오 데모 플로우 강화

### 목적

리뷰어가 별도 설명 없이 2분 안에 “작은 관계 루틴 → 미션 조정 → 회고 → 성장 확인” 흐름을 한 번 완료할 수 있게 한다. 기존 smoke test는 렌더링 중심이므로, 실제 상호작용과 상태 변화 검증을 보강한다.

### 핵심 플로우

1. `/api/qa/auth-bypass?next=/ko/home`로 데모 진입
2. home에서 이번 주 챌린지 확인
3. challenge detail로 이동
4. “조금 더 작게”, “장소 바꾸기”, “한마디를 더 안전하게” 중 하나를 실행
5. 반영된 mission context, safe line, minimum win 확인
6. reflection으로 이동
7. outcome, mood, difficulty, reflection text 입력 후 제출
8. progress 또는 home으로 돌아와 점수/진행 맥락 확인
9. 같은 reflection을 반복 제출해도 XP가 중복 지급되지 않는지 확인

### 작업 항목

- 기존 smoke test와 충돌하지 않는 별도 portfolio demo E2E를 추가할지 결정한다.
- reflection submit 성공 경로를 직접 검증한다.
- duplicate reflection/idempotency 경로를 직접 검증한다.
- mission adjustment 후 detail 화면 copy가 실제로 바뀌는지 검증한다.
- back navigation과 locale routing이 데모 중 끊기지 않는지 확인한다.
- 빈 상태 또는 demo fallback 상태에서 안내가 충분한지 확인한다.
- README의 포트폴리오 데모 경로와 checkpoint의 검증 결과를 최신화한다.

### 비범위

- 새 DB schema 추가
- 실제 production analytics 구축
- 데모 전용 UI를 제품 UI와 분리해서 만드는 작업

### 수용 기준

- 처음 보는 사람이 로컬 데모에서 핵심 경험을 2분 안에 한 번 완료할 수 있다.
- Playwright가 reflection submit과 duplicate submit을 검증한다.
- 미션 조정 후 화면에 보이는 copy가 변경된다.
- QA auth bypass 없이도 일반 라우팅 구조가 깨지지 않는다.

## 7E 보안 및 운영 증빙

### 목적

포트폴리오 리뷰어가 “이 앱은 보안과 운영을 생각하며 만들었다”고 판단할 수 있도록 코드, 테스트, 문서 근거를 정리한다. 큰 보안 변경은 신중하게 backlog로 두고, 현재 안전하게 증빙 가능한 것부터 닫는다.

### 작업 항목

- `/api/qa/auth-bypass`가 real production runtime에서 차단되는지 unit test와 코드 흐름을 재확인한다.
- `SUPABASE_SERVICE_ROLE_KEY`가 client bundle 경로로 새지 않는지 검색 기반 guard 또는 문서화된 체크를 추가한다.
- Supabase migration에서 주요 user-owned table의 RLS enable/policy 존재를 점검하고, 결과를 security checklist에 남긴다.
- `npm audit --omit=dev` 결과를 다시 확인한다.
- security headers 중 이미 안전하게 적용된 항목과, CSP처럼 report-only로 시작해야 하는 항목을 분리한다.
- Vercel preview smoke가 실제 URL만 주어지면 실행 가능한 상태인지 문서와 script 관점에서 확인한다.
- checkpoint 또는 별도 security proof 문서에 증빙 결과를 요약한다.

### 비범위

- CSP 즉시 enforce
- 인증/권한 모델 재설계
- Supabase schema 변경
- production 배포 또는 main 병합

### 수용 기준

- QA bypass production 차단 근거가 코드와 테스트로 남아 있다.
- service role key client leakage 검토 결과가 명확하다.
- 주요 RLS coverage가 문서화되어 있다.
- `npm audit --omit=dev` 결과가 기록된다.
- 보안 backlog가 “나중에 해야 할 막연한 일”이 아니라 우선순위와 위험도로 정리되어 있다.

## 공통 검증 계획

필수 명령:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run check`
- `npm run test:e2e:smoke`

추가 검증:

- keyboard-only Playwright 또는 수동 tab traversal
- mobile 390px / desktop visual QA
- reduced motion emulation
- `npm audit --omit=dev`
- production QA bypass 차단 테스트
- RLS migration coverage 점검

## 구현 순서

1. Worklog와 이 계획 문서를 먼저 커밋한다.
2. 7C 접근성 및 사용성 폴리시를 구현하고 검증한다.
3. 7D 데모 플로우 E2E를 추가하고 필요한 copy/navigation 문제를 수정한다.
4. 7E 보안/운영 증빙을 코드, 테스트, 문서로 정리한다.
5. 모든 검증 결과를 checkpoint에 반영한다.
6. 사용자의 별도 확인 전까지 원격 push와 main 병합은 하지 않는다.
