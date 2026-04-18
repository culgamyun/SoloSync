# 체크포인트 - Supabase migration 적용 시도 보류

날짜: 2026-04-17

## 사용자 요청

이전 권장 다음 단계였던 실제 Supabase migration 적용과 `micro_mission_return_report()` 검증으로 넘어가자고 요청했다.

## 진행한 확인

- `npx supabase --version`으로 Supabase CLI wrapper 실행 가능성을 확인했다.
- `.env`에서 키 값은 출력하지 않고 필요한 키 이름만 확인했다.
- 공개 Supabase URL에서 project ref를 확인했다.
- Supabase CLI 로그인/링크 상태를 확인했다.
- service role key를 사용해 원격 프로젝트에 대한 비파괴 schema probe를 실행했다.

## 결과

- `npx supabase`는 실행 가능하다.
- 로컬에는 `supabase/config.toml`과 `supabase/.temp/project-ref`가 없다.
- Supabase CLI는 로그인되어 있지 않다.
- 현재 shell에는 `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_URL`, `DATABASE_URL`, `POSTGRES_URL`이 없다.
- `npx supabase projects list`는 access token 부재로 실패했다.
- `npx supabase migration list --linked --workdir supabase`는 project ref 링크 부재로 실패했다.
- `.env`가 가리키는 원격 프로젝트의 REST schema cache에는 `public.challenges`, `public.challenge_reflections`, `public.micro_mission_return_report()`가 없다.

## 판단

현재 원격 Supabase 프로젝트는 `004_micro_social_missions.sql`만 빠진 상태가 아니라 앱의 base schema도 적용되지 않았거나, 이 repo가 기대하는 DB와 다른 프로젝트를 가리키고 있을 가능성이 높다.

DDL 적용에 필요한 Supabase access token, CLI login, DB password, 또는 Postgres connection URL이 없으므로 실제 remote migration 적용은 진행하지 않았다.

## 다음 단계

1. 실제 대상 Supabase 프로젝트가 맞는지 확인한다.
2. `supabase login`을 하거나 `SUPABASE_ACCESS_TOKEN`을 shell에 제공한다.
3. 또는 Postgres DB URL/password를 제공해 `npx supabase db push --db-url ...` 경로로 적용한다.
4. base migrations 적용 여부를 먼저 확인한 뒤 `004_micro_social_missions.sql`을 적용한다.
5. 적용 후 `select * from public.micro_mission_return_report();` 또는 Supabase RPC로 샘플/staging 데이터를 검증한다.
