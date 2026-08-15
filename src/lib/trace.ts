export type Span = {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  ts: string;
  durationMs: number;
  attributes: Record<string, string | number | boolean | null>;
};

function hex(n: number): string {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function newTraceId(): string {
  return hex(16);
}

export function newSpanId(): string {
  return hex(8);
}

export function startSpan(
  name: string,
  attributes: Span["attributes"],
  parent?: { traceId: string; spanId?: string } | null,
): { traceId: string; spanId: string; started: number; parentSpanId: string | null } {
  return {
    traceId: parent?.traceId ?? newTraceId(),
    spanId: newSpanId(),
    parentSpanId: parent?.spanId ?? null,
    started: Date.now(),
  };
}

export function endSpan(
  started: { traceId: string; spanId: string; started: number; parentSpanId: string | null },
  name: string,
  attributes: Span["attributes"],
): Span {
  return {
    traceId: started.traceId,
    spanId: started.spanId,
    parentSpanId: started.parentSpanId,
    name,
    ts: new Date().toISOString(),
    durationMs: Date.now() - started.started,
    attributes,
  };
}
