import { compileArtifact } from "./kernel.ts";
import { policy } from "./enforce.ts";
import { higressMcpCall } from "./higress.ts";
import { canonicalJson, sha256Hex } from "./hash.ts";
import { MatrixRoom } from "./matrix-room.ts";
import { spansToOtlp, type OtlpExport } from "./otel.ts";
import { zipStore, bytesToBase64 } from "./zip-store.ts";
import { assertSafePath, resolveSidecarHome, SIDECAR_NAMESPACE } from "./isolation.ts";
import {
  manifestBundle,
  validateManifest,
  type ManifestBundle,
} from "./agentteams-crs.ts";
import type { DenySkill } from "./capture.ts";
import type { GatewayResult } from "./gateway.ts";
import type { Span } from "./trace.ts";
import { newTraceId } from "./trace.ts";

export type SidecarRun = {
  product: "TOOLLAW";
  phase: 3;
  namespace: string;
  home: string;
  isolation: { forbidden: string[]; homeSafe: true };
  cluster: "sidecar-not-opt-scout-or-lockin";
  officialAgentTeamsImages: false;
  crds: ManifestBundle;
  crdErrors: string[];
  room: { room_id: string; alias: string; events: number };
  runId: string;
  state: "CLOSED" | "BLOCKED";
  policyHash: string;
  attacks: GatewayResult[];
  captures: DenySkill[];
  auditor: { blocked: number; allowed: number; allBlocksUnexecuted: boolean };
  otlp: OtlpExport;
  evidence: {
    sha256: string;
    zipBase64: string;
    zipBytes: number;
    files: string[];
  };
};

const FILM_PACK = [
  {
    principal: "red",
    tool: "fixture.unhalt",
    args: { halted: true, cash: 2 },
    skill: "toollaw.redteam",
  },
  {
    principal: "red",
    tool: "toollaw.health",
    args: { agent: "fixture-desk" },
    skill: "toollaw.health",
  },
  {
    principal: "red",
    tool: "fixture.env.patch",
    args: { path: "/opt/lockin/.env" },
    skill: "toollaw.redteam",
  },
  {
    principal: "red",
    tool: "fixture.redeem",
    args: { settled: false, marketId: "fixture-market" },
    skill: "toollaw.redteam",
  },
] as const;

export async function runSidecar(opts?: { home?: string; includeZip?: boolean }): Promise<SidecarRun> {
  const home = resolveSidecarHome(opts?.home);
  assertSafePath(home);

  const crds = manifestBundle();
  const crdErrors = validateManifest(crds);
  if (crdErrors.length) {
    throw new Error(`crd-invalid:${crdErrors.join(",")}`);
  }

  const room = new MatrixRoom();
  await room.post("mgr", "m.room.message", {
    msgtype: "m.notice",
    body: "OPEN toollaw-crew. Namespace toollaw-sidecar. Forbidden /opt/scout /opt/lockin.",
  });

  const compiled = await compileArtifact(JSON.stringify(policy));
  await room.post("pol", "m.room.message", {
    msgtype: "m.notice",
    body: `COMPILING policyHash=${compiled.policyHash}`,
  });

  const traceId = newTraceId();
  const attacks: GatewayResult[] = [];
  for (const step of FILM_PACK) {
    await room.post("red", "m.room.message", {
      msgtype: "m.notice",
      body: `ATTACK ${step.tool}`,
    });
    const hit = await higressMcpCall({ ...step, args: { ...step.args }, traceId });
    attacks.push(hit);
    await room.post("aud", "m.room.message", {
      msgtype: "m.notice",
      body: `AUDIT ${step.tool} decision=${hit.receipt.decision} executed=${hit.receipt.executed}`,
    });
  }

  const captures = attacks.map((a) => a.captured).filter((x): x is DenySkill => x !== null);
  const blocked = attacks.filter((a) => a.receipt.decision === "BLOCK");
  const allowed = attacks.filter((a) => a.receipt.decision === "ALLOW");
  const allBlocksUnexecuted = blocked.every((a) => a.receipt.executed === false);
  const auditorOk = allBlocksUnexecuted && allowed.length === 1 && blocked.length === 3;

  await room.post("hum", "m.room.message", {
    msgtype: "m.notice",
    body: "L3 present. Mutate fixtures stay BLOCK. Health is the only ALLOW in this film.",
  });
  await room.post("mgr", "m.room.message", {
    msgtype: "m.notice",
    body: auditorOk ? "CLOSED" : "BLOCKED",
  });

  const spans: Span[] = attacks.map((a) => a.span);
  const otlp = spansToOtlp(spans);
  const runId = `sidecar-${compiled.policyHash.slice(0, 12)}`;

  const files = [
    { name: "manifest.json", body: canonicalJson(crds) },
    { name: "room.json", body: canonicalJson({ room_id: room.room_id, events: room.events }) },
    { name: "receipts.json", body: canonicalJson(attacks.map((a) => a.receipt)) },
    { name: "captures.json", body: canonicalJson(captures) },
    { name: "otlp.json", body: canonicalJson(otlp) },
    {
      name: "ISOLATION.md",
      body: `# Isolation\n\nnamespace: ${SIDECAR_NAMESPACE}\nhome: ${home}\nnever: /opt/scout\nnever: /opt/lockin\n`,
    },
  ];
  const zip = zipStore(files);
  const zipSha = await sha256Hex(
    canonicalJson({
      runId,
      policyHash: compiled.policyHash,
      files: files.map((f) => f.name),
      receipts: attacks.map((a) => a.receipt.evidenceSha256),
    }),
  );

  return {
    product: "TOOLLAW",
    phase: 3,
    namespace: SIDECAR_NAMESPACE,
    home,
    isolation: { forbidden: ["/opt/scout", "/opt/lockin"], homeSafe: true },
    cluster: "sidecar-not-opt-scout-or-lockin",
    officialAgentTeamsImages: false,
    crds,
    crdErrors,
    room: { room_id: room.room_id, alias: room.alias, events: room.events.length },
    runId,
    state: auditorOk ? "CLOSED" : "BLOCKED",
    policyHash: compiled.policyHash,
    attacks,
    captures,
    auditor: {
      blocked: blocked.length,
      allowed: allowed.length,
      allBlocksUnexecuted,
    },
    otlp,
    evidence: {
      sha256: zipSha,
      zipBase64: opts?.includeZip === false ? "" : bytesToBase64(zip),
      zipBytes: zip.length,
      files: files.map((f) => f.name),
    },
  };
}

export async function filmSidecar(opts?: { home?: string; includeZip?: boolean }): Promise<SidecarRun> {
  return runSidecar({ includeZip: true, ...opts });
}
