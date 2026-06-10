import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q || q.trim().length < 2) return Response.json([]);

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=25`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return Response.json(data.results ?? []);
  } catch {
    return Response.json([]);
  }
}
