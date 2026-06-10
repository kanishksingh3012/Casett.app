import { NextRequest, NextResponse } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";
const DEEZER_URL = "https://api.deezer.com/search";

let cached: { token: string; exp: number } | null = null;

async function getSpotifyToken() {
  if (cached && Date.now() < cached.exp) return cached.token;
  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${creds}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Spotify token failed");
  cached = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) return NextResponse.json({ results: [] });

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ error: "missing_credentials", results: [] });
  }

  try {
    // Run Spotify search and Deezer search in parallel
    const [spotifyRes, deezerRes] = await Promise.allSettled([
      getSpotifyToken().then((token) =>
        fetch(`${SEARCH_URL}?q=${encodeURIComponent(q)}&type=track&limit=25&market=US`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      ),
      fetch(`${DEEZER_URL}?q=${encodeURIComponent(q)}&limit=30`).then((r) => r.json()),
    ]);

    const spotifyTracks =
      spotifyRes.status === "fulfilled" ? spotifyRes.value.tracks?.items || [] : [];

    // Build a lookup of Deezer previews keyed by normalized title+artist
    const deezerMap = new Map<string, string>();
    if (deezerRes.status === "fulfilled") {
      for (const d of deezerRes.value.data || []) {
        if (d.preview) {
          deezerMap.set(norm(d.title) + norm(d.artist?.name ?? ""), d.preview);
          deezerMap.set(norm(d.title), d.preview);
        }
      }
    }

    const results = spotifyTracks.map((t: Record<string, unknown>) => {
      const album = t.album as Record<string, unknown>;
      const images = album?.images as Array<{ url: string }> ?? [];
      const artists = (t.artists as Array<{ name: string }>).map((a) => a.name).join(", ");

      // Prefer Spotify preview, fall back to Deezer match
      const spotifyPreview = t.preview_url as string | null;
      const deezerPreview =
        deezerMap.get(norm(t.name as string) + norm(artists)) ||
        deezerMap.get(norm(t.name as string)) ||
        null;

      return {
        title: t.name,
        artist: artists,
        artworkUrl: images[1]?.url || images[0]?.url || null,
        previewUrl: spotifyPreview || deezerPreview,
        a: "#1DB954",
        b: "#121212",
      };
    });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "search_failed", results: [] }, { status: 500 });
  }
}
