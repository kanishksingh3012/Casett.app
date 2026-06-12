# Casett — Product & Technical Spec

> A pocket cassette studio. Record your voice, pin one song to it, and send a
> link that plays a real "tape" on any device — no app needed on the other end.

- **Status:** Live (deployed on Vercel)
- **Last updated:** 2026-06-12
- **Repo:** `kanishksingh3012/Casett.app`
- **Branches:** `main` (production → Vercel) · `clean-main` (working branch)

---

## 1. Product overview

Casett turns a short personal message into a keepsake **cassette tape**. The
sender steps through a guided 5-step flow to title the tape, record up to 90s
of voice (Side A), attach one song (Side B), customize the cassette's look,
and get a shareable link. The recipient opens that link in any browser and
plays an interactive, flippable cassette — Side A is the voice, Side B is the
song preview.

### Core promise
- **Personal:** your actual voice, not text.
- **Curated:** exactly one song — a deliberate choice, not a playlist.
- **Frictionless to receive:** opens as a web player, nothing to install.
- **Tangible:** the artifact looks and behaves like a physical tape.

### Non-goals (intentionally out of scope)
- Accounts / login / user profiles.
- A library or feed of past tapes (removed — see Decision Log D-2).
- Multi-song mixtapes.
- Native mobile apps.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, React 19 |
| Rendering | Client components for the studio; **server component** for `/play/[id]` |
| Styling | Single global stylesheet (`app/globals.css`) + one CSS module for the cassette |
| Backend | Supabase (Postgres + Storage) |
| Audio capture | `MediaRecorder` Web API |
| Song data | iTunes Search API (proxied) |
| Hosting | Vercel (auto-deploy on push to `main`) |

Dependencies are deliberately minimal: `next`, `react`, `react-dom`,
`@supabase/supabase-js`. No UI kit, no state library.

---

## 3. Architecture

### 3.1 App structure

```
app/
  layout.tsx            # fonts, root html
  page.tsx              # mounts <AppShell /> (the studio)
  globals.css           # all studio + player styles + design tokens
  play/page.tsx         # legacy player: reads ?t=<encoded tape>
  play/[id]/page.tsx    # primary player: server-fetches tape by id from Supabase
  api/itunes/route.ts   # proxy to iTunes Search (iOS-safe song search)
  api/spotify/search/   # unused legacy route (kept for reference)

components/
  AppShell.tsx          # studio state machine + screen router
  StandalonePlayer.tsx  # the recipient's flippable cassette player
  screens/              # the 5 studio steps + home
  cassette/             # Cassette, FlipCassette, Reel (the tape visual)
  ui/                   # TopBar, Stepper, LCD, Waveform, icons, etc.

lib/
  types.ts              # Tape, Song, Shell, Font, StickerPlacement
  data.ts               # SHELLS, FONTS, STICKER_SVG, FRESH_TAPE()
  share.ts              # encodeTape / decodeTape (URL fallback)
  supabase.ts           # browser Supabase client (anon)
  tapeStore.ts          # saveTape, uploadVoiceBlob, loadTapeById
```

### 3.2 The studio is a client-side state machine

`AppShell.tsx` holds two pieces of state — the current `screen` and the
working `tape` — and routes between six screens. There is no router
navigation between steps; it's a single mounted component swapping bodies
with a short fade transition (`go()` sets an "out"/"in" class).

```
Screen = "home" | "new" | "record" | "song" | "customize" | "share"
```

**Draft persistence:** the current `screen` and `tape` are mirrored to
`localStorage` (`cz_screen`, `cz_tape`) on every change, and restored on
mount after a `hydrated` guard. A refresh mid-flow resumes where you left off.

### 3.3 The flow

```
HOME ──Make a tape──▶ NEW ──▶ RECORD ──▶ SONG ──▶ CUSTOMIZE ──▶ SHARE
 ▲                    (1/5)    (2/5)      (3/5)     (4/5)        (5/5)
 └──────────────────── "Make another tape" (resets to FRESH_TAPE) ──┘
```

---

## 4. Data model

