"use client";

import { useState, useRef, useEffect } from "react";
import type { Tape, Song } from "@/lib/types";
import StatusBar from "@/components/ui/StatusBar";
import TopBar from "@/components/ui/TopBar";
import Stepper from "@/components/ui/Stepper";
import { ICON } from "@/components/ui/icons";

interface AddSongScreenProps {
  tape: Tape;
  set: (patch: Partial<Tape>) => void;
  onBack: () => void;
  onNext: () => void;
}

const GRADS: [string, string][] = [
  ["#7b5cff", "#2a1a6a"], ["#ff8f6a", "#7a2a1a"], ["#3ec8a0", "#114a39"],
  ["#6aa9ff", "#16315a"], ["#ff6aa9", "#5a1a3a"], ["#f2b850", "#6a4a14"],
  ["#9b59b6", "#4a1a7a"], ["#e74c3c", "#5a1a1a"], ["#1abc9c", "#0a3a32"],
  ["#e67e22", "#5a3010"],
];

function gradFor(s: string): [string, string] {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return GRADS[h % GRADS.length];
}

async function searchItunes(query: string): Promise<Song[]> {
  const res = await fetch(`/api/itunes?q=${encodeURIComponent(query)}`);
  const results = await res.json();
  return (results || []).map((r: Record<string, string>) => {
    const [a, b] = gradFor(r.trackName);
    return {
      title: r.trackName,
      artist: r.artistName,
      a,
      b,
      previewUrl: r.previewUrl || undefined,
      artworkUrl: r.artworkUrl100
        ? r.artworkUrl100.replace("100x100bb", "60x60bb")
        : undefined,
    };
  });
}

export default function AddSongScreen({ tape, set, onBack, onNext }: AddSongScreenProps) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Song | null>(tape.song || null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const search = async (query: string) => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const items = await searchItunes(query);
      setResults(items.slice(0, 3));
    } catch {
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const handleQ = (val: string) => {
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const togglePlay = (i: number, song: Song) => {
    if (!song.previewUrl) return;
    if (playing === i) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(song.previewUrl);
    audio.onended = () => setPlaying(null);
    audio.play();
    audioRef.current = audio;
    setPlaying(i);
  };

  const hasQuery = q.trim().length >= 2;

  return (
    <div className="screen">
      <StatusBar />
      <TopBar onBack={onBack} title="Side B · One Song" step="3 / 5" />
      <div className="screen-body">
        <Stepper step={1} />
        <div className="field search" style={{ position: "relative" }}>
          <input
            value={q}
            placeholder="Search any song…"
            onChange={(e) => handleQ(e.target.value)}
          />
          {loading && (
            <span style={{
              position: "absolute", right: 14, top: "50%",
              transform: "translateY(-50%)",
              width: 14, height: 14,
              border: "2px solid rgba(255,255,255,.15)",
              borderTopColor: "#E8A030",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              display: "inline-block",
            }} />
          )}
        </div>

        {!hasQuery ? (
          <div className="song-empty">
            <span className="song-empty-note">♪</span>
            <div className="song-empty-h">Say it with a song</div>
            <div className="song-empty-p">
              Pick a track that carries the message<br />
              words can&apos;t. Search above to begin.
            </div>
          </div>
        ) : (
          <div className="song-list">
            {searched && results.length === 0 && !loading && (
              <div style={{ textAlign: "center", opacity: 0.4, padding: "24px 0", fontSize: 13 }}>
                No results
              </div>
            )}
            {results.map((s, i) => {
              const on = !!(sel && sel.title === s.title && sel.artist === s.artist);
              const hasPreview = !!s.previewUrl;
              return (
                <div
                  key={`${s.title}-${s.artist}-${i}`}
                  className={`song-row${on ? " on" : ""}`}
                  onClick={() => setSel(s)}
                >
                  <button
                    className="song-art"
                    style={
                      s.artworkUrl
                        ? { backgroundImage: `url(${s.artworkUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: `linear-gradient(135deg,${s.a},${s.b})` }
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(i, s);
                    }}
                    disabled={!hasPreview}
                  >
                    {hasPreview && (playing === i ? ICON.pause : ICON.play)}
                  </button>
                  <div className="song-info">
                    <div className="t">{s.title}</div>
                    <div className="a">{s.artist}{hasPreview ? " · preview" : ""}</div>
                    {playing === i && <div className="mini-bar"><i /></div>}
                  </div>
                  <span className={`song-pick${on ? " on" : ""}`}>
                    {on ? ICON.check : ICON.plus}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="screen-foot">
        <button
          className="cta"
          disabled={!sel}
          onClick={() => {
            audioRef.current?.pause();
            set({ song: sel });
            onNext();
          }}
        >
          Next · Customize
        </button>
      </div>
    </div>
  );
}
