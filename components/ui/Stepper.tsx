const LABELS = ["Record", "Song", "Style", "Share"];

interface StepperProps {
  step: number;
}

export default function Stepper({ step }: StepperProps) {
  return (
    <div className="stepper">
      {LABELS.map((label, n) => (
        <div
          key={n}
          className={`st-dot${n <= step ? " done" : ""}${n === step ? " cur" : ""}`}
        >
          <span />
          {label}
        </div>
      ))}
    </div>
  );
}
