interface LCDProps {
  status: string;
  time: string;
  totalTime: string;
  side?: string;
  recording?: boolean;
}

export default function LCD({ status, time, totalTime, side = "A", recording = false }: LCDProps) {
  return (
    <div className="lcd">
      <span className="stat">
        <span className={`rd${recording ? " on" : ""}`} />
        {status} · {time} / {totalTime}
      </span>
      <span className="meta">SIDE {side}</span>
    </div>
  );
}
