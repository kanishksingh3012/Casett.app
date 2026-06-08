"use client";

import { useState } from "react";
import type { Tape } from "@/lib/types";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Cassette from "@/components/cassette";
import { ICON } from "@/components/ui/icons";

interface ShareScreenProps {
  tape: Tape;
  onBack: () => void;
  onSave: () => void;
  onPreview: () => void;
}

export default function ShareScreen({ tape, onBack, onSave, onPreview }: ShareScreenProps) {
  const [copied, setCopied] = useState(false);

  const link =
    "casett.app/t/" +
    (tape.title
      ? tape.title
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .slice(0, 4)
      : "9x4k") +
    "k";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
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
          <span>{link}</span>
          <button onClick={handleCopy}>
            {copied ? ICON.check : ICON.copy}
          </button>
        </div>
        <div className="share-actions">
          <button className="cta" onClick={onPreview}>
            {ICON.share}
            <span>Share link</span>
          </button>
          <button className="gbtn" onClick={onSave}>
            Save to Library
          </button>
        </div>
        <div className="share-foot">
          opens a web player — no app needed on their end
        </div>
      </div>
    </div>
  );
}
