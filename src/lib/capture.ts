import type { Receipt } from "./kernel.ts";

export type DenySkill = {
  name: string;
  tool: string;
  reasons: string[];
  evidenceSha256: string;
  markdown: string;
};

export function captureDeny(receipt: Receipt): DenySkill | null {
  if (receipt.decision !== "BLOCK") return null;
  const slug = receipt.tool.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  const name = `toollaw.deny-${slug}`;
  const markdown = `# Skill: ${name}

- **Purpose:** Captured after Red Team BLOCK. ${receipt.tool} must not execute for principal ${receipt.principal}.
- **Inputs:** attempt JSON
- **Outputs:** BLOCK
- **Rules:** ${receipt.reasons.join(", ") || "fail-closed"}
- **Evidence:** ${receipt.evidenceSha256}
- **Security:** deny-only. Cannot execute ${receipt.tool}.
- **Loop slot:** capture
`;
  return {
    name,
    tool: receipt.tool,
    reasons: receipt.reasons,
    evidenceSha256: receipt.evidenceSha256,
    markdown,
  };
}

export function capturePack(receipts: Receipt[]): DenySkill[] {
  return receipts.map(captureDeny).filter((x): x is DenySkill => x !== null);
}
