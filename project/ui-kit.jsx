// ui-kit.jsx — shared data + atoms + the hero Cassette for the Studio Dark prototype.
const { useState, useRef, useEffect } = React;

/* ---------------- data ---------------- */
const SHELLS = [
{ key: "graphite", name: "Graphite", hex: "#3A3A42", sa: "#44444c", sb: "#2b2b30", sc: "#1c1c20", pr: "#ececed", ac: "#9a9aa3" },
{ key: "cocoa", name: "Cocoa", hex: "#5C3A24", sa: "#6e4a30", sb: "#523320", sc: "#38210f", pr: "#f3e6d6", ac: "#e0a35a" },
{ key: "bone", name: "Bone", hex: "#F4F4F2", sa: "#ffffff", sb: "#f1f0ea", sc: "#dcd8ce", pr: "#33332f", ac: "#d98a1e" },
{ key: "violet", name: "Violet", hex: "#7B2FBE", sa: "#8e44d0", sb: "#6f29ab", sc: "#4c1c78", pr: "#f3e9ff", ac: "#e070c8" },
{ key: "marine", name: "Marine", hex: "#16607A", sa: "#1d7596", sb: "#155b73", sc: "#0d3f50", pr: "#e6f6ff", ac: "#3ec8e6" },
{ key: "forest", name: "Forest", hex: "#1F7A5E", sa: "#259170", sb: "#1c7057", sc: "#114a39", pr: "#eafff4", ac: "#f2d23a" },
{ key: "rose", name: "Rose", hex: "#A83B6B", sa: "#c0497e", sb: "#9a3460", sc: "#6e2444", pr: "#ffe9f2", ac: "#ff6a6a" },
{ key: "amber", name: "Amber", hex: "#E8A030", sa: "#f2b850", sb: "#dd8f24", sc: "#a86314", pr: "#3a2208", ac: "#c0392b" }];

const shellOf = (k) => SHELLS.find((s) => s.key === k) || SHELLS[0];

const FONTS = [
{ name: "Reenie Beanie", css: "'Reenie Beanie', cursive", mult: 1.0 },
{ name: "Shadows Into Light", css: "'Shadows Into Light', cursive", mult: 0.74 },
{ name: "Caveat", css: "'Caveat', cursive", mult: 0.92, weight: 600 },
{ name: "Gloria Hallelujah", css: "'Gloria Hallelujah', cursive", mult: 0.66 },
{ name: "Patrick Hand", css: "'Patrick Hand', cursive", mult: 0.78 }];

const fontOf = (n) => FONTS.find((f) => f.name === n) || FONTS[0];

