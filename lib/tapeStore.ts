import type { Tape } from "./types";
import { supabase } from "./supabase";

export async function uploadVoiceBlob(blob: Blob): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");
  const ext = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "m4a" : "webm";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("voices")
    .upload(filename, blob, { contentType: blob.type });
  if (error) throw error;
  const { data } = supabase.storage.from("voices").getPublicUrl(filename);
  return data.publicUrl;
}

export async function saveTape(tape: Tape): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");

  let voiceUrl = tape.voiceUrl;
  // blob: URLs would fail on iOS Safari — RecordScreen should upload before reaching here
  // but if somehow a blob URL slips through on desktop, handle it gracefully
  if (voiceUrl?.startsWith("blob:")) {
    try {
      const res = await fetch(voiceUrl);
      const blob = await res.blob();
      voiceUrl = await uploadVoiceBlob(blob);
    } catch {
      voiceUrl = undefined;
    }
  }

  const { data, error } = await supabase
    .from("tapes")
    .insert({ data: { ...tape, voiceUrl } })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function loadTapeById(id: string): Promise<Tape | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("tapes")
    .select("data")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data.data as Tape;
}
