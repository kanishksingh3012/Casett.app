export default function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-right">
        <span className="sig" />
        <span className="wifi" />
        <span className="bat" />
      </span>
    </div>
  );
}
