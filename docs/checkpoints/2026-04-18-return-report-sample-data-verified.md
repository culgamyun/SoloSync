# 체크포인트 - 복귀 지표 report 샘플 데이터 검증

날짜: 2026-04-18

## 사용자 요청

원격 Supabase migration 적용 완료 후, `micro_mission_return_report()`가 실제 숫자를 제대로 반환하는지 검증하기로 했다.

## 검증 방식

service role로 임시 auth user 3명을 만들고, 검증 후 즉시 삭제했다.

시나리오:

- 실패 주차: `2026-04-06T00:00:00+00:00`
- 다음 주차: `2026-04-13T00:00:00+00:00`
- 실패/스킵 cohort: 3명
  - 1명: `could_not_do_it` reflection
  - 2명: `skipped` micro-social challenge
- 다음 주 복귀: 2명
  - 1명: 다음 주 challenge activity
  - 1명: 다음 주 weekly check-in
  - 1명: 미복귀

## 결과

`micro_mission_return_report()` target row:

```json
{
  "failed_week_start_date": "2026-04-06T00:00:00+00:00",
  "failed_or_skipped_users": 3,
  "returned_next_week_users": 2,
  "next_week_return_rate": 0.6667
}
```

기대값과 일치했다.

## Cleanup

- 임시 auth user 3명을 삭제했다.
- cascade cleanup 후 남은 임시 `challenges`, `challenge_reflections`, `weekly_check_ins` count가 모두 0임을 확인했다.
- cleanup 이후 `micro_mission_return_report()`가 다시 빈 배열을 반환함을 확인했다.

## 주의

첫 검증 스크립트는 날짜를 `2026-04-06T00:00:00.000Z`로 엄격 비교해서 실패했다. Supabase RPC는 같은 시각을 `2026-04-06T00:00:00+00:00` 형식으로 반환한다. 이후 검증에서는 실제 반환 포맷을 확인했고 report 숫자는 정상으로 확인됐다.

## 다음 단계

1. Playwright managed browser를 설치하거나 설정한 뒤 `npm run test:e2e`를 실행한다.
2. 커밋 전 전체 dirty diff를 한 번 더 리뷰한다.
