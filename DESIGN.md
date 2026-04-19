# SoloSync 디자인 시스템

## 제품 맥락

- **무엇인가:** SoloSync는 관계가 얕아졌다고 느끼는 사람에게 매주 하나의 부담 낮은 사회적 마이크로 미션을 제안하는 소셜 헬스 코치다.
- **누구를 위한가:** 수도권에 사는 20대 1인 가구 직장인. 출근 근무를 하고, 퇴근 후 루틴은 헬스장, 유튜브, 잠으로 좁아져 있다. 회사 밖 친구가 적고 모임 앱은 부담스럽다.
- **인접 영역:** 사회성 회복, 행동 변화, 외로움 완화, 모임/친구 찾기 전 단계의 사회적 재진입.
- **피해야 할 오해:** 상담 앱, 데이팅 앱, 모임 마켓플레이스, 감정 일기만 하는 AI 챗봇처럼 보이면 안 된다.
- **제품 유형:** 모바일 우선 PWA / 웹앱.

## 미학 방향

- **방향:** Urban Field Notes.
- **형태:** 도시의 생활 공간을 관찰하는 차분한 현장 노트. 작은 스탬프, 체크 표시, 장소/상대/타이밍 구조, 미세한 그리드 질감을 사용한다.
- **정서:** 사용자를 진단하지 않는다. 감정을 과장하지 않고, 아주 작은 행동을 실험처럼 다룬다.
- **핵심 차별점:** 대부분의 외로움/관계 제품은 이미 사람을 만나거나 이벤트를 찾을 준비가 됐다고 가정한다. SoloSync는 그 이전, 생활권에서 20초짜리 접촉을 시도하는 단계에서 시작한다.

## 타이포그래피

- **Display / Hero:** IBM Plex Sans KR. 한국어를 또렷하게 지지하고 기록지 같은 인상을 준다.
- **Body:** IBM Plex Sans KR. 본문과 UI를 같은 한국어 중심 서체로 맞춘다.
- **UI / Label:** IBM Plex Sans KR 600-700 weight. 칩, 버튼, 상태 라벨, 폼 라벨에 사용한다.
- **Data / Metric:** Geist Mono. 점수, XP, streak, 날짜, 스탬프, 테이블 숫자에 사용한다.
- **Code:** Geist Mono.
- **로딩 전략:** 초기에는 Google Fonts의 `IBM Plex Sans KR`, `Geist Mono`를 사용한다. 성능 문제가 커지면 실제 사용하는 weight만 self-host한다.

### 타입 스케일

- Display: desktop 48px / 1.18, mobile 35px / 1.18
- Page title: 28px / 1.22
- Section title: 22px / 1.25
- Card title: 17px / 1.35
- Body: 16px / 1.65
- Small body: 14px / 1.55
- Label: 12px / 1.2
- Metric: 32px / 1.0, Geist Mono

## 컬러

- **접근:** Data-Driven Accent. 행동은 calm green, 관찰은 blue, 회고는 toned-down terracotta로 나눈다. 색은 감정을 과장하기보다 데이터의 성격을 구분한다.
- **Background:** `#F7FAF6` - 조용한 초록빛 종이. 베이지/크림으로 기울지 않는다.
- **Surface:** `#FFFFFF` - 주요 카드와 panel.
- **Surface 2:** `#EEF5F0` - field note block, safe-line callout, 비활성 chip.
- **Ink:** `#202622` - 본문, 강한 border, 핵심 텍스트.
- **Muted:** `#66736B` - 보조 문구, label, 조용한 상태 텍스트.
- **Line:** `#D8E1DA` - divider와 약한 outline.
- **Primary:** `#126B5A` - 시작, 완료, active navigation, progress.
- **Observation:** `#73A8EE` - 관찰 힌트, 안전한 한마디, "무슨 일이 있었는지 기록"하는 UI.
- **Reflection:** `#C05A4E` - 회고, 실패 재해석, 감정이 열린 상태. 기본 filled button으로는 쓰지 않는다.
- **Info:** `#3C7DD9` - 시스템 안내, coach note, 중립 정보.
- **Error / Danger:** `#D94C61` - 오류, 위험, destructive action.
- **Success:** `#20805F` - 완료, 긍정적 확인.
- **Warning:** `#B48A00` - 주의, 속도 조절, 과하게 하지 말라는 안내.

