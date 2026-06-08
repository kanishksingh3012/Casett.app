"use client";

import { ICON } from "./icons";

interface TabBarProps {
  active: "home" | "library";
  go: (screen: string) => void;
}

export default function TabBar({ active, go }: TabBarProps) {
  return (
    <div className="tabbar">
      <button className={`ti${active === "home" ? " on" : ""}`} onClick={() => go("home")}>
        {ICON.home}
        <span>Home</span>
      </button>
      <button className={`ti${active === "library" ? " on" : ""}`} onClick={() => go("library")}>
        {ICON.lib}
        <span>Library</span>
      </button>
    </div>
  );
}
