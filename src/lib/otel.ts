import type { Span } from "./trace.ts";

/** OTLP/HTTP JSON (protobuf JSON mapping). Exportable to a collector; no vendor SDK. */

export type OtlpExport = {
  resourceSpans: Array<{
    resource: {
      attributes: Array<{ key: string; value: { stringValue: string } }>;
    };
    scopeSpans: Array<{
      scope: { name: string; version: string };
      spans: Array<{
        traceId: string;
        spanId: string;
        parentSpanId?: string;
        name: string;
        kind: number;
        startTimeUnixNano: string;
        endTimeUnixNano: string;
        attributes: Array<{
          key: string;
          value: { stringValue?: string; intValue?: string; boolValue?: boolean };
        }>;
        status: { code: number };
      }>;
    }>;
  }>;
};

function attrValue(
  v: string | number | boolean | null,
): { stringValue?: string; intValue?: string; boolValue?: boolean } {
  if (typeof v === "boolean") return { boolValue: v };
  if (typeof v === "number") return { intValue: String(Math.trunc(v)) };
  return { stringValue: v == null ? "" : String(v) };
}

export function spansToOtlp(spans: Span[], serviceName = "toollaw-sidecar"): OtlpExport {
  return {
    resourceSpans: [
      {
        resource: {
          attributes: [
            { key: "service.name", value: { stringValue: serviceName } },
            { key: "service.namespace", value: { stringValue: "toollaw-sidecar" } },
            { key: "toollaw.forbidden_roots", value: { stringValue: "/opt/scout,/opt/lockin" } },
          ],
        },
        scopeSpans: [
          {
            scope: { name: "toollaw.gateway", version: "0.3.0" },
            spans: spans.map((s) => {
              const end = Date.parse(s.ts) || Date.now();
              const start = end - s.durationMs;
              return {
                traceId: s.traceId,
                spanId: s.spanId,
                parentSpanId: s.parentSpanId ?? undefined,
                name: s.name,
                kind: 3,
                startTimeUnixNano: `${BigInt(start) * 1_000_000n}`,
                endTimeUnixNano: `${BigInt(end) * 1_000_000n}`,
                attributes: Object.entries(s.attributes).map(([key, value]) => ({
                  key,
                  value: attrValue(value),
                })),
                status: {
                  code: s.attributes["decision"] === "BLOCK" ? 2 : 1,
                },
              };
            }),
          },
        ],
      },
    ],
  };
}
