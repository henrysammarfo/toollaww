import { gatewayDispatch, type GatewayResult } from "./gateway.ts";

/**
 * Higress-shaped MCP adapter.
 * Workers never see live tokens. Every tool call hits TOOLLAW enforce first.
 * This is not the Hangzhou Higress binary; it is the same contract: MCP in, gated call out.
 */

export type HigressProxyResult = GatewayResult & {
  gateway: "toollaw-higress-shaped";
  credentialLeaveWorker: false;
};

export async function higressMcpCall(input: {
  principal: string;
  tool: string;
  args?: Record<string, unknown>;
  skill?: string;
  ticketId?: string | null;
  traceId?: string;
}): Promise<HigressProxyResult> {
  const inner = await gatewayDispatch(input);
  return {
    ...inner,
    gateway: "toollaw-higress-shaped",
    credentialLeaveWorker: false,
  };
}
