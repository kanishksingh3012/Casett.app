"use client";

import { useState, useEffect, useRef } from "react";
import type { Tape } from "@/lib/types";
import { FRESH_TAPE, SEED_LIB } from "@/lib/data";

import HomeScreen from "@/components/screens/HomeScreen";
import NewTapeScreen from "@/components/screens/NewTapeScreen";
import RecordScreen from "@/components/screens/RecordScreen";
import AddSongScreen from "@/components/screens/AddSongScreen";
import CustomizeScreen from "@/components/screens/CustomizeScreen";
import ShareScreen from "@/components/screens/ShareScreen";
import AppPlayerScreen from "@/components/screens/AppPlayerScreen";
import WebPlayerScreen from "@/components/screens/WebPlayerScreen";
import LibraryScreen from "@/components/screens/LibraryScreen";

type Screen =
  | "home"
  | "new"
  | "record"
  | "song"
  | "customize"
  | "share"
  | "app-player"
  | "player"
  | "library";

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tape, setTape] = useState<Tape>(FRESH_TAPE());
  const [lib, setLib] = useState<Tape[]>(SEED_LIB);
  const [viewing, setViewing] = useState<Tape | null>(null);
  const [trans, setTrans] = useState("");
  const deviceRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const savedScreen = localStorage.getItem("cz_screen") as Screen | null;
      if (savedScreen) setScreen(savedScreen);
    } catch {}
    try {
      const savedTape = localStorage.getItem("cz_tape");
      if (savedTape) setTape(JSON.parse(savedTape));
    } catch {}
    try {
      const savedLib = localStorage.getItem("cz_lib");
      if (savedLib) setLib(JSON.parse(savedLib));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("cz_screen", screen); } catch {}
  }, [screen, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("cz_tape", JSON.stringify(tape)); } catch {}
  }, [tape, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("cz_lib", JSON.stringify(lib)); } catch {}
  }, [lib, hydrated]);

  // Fit device to window
  useEffect(() => {
    const fit = () => {
      const device = deviceRef.current;
      if (!device) return;
      const s = Math.min(
        1,
        (window.innerHeight - 40) / 844,
        (window.innerWidth - 24) / 392
      );
      device.style.transform = `scale(${s})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  const go = (s: string) => {
    setTrans("out");
    setTimeout(() => {
      setScreen(s as Screen);
      setTrans("in");
      setTimeout(() => setTrans(""), 20);
    }, 140);
  };

  const set = (patch: Partial<Tape>) => {
    setTape((t) => ({ ...t, ...patch }));
  };

  const startNew = () => {
    setTape(FRESH_TAPE());
    go("new");
  };

  const openTape = (t: Tape) => {
    setViewing(t);
    go("app-player");
  };

  const saveTape = () => {
    const rec: Tape = { ...tape, dir: "sent", when: "now" };
    setLib((l) => [rec, ...l]);
    setTape(FRESH_TAPE());
    go("home");
  };

  let body: React.ReactNode = null;

  if (screen === "home") {
    body = (
      <HomeScreen lib={lib} onNew={startNew} onOpen={openTape} go={go} />
    );
  } else if (screen === "new") {
    body = (
      <NewTapeScreen
        tape={tape}
        set={set}
        onBack={() => go("home")}
        onNext={() => go("record")}
      />
    );
  } else if (screen === "record") {
    body = (
      <RecordScreen
        tape={tape}
        set={set}
        onBack={() => go("new")}
        onNext={() => go("song")}
      />
    );
  } else if (screen === "song") {
    body = (
      <AddSongScreen
        tape={tape}
        set={set}
        onBack={() => go("record")}
        onNext={() => go("customize")}
      />
    );
  } else if (screen === "customize") {
    body = (
      <CustomizeScreen
        tape={tape}
        set={set}
        onBack={() => go("song")}
        onNext={() => go("share")}
      />
    );
  } else if (screen === "share") {
    body = (
      <ShareScreen
        tape={tape}
        onBack={() => go("customize")}
        onSave={saveTape}
      />
    );
  } else if (screen === "app-player") {
    body = (
      <AppPlayerScreen
        tape={viewing || tape}
        onBack={() => go(lib.length ? "library" : "home")}
        onShare={() => go("player")}
      />
    );
  } else if (screen === "player") {
    body = (
      <WebPlayerScreen
        tape={viewing || tape}
        onClose={() => go("app-player")}
      />
    );
  } else if (screen === "library") {
    body = (
      <LibraryScreen lib={lib} onOpen={openTape} go={go} />
    );
  }

  return (
    <div className="room">
      <div className="device" ref={deviceRef}>
        <div className="screen-host">
          <div className="island" />
          <div className={`screen-slot${trans ? ` ${trans}` : ""}`}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}