### 다크 모드

단순 반전이 아니라 surface를 다시 설계한다.

- Background: `#151A17`
- Surface: `#202722`
- Surface 2: `#263129`
- Line: `#3D4B42`
- Reflection: `#DC7B70`
- Observation: `#8BBCFF`

다크 모드 accent는 작은 면적에만 사용하고, 고채도 블록은 피한다.

## 간격

- **기본 단위:** 4px.
- **정서:** 탄탄하지만 딱딱하지 않게. SoloSync는 고급 웰니스 앱이 아니라 실용적인 모바일 현장 노트다.
- **스케일:** 2xs 2px, xs 4px, sm 8px, md 16px, lg 24px, xl 32px, 2xl 48px, 3xl 64px.
- **규칙:** 모바일 카드 안쪽은 12-16px, 상위 panel은 20-24px, mission metadata gap은 8-12px를 우선한다.

## 레이아웃

- **접근:** Grid-disciplined mobile utility.
- **Grid:** 768px 미만은 단일 column. tablet/desktop에서는 보조 정보가 있을 때만 2-column을 쓴다.
- **최대 폭:** 모바일 앱 화면은 420px, 집중 읽기/form은 720px, desktop preview/admin은 1120px.
- **Radius:** sm 4px, md 6px, lg 8px. 카드와 버튼은 8px 이하를 유지한다. `full` radius는 avatar, ring 같은 원형 요소에만 쓴다.
- **Border:** 1px line을 구조로 사용한다. 주요 field-note panel과 mockup surface에는 ink border를 얇게 쓴다.
- **중첩 카드 금지:** 카드 안에 또 다른 장식 카드가 들어가면 안 된다. 정보 구조가 필요하면 divider, label, table, field row를 사용한다.
- **미션 화면:** 일반 동기부여 문구보다 `장소`, `상대`, `타이밍`, `안전한 한마디`, `최소 성공`, `실패 재해석`이 먼저 드러나야 한다.
- **레이아웃 안정성:** chip, XP, score label, 숫자, action button은 어색하게 줄바꿈되면 안 된다. 좁은 화면에서는 요소 배치를 바꾸고 개별 chip/control은 내부 줄바꿈을 피한다.

## 모션

- **접근:** Minimal-functional.
- **Easing:** enter는 ease-out, exit는 ease-in, 이동은 ease-in-out.
- **Duration:** micro 80ms, short 160ms, medium 240ms, long 400ms.
- **사용처:** 상태 변경, 페이지 전환, 점수 업데이트, coach reply 등장에만 사용한다.
- **금지:** 목적 없는 반복 motion, bouncing wellness animation, 의미 없는 shimmer.

## 제품 UI 원칙

- **수치화를 먼저 줄인다:** 사용자가 치료받는 사람이 아니라 작은 실험을 하는 사람처럼 느껴야 한다.
- **맥락을 구체화한다:** 추상적 조언보다 장소, 상대, 타이밍, 안전한 한마디를 우선한다.
- **최소 성공을 크게 보이게 한다:** "눈 마주치고 인사만 해도 성공"은 핵심 affordance다.
- **실패를 다시 해석한다:** 실패 상태는 막다른 길이 아니라 다음 시도를 고르는 단서여야 한다.
- **완료보다 복귀:** 초기 핵심 지표는 미션을 실패/스킵한 사용자가 다음 주에 돌아오는지다.
- **카테고리 일관성:** 데이팅, 모임, 상담, AI 챗봇 wrapper처럼 보이는 패턴을 빌리지 않는다.

## 일지 / 커뮤니티 가드레일

향후 후보 기능으로 "오늘의 일지"를 고려한다.

