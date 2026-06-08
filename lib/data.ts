import type { Shell, Font, Song } from "./types";

export const SHELLS: Shell[] = [
  { key: "graphite", name: "Graphite", hex: "#3A3A42", sa: "#44444c", sb: "#2b2b30", sc: "#1c1c20", pr: "#ececed", ac: "#9a9aa3" },
  { key: "cocoa",    name: "Cocoa",    hex: "#5C3A24", sa: "#6e4a30", sb: "#523320", sc: "#38210f", pr: "#f3e6d6", ac: "#e0a35a" },
  { key: "bone",     name: "Bone",     hex: "#F4F4F2", sa: "#ffffff", sb: "#f1f0ea", sc: "#dcd8ce", pr: "#33332f", ac: "#d98a1e" },
  { key: "violet",   name: "Violet",   hex: "#7B2FBE", sa: "#8e44d0", sb: "#6f29ab", sc: "#4c1c78", pr: "#f3e9ff", ac: "#e070c8" },
  { key: "marine",   name: "Marine",   hex: "#16607A", sa: "#1d7596", sb: "#155b73", sc: "#0d3f50", pr: "#e6f6ff", ac: "#3ec8e6" },
  { key: "forest",   name: "Forest",   hex: "#1F7A5E", sa: "#259170", sb: "#1c7057", sc: "#114a39", pr: "#eafff4", ac: "#f2d23a" },
  { key: "rose",     name: "Rose",     hex: "#A83B6B", sa: "#c0497e", sb: "#9a3460", sc: "#6e2444", pr: "#ffe9f2", ac: "#ff6a6a" },
  { key: "amber",    name: "Amber",    hex: "#E8A030", sa: "#f2b850", sb: "#dd8f24", sc: "#a86314", pr: "#3a2208", ac: "#c0392b" },
];

export const shellOf = (key: string): Shell =>
  SHELLS.find((s) => s.key === key) ?? SHELLS[0];

export const FONTS: Font[] = [
  { name: "Reenie Beanie",      css: "'Reenie Beanie', cursive",      mult: 1.0 },
  { name: "Shadows Into Light", css: "'Shadows Into Light', cursive", mult: 0.74 },
  { name: "Caveat",             css: "'Caveat', cursive",             mult: 0.92, weight: 600 },
  { name: "Gloria Hallelujah",  css: "'Gloria Hallelujah', cursive",  mult: 0.66 },
  { name: "Patrick Hand",       css: "'Patrick Hand', cursive",       mult: 0.78 },
];

export const fontOf = (name: string): Font =>
  FONTS.find((f) => f.name === name) ?? FONTS[0];

