// screens.jsx — all 8 hi-fi screens. Uses ui-kit globals.
const { useState: uS, useRef: uR, useEffect: uE } = React;

/* shared chrome */
function TopBar({ onBack, title, step, action }) {
  return (
    <div className="topbar">
      {onBack ? <button className="nav-glass" onClick={onBack}>{ICON.back}</button> : <span className="nav-spacer"></span>}
      <div className="tb-mid">
        <div className="tb-title" data-comment-anchor="943356a1d3-div-10-9">{title}</div>
        {step && <div className="tb-step">{step}</div>}
      </div>
      {action || <span className="nav-spacer"></span>}
    </div>);

}
function Stepper({ i }) {
  const labels = ["Record", "Song", "Style", "Share"];
  return <div className="stepper">{labels.map((l, n) =>
    <div key={n} className={"st-dot" + (n <= i ? " done" : "") + (n === i ? " cur" : "")}><span></span>{l}</div>
    )}</div>;
}

/* ---------- HOME ---------- */
function Home({ lib, onNew, onOpen, go }) {
  const empty = lib.length === 0;
  if (empty) return (
    <div className="screen" data-screen-label="Home (empty)">
      <StatusBar />
      <div className="screen-body center">
        <button className="fab big" onClick={onNew}>{ICON.plus}</button>
        <div className="empty-h">Make a tape</div>
        <div className="empty-p">record your voice, add one song,<br />send it to someone</div>
      </div>
      <TabBar active="home" go={go} />
    </div>);

  return (
    <div className="screen" data-screen-label="Home">
      <StatusBar />
      <div className="topbar plain"><div className="tb-mid left"><div className="h-title">Your tapes</div></div></div>
      <div className="screen-body">
        <div className="sub-lbl">Recent tapes</div>
        <div className="tape-list">
          {lib.map((t, i) => {
            const sh = SHELLS.find(s => s.key === t.shell) || SHELLS[0];
            return (
              <button key={i} className="tape-card" onClick={() => onOpen(t)}>
                <div className="cass-ico" style={{ background: `linear-gradient(155deg,${sh.sa},${sh.sb} 55%,${sh.sc})` }}>
                  <div className="cass-ico-win"><span></span><span></span></div>
                </div>
                <div className="tc-info">
                  <div className="tc-title">{t.title}</div>
                  <div className="tc-sub">
                    <span className="tc-song"><span className="nt">♪</span>{t.song ? t.song.title + " · " + t.song.artist : "no song yet"}</span>
                    <span className="tc-when">{t.when}</span>
                  </div>
                </div>
              </button>);
          })}
        </div>
      </div>
      <button className="fab" onClick={onNew}>{ICON.plus}</button>
      <TabBar active="home" go={go} />
    </div>);

}

/* ---------- NEW TAPE ---------- */
function NewTape({ tape, set, onBack, onNext }) {
  return (
    <div className="screen" data-screen-label="New Tape">
      <StatusBar />
      <TopBar onBack={onBack} title="New Tape" step="1 / 5" />
      <div className="screen-body">
        <div className="cass-stage sm"><Cassette tape={tape} side="A" showStickers={false} /></div>
        <div className="field">
          <label>Tape title · 4–5 words</label>
          <input value={tape.title} maxLength={28} placeholder="thinking of you lately"
          onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div className="field">
          <label>Who's it from?</label>
          <input value={tape.from} maxLength={16} placeholder="Alex" onChange={(e) => set({ from: e.target.value })} />
        </div>
      </div>
      <div className="screen-foot">
        <button className="cta" disabled={!tape.title.trim()} onClick={onNext}>Next · Record Side A</button>
      </div>
    </div>);

}