```ts
interface Tape {
  title: string;                 // 4–5 words, max 28 chars
  from: string;                  // sender name, max 16 chars
  shell: string;                 // shell key (e.g. "amber")
  noteFont: string;              // handwriting font name
  stickers: StickerPlacement[];  // decals placed on the shell
  hasVoice: boolean;
  voiceLen: number;              // seconds (0–90)
  voiceUrl?: string;             // https:// Supabase URL once uploaded
  song: Song | null;            // one song, or null
  dir?: "sent" | "received";    // legacy, unused in current flow
  when?: string;                // legacy, unused
}

interface Song {
  title: string; artist: string;
  a: string; b: string;          // gradient fallback colors
  previewUrl?: string;           // iTunes 30s preview (works cross-device)
  artworkUrl?: string;           // 60x60 album art
}
```

**Persistence shapes:**
- **In Supabase `tapes` table:** the whole `Tape` object is stored as a JSON
  blob in a `data` column; the row's `id` (uuid) is the short-link key.
- **Voice audio:** uploaded to Supabase Storage bucket `voices`; the public
  URL is written into `tape.voiceUrl` before the tape row is saved.

---

## 5. Screen-by-screen spec

### 5.1 Home (`HomeScreen.tsx`) — redesigned
Distinctive tape-deck hero (deliberately *not* a generic app landing):
- Pulsing `● CASETT` wordmark + "est. for people you love" tag.
- A scrolling marquee strip ("a voice · one song · a moment held still").
- A **tilted, spinning cassette** as the centerpiece (real `<Cassette>` with
  turning reels, pulsing in/out of spin every ~4s).
- Bold headline "Make a tape." + supporting line.
- Pill **Press record** CTA (red REC dot + plus icon).
- All within the 440px app frame.
- **Single action:** `onNew` → resets to a fresh tape and goes to step 1.

### 5.2 New Tape (`NewTapeScreen.tsx`) — step 1/5
- Live cassette preview (no stickers yet).
- Inputs: **Tape title** (≤28 chars) and **Who's it from?** (≤16 chars).
- CTA disabled until a title is entered. → Record.

### 5.3 Record (`RecordScreen.tsx`) — step 2/5
- Cassette spins while recording; LCD shows REC/DONE/READY + timer.
- `MediaRecorder` captures mic audio; **90s hard cap** (auto-stops).
- On stop: builds a `Blob` (mime from the recorded chunks), creates a local
  `blob:` URL for instant playback **and immediately uploads the blob** to
  Supabase Storage in the background (see Decision Log D-6/D-7).
- Re-record and play-back controls.
- **Next is async:** `proceed()` awaits the in-flight upload so the saved tape
  always carries an `https://` voice URL, never a `blob:` URL. Button shows
  "Uploading…" while waiting.
- Can also **skip voice** (song-only tape).

### 5.4 Add Song (`AddSongScreen.tsx`) — step 3/5
- Debounced search (400ms) against `/api/itunes?q=…`.
- **No default/placeholder songs.** Empty state when query < 2 chars:
  "Say it with a song — pick a track that carries the message words can't."
- Shows **max 3 results**. Each row: artwork, title/artist, 30s preview
  play/pause, and a select toggle.
- CTA disabled until a song is selected. → Customize.

### 5.5 Customize (`CustomizeScreen.tsx`) — step 4/5
- Pick the **shell color** (8 options, see `SHELLS`).
- Pick the **handwriting font** for the label (5 options, see `FONTS`).
- Place **stickers** (10 SVG decals — heart, moon, sun, star, etc.).
- Live preview on the cassette. → Share.

### 5.6 Share (`ShareScreen.tsx`) — step 5/5
- On mount (guarded by a ref so it runs once), calls `saveTape(tape)`:
  - If `voiceUrl` is somehow still a `blob:`, it's uploaded as a fallback.
  - Inserts the tape JSON into Supabase, returns the row `id`.
- Builds the share URL:
  - **Primary:** `${origin}/play/${id}` (short link).
  - **Fallback** (if Supabase save fails): `${origin}/play?t=${encodeTape}`.
- **Share link** button uses the native share sheet via `navigator.share()`
  (iOS/Android/macOS), falling back to clipboard copy.
