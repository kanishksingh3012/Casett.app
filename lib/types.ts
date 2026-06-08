export interface Shell {
  key: string;
  name: string;
  hex: string;
  sa: string;
  sb: string;
  sc: string;
  pr: string;
  ac: string;
}

export interface Font {
  name: string;
  css: string;
  mult: number;
  weight?: number;
}

export interface StickerPlacement {
  key: string;
  top: number;   // percent
  left: number;  // percent
  size: number;
  rot: number;
}

export interface Song {
  title: string;
  artist: string;
  a: string;
  b: string;
}

export interface Tape {
  title: string;
  from: string;
  shell: string;
  noteFont: string;
  stickers: StickerPlacement[];
  hasVoice: boolean;
  voiceLen: number;
  song: Song | null;
  dir?: "sent" | "received";
  when?: string;
}
