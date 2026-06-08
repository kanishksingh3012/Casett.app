import styles from "./Cassette.module.css";

interface ReelProps {
  side: "l" | "r";
  spin?: boolean;
}

const OUTER_R = 58;
const RING_R = 41;
const SPOKE_ORBIT = 18;
const SPOKE_COUNT = 6;
const HOLE_COUNT = 16;
const CX = 60;
const CY = 60;

export default function Reel({ side, spin }: ReelProps) {
  const holes = Array.from({ length: HOLE_COUNT }, (_, i) => {
    const a = (i / HOLE_COUNT) * Math.PI * 2;
    return { cx: CX + RING_R * Math.cos(a), cy: CY + RING_R * Math.sin(a) };
  });

  const spokes = Array.from({ length: SPOKE_COUNT }, (_, i) => {
    const a = (i / SPOKE_COUNT) * Math.PI * 2;
    const x = CX + SPOKE_ORBIT * Math.cos(a);
    const y = CY + SPOKE_ORBIT * Math.sin(a);
    const deg = (a * 180) / Math.PI + 90;
    return { x, y, deg };
  });

  const cls = [
    styles.reel,
    side === "l" ? styles.reelL : styles.reelR,
    spin ? styles.spinning : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg className={cls} viewBox="0 0 120 120">
      {/* outer disc */}
      <circle cx={CX} cy={CY} r={OUTER_R} fill="#f2efe7" />
      <circle cx={CX} cy={CY} r={OUTER_R - 1} fill="none" stroke="rgba(0,0,0,.14)" strokeWidth="1.4" />

      {/* perimeter holes */}
      {holes.map((h, i) => (
        <circle key={i} cx={h.cx} cy={h.cy} r={4.4} fill="#26211b" />
      ))}

      {/* inner disc */}
      <circle cx={CX} cy={CY} r={29} fill="#e6e2d7" />

      {/* spokes */}
      {spokes.map((s, i) => (
        <rect
          key={i}
          x={s.x - 3}
          y={s.y - 6}
          width={6}
          height={12}
          rx={1.5}
          transform={`rotate(${s.deg} ${s.x} ${s.y})`}
          fill="#c9c4b6"
        />
      ))}

      {/* hub */}
      <circle cx={CX} cy={CY} r={11} fill="#b6b1a4" stroke="#26211b" strokeWidth={3} />
    </svg>
  );
}
