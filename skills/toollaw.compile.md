# Skill: toollaw.compile

- **Name:** `toollaw.compile`
- **Purpose:** Turn a policy document into a hashed allowlist artifact Workers load. Law is compiled, not prompt-hoped.
- **Inputs:** `{ policy }` matching `contracts/policy.schema.json` (YAML or JSON).
- **Outputs:** `{ policyHash, artifactUri, version }`
- **Invocation:** state `OPEN` → `COMPILING`. Manager assigns Policy Compiler only.
- **Depends:** schema validator; no live fleet APIs.
- **Failure:** invalid schema → no hash, Team state `BLOCKED`. Do not load a previous artifact silently.
- **Security:** compiler must not execute fixture tools. Hash is sha256 of canonical JSON.
- **Reuse:** any AgentTeams crew that needs tool-level law.
- **Loop slot:** decompose / tools.
