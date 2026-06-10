import { createClient } from "@supabase/supabase-js";
import type { Tape } from "@/lib/types";
import StandalonePlayer from "@/components/StandalonePlayer";

export default async function PlayIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let tape: Tape | null = null;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("tapes")
      .select("data")
      .eq("id", id)
      .single();
    tape = (data?.data as Tape) ?? null;
  } catch {}

  return <StandalonePlayer initialTape={tape} />;
}
