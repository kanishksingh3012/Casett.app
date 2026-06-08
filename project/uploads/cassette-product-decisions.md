# Cassette — Product Decisions

Consolidated answers to the design critique. These decisions override anything in earlier documents where they conflict.

---

## What this product actually is

This is not a mixtape app. It is a personal audio message app using cassette tape aesthetics. The cassette is the vessel, not the content. The core experience is: record your voice, attach one song that represents the feeling, give it a short title, customize the shell, send it. The recipient receives a beautiful cassette that plays your voice and your chosen song. The word "mixtape" is a reference point for the aesthetic, not the functionality.

---

## Audio — no silent tapes

Spotify's Search API returns a `preview_url` on every track — a free 30-second MP3 with no OAuth, no login, and no paywall required on either end. This is used as the audio source for every attached song. The creator searches a track, attaches it, and the recipient hears a 30-second preview clip when they open Side B. No streaming account required from anyone. This is a day-one feature, not a later version.

---

## Side A and Side B

Side A holds the voice note. Side B holds the song. When the tape is playing, Side A plays first — the creator's voice — then the recipient flips the cassette to Side B to hear the song. This is the complete message: voice first, song second.

If the creator does not record a voice note, the song automatically moves to Side A. Side B is blank. The flip affordance is hidden entirely — the cassette behaves as a single-sided tape. There is no empty Side B to confuse the recipient.

Voice note length is capped at 90 seconds. This is long enough for a genuine message and short enough to force conciseness. It is a hard limit enforced in the recording UI.

---

## Sender identity — no Seal

The Seal feature is removed from the product entirely. The voice note already carries the sender's identity — the recipient hears their voice. For visual attribution on the cassette, the sender's name appears in the cassette header in the same position as the brand/model text on a real tape. "from" appears in small uppercase text (like TYPE I or NORMAL BIAS on the original reference), and the sender's name appears in the larger model-number font size directly beside it. This is decorative, unambiguous, and requires no separate identity system.

---

## The label — a title, not a letter

The cassette label holds a short title: 4 to 5 words maximum. This is not a note or a message — it is a name for the tape. The voice note is the message. Examples: "thinking of you lately", "this one's for you", "summer in my head". The label text is rendered in a handwritten font. There is no separate notes or message field in the create flow.

---

## The note as translucent paper

The label on the cassette is rendered as a strip of translucent paper, similar to masking tape opacity — not fully opaque, but not see-through either. The background is white or very light cream. The text is black. This is deliberately high-contrast and accessible, and the slight translucency adds to the analog, hand-assembled aesthetic without sacrificing legibility. Handwritten fonts are used on the label only. All other UI elements — player controls, tracklist area, navigation — use standard readable typography that meets WCAG AA contrast requirements.

---

## Home screen — one action

The empty Home screen has a single primary action: a large (+) button centered on the screen with one line of supporting text underneath. No Library grid, no identity prompts, no competing calls to action. The Library tab or section only appears after the first tape has been saved. The first time a user opens the app, the only thing they can do is make a tape.

---

## No Seal, no Seal onboarding

Seal is gone. There is no onboarding flow asking the user to configure an identity before making anything. The first thing a new user does is create a tape. Their name is collected naturally as part of the create flow — one field asking who this tape is from.

---

## Library — sent and received

The Library shows both tapes the user has sent and tapes they have received, in a single unified collection. This makes the Library a keepsake shelf — a place where meaningful moments from close friends sit alongside things you made for others. It is not a drafts folder or a history log. It is the emotional core of the app over time.

Receiving a tape into the Library requires the recipient to have the app and an account. This is intentional — opening a shared tape link shows the full web player experience with no friction, but saving it to a personal library is the prompt to download the app. This is a natural growth mechanic.

---

## Account and sync

Magic link email login. No password. Optional, not required. Triggered after the user has created 2 to 3 tapes — at the point where they have something worth preserving. If dismissed, the library remains stored locally on the device and a persistent low-key banner in the Library reads "Sign in to sync your library across devices." The tapes themselves — anything shared — are always stored server-side and the link always works regardless of device or app state. Only the library index is local until the user logs in.

---

## Cassette literacy

The cassette uses retro aesthetics with universal affordances. Every control uses a standard icon (▶ for play, ↩ for rewind) paired with a short text label underneath. NR ON/OFF, TYPE I, Hi-Fi Stereo, and similar cassette-spec text are purely decorative — non-interactive, never explained, there for texture and authenticity. The flip interaction is discoverable, not required: a subtle pulsing glow on the cassette edge on first load suggests it can be interacted with. Tapping the cassette body triggers the flip. The player controls are always the primary path.

---

## Recipient experience

The shared tape link always opens a web experience. No app store gate, no download wall. The recipient sees the full tape player in their mobile browser — cassette, controls, side indicator, the sender's name — and can play Side A and flip to Side B immediately. A Smart App Banner may appear at the top of the page (the standard iOS/Android dismissible prompt) but it never blocks the player. The recipient web player is treated as the most important screen in the product because it is what the majority of people who ever encounter this app will see first.

---

## Tape length bar

The tape length bar visible on the cassette is decorative. It reflects the duration of the voice note as a visual fill — longer message, more tape used — but it is not tied to any functional limit or warning system. The real limit is the 90-second voice note cap. The bar reinforces the analog cassette aesthetic without creating a confusing mechanic.

---

## What is removed from earlier specs

- Seal (creator identity stamp) — removed entirely
- Tracklist / multiple songs — removed, one song per tape
- Notes / long-form message field — replaced by 4-5 word title only
- Sticker placement — to be revisited, not confirmed in or out
- Side B as second playlist side — replaced by Side B = one song
- MVP phasing — this is designed as a complete product from the start

---

*Product decisions document · Cassette · June 2026*
