# Skill: toollaw.evidence

- **Name:** `toollaw.evidence`
- **Purpose:** Append-only receipt so judges (and enterprises) can see the decision, policy hash, and that a blocked call did not execute.
- **Inputs:** `{ toollaw: ToolLaw }` after enforce.
- **Outputs:** `{ evidenceUri, sha256 }` where sha256 covers canonical attempt + decision + policyHash + timestamp.
- **Invocation:** every ALLOW, BLOCK, and REQUIRE_APPROVAL.
- **Depends:** local evidence dir (prelim) / object store (semi). No fleet writes.
- **Failure:** write error → Team `BLOCKED`; do not proceed as if audited.
- **Security:** receipts are not secrets. Do not store API keys or private keys in the payload.
- **Reuse:** any gated agent action.
- **Loop slot:** evidence.