- **기본은 비공개:** 일지는 기본적으로 비공개이며, 이때는 AI만 댓글/해석을 제공한다.
- **공개는 명시적 선택:** 익명 커뮤니티 공개는 default가 아니며 사용자가 직접 선택해야 한다.
- **댓글은 응원 중심:** 공개 댓글은 지지, 공감, "나도 비슷했어", 조심스러운 경험 공유 수준으로 제한한다.
- **Moderation 우선:** 욕설, 비난, 조롱, 혐오, 과도한 부정 라벨링, 자해 위험 표현은 필터링, 경고, 차단, 검토 경로가 필요하다.
- **Engagement bait 금지:** 좋아요, 인기순, 공개 취약성 경쟁, streak 압박으로 피드를 설계하지 않는다.
- **출시 순서:** 먼저 비공개 AI 일지로 학습한다. 공개 익명 댓글은 core micro-mission loop와 moderation 설계가 준비된 뒤에 연다.

## 컴포넌트 지침

- **Button:** 최소 높이 44px, radius 6px, gradient 금지, label 내부 줄바꿈 금지. primary는 `#126B5A`.
- **Icon button:** `size="icon"`은 44px 정사각형, 내부 padding 0, 접근성 label 필수.
- **Chip:** compact하게, 내부 줄바꿈 없이, radius 4px. 상태 의미가 있을 때만 semantic fill을 쓴다.
- **Card:** 1px border, 6-8px radius, label과 divider로 계층을 만든다. 떠 있는 nested card를 남발하지 않는다.
- **Score ring:** 숫자와 label은 ring 안에 둔다. delta는 공간이 충분할 때만 ring 바깥 아래에 둔다.
- **Coach message:** 좌우 정렬과 명확한 bubble을 쓴다. 코치 문장은 과하게 치료적이지 않고, 구체적 다음 행동을 포함해야 한다.
- **Reflection form:** 먼저 낮은 마찰의 outcome 선택지를 제공하고, 자유 작성은 선택에 가깝게 둔다. 고백문을 강요하지 않는다.
- **Bottom navigation:** 앱 shell 위의 작은 control surface처럼 보여야 한다. 과한 pill/glass 효과는 피한다.

## Preview

- HTML preview: `.gstack/design-consultation/solosync-urban-field-notes-preview.html`
- 목적: 실제 앱 코드 적용 전 타이포그래피, 컬러, 컴포넌트 rhythm, realistic SoloSync screen 방향을 보는 정적 reference.
- 주의: `.gstack/`는 저장소 문서의 source of truth가 아니다. 최종 결정은 이 `DESIGN.md`에 남긴다.

## 결정 기록

| 날짜 | 결정 | 이유 |
| --- | --- | --- |
| 2026-04-17 | 초기 디자인 시스템 생성 | Office Hours 맥락과 디자인 컨설테이션 리서치를 바탕으로 Urban Field Notes 방향을 정했다. |
| 2026-04-17 | 데이팅/모임/상담 문법을 피한다 | SoloSync의 가치는 사용자가 치료, 이벤트, 데이트를 선택하기 전 단계에서 시작한다. |
| 2026-04-17 | IBM Plex Sans KR + Geist Mono 선택 | 한국어 가독성과 점수/XP/field label의 기록 감각을 동시에 살린다. |
| 2026-04-17 | Data-Driven Accent 팔레트 선택 | green action은 유지하고, high-energy citron/coral 조합은 observation blue와 reflection terracotta로 낮췄다. |
| 2026-04-17 | 일지/익명 응원 댓글은 후보로만 기록 | 비공개 AI 회고는 잘 맞지만 공개 익명 댓글은 moderation과 anti-engagement guardrail이 준비된 뒤에 열어야 한다. |
| 2026-04-19 | 문서 인코딩 복구 | 깨진 한글은 디자인 의사결정을 이어받기 어렵게 하므로, merged state 기준으로 정상 한글 source of truth를 복구했다. |
