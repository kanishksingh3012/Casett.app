"use client";

import { useState, useEffect } from "react";
import { ICON } from "@/components/ui/icons";
import Cassette from "@/components/cassette";
import { FRESH_TAPE } from "@/lib/data";

interface HomeScreenProps {
  onNew: () => void;
}

const MARQUEE = "a voice  ·  one song  ·  a moment held still  ·  ";

const HERO_TAPE = {
  ...FRESH_TAPE(),
  title: "for you",
  shell: "amber",
};

export default function HomeScreen({ onNew }: HomeScreenProps) {
  const [spin, setSpin] = useState(false);

  // gentle idle spin pulse so the hero feels alive
  useEffect(() => {
    setSpin(true);
    const id = setInterval(() => setSpin((s) => !s), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home2">
      <div className="home2-glow" />

      <header className="home2-top">
        <span className="home2-mark">
          <span className="home2-dot" /> CASETT
        </span>
        <span className="home2-est">est. for people you love</span>
      </header>

      <div className="home2-marquee" aria-hidden>
        <div className="home2-marquee-track">
          {MARQUEE.repeat(4)}
        </div>
      </div>

      <div className="home2-stage">
        <Cassette tape={HERO_TAPE} side="A" spin={spin} showStickers />
      </div>

      <div className="home2-copy">
        <h1 className="home2-h1">
          Make a tape<span className="home2-accent">.</span>
        </h1>
        <p className="home2-sub">
          Record your voice, pin one song to it,
          <br />
          and send a memory that actually plays.
        </p>
      </div>

      <div className="home2-foot">
        <button className="home2-cta" onClick={onNew}>
          <span className="home2-cta-dot" />
          <span>Press record</span>
          <span className="home2-cta-arrow">{ICON.plus}</span>
        </button>
        <div className="home2-hint">no app needed on their end ✦</div>
      </div>
    </div>
  );
}
