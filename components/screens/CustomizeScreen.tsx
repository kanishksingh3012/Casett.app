"use client";

import { useState, useRef, useEffect } from "react";
import type { Tape, StickerPlacement } from "@/lib/types";
import { SHELLS, FONTS, STICKER_KEYS, STICKER_SVG } from "@/lib/data";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Stepper from "@/components/ui/Stepper";
import Cassette from "@/components/cassette";

interface CustomizeScreenProps {
  tape: Tape;
  set: (patch: Partial<Tape>) => void;
  onBack: () => void;
  onNext: () => void;
}

interface DragState {
  mode: "new" | "move";
  key: string;
  idx?: number;
  sx: number;
  sy: number;
  moved: boolean;
}

interface Ghost {
  key: string;
  x: number;
  y: number;
}

export default function CustomizeScreen({ tape, set, onBack, onNext }: CustomizeScreenProps) {
  const stickers = tape.stickers || [];
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const stkRef = useRef<StickerPlacement[]>(stickers);
  stkRef.current = stickers;
  const [ghost, setGhost] = useState<Ghost | null>(null);

  const toPct = (cx: number, cy: number) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return {
      x: Math.min(95, Math.max(5, ((cx - r.left) / r.width) * 100)),
      y: Math.min(90, Math.max(8, ((cy - r.top) / r.height) * 100)),
    };
  };

  const inside = (cx: number, cy: number) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const cx = e.clientX, cy = e.clientY;
      if (Math.abs(cx - d.sx) + Math.abs(cy - d.sy) > 6) d.moved = true;
      if (d.mode === "new") {
        setGhost({ key: d.key, x: cx, y: cy });
      } else if (d.mode === "move" && d.idx !== undefined) {
        const p = toPct(cx, cy);
        set({
          stickers: stkRef.current.map((s, i) =>
            i === d.idx ? { ...s, left: p.x, top: p.y } : s
          ),
        });
      }
    };

    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const cx = e.clientX, cy = e.clientY;
      if (d.mode === "new") {
        if (inside(cx, cy)) {
          const p = toPct(cx, cy);
          set({
            stickers: [
              ...stkRef.current,
              { key: d.key, top: p.y, left: p.x, size: 30, rot: 0 },
            ],
          });
        } else if (!d.moved) {
          set({
            stickers: [
              ...stkRef.current,
              { key: d.key, top: 28, left: 50, size: 30, rot: 0 },
            ],
          });
        }
      }
      dragRef.current = null;
      setGhost(null);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const startNew = (k: string, e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = { mode: "new", key: k, sx: e.clientX, sy: e.clientY, moved: false };
    setGhost({ key: k, x: e.clientX, y: e.clientY });
  };

  const startMove = (idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      mode: "move",
      key: stickers[idx].key,
      idx,
      sx: e.clientX,
      sy: e.clientY,
      moved: false,
    };
  };

  const removeSticker = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    set({ stickers: stickers.filter((_, i) => i !== idx) });
  };

  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="Customize" step="4 / 5" />
      <div className="screen-body">
        <Stepper step={2} />
        <div className="cass-stage sm">
          <div className="cz-cass" ref={wrapRef}>
            <Cassette tape={tape} side="A" showStickers={false} />
            <div className="sticker-layer">
              {stickers.map((s, i) => (
                <div
                  key={i}
                  className="placed"
                  style={{
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    transform: `translate(-50%,-50%) rotate(${s.rot}deg)`,
                  }}
                  onPointerDown={(e) => startMove(i, e)}
                >
                  <span
                    className="placed-art"
                    dangerouslySetInnerHTML={{
                      __html: `<svg viewBox="0 0 24 24" width="${s.size}" height="${s.size}">${STICKER_SVG[s.key] ?? ""}</svg>`,
                    }}
                  />
                  <button
                    className="ps-x"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => removeSticker(i, e)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cz-sec">
          <div className="cz-lbl">Shell color</div>
          <div className="picker">
            {SHELLS.map((s) => (
              <button
                key={s.key}
                className={`sw${tape.shell === s.key ? " on" : ""}`}
                style={{ background: s.hex }}
                onClick={() => set({ shell: s.key })}
              />
            ))}
          </div>
        </div>

        <div className="cz-sec">
          <div className="cz-lbl">Note font</div>
          <div className="font-row">
            {FONTS.map((f) => (
              <button
                key={f.name}
                className={`font-chip${tape.noteFont === f.name ? " on" : ""}`}
                style={{ fontFamily: f.css, fontWeight: f.weight ?? 400 }}
                onClick={() => set({ noteFont: f.name })}
              >
                {f.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="cz-sec">
          <div className="cz-lbl">
            Doodle stickers{" "}
            <span className="cz-hint">drag onto the tape</span>
          </div>
          <div className="sticker-tray">
            {STICKER_KEYS.map((k) => (
              <button
                key={k}
                className="st-cell"
                onPointerDown={(e) => startNew(k, e)}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: `<svg viewBox="0 0 24 24" width="26" height="26">${STICKER_SVG[k] ?? ""}</svg>`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {ghost && (
        <div
          className="sticker-ghost"
          style={{ left: ghost.x, top: ghost.y }}
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 24 24" width="34" height="34">${STICKER_SVG[ghost.key] ?? ""}</svg>`,
          }}
        />
      )}

      <div className="screen-foot">
        <button className="cta" onClick={onNext}>
          Next · Share
        </button>
      </div>
    </div>
  );
}
