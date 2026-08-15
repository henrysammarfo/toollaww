import { gatedCall, type Receipt } from "./kernel.ts";
import { captureDeny, type DenySkill } from "./capture.ts";
import { endSpan, startSpan, type Span } from "./trace.ts";

export type GatewayResult = {
  receipt: Receipt;
  executedBody: unknown;
  captured: DenySkill | null;
  span: Span;
};

const stubs: Record<string, (args: Record<string, unknown>) => unknown> = {
  "toollaw.health": (args) => ({
    ok: true,
    halted: true,
    cash: 2,
    source: "fixture",
    agent: args["agent"] ?? "fixture-desk",
  }),
};

export async function gatewayDispatch(input: {
  principal: string;
  tool: string;
  args?: Record<string, unknown>;
  skill?: string;
  ticketId?: string | null;
  traceId?: string;
}): Promise<GatewayResult> {
  const spanStart = startSpan("gateway.dispatch", {
    principal: input.principal,
    tool: input.tool,
  }, input.traceId ? { traceId: input.traceId, spanId: "parent" } : null);

  const receipt = await gatedCall({
    principal: input.principal,
    tool: input.tool,
    args: input.args ?? {},
    skill: input.skill,
    ticketId: input.ticketId ?? null,
  });

  const captured = captureDeny(receipt);
  let executedBody: unknown = null;
  if (receipt.decision === "ALLOW") {
    const stub = stubs[input.tool];
    executedBody = stub ? stub(input.args ?? {}) : { ok: true, stub: true };
  }

  const span = endSpan(spanStart, "gateway.dispatch", {
    principal: input.principal,
    tool: input.tool,
    decision: receipt.decision,
    executed: receipt.executed,
    captured: captured?.name ?? null,
  });

  return { receipt: { ...receipt, traceId: span.traceId, spanId: span.spanId }, executedBody, captured, span };
}
