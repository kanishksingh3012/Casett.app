"use client";

import { useState } from "react";
import type { Tape } from "@/lib/types";
import { encodeTape } from "@/lib/share";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Cassette from "@/components/cassette";
import { ICON } from "@/components/ui/icons";

interface ShareScreenProps {
  tape: Tape;
  onBack: () => void;
  onDone: () => void;
}

export default function ShareScreen({ tape, onBack, onDone }: ShareScreenProps) {
  const [copied, setCopied] = useState(false);

  // Full self-contained link — tape data lives in the URL, so it opens on any device.
  const playUrl = typeof window !== "undefined"
    ? `${window.location.origin}/play?t=${encodeTape(tape)}`
    : "/play";

  const displaySlug =
    (tape.title
      ? tape.title.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4)
      : "9x4k") + "k";

  const copyLink = async () => {
    try { await navigator.clipboard?.writeText(playUrl); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const handleShare = async () => {
    // Native share sheet (iOS / Android / macOS) when available
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: tape.title || "A tape for you",
          text: `${tape.from || "Someone"} made you a tape 📼`,
          url: playUrl,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    // Fallback: copy link to clipboard
    copyLink();
  };

  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="Ready to send" step="5 / 5" />
      <div className="screen-body center-soft">
        <div className="share-glow" />
        <div className="cass-stage hero">
          <Cassette tape={tape} side="A" showStickers={true} />
        </div>
        <div className="share-sub">your tape is ready ✦</div>
        <div className="link-pill">
          <span>casett.app/t/{displaySlug}</span>
          <button onClick={copyLink}>
            {copied ? ICON.check : ICON.copy}
          </button>
        </div>
        <div className="share-actions">
          <button className="cta" onClick={handleShare}>
            {ICON.share}
            <span>Share link</span>
          </button>
          <button className="gbtn" onClick={onDone}>
            Make another tape
          </button>
        </div>
        <div className="share-foot">
          {copied ? "link copied ✓" : "opens a web player — no app needed on their end"}
        </div>
      </div>
    </div>
  );
}
