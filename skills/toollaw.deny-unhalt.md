# Skill: toollaw.deny-unhalt

- **Name:** `toollaw.deny-unhalt`
- **Purpose:** Experience capture. After Red Team’s unhalt attempt is BLOCKED, Auditor writes this Skill so the next Team loads a named deny instead of rediscovering the rule in chat.
- **Inputs:** `{ evidenceSha256, policyHash }`
- **Outputs:** `{ skillUri }` markdown/JSON rule: unhalt without Human L3 + cash floor → BLOCK.
- **Invocation:** state `VERIFYING` → `CLOSED` on a successful BLOCK.
- **Depends:** `toollaw.evidence` receipt must exist.
- **Failure:** no receipt → do not emit a Skill (avoid folklore).
- **Security:** captured Skill is deny-only. It cannot unhalt.
- **Reuse:** pattern for `toollaw.deny-redeem-unsettled`, `toollaw.deny-env-peer`.
- **Loop slot:** capture.
