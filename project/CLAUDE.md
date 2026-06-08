# Cassette — Project Preferences

Persistent decisions for the Casett audio-message app. Honor these in all work.

## Locked preferences
- **Platform:** iOS (targeting iOS 26 / Liquid Glass design language).
- **UI direction:** **Liquid Glass** (translucent frosted chrome, floating elements) — NOT the skeuomorphic variation.
- **Cassette design:** **Smoky Hi-Fi** (charcoal translucent shell, white index-card label, blue-ballpoint handwriting) — this is the chosen hero cassette.
- **Theme / mode:** **Dark mode**, modern + minimal, clean and sleek. Near-black matte panels, generous negative space, hairline borders, soft elevation. (Reference: uploads/pasted-1780818870719-0.png — Customization Deck + transport keys + LCD.)

## App name & domain
- **App name:** Casett (single 't' — intentional).
- **Domain:** casett.app — use as placeholder everywhere. Share links: `casett.app/t/[id]`.
- **No auth in this version.** Core loop (create → share → receive) works without an account. Library = localStorage only. Shared tapes live on the server permanently via their link regardless of device.

## Product model
- Personal **audio-message** app, not a mixtape app. Side A = voice (≤0:90), Side B = one song (Spotify 30s preview).
- **No Seal.** Sender name in cassette header. Label = 4–5 word title only.
- Web-first recipient player. One-action Home. Library = sent + received (localStorage only).

## Approved (Theme Preview, dark)
- **Studio Dark + Liquid Glass direction is APPROVED** as the app's look.
- **Transport controls must be original** — dark Liquid-Glass circular buttons (amber primary PLAY, red REC), NOT the reference's white keycaps. Never copy the inspiration image's button style.
- **Customization = shell color + note font + doodle stickers.** No "Shell Type" or "Pen Style" controls.
- **Keep full Smoky Hi-Fi cassette detail** at all times: top-area fine spec text, the two tape strips holding the paper, the paper rule line + small paper details (NR/ON-OFF, SIDE A), the lower ridged "grill" with capstan notch + holes, and the A-side badge. Do not flatten the cassette.
- **Paper slip shows only the handwritten tape title** — no NR/ON-OFF, no SIDE A on the paper itself.
- **Both sides (A & B) of the cassette label use the same user-selected note font** (Reenie Beanie default). Never hardcode a different font for Side B.

## Type & color system (dark, modern-minimal)
- Display/UI labels: **Space Grotesk** (uppercase, tracked). Body: **DM Sans**. LCD/mono: **JetBrains Mono**. Label handwriting: **Reenie Beanie** (blue ballpoint) — CHOSEN DEFAULT for the tape note. (Other options in Note Fonts.html: Shadows Into Light, Caveat, Gloria Hallelujah, Patrick Hand.)
- Surfaces: bg #0B0B0C · panel #161618 · panel-2 #1E1E21 · glass rgba(255,255,255,.06)+blur · hairline rgba(255,255,255,.08).
- Text: #F4F4F2 / #9A9AA0 / #65656B.
- Accent: amber **#E8A030** (primary highlight). Record/destructive only: **#FF453A**. Shell-color swatches are a curated jewel-tone palette (content, not brand).

## Cassette details (refined)
- Paper slip / index card shows **only the handwritten tape title** — no NR/ON-OFF, no SIDE A text on the paper. (Side letter still lives on the shell's printed strip + A-badge, not the paper.)
- **8 shell colors** (each a vintage-label theme, see Mixtape Themes.html): Graphite #3A3A42 · **Cocoa Brown #5C3A24** (replaced Onyx — too close to Graphite) · Bone White #F4F4F2 · Violet #7B2FBE · Marine #16607A · Forest #1F7A5E · Rose #A83B6B · Amber #E8A030. **White IS a shell color.**
- Note handwriting font is user-selectable; **Reenie Beanie is the default**.
- **Doodle stickers** (see Doodle Stickers.html): die-cut marker doodles — heart, moon, sun, flower, star, cloud, bolt, music note, smiley, sparkle — draggable onto label or shell, free rotate/scale.
- **Customize step = shell color + note font + doodle stickers.**

## Player screens (two distinct experiences)
- **In-app player** (opening a tape from Home or Library): native iOS UI — status bar, back button, full-width cassette hero, waveform + live countdown timestamp, Voice/Song indicators (amber text when active, no pill background), reels spin on play. No browser chrome.
- **Web player** (recipient opens shared link, or Share screen preview): browser URL bar + dismissible Smart App Banner + "Save to Library" CTA. This is the only place browser chrome appears.
- **Timestamp in player** counts up live from `0:00`; resets on Rew or Flip. Auto-stops at end of side.
- **Side indicator** = "● Voice" / "● Song" — active side in amber text only, no pill or background.
- **Home tape cards**: small colored cassette icon (shell color), title, ♪ song · artist, date. No To/From row.

## Library screen
- **Unified keepsake shelf** — sent + received tapes together in a 2-column grid.
- Cards are **equal size** (fixed aspect-ratio). Direction shown as **↗ (amber = sent)** / **↙ (teal = received)** icon, not text.
- **No sync/sign-in banner** — auth is out of scope for this version.

## Flow (9 screens)
1. Home (empty) → one centered (+)
2. Home (filled) → recent tapes list + FAB
3. New Tape → title + from name
4. Record · Side A → waveform, 0:90 cap, live LCD
5. Add Song · Side B → search + pick one song
6. Customize → shell color + note font + drag-drop stickers
7. Share + Save → casett.app/t/[id] link + save
8. App Player → in-app, full-width cassette, flip, live timestamp
9. Web Player → browser chrome, Smart App Banner, no download wall
10. Library → 2-col grid, equal cards, direction icons

## Flow note
- Record (Side A) → Add song (Side B) → Customize are SEPARATE steps. Theme Preview composites them on one frame for presentation only.
