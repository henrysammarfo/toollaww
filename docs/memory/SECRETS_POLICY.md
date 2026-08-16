# Secrets

Never commit API keys, tokens, private keys, or admin passwords.

- Research keys stay in a local gitignored `.env`, not in this repo.
- AgentTeams LLM keys and dashboard/Element passwords live only on the demo VM.
- Gateway holds credentials. Workers receive ALLOW / BLOCK JSON only.
- Rotate any key that was ever pasted in chat or a screenshot.
