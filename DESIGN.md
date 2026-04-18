# SoloSync 디자인 시스템

## 제품 맥락

- **무엇인가:** SoloSync는 관계가 얕아졌다고 느끼는 사람에게 매주 낮은 부담의 사회적 마이크로 미션을 제안하는 소셜 헬스 코치다.
- **누구를 위한가:** 수도권에 사는 20대 1인 가구 직장인. 출근 근무를 하고, 퇴근 후에는 헬스장, 유튜브, 넷플릭스, 잠으로 이어지는 루틴이 많다. 회사 밖 친구가 적고, 모임 앱은 부담스럽게 느낀다.
- **인접 영역:** 소셜 헬스, 행동 변화, 외로움 완화, 모임/친구 찾기 전 단계의 사회적 재진입. 인접 제품으로는 Meetup, Bumble For Friends, Timeleft, Finch, Headspace, 문토, 프립 등이 있다.
- **프로젝트 유형:** 모바일 우선 PWA / 웹앱.

## 미학 방향

- **방향:** Urban Field Notes.
- **장식 수준:** 의도적 장식. 얇은 선, 작은 스탬프, 체크 표시, 장소/상대/타이밍 구조, 미세한 그리드 질감을 사용한다.
- **느낌:** 평범한 도시 생활을 관찰하는 차분한 현장 노트처럼 보여야 한다. 실용적이고, 관찰적이고, 판단하지 않으며, 살짝 도시적이어야 한다.
- **피해야 할 느낌:** 상담 접수지, 데이팅 앱, 모임 마켓플레이스, 파스텔 웰니스 저널, AI 챗봇 wrapper처럼 보이면 안 된다.
- **핵심 통찰:** 대부분의 인접 제품은 사용자가 이미 사람이나 이벤트를 찾을 준비가 되어 있다고 가정한다. SoloSync의 wedge는 그 이전이다. 사용자가 모임, 데이트, 상담을 선택하기 전에 생활권에서 20초짜리 접촉을 시도하도록 돕는다.

## 타이포그래피

- **Display / Hero:** IBM Plex Sans KR. 한국어를 잘 지원하고, 일반적인 앱 sans보다 구조적이고 기록지 같은 인상을 준다.
- **Body:** IBM Plex Sans KR. 본문과 display를 같은 한국어 우선 서체로 맞춰 UI가 조각나 보이지 않게 한다.
- **UI / Label:** IBM Plex Sans KR 600-700 weight. 칩, 버튼, 상태 라벨, form label에 사용한다.
- **Data / Metric:** Geist Mono. 점수, XP, streak, 날짜, 작은 stamp, table 숫자에 사용한다. 숫자는 가능하면 tabular numeric으로 맞춘다.
- **Code:** Geist Mono.
- **로딩 전략:** 초기에는 Google Fonts의 `IBM Plex Sans KR`, `Geist Mono`를 사용한다. 성능 문제가 커지면 실제 사용하는 weight만 WOFF2로 self-host한다.

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

- **접근:** Data-Driven Accent. 행동은 calm green으로, 관찰은 blue로, 회고는 toned-down terracotta로 분리한다. 색은 감정의 과장이 아니라 데이터의 성격을 구분하는 장치다.
- **Background:** `#F7FAF6` - 조용한 초록빛 종이. 베이지/크림으로 기울지 않는다.
- **Surface:** `#FFFFFF` - 주요 카드와 panel.
- **Surface 2:** `#EEF5F0` - field note block, safe-line callout, 비활성 chip.
- **Ink:** `#202622` - 본문, 강한 border, 핵심 텍스트.
- **Muted:** `#66736B` - 보조 문구, label, 조용한 상태 텍스트.
- **Line:** `#D8E1DA` - divider와 낮은 강조의 outline.
- **Primary:** `#126B5A` - 시작, 완료, active navigation, progress.
- **Observation:** `#73A8EE` - 관찰 노트, 안전한 한마디, "무슨 일이 있었는지 기록"하는 UI.
- **Reflection:** `#C05A4E` - 회고, 실패 후 해석, 감정이 실린 상태. 큰 filled button에는 기본으로 쓰지 않는다.
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

다크 모드의 accent는 작은 면적에만 사용하고, 큰 채도 블록은 피한다.

## 간격

- **기본 단위:** 4px.
- **밀도:** 편하지만 푹신하지 않게. SoloSync는 고급 웰니스 저널이 아니라 실용적인 모바일 현장 노트다.
- **스케일:** 2xs 2px, xs 4px, sm 8px, md 16px, lg 24px, xl 32px, 2xl 48px, 3xl 64px.
- **규칙:** 밀도 높은 모바일 카드 내부는 12-16px, 상위 panel은 20-24px, mission metadata 내부 gap은 8-12px를 우선한다.

## 레이아웃

- **접근:** Grid-disciplined mobile utility.
- **Grid:** 768px 미만은 단일 column. tablet/desktop에서 두 번째 column이 정말 보조 정보일 때만 2-column을 쓴다.
- **최대 폭:** 모바일 앱 표면은 420px, 집중 읽기/form은 720px, desktop preview/admin은 1120px.
- **Radius:** sm 4px, md 6px, lg 8px. 카드와 버튼은 8px 이하를 유지한다. `full` radius는 avatar, ring 같은 원형 요소에만 사용한다.
- **Border:** 1px line을 구조로 사용한다. 주요 field-note panel과 mockup surface에는 ink border를 쓸 수 있다.
- **중첩 카드 금지:** 카드 안에 장식용 카드를 다시 넣지 않는다. 정보 구조가 필요하면 divider, label, table, field row를 사용한다.
- **미션 표면:** 미션 카드는 일반적인 동기부여 문구보다 `장소`, `상대`, `타이밍`, `안전한 한마디`, `최소 성공`, `실패 후 해석`을 먼저 드러내야 한다.
- **레이아웃 안정성:** chip, XP, score label, 숫자, action button은 어색하게 줄바꿈되면 안 된다. 좁은 화면에서는 요소 배치를 바꾸고, 개별 chip/control의 내부 줄바꿈은 피한다.

