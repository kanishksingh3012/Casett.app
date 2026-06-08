interface WaveformProps {
  active: boolean;
  n?: number;
}

export default function Waveform({ active, n = 34 }: WaveformProps) {
  const bars = Array.from({ length: n });
  return (
    <div className={`waveform${active ? " active" : ""}`}>
      {bars.map((_, i) => (
        <span
          key={i}
          style={
            {
              "--d": `${(i % 7) * 0.09}s`,
              "--h": `${20 + Math.round(Math.abs(Math.sin(i * 1.7)) * 46)}%`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
