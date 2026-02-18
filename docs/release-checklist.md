# Release Checklist

- [ ] Lint/typecheck/test/build pass locally and in CI.
- [ ] Security checks pass (secret scan + dependency review).
- [ ] Migration/data-impact reviewed.
- [ ] Rollback steps documented.
- [ ] Post-release smoke test completed.
- [ ] Rollback drill incident note generated (`scripts/deploy/run-rollback-drill.sh`).
- [ ] Go/No-Go evidence bundle generated (`scripts/release/generate-go-no-go-evidence.sh`).
- [ ] On-call and escalation ownership confirmed (`docs/ONCALL_ESCALATION.md`).
- [ ] Ownership validation passes (`scripts/release/validate-ownership.sh`).
