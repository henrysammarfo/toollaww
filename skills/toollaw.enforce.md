# Skill: toollaw.enforce

- **Name:** `toollaw.enforce`
- **Purpose:** Deterministic gate. LLM may propose a call; this Skill decides ALLOW / BLOCK / REQUIRE_APPROVAL. Default **BLOCK**.
- **Inputs:** `{ attempt: ToolLaw, policyHash, ticketId? }`
- **Outputs:** `{ decision, reasons[], executed: false }` on BLOCK; `executed` stays false until a later stub tool runs (v0 high-risk never runs).
- **Rules (v0):**
  - unknown tool → BLOCK
  - principal not in `allowPrincipals` → BLOCK
  - `mutate: true` and no valid Human ticket → BLOCK (or REQUIRE_APPROVAL if the tool is listed as ticketable and Human is in the room)
  - `pathContainsPeer` if args.path includes a peer fleet token → BLOCK
  - `marketMustBeSettled` if args.settled !== true → BLOCK
  - Red Team calling `toollaw.approve` → BLOCK
  - `toollaw.health` for listed principals → ALLOW
- **Invocation:** before any fixture tool; Auditor may re-run to match traces.
- **Depends:** compiled artifact from `toollaw.compile`. Pure function.
- **Failure:** missing policyHash → BLOCK.
- **Security:** no side effects. Does not weaken the allowlist.
- **Reuse:** drop in as a gateway hook (Higress adapter later).
- **Loop slot:** tools / approve.
