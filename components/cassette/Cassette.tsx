import type { Tape } from "@/lib/types";
import { shellOf, fontOf, STICKER_SVG } from "@/lib/data";
import Reel from "./Reel";
import styles from "./Cassette.module.css";

interface CassetteProps {
  tape: Tape;
  side?: "A" | "B";
  spin?: boolean;
  showStickers?: boolean;
  songTitle?: string;
}

export default function Cassette({
  tape,
  side = "A",
  spin = false,
  showStickers = true,
  songTitle,
}: CassetteProps) {
  const sh = shellOf(tape.shell);
  const f = fontOf(tape.noteFont);
  const isB = side === "B";
  const noteText = isB
    ? songTitle ?? tape.song?.title ?? "side b"
    : tape.title || "untitled tape";

  const noteStyle: React.CSSProperties = {
    fontFamily: f.css,
    fontWeight: f.weight ?? 400,
    fontSize: `calc(8cqi * ${f.mult})`,
  };

  const shellVars = {
    "--sa": sh.sa,
    "--sb": sh.sb,
    "--sc": sh.sc,
    "--pr": sh.pr,
    "--ac": sh.ac,
  } as React.CSSProperties;

  return (
    <div className={styles.wrap}>
      <div className={styles.cass} style={shellVars}>
        {/* corner screws */}
        <span className={`${styles.screw} ${styles.screwTl}`} />
        <span className={`${styles.screw} ${styles.screwTr}`} />
        <span className={`${styles.screw} ${styles.screwBl}`} />
        <span className={`${styles.screw} ${styles.screwBr}`} />

        {/* brand strip */}
        <div className={styles.top}>
          <span className={styles.topSide}>{side}</span>
          <div className={styles.brand}>
            <div className={styles.brandName}>
              {`FROM · ${(tape.from || "YOU").toUpperCase()}`}
            </div>
            <div className={styles.brandDetail}>TYPE I · NORMAL · 120µs</div>
            <div className={styles.brandLine} />
          </div>
          <span className={styles.topDur}>HI-FI</span>
        </div>

        {/* index-card label */}
        <div className={styles.label}>
          <span className={styles.tape + " " + styles.tapeL} />
          <span className={styles.tape + " " + styles.tapeR} />
          <span className={styles.labelText} style={noteStyle}>
            {noteText}
          </span>
        </div>

        {/* reel window */}
        <div className={styles.window}>
          <div className={styles.windowGloss} />
          <span className={`${styles.pk} ${styles.pkL}`} />
          <span className={`${styles.pk} ${styles.pkR}`} />
          <Reel side="l" spin={spin} />
          <Reel side="r" spin={spin} />
          <div className={styles.bridge} />
        </div>

        {/* grill */}
        <div className={styles.bottom}>
          <div className={styles.bottomRidges} />
          <span className={styles.badge}>{side}</span>
          <div className={styles.bottomNotch}>
            <span className={styles.hole} />
            <span className={styles.hole} />
            <span className={styles.hole} />
            <span className={styles.hole} />
          </div>
        </div>
      </div>

      {/* placed stickers */}
      {showStickers &&
        tape.stickers.map((s, i) => (
          <span
            key={i}
            className={styles.sticker}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            }}
            dangerouslySetInnerHTML={{
              __html: `<svg viewBox="0 0 24 24" width="${s.size}" height="${s.size}">${STICKER_SVG[s.key] ?? ""}</svg>`,
            }}
          />
        ))}
    </div>
  );
}