- Shows a "preparing your link…" state while saving; surfaces save errors in a
  debug strip (to be removed once fully stable — see D-8).
- "Make another tape" resets to a fresh tape and returns home.

### 5.7 Player (`StandalonePlayer.tsx` via `/play/[id]`)
- **Server component** (`app/play/[id]/page.tsx`) fetches the tape by id from
  Supabase *before* sending HTML, then hydrates `<StandalonePlayer>`.
- If no `initialTape` prop (the `/play?t=` route), it decodes the tape from the
  `?t=` URL param, then falls back to same-device `localStorage`.
- UI: a `FlipCassette` you can **flip between Side A (Voice) and Side B (Song)**.
  - Side A plays `voiceUrl`; Side B plays the song `previewUrl`.
  - Transport: rewind, play/pause, flip. Waveform + elapsed/total readout.
  - Reels spin while playing.
- Empty state ("No tape found") with a link to make your own.

---

## 6. Sharing & cross-device playback

Two mechanisms, primary + fallback:

### Primary — Supabase short links (`/play/[id]`)
1. `saveTape()` ensures the voice is uploaded (public `https://` URL).
2. The full tape JSON is inserted into the `tapes` table; the row `id` is the
   link key.
3. Recipient opens `/play/{id}`; the server component fetches the row and
   renders the player. Works on any device, link is short.

### Fallback — encoded URL (`/play?t=<base64>`)
- `encodeTape()` serializes the tape to URL-safe base64 (`lib/share.ts`).
- Used only if the Supabase insert fails. **Voice is stripped** in this mode
  (the `blob:` URL is meaningless off-device); the song preview still works.

> **Why both:** the encoded URL guarantees *something* is always shareable even
> if the backend hiccups, while the short link is the clean, voice-carrying
> default.

---

## 7. Backend (Supabase)

### 7.1 Database — `tapes` table
- `id uuid` (primary key, default `gen_random_uuid()`)
- `data jsonb` — the full `Tape` object
- `created_at timestamptz default now()`

**Row Level Security** (anonymous browser access via the anon key):
- `insert` policy `to anon with check (true)` — anyone can create a tape.
- `select` policy `to anon using (true)` — anyone with the id can read it.

> RLS must explicitly target `to anon`; omitting it caused
> "new row violates row-level security policy" (Decision Log D-4).

### 7.2 Storage — `voices` bucket
- **Must be a public bucket** so playback URLs resolve for recipients.
- Policies allow anonymous `insert` (upload) and public read.
- Files: `${timestamp}-${random}.{webm|ogg|m4a}`, content-type from the blob.

### 7.3 `lib/tapeStore.ts` surface
- `uploadVoiceBlob(blob): Promise<string>` — uploads a `Blob` directly (no
  re-fetch), returns the public URL. **This is the iOS-safe path.**
- `saveTape(tape): Promise<string>` — uploads any leftover `blob:` voice, then
  inserts the tape row, returns the id.
- `loadTapeById(id): Promise<Tape | null>` — reads a tape (used as needed).

---

## 8. Design system

### 8.1 Tokens (`app/globals.css` `:root`)
- **Surfaces:** `--bg #0B0B0C`, `--panel #161618`, glass/hairline overlays.
- **Text:** `--t1 #F4F4F2` (primary), `--t2 #9A9AA0`, `--t3 #65656B`.
- **Brand:** `--amber #E8A030` / `--amber-soft #F2B850`; `--rec #FF453A`;
  `--lcd #7FE0A8` (LCD green); `--ink`.
- **Fonts:** Space Grotesk (`--font-ui`), DM Sans (`--font-body`),
  JetBrains Mono (`--font-mono`); handwriting fonts for tape labels.
- Background is a dark radial-gradient wash (warm amber top-right, faint mint
  bottom-left).

### 8.2 Frame
- The whole app renders inside `.casett-app { max-width: 440px; margin: auto }`.
  **No phone frame, status bar, or dynamic island** (all removed — D-1).
- Safe-area insets (`env(safe-area-inset-*)`) handle the iPhone notch.

### 8.3 The cassette (`components/cassette/`)
- `Cassette` renders a shell (colors from `SHELLS`), a handwritten label, two
  spinning `Reel`s, and optional `stickers` (SVG from `STICKER_SVG`).
