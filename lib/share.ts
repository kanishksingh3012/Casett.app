import type { Tape } from "./types";

/**
 * Encode a tape into a URL-safe string so it can travel inside a share link
 * and open on ANY device (no server / localStorage needed).
 *
 * Note: voiceUrl is a local blob: URL that only exists in the sender's browser,
 * so it is stripped. Cross-device voice playback needs a real upload (backend),
 * which is a later milestone. The song preview is a real iTunes URL and works
 * everywhere.
 */
export function encodeTape(tape: Tape): string {
  const shareable: Tape = { ...tape, voiceUrl: undefined };
  const json = JSON.stringify(shareable);
  // unicode-safe base64
  const b64 = btoa(unescape(encodeURIComponent(json)));
  // make it URL-safe
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeTape(encoded: string): Tape | null {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json) as Tape;
  } catch {
    return null;
  }
}
