"use client";

import type { Tape } from "@/lib/types";
import StatusBar from "@/components/ui/StatusBar";
import TabBar from "@/components/ui/TabBar";
import Cassette from "@/components/cassette";

interface LibraryScreenProps {
  lib: Tape[];
  onOpen: (t: Tape) => void;
  go: (s: string) => void;
}

export default function LibraryScreen({ lib, onOpen, go }: LibraryScreenProps) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="topbar plain">
        <div className="tb-mid left">
          <div className="h-title">Library</div>
        </div>
      </div>
      <div className="screen-body">
        <div className="lib-grid">
          {lib.map((t, i) => (
            <button key={i} className="lib-card" onClick={() => onOpen(t)}>
              <Cassette tape={t} side="A" showStickers={true} />
              <div className="lib-meta">
                <span className="lm-title">{t.title}</span>
                <span
                  style={{
                    color: t.dir === "sent" ? "var(--amber)" : "#3ec8a0",
                    fontSize: "14px",
                    flex: "none",
                    lineHeight: "1",
                  }}
                >
                  {t.dir === "sent" ? "↗" : "↙"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <TabBar active="library" go={go} />
    </div>
  );
}
