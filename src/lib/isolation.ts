/** Sidecar must never write SCOUT or LOCKIN production trees. */

export const FORBIDDEN_ROOTS = [
  "/opt/scout",
  "/opt/lockin",
  "\\opt\\scout",
  "\\opt\\lockin",
] as const;

export const SIDECAR_NAMESPACE = "toollaw-sidecar";
export const SIDECAR_VOLUME = "/var/lib/toollaw";
export const DEFAULT_SIDECAR_HOME = SIDECAR_VOLUME;

export class IsolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IsolationError";
  }
}

function normalize(p: string): string {
  return p.replace(/\\/g, "/").replace(/\/+/g, "/").toLowerCase();
}

export function isForbiddenPath(p: string): boolean {
  const n = normalize(p);
  return FORBIDDEN_ROOTS.some((root) => {
    const r = normalize(root);
    return n === r || n.startsWith(`${r}/`) || n.includes(`${r}/`) || n.endsWith(r);
  });
}

export function assertSafePath(p: string): string {
  if (!p || !p.trim()) {
    throw new IsolationError("empty-path");
  }
  if (isForbiddenPath(p)) {
    throw new IsolationError(`forbidden-peer-path:${p}`);
  }
  return p;
}

export function assertSafeTree(paths: string[]): void {
  for (const p of paths) assertSafePath(p);
}

export function resolveSidecarHome(override?: string): string {
  const home =
    override ??
    (typeof process !== "undefined" ? process.env["TOOLLAW_SIDECAR_HOME"] : undefined) ??
    DEFAULT_SIDECAR_HOME;
  return assertSafePath(home);
}
