import type { Tape } from "@/lib/types";
import Cassette from "./Cassette";

interface FlipCassetteProps {
  tape: Tape;
  flipped: boolean;
  spin?: boolean;
}

export default function FlipCassette({ tape, flipped, spin = false }: FlipCassetteProps) {
  const base: React.CSSProperties = {
    width: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transition: "transform .62s cubic-bezier(.4,.8,.3,1), opacity .26s ease",
  };

  const frontStyle: React.CSSProperties = {
    ...base,
    transform: `rotateY(${flipped ? 180 : 0}deg)`,
    opacity: flipped ? 0 : 1,
  };

  const backStyle: React.CSSProperties = {
    ...base,
    position: "absolute",
    inset: 0,
    transform: `rotateY(${flipped ? 360 : 180}deg)`,
    opacity: flipped ? 1 : 0,
  };

  return (
    <div className="flip3d">
      <div className="flip-inner" style={{ position: "relative", width: "100%", transformStyle: "preserve-3d" }}>
        <div style={frontStyle}>
          <Cassette tape={tape} side="A" spin={spin} showStickers={true} />
        </div>
        <div style={backStyle}>
          <Cassette
            tape={tape}
            side="B"
            spin={spin}
            showStickers={false}
            songTitle={tape.song?.title ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
