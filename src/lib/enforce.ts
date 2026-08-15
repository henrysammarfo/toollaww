import type { Decision, Risk } from "@/lib/toollaw-data";
import policy from "../../fixtures/policy.v0.json";

export type EnforceAttempt = {
  principal: string;
  tool: string;
  args: Record<string, unknown>;
  ticketId?: string | null;
};

export type EnforceResult = {
  decision: Decision;
  reasons: string[];
  executed: boolean;
  risk: Risk;
  mutate: boolean;
};

type ToolRule = (typeof policy.tools)[number];

function findTool(name: string): ToolRule | undefined {
  return policy.tools.find((t) => t.name === name);
}

export function enforce(attempt: EnforceAttempt): EnforceResult {
  const tool = findTool(attempt.tool);
  if (!tool) {
    return {
      decision: "BLOCK",
      reasons: ["unknown-tool"],
      executed: false,
      risk: "critical",
      mutate: true,
    };
  }

  const risk = tool.risk as Risk;
  const mutate = tool.mutate;

  if (!tool.allowPrincipals.includes(attempt.principal)) {
    if (tool.requireTicket && attempt.principal !== "hum") {
      return {
        decision: "BLOCK",
        reasons: ["principal-not-allowed", "require-ticket"],
        executed: false,
        risk,
        mutate,
      };
    }
    return {
      decision: "BLOCK",
      reasons: ["principal-not-allowed"],
      executed: false,
      risk,
      mutate,
    };
  }

  const args = attempt.args;
  for (const rule of tool.argRules) {
    if (rule.type === "marketMustBeSettled" && args["settled"] !== true) {
      return {
        decision: "BLOCK",
        reasons: ["market-must-be-settled"],
        executed: false,
        risk,
        mutate,
      };
    }
    if (rule.type === "pathContainsPeer") {
      const path = String(args["path"] ?? "").toLowerCase();
      const peers = "peers" in rule && Array.isArray(rule.peers) ? rule.peers : [];
      if (peers.some((p) => path.includes(String(p)))) {
        return {
          decision: "BLOCK",
          reasons: ["path-contains-peer"],
          executed: false,
          risk,
          mutate,
        };
      }
    }
    if (rule.type === "requireTicket" && !attempt.ticketId) {
      return {
        decision: "BLOCK",
        reasons: ["require-ticket"],
        executed: false,
        risk,
        mutate,
      };
    }
  }

  if (attempt.tool === "toollaw.approve" && attempt.principal !== "hum") {
    return {
      decision: "BLOCK",
      reasons: ["human-only"],
      executed: false,
      risk,
      mutate,
    };
  }

  return {
    decision: "ALLOW",
    reasons: ["allowlist-match"],
    executed: !mutate,
    risk,
    mutate,
  };
}

export { policy };
