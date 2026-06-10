"use client";

import { ICON } from "@/components/ui/icons";

interface HomeScreenProps {
  onNew: () => void;
}

const TAGS = ["birthday", "road trip", "date night", "a first"];

export default function HomeScreen({ onNew }: HomeScreenProps) {
  return (
    <div className="home-screen">
      <div className="home-brand">● Casett</div>
      <h1 className="home-heading">Hey there.</h1>
      <p className="home-tagline">
        Record your voice, add one song,<br />
        send it to someone who matters.
      </p>
      <button className="home-card" onClick={onNew}>
        <div className="home-card-inner">
          <div>
            <div className="home-card-title">Make a tape</div>
            <div className="home-card-desc">Turn a moment into a memory</div>
          </div>
          <span className="home-card-fab">{ICON.plus}</span>
        </div>
      </button>
      <div className="home-tags">
        {TAGS.map((t) => (
          <span key={t} className="home-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