export const STICKER_SVG: Record<string, string> = {
  heart:   '<path d="M12 20.6C12 20.6 3.4 14.5 3.4 8.7C3.4 6 5.6 4 8.1 4C10 4 11.4 5.1 12 6.4C12.6 5.1 14 4 15.9 4C18.4 4 20.6 6 20.6 8.7C20.6 14.5 12 20.6 12 20.6Z" fill="#FF566E" stroke="#C32f45" stroke-width="1.3"/>',
  moon:    '<path d="M15.6 3.2A8.6 8.6 0 1 0 21 14.8A6.7 6.7 0 0 1 15.6 3.2Z" fill="#F2D23A" stroke="#C79A12" stroke-width="1.3" stroke-linejoin="round"/>',
  sun:     '<circle cx="12" cy="12" r="4.4" fill="#F5A623" stroke="#C77F12" stroke-width="1.3"/><g stroke="#F5A623" stroke-width="2.1" stroke-linecap="round"><line x1="12" y1="2.6" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.4"/><line x1="2.6" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.4" y2="12"/><line x1="5.3" y1="5.3" x2="7" y2="7"/><line x1="17" y1="17" x2="18.7" y2="18.7"/><line x1="18.7" y1="5.3" x2="17" y2="7"/><line x1="7" y1="17" x2="5.3" y2="18.7"/></g>',
  flower:  '<g stroke="#C84f86" stroke-width="1.2"><ellipse cx="12" cy="6.5" rx="2.5" ry="3.6" fill="#FF8FB3"/><ellipse cx="12" cy="17.5" rx="2.5" ry="3.6" fill="#FF8FB3"/><ellipse cx="6.5" cy="12" rx="3.6" ry="2.5" fill="#FF8FB3"/><ellipse cx="17.5" cy="12" rx="3.6" ry="2.5" fill="#FF8FB3"/></g><circle cx="12" cy="12" r="2.8" fill="#F2D23A" stroke="#C79A12" stroke-width="1.2"/>',
  star:    '<path d="M12 2.6l2.5 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16l-5.4 3.2 1.4-6.1L3.3 8.9l6.2-.6z" fill="#FFCE3A" stroke="#D9A21a" stroke-width="1.3" stroke-linejoin="round"/>',
  cloud:   '<path d="M7.5 18A4 4 0 0 1 7 10.1A5 5 0 0 1 16.4 9.2A4.2 4.2 0 0 1 16.5 18Z" fill="#9CCBFF" stroke="#4F8FD6" stroke-width="1.3" stroke-linejoin="round"/>',
  bolt:    '<path d="M13 2.2 4.6 13.4H10l-1.2 8.4L19 9.6h-5.6z" fill="#FFD23A" stroke="#D9A21a" stroke-width="1.3" stroke-linejoin="round"/>',
  note:    '<g fill="#6AA9FF" stroke="#3E73C8" stroke-width="1.2"><path d="M9.2 17.5V6.2l8-1.7v10.4" fill="none" stroke-width="2"/><ellipse cx="7" cy="17.6" rx="2.6" ry="2.2"/><ellipse cx="15" cy="15.8" rx="2.6" ry="2.2"/></g>',
  smiley:  '<circle cx="12" cy="12" r="9" fill="#FFCE3A" stroke="#D9A21a" stroke-width="1.3"/><circle cx="9" cy="10.5" r="1.2" fill="#7A5410"/><circle cx="15" cy="10.5" r="1.2" fill="#7A5410"/><path d="M8 14.5a4 4 0 0 0 8 0" fill="none" stroke="#7A5410" stroke-width="1.6" stroke-linecap="round"/>',
  sparkle: '<path d="M12 2.4c.6 5 1.7 7.7 8 9.6-6.3 1.9-7.4 4.6-8 9.6-.6-5-1.7-7.7-8-9.6 6.3-1.9 7.4-4.6 8-9.6z" fill="#E6D2FF" stroke="#9B7BD6" stroke-width="1.3" stroke-linejoin="round"/>',
};

export const STICKER_KEYS = Object.keys(STICKER_SVG);

export const SONGS: Song[] = [
  { title: "Dreams",                 artist: "Fleetwood Mac",    a: "#7b5cff", b: "#2a1a6a" },
  { title: "This Must Be the Place", artist: "Talking Heads",    a: "#ff8f6a", b: "#7a2a1a" },
  { title: "Linger",                 artist: "The Cranberries",  a: "#3ec8a0", b: "#114a39" },
  { title: "Just Like Heaven",       artist: "The Cure",         a: "#6aa9ff", b: "#16315a" },
  { title: "Cherry-coloured Funk",   artist: "Cocteau Twins",    a: "#ff6aa9", b: "#5a1a3a" },
  { title: "Pink Moon",              artist: "Nick Drake",       a: "#f2b850", b: "#6a4a14" },
];

export const FRESH_TAPE = (): import("./types").Tape => ({
  title: "",
  from: "",
  shell: "graphite",
  noteFont: "Reenie Beanie",
  stickers: [],
  hasVoice: false,
  voiceLen: 0,
  song: null,
});

export const SEED_LIB: import("./types").Tape[] = [
  {
    title: "our long drive home",
    from: "Maya",
    dir: "sent",
    when: "2d",
    shell: "amber",
    noteFont: "Reenie Beanie",
    stickers: [{ key: "heart", top: 8, left: 78, size: 30, rot: 12 }],
    song: { title: "Dreams", artist: "Fleetwood Mac", a: "#7b5cff", b: "#2a1a6a" },
    hasVoice: true,
    voiceLen: 72,
  },
  {
    title: "happy birthday dad",
    from: "Dad",
    dir: "received",
    when: "5d",
    shell: "marine",
    noteFont: "Caveat",
    stickers: [{ key: "star", top: 10, left: 80, size: 26, rot: -10 }],
    song: { title: "Pink Moon", artist: "Nick Drake", a: "#f2b850", b: "#6a4a14" },
    hasVoice: true,
    voiceLen: 45,
  },
];
