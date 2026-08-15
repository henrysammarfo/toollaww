# Agent Identity List (Handbook Appendix A)

Team: Accra Technical University · GOAI Track 1 Agent Infra · **TOOLLAW**

Collaboration baseline: **AgentTeams** (formerly HiClaw) — Manager–Workers in a Matrix room. Humans are first-class room members (L3 on high-risk).

| ID | Role | AgentTeams mapping | Runtime (target) | Capability boundary | May call | Must not |
|---|---|---|---|---|---|---|
| `mgr` | Manager | Manager | Manager image | Create Team, assign Workers, track state | Team APIs | Any tool fire |
| `pol` | Policy Compiler | Team Leader or Worker | QwenPaw | Compile policy YAML → hashed allowlist artifact | `toollaw.compile` | Execute `unhalt` / `redeem` / `env.patch` |
| `red` | Red Team | Worker | OpenClaw or QwenPaw | Attempt forbidden Skills/tools from the attack pack | `toollaw.redteam` | Issue `toollaw.approve` tickets |
| `aud` | Gateway Auditor | Worker | QwenPaw | Match attempt to policy, prove non-execution, store evidence | `toollaw.enforce`, `toollaw.evidence`, `toollaw.health` | Weaken or rewrite the allowlist |
| `hum` | Human | Matrix Human | human | L3 ALLOW / DENY on high-risk | `toollaw.approve` | Be skipped on mutate tools |

## Collaboration relationships

```
Human (L3) ─┐
            ├─► Manager ─► Team "toollaw-<id>"
            │                 ├─ Policy Compiler
            │                 ├─ Red Team         (attack)
            │                 └─ Gateway Auditor  (gate + evidence)
```

High-risk = unhalt, unsettled redeem, any env write, private-key touch.  
Low-risk = `toollaw.health` and other read fixtures.

State: `OPEN → COMPILING → ATTACKING → BLOCKED | AWAITING_APPROVAL → VERIFYING → CLOSED`
