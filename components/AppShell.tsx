"use client";

import { useState, useEffect } from "react";
import type { Tape } from "@/lib/types";
import { FRESH_TAPE } from "@/lib/data";

import HomeScreen from "@/components/screens/HomeScreen";
import NewTapeScreen from "@/components/screens/NewTapeScreen";
import RecordScreen from "@/components/screens/RecordScreen";
import AddSongScreen from "@/components/screens/AddSongScreen";
import CustomizeScreen from "@/components/screens/CustomizeScreen";
import ShareScreen from "@/components/screens/ShareScreen";

type Screen = "home" | "new" | "record" | "song" | "customize" | "share";
const VALID_SCREENS: Screen[] = ["home", "new", "record", "song", "customize", "share"];

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tape, setTape] = useState<Tape>(FRESH_TAPE());
  const [trans, setTrans] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cz_screen") as Screen | null;
      if (saved && VALID_SCREENS.includes(saved)) setScreen(saved);
    } catch {}
    try {
      const savedTape = localStorage.getItem("cz_tape");
      if (savedTape) setTape(JSON.parse(savedTape));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("cz_screen", screen); } catch {}
  }, [screen, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("cz_tape", JSON.stringify(tape)); } catch {}
  }, [tape, hydrated]);

  const go = (s: Screen) => {
    setTrans("out");
    setTimeout(() => {
      setScreen(s);
      setTrans("in");
      setTimeout(() => setTrans(""), 20);
    }, 140);
  };

  const set = (patch: Partial<Tape>) => setTape((t) => ({ ...t, ...patch }));

  const startNew = () => {
    setTape(FRESH_TAPE());
    go("new");
  };

  let body: React.ReactNode = null;

  if (screen === "home") {
    body = <HomeScreen onNew={startNew} />;
  } else if (screen === "new") {
    body = (
      <NewTapeScreen tape={tape} set={set} onBack={() => go("home")} onNext={() => go("record")} />
    );
  } else if (screen === "record") {
    body = (
      <RecordScreen tape={tape} set={set} onBack={() => go("new")} onNext={() => go("song")} />
    );
  } else if (screen === "song") {
    body = (
      <AddSongScreen tape={tape} set={set} onBack={() => go("record")} onNext={() => go("customize")} />
    );
  } else if (screen === "customize") {
    body = (
      <CustomizeScreen tape={tape} set={set} onBack={() => go("song")} onNext={() => go("share")} />
    );
  } else if (screen === "share") {
    body = (
      <ShareScreen
        tape={tape}
        onBack={() => go("customize")}
        onDone={() => { setTape(FRESH_TAPE()); go("home"); }}
      />
    );
  }

  return (
    <div className="casett-app">
      <div className={`screen-slot${trans ? ` ${trans}` : ""}`}>
        {body}
      </div>
    </div>
  );
}
