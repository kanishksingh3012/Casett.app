import { ICON } from "./icons";

interface TopBarProps {
  onBack?: () => void;
  title: string;
  step?: string;
  action?: React.ReactNode;
}

export default function TopBar({ onBack, title, step, action }: TopBarProps) {
  return (
    <div className="topbar">
      {onBack ? (
        <button className="nav-glass" onClick={onBack}>
          {ICON.back}
        </button>
      ) : (
        <span className="nav-spacer" />
      )}
      <div className="tb-mid">
        <div className="tb-title">{title}</div>
        {step && <div className="tb-step">{step}</div>}
      </div>
      {action || <span className="nav-spacer" />}
    </div>
  );
}
