# Portfolio Visual Identity & Motion Polish Plan

Last updated: 2026-04-29
Status: implemented and verified locally on `codex/portfolio-readiness-audit`

## 목표

SoloSync가 포트폴리오 데모 첫 5초 안에 “작은 관계 루틴 / weekly micro-mission” 제품으로 보이도록 시각 정체성과 움직임을 보강한다. 비주얼 방향은 `Field-note illustration`, 모션 방향은 `Expressive app feel`로 고정한다.

## 문제

현재 앱은 기능 흐름은 읽히지만, 첫 화면과 핵심 루틴 화면에서 제품 고유의 장면성이 아직 약하다. 또한 화면 전환, 하단 탭, 카드 선택, 점수 변화가 정적으로 느껴져 포트폴리오 데모에서 완성도가 덜 살아난다.

## 범위

1. **Visual identity assets**
   - 생성형 raster asset을 프로젝트 자산으로 저장한다.
   - 적용 위치는 welcome, challenge detail, home/progress, empty state이다.
   - 하단 navigation에는 이미지를 넣지 않고 lucide icon 체계를 유지한다.

2. **Motion polish**
   - Framer Motion으로 짧고 조용한 reveal, active tab indicator, card/tap feedback, score ring animation을 적용한다.
   - `prefers-reduced-motion`을 존중한다.
   - 반복적 shimmer, bounce, 과장된 wellness-style motion은 제외한다.

## 자산 세트

저장 위치: `public/images/field-notes/`

- `welcome-routine-space.webp`
  - welcome hero용.
  - 일상 공간에서 작은 관계 행동을 준비하는 장면.
- `micro-mission-field-note.webp`
  - challenge detail의 micro-mission 섹션용.
  - 카페, 편의점, 동네 공간의 field-note 분위기.
- `progress-stamp.webp`
  - home score/recovery, progress 영역용.
  - weekly routine stamp/badge 느낌.
- `empty-state-field-note.webp`
  - challenge/progress 빈 상태용.
  - 조용한 기록 노트와 다음 시도를 기다리는 느낌.

## 공통 프롬프트 방향

Urban Field Notes, calm green, observation blue, toned terracotta, light paper texture, mobile PWA-friendly composition. No text, no logos, no watermark, no dating symbolism, no therapy or medical symbolism, no stock-photo feel.

## 구현 규칙

- `FieldNoteImage`
  - radius, border, aspect ratio, decorative alt, image sizing을 통일한다.
  - 앱 내부에서는 field-note 이미지를 정보 카드의 보조 레이어로만 사용한다.
- `MotionReveal`
  - 서버 페이지에서 사용할 수 있는 작은 client wrapper로 유지한다.
  - 기본 duration은 320ms 이내, delay는 section 단위로 짧게 제한한다.
- `TabBar`
  - active tab은 `layoutId` indicator로 부드럽게 이동한다.
  - icon/text scale과 opacity feedback은 작게만 준다.
- `ScoreRing`
  - stroke dashoffset을 initial-to-target으로 animate한다.
  - 숫자 count-up은 v1에서 제외한다.
- Card/interaction
  - challenge card, reflection outcome, mission adjustment button에는 hover/tap/selected feedback을 준다.
  - form action, route, auth, QA bypass behavior는 바꾸지 않는다.

## 적용 화면

- Welcome
  - routine-space field-note asset을 첫 화면의 중심 신호로 추가한다.
- Home
  - progress stamp와 recovery field-note band로 “이번 주 루틴” 인상을 강화한다.
- Challenges
  - challenge card hover/tap motion과 empty-state visual fallback을 준비한다.
- Challenge Detail
  - micro-mission field-note image band를 mission context 영역 상단에 추가한다.
  - smaller/different/safer adjustment 버튼에 조용한 interaction feedback을 준다.
- Reflection
  - outcome, mood, difficulty 선택이 자연스럽게 강조되도록 selected transition을 준다.
- Progress
  - score ring animation과 stamp asset으로 성취감을 보강한다.
- Settings
  - 정보 구조는 유지하고 section reveal만 적용한다.

## QA 기준

필수 명령:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run check`
- `npm run test:e2e:smoke`

브라우저/시각 QA:

- 390px 모바일과 데스크톱에서 welcome, home, challenges, challenge detail, reflection, progress, settings 확인.
- console error 없음.
- horizontal overflow 없음.
- 하단 nav label/icon 겹침 없음.
- generated image가 product identity를 강화하고 therapy/dating/stock-photo처럼 보이지 않아야 함.
- reduced motion emulation에서 핵심 사용성이 유지되어야 함.

## 수용 기준

- Welcome과 Home에서 첫 5초 안에 “작은 관계 루틴 / weekly micro-mission” 정체성이 보인다.
- 하단 navigation은 이미지 장식 없이 더 부드럽고 명확한 active state를 보여준다.
- Challenge detail은 mission context, safe line, minimum win을 field-note처럼 이해시킨다.
- Motion은 사용성을 돕고 반복적이거나 산만한 bounce/shimmer가 없다.

## 비범위

- 새 public API 추가.
- DB schema, Supabase migration 변경.
- QA auth bypass, auth route, locale route 의미 변경.
- CSP처럼 앱 동작을 크게 흔들 수 있는 보안 헤더 변경.
