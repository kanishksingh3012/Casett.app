"use client";

import { useState, useEffect, useRef } from "react";
import type { Tape } from "@/lib/types";
import { saveTape } from "@/lib/tapeStore";
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
  const [tapeId, setTapeId] = useState<string | null>(null);
  const [saving, setSaving] = useState(true);
  const [copied, setCopied] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    saveTape(tape)
      .then((id) => setTapeId(id))
      .catch(() => {})
      .finally(() => setSaving(false));
  }, [tape]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const playUrl = tapeId
    ? `${origin}/play/${tapeId}`
    : `${origin}/play?t=${encodeTape(tape)}`;

  const displayUrl = tapeId
    ? `casett.app/t/${tapeId}`
    : "casett.app/t/...";

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(playUrl); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: tape.title || "A tape for you",
          text: `${tape.from || "Someone"} made you a tape 📼`,
          url: playUrl,
        });
        return;
      } catch {}
    }
    handleCopy();
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
          {saving
            ? <span style={{ opacity: 0.45, fontSize: 12 }}>preparing your link…</span>
            : <span>{displayUrl}</span>
          }
          <button onClick={handleCopy} disabled={saving}>
            {copied ? ICON.check : ICON.copy}
          </button>
        </div>
        <div className="share-actions">
          <button className="cta" onClick={handleShare} disabled={saving}>
            {saving ? (
              <>
                <span className="share-spinner" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                {ICON.share}
                <span>Share link</span>
              </>
            )}
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
