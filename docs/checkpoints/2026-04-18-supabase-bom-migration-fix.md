# 체크포인트 - Supabase migration BOM 오류 수정

날짜: 2026-04-18

## 증상

사용자가 `npx supabase db push`를 실행하면 `001_initial_schema.sql`의 첫 statement에서 아래 오류가 발생했다.

```text
ERROR: syntax error at or near "create" (SQLSTATE 42601)
At statement: 0
create extension if not exists pgcrypto
^
```

## 원인

`001_initial_schema.sql`, `002_rls_policies.sql`, `003_functions.sql` 맨 앞에 UTF-8 BOM 바이트(`EF BB BF`)가 있었다.

Postgres/Supabase migration runner가 첫 SQL 토큰 앞의 BOM을 처리하지 못해 첫 `create extension` statement를 syntax error로 해석했다.

`004_micro_social_missions.sql`에는 BOM이 없었다.

## 수정

아래 파일에서 BOM만 제거했다.

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_functions.sql`

## 검증

통과:

- 모든 migration 파일의 BOM 여부 확인: `001`-`004` 모두 `BOM=false`
- `Format-Hex -Path supabase\migrations\001_initial_schema.sql | Select-Object -First 2`로 첫 바이트가 `create extension`의 `c`임을 확인
- `git diff --check -- supabase\migrations\001_initial_schema.sql supabase\migrations\002_rls_policies.sql supabase\migrations\003_functions.sql`

주의:

- Codex의 비대화형 shell에서는 DB password prompt를 받을 수 없어 `npx supabase db push --dry-run`은 `SUPABASE_DB_PASSWORD` 인증 단계에서 멈췄다.
- 사용자의 PowerShell에서 다시 `npx supabase db push`를 실행해야 실제 적용 여부를 확인할 수 있다.

## 다음 단계

1. 사용자의 PowerShell에서 `npx supabase db push`를 다시 실행한다.
2. DB password 입력이 필요하면 Supabase Dashboard의 database password를 입력한다.
3. 적용 후 `select * from public.micro_mission_return_report();` 또는 Supabase RPC로 report 함수 존재 여부를 확인한다.
