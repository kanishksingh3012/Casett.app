import type { Tape } from "./types";
import { supabase } from "./supabase";

async function uploadVoice(blobUrl: string): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  const ext = blob.type.includes("ogg") ? "ogg" : "webm";
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
  if (voiceUrl?.startsWith("blob:")) {
    voiceUrl = await uploadVoice(voiceUrl);
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