/* ---------- RECORD SIDE A ---------- */
function RecordA({ tape, set, onBack, onNext }) {
  const [rec, setRec] = uS(false);
  const [done, setDone] = uS(tape.hasVoice || false);
  const [t, setT] = uS(tape.voiceLen || 0);
  const ref = uR();
  uE(() => {
    if (rec) {ref.current = setInterval(() => setT((x) => {if (x >= 90) {clearInterval(ref.current);setRec(false);setDone(true);return 90;}return x + 1;}), 1000);} else
    clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [rec]);
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(1, "0")}:${String(s % 60).padStart(2, "0")}`;
  const toggle = () => {if (done) return;setRec((r) => !r);if (rec) setDone(true);};
  const proceed = () => {set({ hasVoice: true, voiceLen: t });onNext();};
  return (
    <div className="screen" data-screen-label="Record Side A">
      <StatusBar />
      <TopBar onBack={onBack} title="Side A · Your Voice" step="2 / 5" />
      <div className="screen-body">
        <Stepper i={0} />
        <div className="cass-stage sm"><Cassette tape={tape} side="A" spin={rec} showStickers={false} /></div>
        <div className="lcd"><span className="stat"><span className={"rd" + (rec ? " on" : "")}></span>{rec ? "REC" : done ? "DONE" : "READY"} · {mmss(t)} / 1:30</span><span className="meta">SIDE A</span></div>
        <Waveform active={rec} />
        <div className="rec-controls">
          {!done ?
          <div className="rec-center">
              <button className={"rec-btn" + (rec ? " on" : "")} onClick={toggle}><span className="rdot"></span></button>
              <span className="rec-cap">{rec ? "tap to stop" : "tap to record"}</span>
            </div> :

          <div className="rec-done">
              <div className="rec-row">
                <button className="tbtn" onClick={() => {setDone(false);setRec(false);setT(0);}}>{ICON.rew}</button>
                <button className="tbtn play">{ICON.play}</button>
              </div>
              <span className="rec-cap">re-record · play back</span>
            </div>
          }
        </div>
      </div>
      <div className="screen-foot">
        <button className="cta" disabled={!done} onClick={proceed}>Next · Add a song</button>
        <button className="link-btn" onClick={proceed} style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}>skip voice — song only</button>
      </div>
    </div>);

}

/* ---------- ADD SONG SIDE B ---------- */
function AddSongB({ tape, set, onBack, onNext }) {
  const [q, setQ] = uS("");
  const [sel, setSel] = uS(tape.song || null);
  const [playing, setPlaying] = uS(null);
  const list = SONGS.filter((s) => (s.title + s.artist).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="screen" data-screen-label="Add Song Side B">
      <StatusBar />
      <TopBar onBack={onBack} title="Side B · One Song" step="3 / 5" />
      <div className="screen-body">
        <Stepper i={1} />
        <div className="field search"><input value={q} placeholder="Search a song…" onChange={(e) => setQ(e.target.value)} /></div>
        <div className="song-list">
          {list.map((s, i) => {
            const on = sel && sel.title === s.title;
            return (
              <div key={i} className={"song-row" + (on ? " on" : "")} onClick={() => setSel(s)}>
                <button className="song-art" style={{ background: `linear-gradient(135deg,${s.a},${s.b})` }}
                onClick={(e) => {e.stopPropagation();setPlaying(playing === i ? null : i);}}>
                  {playing === i ? ICON.pause : ICON.play}
                </button>
                <div className="song-info"><div className="t">{s.title}</div><div className="a">{s.artist} · 0:30 preview</div>
                  {playing === i && <div className="mini-bar"><i></i></div>}
                </div>
                <span className={"song-pick" + (on ? " on" : "")}>{on ? ICON.check : ICON.plus}</span>
              </div>);

          })}
        </div>
      </div>
      <div className="screen-foot">
        <button className="cta" disabled={!sel} onClick={() => {set({ song: sel });onNext();}}>Next · Customize</button>
      </div>
    </div>);

}

/* ---------- CUSTOMIZE ---------- */
function Customize({ tape, set, onBack, onNext }) {
  const stickers = tape.stickers || [];
  const wrapRef = uR(null);
  const dragRef = uR(null);
  const stkRef = uR(stickers); stkRef.current = stickers;
  const [ghost, setGhost] = uS(null);

  const toPct = (cx, cy) => {
    const r = wrapRef.current.getBoundingClientRect();
    return {
      x: Math.min(95, Math.max(5, (cx - r.left) / r.width * 100)),
      y: Math.min(90, Math.max(8, (cy - r.top) / r.height * 100))
    };
  };
  const inside = (cx, cy) => {
    const r = wrapRef.current.getBoundingClientRect();
    return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
  };

  uE(() => {
    const move = (e) => {
      const d = dragRef.current; if (!d) return;
      const cx = e.clientX, cy = e.clientY;
      if (Math.abs(cx - d.sx) + Math.abs(cy - d.sy) > 6) d.moved = true;
      if (d.mode === "new") setGhost({ key: d.key, x: cx, y: cy });
      else if (d.mode === "move") { const p = toPct(cx, cy); set({ stickers: stkRef.current.map((s, i) => i === d.idx ? { ...s, left: p.x, top: p.y } : s) }); }
    };
    const up = (e) => {
      const d = dragRef.current; if (!d) return;
      const cx = e.clientX, cy = e.clientY;
      if (d.mode === "new") {
        if (inside(cx, cy)) { const p = toPct(cx, cy); set({ stickers: [...stkRef.current, { key: d.key, top: p.y, left: p.x, size: 30, rot: 0 }] }); }
        else if (!d.moved) { set({ stickers: [...stkRef.current, { key: d.key, top: 28, left: 50, size: 30, rot: 0 }] }); }
      }
      dragRef.current = null; setGhost(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, []);

  const startNew = (k, e) => { e.preventDefault(); dragRef.current = { mode: "new", key: k, sx: e.clientX, sy: e.clientY, moved: false }; setGhost({ key: k, x: e.clientX, y: e.clientY }); };
  const startMove = (idx, e) => { e.preventDefault(); e.stopPropagation(); dragRef.current = { mode: "move", idx, sx: e.clientX, sy: e.clientY, moved: false }; };
  const removeSticker = (idx, e) => { e.stopPropagation(); set({ stickers: stickers.filter((_, i) => i !== idx) }); };

  return (
    <div className="screen" data-screen-label="Customize">
      <StatusBar />
      <TopBar onBack={onBack} title="Customize" step="4 / 5" />
      <div className="screen-body">
        <Stepper i={2} />
        <div className="cass-stage">
          <div className="cz-cass" ref={wrapRef}>
            <Cassette tape={tape} side="A" showStickers={false} />
            <div className="sticker-layer">
              {stickers.map((s, i) =>
              <div key={i} className="placed" style={{ top: s.top + "%", left: s.left + "%", transform: `translate(-50%,-50%) rotate(${s.rot}deg)` }} onPointerDown={(e) => startMove(i, e)}>
                  <span className="placed-art"><Sticker k={s.key} size={s.size} cls="" /></span>
                  <button className="ps-x" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => removeSticker(i, e)}>×</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="cz-sec">
          <div className="cz-lbl">Shell color</div>
          <div className="picker">
            {SHELLS.map((s) =>
            <button key={s.key} className={"sw" + (tape.shell === s.key ? " on" : "")} style={{ background: s.hex }} onClick={() => set({ shell: s.key })} />
            )}
          </div>
        </div>
        <div className="cz-sec">
          <div className="cz-lbl">Note font</div>
          <div className="font-row">
            {FONTS.map((f) =>
            <button key={f.name} className={"font-chip" + (tape.noteFont === f.name ? " on" : "")}
            style={{ fontFamily: f.css, fontWeight: f.weight || 400 }} onClick={() => set({ noteFont: f.name })}>{f.name.split(" ")[0]}</button>
            )}
          </div>
        </div>
        <div className="cz-sec">
          <div className="cz-lbl">Doodle stickers <span className="cz-hint">drag onto the tape</span></div>
          <div className="sticker-tray">
            {STICKER_KEYS.map((k) =>
            <button key={k} className="st-cell" onPointerDown={(e) => startNew(k, e)}><Sticker k={k} size={26} cls="" /></button>
            )}
          </div>
        </div>
      </div>
      {ghost && <div className="sticker-ghost" style={{ left: ghost.x, top: ghost.y }}><Sticker k={ghost.key} size={34} cls="" /></div>}
      <div className="screen-foot">
        <button className="cta" onClick={onNext}>Next · Share</button>
      </div>
    </div>);

}

/* ---------- SHARE + SAVE ---------- */
function Share({ tape, onBack, onSave, onPreview }) {
  const [copied, setCopied] = uS(false);
  const link = "casett.app/t/" + (tape.title ? tape.title.toLowerCase().replace(/[^a-z]/g, "").slice(0, 4) : "9x4k") + "k";
  return (
    <div className="screen" data-screen-label="Share">
      <StatusBar />
      <TopBar onBack={onBack} title="Ready to send" step="5 / 5" />
      <div className="screen-body center-soft">
        <div className="share-glow"></div>
        <div className="cass-stage hero"><Cassette tape={tape} side="A" showStickers={true} /></div>
        <div className="share-sub">your tape is ready ✦</div>
        <div className="link-pill"><span>{link}</span><button onClick={() => {setCopied(true);setTimeout(() => setCopied(false), 1400);}}>{copied ? ICON.check : ICON.copy}</button></div>
        <div className="share-actions">
          <button className="cta" onClick={onPreview}>{ICON.share}<span>Share link</span></button>
          <button className="gbtn" onClick={onSave}>Save to Library</button>
        </div>
        <div className="share-foot">opens a web player — no app needed on their end</div>
      </div>
    </div>);

}

/* ---------- APP PLAYER (in-app, native iOS) ---------- */
function AppPlayer({ tape, onBack, onShare }) {
  const [flipped, setFlipped] = uS(false);
  const [playing, setPlaying] = uS(false);
  const [elapsed, setElapsed] = uS(0);
  const side = flipped ? "B" : "A";
  const totalA = tape.voiceLen || 90;
  const totalB = 30;
  const total = side === "A" ? totalA : totalB;

  uE(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed(e => {
      if (e >= total - 1) { clearInterval(id); setPlaying(false); return total; }
      return e + 1;
    }), 1000);
    return () => clearInterval(id);
  }, [playing, side, total]);

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const handleFlip = () => { setFlipped(f => !f); setElapsed(0); setPlaying(false); };
  const handleRew  = () => { setFlipped(false); setElapsed(0); setPlaying(false); };

  return (
    <div className="screen" data-screen-label="App Player">
      <StatusBar />
      <TopBar onBack={onBack} title={tape.title || "Tape"} right={
        <button className="share-glass" onClick={onShare}>
          <span className="dot"></span>Share
        </button>} />
      <div className="player-body" style={{ paddingTop: "10px" }}>
        <div style={{ width: "100%", margin: "0 auto 14px" }}>
          <FlipCassette tape={tape} flipped={flipped} spin={playing} />
        </div>
        <div className="side-ind">
          <span className={side === "A" ? "on" : ""}>● Voice</span>
          <span className={side === "B" ? "on" : ""}>● Song</span>
        </div>
        <div className="player-now">
          <div className="now voice">
            <Waveform active={playing} />
            <div className="now-cap">{fmt(elapsed)} — {fmt(total)}</div>
          </div>
        </div>
        <div className="player-transport">
          <button className="tbtn" onClick={handleRew}>{ICON.rew}</button>
          <button className="tbtn play" onClick={() => setPlaying(p => !p)}>{playing ? ICON.pause : ICON.play}</button>
          <button className="tbtn flip-btn" onClick={handleFlip}>{ICON.flip}<span className="flip-hint">flip</span></button>
        </div>
      </div>
    </div>);
}

/* ---------- WEB PLAYER (recipient, browser) ---------- */
function Player({ tape, onClose }) {
  const [flipped, setFlipped] = uS(false);
  const [playing, setPlaying] = uS(false);
  const side = flipped ? "B" : "A";
  return (
    <div className="screen browser" data-screen-label="Web Player">
      <div className="browserbar">
        <span className="bb-lock">🔒</span>
        <span className="bb-url">casett.app/t/9x4k</span>
        <span className="bb-dots">⋯</span>
      </div>
      <div className="app-banner">
        <div className="ab-icon"><Sticker k="note" size={18} cls="" /></div>
        <div className="ab-txt"><b>Casett</b><span>Open in the app</span></div>
        <button className="ab-get">Get</button>
        <button className="ab-x" onClick={(e) => e.currentTarget.closest('.app-banner').style.display = 'none'}>✕</button>
      </div>
      <div className="player-body">
        <div className="player-from">A tape from <b>{tape.from || "Alex"}</b></div>
        <FlipCassette tape={tape} flipped={flipped} spin={playing} />
        <div className="side-ind"><span className={side === "A" ? "on" : ""}>● Voice</span><span className={side === "B" ? "on" : ""}>● Song</span></div>
        <div className="player-now">
          {side === "A" ?
          <div className="now voice"><Waveform active={playing} /><div className="now-cap">{tape.from || "Alex"}'s voice note</div></div> :
          <div className="now song">
                <div className="song-art big" style={{ background: tape.song ? `linear-gradient(135deg,${tape.song.a},${tape.song.b})` : "#333" }}>{ICON.note}</div>
                <div className="now-song"><div className="t">{tape.song ? tape.song.title : "—"}</div><div className="a">{tape.song ? tape.song.artist : ""} · 0:30</div></div>
              </div>}
        </div>
        <div className="player-transport">
          <button className="tbtn" onClick={() => {setFlipped(false);setPlaying(false);}}>{ICON.rew}</button>
          <button className="tbtn play" onClick={() => setPlaying((p) => !p)}>{playing ? ICON.pause : ICON.play}</button>
          <button className="tbtn flip-btn" onClick={() => setFlipped((f) => !f)}>{ICON.flip}<span className="flip-hint">flip</span></button>
        </div>
        <button className="save-received" onClick={onClose}>♥ Save to your Library</button>
      </div>
    </div>);

}

/* ---------- LIBRARY ---------- */
function Library({ lib, onOpen, go }) {
  return (
    <div className="screen" data-screen-label="Library">
      <StatusBar />
      <div className="topbar plain"><div className="tb-mid left"><div className="h-title">Library</div></div></div>
      <div className="screen-body">

        <div className="lib-grid">
          {lib.map((t, i) =>
          <button key={i} className="lib-card" onClick={() => onOpen(t)}>
              <Cassette tape={t} side="A" showStickers={false} />
              <div className="lib-meta">
                <span className="lm-title">{t.title}</span>
                <span className={"dir-icon " + (t.dir||"sent")}>{t.dir==="received" ? "↙" : "↗"}</span>
              </div>
            </button>
          )}
        </div>
      </div>
      <TabBar active="library" go={go} />
    </div>);

}

/* ---------- TAB BAR ---------- */
function TabBar({ active, go }) {
  return (
    <div className="tabbar glass">
      <button className={"ti" + (active === "home" ? " on" : "")} onClick={() => go("home")}>{ICON.home}<span>Home</span></button>
      <button className={"ti" + (active === "library" ? " on" : "")} onClick={() => go("library")}>{ICON.lib}<span>Library</span></button>
    </div>);

}

Object.assign(window, { Home, NewTape, RecordA, AddSongB, Customize, Share, AppPlayer, Player, Library, TabBar });