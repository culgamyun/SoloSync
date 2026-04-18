# 체크포인트 - Supabase migrations 적용 완료

날짜: 2026-04-18

## 사용자 보고

사용자가 BOM 제거 후 `npx supabase db push`를 다시 실행했고, 아래 정보성 알림과 함께 push가 완료되었다.

```text
NOTICE (42710): extension "pgcrypto" already exists, skipping
NOTICE (00000): trigger "on_auth_user_created" for relation "auth.users" does not exist, skipping
```

두 메시지는 각각 이미 존재하는 extension과 아직 없는 trigger를 건너뛰었다는 알림이며 실패가 아니다.

## 확인 결과

- `npx supabase migration list --linked`에서 `001`, `002`, `003`, `004`가 Local/Remote 양쪽에 표시됐다.
- service role 기반 비파괴 probe 결과:
  - `public.challenges`의 `mission_kind`, `mission_context`, `safe_line`, `minimum_win`, `fear`, `reframe` 컬럼 조회가 성공했다.
  - `public.challenge_reflections.outcome` 컬럼 조회가 성공했다.
  - `public.micro_mission_return_report()` RPC 호출이 성공했다.

## 현재 상태

원격 Supabase schema 적용은 완료됐다.

아직 샘플/staging 데이터가 없어 `micro_mission_return_report()` 결과는 빈 배열이다.

## 다음 단계

1. 샘플 또는 staging 데이터로 마이크로 미션 실패/스킵 cohort와 다음 주 복귀 activity를 만든다.
2. `micro_mission_return_report()`가 기대한 주차별 count/rate를 반환하는지 확인한다.
3. 이후 Playwright e2e 또는 최종 review pass로 넘어간다.
