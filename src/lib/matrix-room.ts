import { sha256Hex } from "./hash.ts";

/** Matrix Client-Server event shape. Sidecar room bus; Synapse can replace this later. */

export type MatrixEvent = {
  event_id: string;
  room_id: string;
  sender: string;
  type: string;
  origin_server_ts: number;
  content: Record<string, unknown>;
};

export const ROOM_ID = "!toollaw-crew:toollaw.local";
export const ROOM_ALIAS = "#toollaw-crew:toollaw.local";

const senders: Record<string, string> = {
  mgr: "@mgr:toollaw.local",
  pol: "@pol:toollaw.local",
  red: "@red:toollaw.local",
  aud: "@aud:toollaw.local",
  hum: "@hum:toollaw.local",
};

export function mxid(role: string): string {
  return senders[role] ?? `@${role}:toollaw.local`;
}

export class MatrixRoom {
  readonly room_id = ROOM_ID;
  readonly alias = ROOM_ALIAS;
  readonly events: MatrixEvent[] = [];

  async post(role: string, type: string, content: Record<string, unknown>): Promise<MatrixEvent> {
    const origin_server_ts = Date.now();
    const unsigned = { room_id: this.room_id, sender: mxid(role), type, origin_server_ts, content };
    const event_id = `$${await sha256Hex(JSON.stringify(unsigned))}`;
    const ev: MatrixEvent = { event_id, ...unsigned };
    this.events.push(ev);
    return ev;
  }
}
