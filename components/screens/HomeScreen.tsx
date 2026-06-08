"use client";

import type { Tape } from "@/lib/types";
import { shellOf } from "@/lib/data";
import StatusBar from "@/components/ui/StatusBar";
import TabBar from "@/components/ui/TabBar";
import { ICON } from "@/components/ui/icons";

interface HomeScreenProps {
  lib: Tape[];
  onNew: () => void;
  onOpen: (t: Tape) => void;
  go: (s: string) => void;
}

export default function HomeScreen({ lib, onNew, onOpen, go }: HomeScreenProps) {
  if (lib.length === 0) {
    return (
      <div className="screen">
        <StatusBar />
        <div className="screen-body center">
          <button className="fab big" onClick={onNew}>
            {ICON.plus}
          </button>
          <div className="empty-h">Make a tape</div>
          <div className="empty-p">
            record your voice, add one song,
            <br />
            send it to someone
          </div>
        </div>
        <TabBar active="home" go={go} />
      </div>
    );
  }

  return (
    <div className="screen">
      <StatusBar />
      <div className="topbar plain">
        <div className="tb-mid left">
          <div className="h-title">Your tapes</div>
        </div>
      </div>
      <div className="screen-body">
        <div className="sub-lbl">Recent tapes</div>
        <div className="tape-list">
          {lib.map((t, i) => {
            const sh = shellOf(t.shell);
            return (
              <button key={i} className="tape-card" onClick={() => onOpen(t)}>
                <div
                  className="cass-ico"
                  style={{
                    background: `linear-gradient(155deg,${sh.sa},${sh.sb} 55%,${sh.sc})`,
                  }}
                >
                  <div className="cass-ico-win">
                    <span />
                    <span />
                  </div>
                </div>
                <div className="tc-info">
                  <div className="tc-title">{t.title}</div>
                  <div className="tc-sub">
                    <span className="tc-song">
                      <span className="nt">♪</span>
                      {t.song
                        ? `${t.song.title} · ${t.song.artist}`
                        : "no song yet"}
                    </span>
                    {t.when && <span className="tc-when">{t.when}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <button className="fab" onClick={onNew}>
        {ICON.plus}
      </button>
      <TabBar active="home" go={go} />
    </div>
  );
}
