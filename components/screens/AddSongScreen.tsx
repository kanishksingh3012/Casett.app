"use client";

import { useState, useRef, useEffect } from "react";
import type { Tape, Song } from "@/lib/types";
import { SONGS } from "@/lib/data";
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

export default function AddSongScreen({ tape, set, onBack, onNext }: AddSongScreenProps) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Song | null>(tape.song || null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [results, setResults] = useState<Song[]>(SONGS);
  const [loading, setLoading] = useState(false);
  const [noCredentials, setNoCredentials] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const search = async (query: string) => {
    if (query.trim().length < 2) {
      setResults(SONGS);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.error === "missing_credentials") {
        setNoCredentials(true);
        setResults(
          SONGS.filter((s) =>
            (s.title + s.artist).toLowerCase().includes(query.toLowerCase())
          )
        );
        return;
      }

      setNoCredentials(false);
      setResults(data.results || []);
    } catch {
      setResults(
        SONGS.filter((s) =>
          (s.title + s.artist).toLowerCase().includes(query.toLowerCase())
        )
      );
    } finally {
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

  const list = q.trim().length < 2
    ? SONGS.filter((s) =>
        (s.title + s.artist).toLowerCase().includes(q.toLowerCase())
      )
    : results;

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
              borderTopColor: "#1DB954",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              display: "inline-block",
            }} />
          )}
        </div>

        {noCredentials && (
          <div style={{
            margin: "0 0 8px", padding: "8px 12px",
            background: "rgba(255,69,58,.12)", borderRadius: 8,
            fontSize: 11, color: "#FF453A", lineHeight: 1.5,
          }}>
            Add <strong>SPOTIFY_CLIENT_ID</strong> &amp; <strong>SPOTIFY_CLIENT_SECRET</strong> to <code>.env.local</code> for full Spotify search.
          </div>
        )}

        <div className="song-list">
          {list.length === 0 && !loading && (
            <div style={{ textAlign: "center", opacity: 0.4, padding: "24px 0", fontSize: 13 }}>
              No results
            </div>
          )}
          {list.map((s, i) => {
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
                  <div className="a">
                    {s.artist}
                    {hasPreview ? " · preview" : ""}
                  </div>
                  {playing === i && (
                    <div className="mini-bar"><i /></div>
                  )}
                </div>
                <span className={`song-pick${on ? " on" : ""}`}>
                  {on ? ICON.check : ICON.plus}
                </span>
              </div>
            );
          })}
        </div>
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