- `FlipCassette` adds the A/B flip animation for the player.
- 8 shells, 5 label fonts, 10 stickers.

---

## 9. iOS / Safari compatibility (hard-won)

These were the main field bugs and how they're handled:

1. **Song search returned nothing on iPhone.** iOS tracking prevention blocks
   direct browser `fetch()` to `itunes.apple.com`. → Proxy through
   `/api/itunes` (server-side fetch). **Always search via the proxy.**
2. **"Load failed" uploading voice.** iOS Safari restricts `fetch()` of a
   `blob:` URL. → Never re-fetch the blob URL; upload the `Blob` object
   directly via `uploadVoiceBlob()` right after recording.
3. **Voice didn't play for the recipient.** Race condition — the background
   upload hadn't finished when the user advanced, so a `blob:` URL got saved.
   → `proceed()` now awaits the upload before saving.

---

## 10. Decision log

| # | Decision | Rationale |
|---|---|---|
| D-1 | Removed phone frame, status bar, dynamic island | App should feel like a real product, not a mockup in a device shell. |
| D-2 | Removed the Library feature & seed data | Casett is about *sending*, not hoarding a feed. Keeps the flow to one clear path. |
| D-3 | Song search: proxy + 3 results + empty-state prompt, no placeholder songs | iOS compatibility + a calmer, more intentional pick. |
| D-4 | Supabase RLS policies must target `to anon` | Anonymous browser writes/reads need explicit anon policies. |
| D-5 | Short links via Supabase `/play/[id]`, with encoded `?t=` fallback | Short, voice-carrying links by default; never a dead share. |
| D-6 | Upload voice immediately on record-stop, not at share time | Avoids iOS `blob:` re-fetch entirely; link is ready sooner. |
| D-7 | `proceed()` awaits the upload before saving | Guarantees an `https://` voice URL reaches the recipient. |
| D-8 | Keep a debug error strip on Share (temporary) | Surfaces backend failures during stabilization; remove once stable. |
| D-9 | Home screen redesigned to tape-deck hero | Original layout resembled another app; needed a distinct identity. |
| D-10 | `/play/[id]` is a server component | Tape is fetched before HTML delivery — fast, shareable, crawlable. |

---

## 11. Deployment & workflow

- **Production branch:** `main` → Vercel auto-deploys on push.
- **Working branch:** `clean-main`.
- **Release flow:** commit to `clean-main` → `git checkout main` →
  `git merge clean-main` → `git push origin main` (Vercel deploys) →
  back to `clean-main` and push it too.
- Root Directory in Vercel is the **repo root** (the Next.js app is not in a
  subfolder).

### Environment variables (Vercel + local `.env.local`, gitignored)
```
NEXT_PUBLIC_SUPABASE_URL=…        # the project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=…   # anon public key
```
> Secrets live in `.env.local` (gitignored) and Vercel project settings only —
> **never committed**. Adding env vars in Vercel requires a manual redeploy to
> take effect.

---

## 12. Known constraints & follow-ups

- **Recording cap:** 90 seconds, single take.
- **One song**, by design; iTunes 30s preview only (no full tracks).
- **No accounts** → no edit/delete of a sent tape, no "my tapes."
- **`voices` bucket must stay public**, or recipient playback 403s.
- **Cleanup pending:** remove the Share debug error strip (D-8) once the
  backend is proven stable in the field.
- **Legacy files retained** but unused: `app/api/spotify/*`,
  `components/screens/{Library,AppPlayer,WebPlayer}Screen.tsx`,
  `lib/data.ts` `SONGS`/`SEED_LIB`. Safe to prune later.

---

## 13. Glossary

- **Tape** — the keepsake artifact: title, sender, voice (Side A), song
  (Side B), shell, font, stickers.
- **Side A / Side B** — voice vs. song, flipped in the player.
- **Shell** — the cassette's colorway.
- **Short link** — `/play/{id}`, backed by a Supabase row.
- **Studio** — the 5-step sender flow (`AppShell`).
- **Player** — the recipient's read-only flippable cassette.