const STICKER_SVG = {
  heart: '<path d="M12 20.6C12 20.6 3.4 14.5 3.4 8.7C3.4 6 5.6 4 8.1 4C10 4 11.4 5.1 12 6.4C12.6 5.1 14 4 15.9 4C18.4 4 20.6 6 20.6 8.7C20.6 14.5 12 20.6 12 20.6Z" fill="#FF566E" stroke="#C32f45" stroke-width="1.3"/>',
  moon: '<path d="M15.6 3.2A8.6 8.6 0 1 0 21 14.8A6.7 6.7 0 0 1 15.6 3.2Z" fill="#F2D23A" stroke="#C79A12" stroke-width="1.3" stroke-linejoin="round"/>',
  sun: '<circle cx="12" cy="12" r="4.4" fill="#F5A623" stroke="#C77F12" stroke-width="1.3"/><g stroke="#F5A623" stroke-width="2.1" stroke-linecap="round"><line x1="12" y1="2.6" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.4"/><line x1="2.6" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.4" y2="12"/><line x1="5.3" y1="5.3" x2="7" y2="7"/><line x1="17" y1="17" x2="18.7" y2="18.7"/><line x1="18.7" y1="5.3" x2="17" y2="7"/><line x1="7" y1="17" x2="5.3" y2="18.7"/></g>',
  flower: '<g stroke="#C84f86" stroke-width="1.2"><ellipse cx="12" cy="6.5" rx="2.5" ry="3.6" fill="#FF8FB3"/><ellipse cx="12" cy="17.5" rx="2.5" ry="3.6" fill="#FF8FB3"/><ellipse cx="6.5" cy="12" rx="3.6" ry="2.5" fill="#FF8FB3"/><ellipse cx="17.5" cy="12" rx="3.6" ry="2.5" fill="#FF8FB3"/></g><circle cx="12" cy="12" r="2.8" fill="#F2D23A" stroke="#C79A12" stroke-width="1.2"/>',
  star: '<path d="M12 2.6l2.5 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16l-5.4 3.2 1.4-6.1L3.3 8.9l6.2-.6z" fill="#FFCE3A" stroke="#D9A21a" stroke-width="1.3" stroke-linejoin="round"/>',
  cloud: '<path d="M7.5 18A4 4 0 0 1 7 10.1A5 5 0 0 1 16.4 9.2A4.2 4.2 0 0 1 16.5 18Z" fill="#9CCBFF" stroke="#4F8FD6" stroke-width="1.3" stroke-linejoin="round"/>',
  bolt: '<path d="M13 2.2 4.6 13.4H10l-1.2 8.4L19 9.6h-5.6z" fill="#FFD23A" stroke="#D9A21a" stroke-width="1.3" stroke-linejoin="round"/>',
  note: '<g fill="#6AA9FF" stroke="#3E73C8" stroke-width="1.2"><path d="M9.2 17.5V6.2l8-1.7v10.4" fill="none" stroke-width="2"/><ellipse cx="7" cy="17.6" rx="2.6" ry="2.2"/><ellipse cx="15" cy="15.8" rx="2.6" ry="2.2"/></g>',
  smiley: '<circle cx="12" cy="12" r="9" fill="#FFCE3A" stroke="#D9A21a" stroke-width="1.3"/><circle cx="9" cy="10.5" r="1.2" fill="#7A5410"/><circle cx="15" cy="10.5" r="1.2" fill="#7A5410"/><path d="M8 14.5a4 4 0 0 0 8 0" fill="none" stroke="#7A5410" stroke-width="1.6" stroke-linecap="round"/>',
  sparkle: '<path d="M12 2.4c.6 5 1.7 7.7 8 9.6-6.3 1.9-7.4 4.6-8 9.6-.6-5-1.7-7.7-8-9.6 6.3-1.9 7.4-4.6 8-9.6z" fill="#E6D2FF" stroke="#9B7BD6" stroke-width="1.3" stroke-linejoin="round"/>'
};
const STICKER_KEYS = Object.keys(STICKER_SVG);
// preset decorative slots stickers drop into (top%, left%, size px, rotate)
const STICKER_SLOTS = [
[8, 78, 34, 14], [60, 7, 30, -12], [5, 11, 28, -16], [52, 85, 32, 10], [26, 46, 24, 4], [12, 55, 26, 8], [70, 72, 28, -8], [30, 16, 24, -6]];


const SONGS = [
{ title: "Dreams", artist: "Fleetwood Mac", a: "#7b5cff", b: "#2a1a6a" },
{ title: "This Must Be the Place", artist: "Talking Heads", a: "#ff8f6a", b: "#7a2a1a" },
{ title: "Linger", artist: "The Cranberries", a: "#3ec8a0", b: "#114a39" },
{ title: "Just Like Heaven", artist: "The Cure", a: "#6aa9ff", b: "#16315a" },
{ title: "Cherry-coloured Funk", artist: "Cocteau Twins", a: "#ff6aa9", b: "#5a1a3a" },
{ title: "Pink Moon", artist: "Nick Drake", a: "#f2b850", b: "#6a4a14" }];


/* ---------------- atoms ---------------- */
function Sticker({ k, size = 26, cls = "st" }) {
  return <span className={cls} dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${STICKER_SVG[k]}</svg>` }} />;
}

function reelInner() {
  let s = '<circle cx="60" cy="60" r="58" fill="#f2efe7"/><circle cx="60" cy="60" r="57" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="1.4"/>';
  for (let i = 0; i < 16; i++) {const a = i / 16 * Math.PI * 2;const x = (60 + 41 * Math.cos(a)).toFixed(1);const y = (60 + 41 * Math.sin(a)).toFixed(1);s += `<circle cx="${x}" cy="${y}" r="4.4" fill="#26211b"/>`;}
  s += '<circle cx="60" cy="60" r="29" fill="#e6e2d7"/>';
  for (let i = 0; i < 6; i++) {const a = i / 6 * Math.PI * 2;const x = 60 + 18 * Math.cos(a);const y = 60 + 18 * Math.sin(a);const deg = a * 180 / Math.PI + 90;s += `<rect x="${(x - 3).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="6" height="12" rx="1.5" transform="rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#c9c4b6"/>`;}
  s += '<circle cx="60" cy="60" r="11" fill="#b6b1a4" stroke="#26211b" stroke-width="3"/>';
  return s;
}
const REEL_HTML = reelInner();
function Reel({ spin, cls }) {
  return <svg className={"reel " + (cls || "") + (spin ? " spinning" : "")} viewBox="0 0 120 120" dangerouslySetInnerHTML={{ __html: REEL_HTML }} />;
}

