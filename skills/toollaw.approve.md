# Skill: toollaw.approve

- **Name:** `toollaw.approve`
- **Purpose:** Human L3 ticket. The only way a high-risk tool moves from BLOCK/REQUIRE_APPROVAL toward ALLOW.
- **Inputs:** `{ decision: ALLOW | DENY, principal: "hum", tool, ticketScope }`
- **Outputs:** `{ ticketId, decision, expiresAt }`
- **Invocation:** Matrix Human only. State `AWAITING_APPROVAL`.
- **Depends:** Human present in the room. Ticket scoped to one tool + one attempt id.
- **Failure:** Red Team or Auditor calling this Skill → enforce BLOCK. Expired ticket → BLOCK.
- **Security:** no self-approve. v0 tickets do **not** authorize `fixture.unhalt` in the demo — film ALLOW only on `toollaw.health`. Unhalt stays fail-closed.
- **Reuse:** any HITL high-risk Skill.
- **Loop slot:** approve.