## 모션

- **접근:** Minimal-functional.
- **Easing:** enter는 ease-out, exit는 ease-in, 이동은 ease-in-out.
- **Duration:** micro 80ms, short 160ms, medium 240ms, long 400ms.
- **사용처:** 상태 변경, 페이지 전환, 점수 업데이트, coach reply 도착을 이해시키는 정도로만 사용한다.
- **금지:** 장식용 반복 motion, bouncing wellness animation, 의미 없는 shimmer.

## 제품 UI 원칙

- **수치심을 먼저 줄인다:** 사용자가 치료받는 사람이 아니라 작은 실험을 하는 사람처럼 느껴야 한다.
- **맥락을 구체화한다:** 추상적 조언보다 장소, 상대, 타이밍, 안전한 한마디를 우선한다.
- **최소 성공을 크게 보이게 한다:** "눈 마주치고 인사만 해도 성공"은 핵심 affordance다.
- **실패를 다시 해석한다:** 실패 상태는 막다른 길이 아니라 다음 시도를 고르는 단서여야 한다.
- **완료율보다 복귀율:** 초기 핵심 지표는 미션을 실패/스킵한 사용자가 다음 주에도 돌아오는지다.
- **카테고리 혼동을 피한다:** 데이팅 앱, 모임 앱, 상담 앱, AI 챗봇 wrapper처럼 보이는 패턴을 빌리지 않는다.

## 일지 / 커뮤니티 가드레일

향후 후보 기능으로 "오늘의 일지"를 고려한다.

- **기본은 비공개:** 일지는 기본적으로 비공개이며, 이때는 AI만 댓글/해석을 제공한다.
- **공개는 명시적 선택:** 익명 커뮤니티 공개는 default가 아니라 사용자가 직접 선택하는 action이어야 한다.
- **댓글은 응원 중심:** 공개 댓글은 짧은 응원, "나도 비슷했어요", 조심스러운 경험 공유 수준으로 제한한다.
- **Moderation 우선:** 욕설, 비난, 조롱, 혐오, 과도한 부정 워딩, 자해 위험 표현은 필터링/신고/차단/검토 경로가 필요하다.
- **Engagement bait 금지:** 좋아요, 인기순, 공개 취약성 경쟁, streak 압박으로 피드를 설계하지 않는다.
- **출시 순서:** 먼저 비공개 AI 일지로 학습한다. 공개 익명 댓글은 core micro-mission loop와 moderation 설계가 준비된 뒤에 연다.

## 컴포넌트 지침

- **Button:** 최소 높이 44px, radius 6px, gradient 금지, label 내부 줄바꿈 금지. primary는 `#126B5A`.
- **Chip:** compact하게, 내부 줄바꿈 없이, radius 4px. 상태 의미가 있을 때만 semantic fill을 쓴다.
- **Card:** 1px border, 6-8px radius, label과 divider로 계층을 만든다. 떠 있는 nested card를 남발하지 않는다.
- **Score ring:** 숫자와 label은 ring 안에 둔다. delta는 공간이 충분할 때만 ring 밖이나 아래에 둔다.
- **Coach message:** 좌우 정렬이 명확한 절제된 bubble을 쓴다. 코치 문장은 과하게 치료적이지 않고, 구체적 다음 행동을 향해야 한다.
- **Reflection form:** 먼저 낮은 마찰의 outcome 선택지를 제공하고, 자유 작성은 선택에 가깝게 둔다. 고백문을 강요하지 않는다.
- **Bottom navigation:** 앱 shell 위의 작은 control surface처럼 보여야 한다. 과한 pill/glass 느낌을 피한다.

## Preview

- HTML preview: `.gstack/design-consultation/solosync-urban-field-notes-preview.html`
- 목적: 실제 앱 코드에 적용하기 전 타이포그래피, 컬러, 컴포넌트 rhythm, realistic SoloSync screen 방향을 보는 정적 reference.

## 결정 기록

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2026-04-17 | 초기 디자인 시스템 생성 | Office Hours 맥락, 디자인 컨설테이션, 경쟁 리서치, Urban Field Notes 방향을 바탕으로 만들었다. |
| 2026-04-17 | 데이팅/모임/상담 앱 문법을 피하기로 함 | SoloSync의 가치는 사용자가 치료, 이벤트, 데이트를 선택하기 전 단계에서 시작된다. |
| 2026-04-17 | IBM Plex Sans KR + Geist Mono 선택 | 한국어 가독성과 점수/XP/field label의 기록 감각을 동시에 살린다. |
| 2026-04-17 | Data-Driven Accent 팔레트 선택 | 기존 green action은 유지하고, high-energy citron/coral 조합을 observation blue와 reflection terracotta로 낮췄다. |
| 2026-04-17 | 일지/익명 응원 댓글 후보 기록 | 비공개 AI 회고는 SoloSync와 잘 맞지만, 공개 익명 댓글은 moderation과 anti-engagement guardrail이 준비된 뒤에 열어야 한다. |