/* The hero cassette — container-responsive. Props: tape{shell,title,noteFont,from,stickers}, side, spin, showStickers, songTitle */
function Cassette({ tape, side = "A", spin = false, showStickers = true, songTitle }) {
  const sh = shellOf(tape.shell);
  const f = fontOf(tape.noteFont);
  const isB = side === "B";
  const noteText = isB ? songTitle || (tape.song ? tape.song.title : "side b") : tape.title || "untitled tape";
  const noteFontCss = f.css;
  const noteStyle = { fontFamily: noteFontCss, fontWeight: f.weight || 400, fontSize: `calc(10.4cqi * ${f.mult})` };
  return (
    <div className="cass-wrap">
      <div className="cass" style={{ "--sa": sh.sa, "--sb": sh.sb, "--sc": sh.sc, "--pr": sh.pr, "--ac": sh.ac }} data-comment-anchor="78947679d6-div-83-7">
        <span className="scr tl"></span><span className="scr tr"></span><span className="scr bl"></span><span className="scr br"></span>
        <div className="c-top">
          <span className="side">{side}</span>
          <div className="brand"><div className="bn">{("FROM · " + (tape.from || "YOU")).toUpperCase()}</div><div className="bd">TYPE I · NORMAL · 120µs</div><div className="ln"></div></div>
          <span className="dur">HI-FI</span>
        </div>
        <div className="c-label">
          <span className="tape l"></span><span className="tape r"></span>
          <span className="hw" style={noteStyle}>{noteText}</span>
        </div>
        <div className="c-window">
          <div className="gloss"></div><div className="pk l"></div><div className="pk r" data-comment-anchor="71869d5e2a-div-95-68"></div>
          <Reel spin={spin} cls="l" /><Reel spin={spin} cls="r" />
          <div className="bridge"></div>
        </div>
        <div className="c-bottom">
          <div className="ridges"></div><span className="badge">{side}</span>
          <div className="notch"><span className="hole"></span><span className="hole"></span><span className="hole"></span><span className="hole"></span></div>
        </div>
      </div>
      {showStickers && (tape.stickers || []).map((s, i) =>
      <span key={i} className="sticker" style={{ top: s.top + "%", left: s.left + "%", transform: `translate(-50%,-50%) rotate(${s.rot}deg)` }}>
          <Sticker k={s.key} size={s.size} cls="" />
        </span>
      )}
    </div>);

}

/* Flippable cassette for the player: front Side A (voice), back Side B (song).
   Inline styles drive the flip so it never depends on fragile descendant CSS. */
function FlipCassette({ tape, flipped, spin }) {
  const base = { width: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
    transition: "transform .62s cubic-bezier(.4,.8,.3,1), opacity .26s ease" };
  const frontStyle = { ...base, transform: `rotateY(${flipped ? 180 : 0}deg)`, opacity: flipped ? 0 : 1 };
  const backStyle = { ...base, position: "absolute", inset: 0, transform: `rotateY(${flipped ? 360 : 180}deg)`, opacity: flipped ? 1 : 0 };
  return (
    <div className="flip3d">
      <div className="flip-inner">
        <div className="flip-face front" style={frontStyle}><Cassette tape={tape} side="A" spin={spin} showStickers={true} /></div>
        <div className="flip-face back" style={backStyle}><Cassette tape={tape} side="B" spin={spin} showStickers={false} songTitle={tape.song ? tape.song.title : ""} /></div>
      </div>
    </div>);

}

/* transport button */
function TBtn({ variant, onClick, children, label }) {
  return (
    <button className={"tbtn " + (variant || "")} onClick={onClick} aria-label={label}>{children}</button>);

}
const ICON = {
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l11-7z" /></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>,
  rew: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 6 4 12l7 6zM20 6l-7 6 7 6z" /></svg>,
  stop: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>,
  flip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2" /><path d="M20 4v5h-5M4 20v-5h5" /></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>,
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>,
  lib: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" /></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  mic: <svg viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>,
  share: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M8 8l4-4 4 4" /><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
};

/* status bar + waveform */
function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-right"><span className="sig"></span><span className="wifi"></span><span className="bat"></span></span>
    </div>);

}
function Waveform({ active, n = 34 }) {
  const bars = Array.from({ length: n });
  return (
    <div className={"waveform" + (active ? " active" : "")}>
      {bars.map((_, i) => <span key={i} style={{ "--d": i % 7 * 0.09 + "s", "--h": 20 + Math.round(Math.abs(Math.sin(i * 1.7)) * 46) + "%" }}></span>)}
    </div>);

}

Object.assign(window, {
  SHELLS, shellOf, FONTS, fontOf, STICKER_SVG, STICKER_KEYS, STICKER_SLOTS, SONGS,
  Sticker, Reel, Cassette, FlipCassette, TBtn, ICON, StatusBar, Waveform
});