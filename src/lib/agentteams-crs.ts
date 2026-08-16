/**
 * AgentTeams CRs (apiVersion agentteams.io/v1beta1).
 * Shape matches post-v1.2 Worker/Team/Human: Team.spec.workerMembers reference standalone Workers.
 * Namespace is always toollaw-sidecar. Never scout/lockin.
 */

import { SIDECAR_NAMESPACE } from "./isolation.ts";

export const API_VERSION = "agentteams.io/v1beta1";

export type McpServer = {
  name: string;
  url: string;
  transport: "http" | "sse";
};

export type WorkerCR = {
  apiVersion: typeof API_VERSION;
  kind: "Worker";
  metadata: { name: string; namespace: string; labels: Record<string, string> };
  spec: {
    model: string;
    runtime: "openclaw" | "qwenpaw" | "copaw" | "hermes";
    identity: string;
    skills: string[];
    mcpServers: McpServer[];
    env: { name: string; value: string }[];
  };
};

export type TeamCR = {
  apiVersion: typeof API_VERSION;
  kind: "Team";
  metadata: { name: string; namespace: string };
  spec: {
    description: string;
    workerMembers: { name: string; role: "team_leader" | "worker" }[];
  };
};

export type HumanCR = {
  apiVersion: typeof API_VERSION;
  kind: "Human";
  metadata: { name: string; namespace: string };
  spec: {
    displayName: string;
    permissionLevel: 1 | 2 | 3;
    accessibleTeams: string[];
    note: string;
    annotations: Record<string, string>;
  };
};

export type ManagerCR = {
  apiVersion: typeof API_VERSION;
  kind: "Manager";
  metadata: { name: string; namespace: string };
  spec: {
    skills: string[];
    mcpServers: McpServer[];
  };
};

const MCP: McpServer = {
  name: "toollaw",
  url: "http://toollaw-gateway:8787/api/mcp",
  transport: "http",
};

const ns = SIDECAR_NAMESPACE;
const noPeerEnv = [
  { name: "TOOLLAW_SIDECAR_HOME", value: "/var/lib/toollaw" },
  { name: "TOOLLAW_FORBIDDEN", value: "/opt/scout,/opt/lockin" },
];

export const managerCR: ManagerCR = {
  apiVersion: API_VERSION,
  kind: "Manager",
  metadata: { name: "toollaw-mgr", namespace: ns },
  spec: {
    skills: ["toollaw.compile", "toollaw.crew"],
    mcpServers: [MCP],
  },
};

export const workerCRs: WorkerCR[] = [
  {
    apiVersion: API_VERSION,
    kind: "Worker",
    metadata: {
      name: "toollaw-pol",
      namespace: ns,
      labels: { "toollaw.io/role": "pol" },
    },
    spec: {
      model: "qwen3.6-plus",
      runtime: "qwenpaw",
      identity: "Policy Compiler. Compiles allowlists. Never fires unhalt/redeem/env.patch.",
      skills: ["toollaw.compile", "toollaw.enforce"],
      mcpServers: [MCP],
      env: noPeerEnv,
    },
  },
  {
    apiVersion: API_VERSION,
    kind: "Worker",
    metadata: {
      name: "toollaw-red",
      namespace: ns,
      labels: { "toollaw.io/role": "red" },
    },
    spec: {
      model: "qwen3.6-plus",
      runtime: "openclaw",
      identity: "Red Team. Attack pack only. Cannot mint toollaw.approve.",
      skills: ["toollaw.redteam", "toollaw.health"],
      mcpServers: [MCP],
      env: noPeerEnv,
    },
  },
  {
    apiVersion: API_VERSION,
    kind: "Worker",
    metadata: {
      name: "toollaw-aud",
      namespace: ns,
      labels: { "toollaw.io/role": "aud" },
    },
    spec: {
      model: "qwen3.6-plus",
      runtime: "qwenpaw",
      identity: "Gateway Auditor. Proves executed=false on BLOCK. Cannot weaken policy.",
      skills: ["toollaw.enforce", "toollaw.evidence", "toollaw.health"],
      mcpServers: [MCP],
      env: noPeerEnv,
    },
  },
];

export const teamCR: TeamCR = {
  apiVersion: API_VERSION,
  kind: "Team",
  metadata: { name: "toollaw-crew", namespace: ns },
  spec: {
    description: "Fail-closed tool-law crew. Isolated from scout/lockin fleets.",
    workerMembers: [
      { name: "toollaw-pol", role: "team_leader" },
      { name: "toollaw-red", role: "worker" },
      { name: "toollaw-aud", role: "worker" },
    ],
  },
};

export const humanCR: HumanCR = {
  apiVersion: API_VERSION,
  kind: "Human",
  metadata: { name: "toollaw-hum", namespace: ns },
  spec: {
    displayName: "Human L3 (TOOLLAW approval tier)",
    permissionLevel: 1,
    accessibleTeams: ["toollaw-crew"],
    note: "AgentTeams permissionLevel 1 = admin-equivalent in the room. TOOLLAW approval tier is L3 on high-risk mutate. No self-approve by red.",
    annotations: { "toollaw.io/approval-tier": "L3" },
  },
};

export type ManifestBundle = {
  apiVersion: typeof API_VERSION;
  namespace: string;
  manager: ManagerCR;
  workers: WorkerCR[];
  team: TeamCR;
  human: HumanCR;
};

export function manifestBundle(): ManifestBundle {
  return {
    apiVersion: API_VERSION,
    namespace: ns,
    manager: managerCR,
    workers: workerCRs,
    team: teamCR,
    human: humanCR,
  };
}

export function validateManifest(bundle: ManifestBundle): string[] {
  const errors: string[] = [];
  if (bundle.namespace !== SIDECAR_NAMESPACE) errors.push("namespace-must-be-toollaw-sidecar");
  if (bundle.apiVersion !== API_VERSION) errors.push("apiVersion-must-be-agentteams.io/v1beta1");
  const names = new Set(bundle.workers.map((w) => w.metadata.name));
  for (const m of bundle.team.spec.workerMembers) {
    if (!names.has(m.name)) errors.push(`missing-worker:${m.name}`);
  }
  const roles = bundle.workers.map((w) => w.metadata.labels["toollaw.io/role"]);
  for (const need of ["pol", "red", "aud"]) {
    if (!roles.includes(need)) errors.push(`missing-role:${need}`);
  }
  if (!bundle.team.spec.workerMembers.some((m) => m.role === "team_leader")) {
    errors.push("team-needs-leader");
  }
  for (const w of bundle.workers) {
    if (w.metadata.namespace !== SIDECAR_NAMESPACE) errors.push(`worker-ns:${w.metadata.name}`);
    for (const skill of w.spec.skills) {
      if (skill.startsWith("nacos://")) errors.push(`nacos-skill-forbidden:${skill}`);
    }
  }
  return errors;
}
