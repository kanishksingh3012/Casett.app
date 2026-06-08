// cassettes.jsx — the hero mixtape visual, themed three ways.
// Exports: Reel, Cassette (to window). Pure presentational; styling lives in the host <style>.

function Reel({ fill }) {
  const holes = Array.from({ length: 16 });
  const teeth = Array.from({ length: 6 });
  const R = 60;
  return (
    <svg className="reel-svg" viewBox="0 0 120 120" aria-hidden="true">
      {/* outer flange */}
      <circle cx="60" cy="60" r="58" className="reel-flange" />
      <circle cx="60" cy="60" r="57" className="reel-flange-ring" />
      {/* ring of holes */}
      {holes.map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <circle key={i} cx={60 + 41 * Math.cos(a)} cy={60 + 41 * Math.sin(a)} r="4.4" className="reel-hole" />
        );
      })}
      {/* hub */}
      <circle cx="60" cy="60" r="29" className="reel-hub" />
      {/* drive teeth */}
      {teeth.map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const x = 60 + 18 * Math.cos(a);
        const y = 60 + 18 * Math.sin(a);
        return (
          <rect key={i} x={x - 3} y={y - 6} width="6" height="12" rx="1.5"
            transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} className="reel-tooth" />
        );
      })}
      <circle cx="60" cy="60" r="11" className="reel-center" />
    </svg>
  );
}

function Cassette({ variant, side, title, subtitle, model, typeline, brand, fill }) {
  return (
    <div className={"cassette " + variant}>
      <div className="shell">
        <span className="screw tl" /><span className="screw tr" />
        <span className="screw bl" /><span className="screw br" />

        {/* printed brand strip */}
        <div className="brand-strip">
          <div className="brand-left">
            <span className="brand-tri">▸</span>
            <span className="brand-model">{model}</span>
            <span className="brand-type">{typeline}</span>
          </div>
          <span className="brand-logo">{brand}</span>
        </div>

        {/* window + reels */}
        <div className="window">
          <div className="tape-pack left" data-fill={fill} />
          <div className="tape-pack right" data-fill={fill} />
          <div className="window-gloss" />
          <div className="reel left"><Reel /></div>
          <div className="reel right"><Reel /></div>
          <div className="bridge" />
        </div>

        {/* ribbed bottom with capstan notch */}
        <div className="bottom">
          <div className="ridges" />
          <div className="notch">
            <span className="cap-hole" /><span className="cap-hole" />
            <span className="cap-hole" /><span className="cap-hole" />
          </div>
          <span className="side-badge">{side.slice(-1)}</span>
        </div>

        {/* the taped paper note — the customizable zone */}
        <div className="note">
          <span className="washi a" /><span className="washi b" />
          <span className="note-side">{side}</span>
          <span className="note-meta">HI-FI STEREO</span>
          <div className="note-title">{title}</div>
          {subtitle ? <div className="note-sub">{subtitle}</div> : null}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Reel, Cassette });
