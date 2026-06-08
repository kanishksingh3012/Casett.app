import type { Metadata } from "next";
import {
  Space_Grotesk,
  DM_Sans,
  JetBrains_Mono,
  Reenie_Beanie,
  Shadows_Into_Light,
  Caveat,
  Gloria_Hallelujah,
  Patrick_Hand,
} from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-reenie-beanie",
  display: "swap",
});

const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-shadows-into-light",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const gloriaHallelujah = Gloria_Hallelujah({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gloria-hallelujah",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-patrick-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casett",
  description: "Record your voice. Add one song. Send it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [
    spaceGrotesk.variable,
    dmSans.variable,
    jetbrainsMono.variable,
    reenieBeanie.variable,
    shadowsIntoLight.variable,
    caveat.variable,
    gloriaHallelujah.variable,
    patrickHand.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <body>
        {/* SVG filter for sticker paper texture — referenced by filter:url(#paper) */}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute" }}
          aria-hidden="true"
        >
          <defs>
            <filter id="paper" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.62"
                numOctaves={3}
                seed={7}
                stitchTiles="stitch"
                result="n"
              />
              <feColorMatrix
                in="n"
                type="matrix"
                values="0 0 0 0 0.20  0 0 0 0 0.15  0 0 0 0 0.08  0 0 0 0.13 0"
                result="grain"
              />
              <feComposite in="grain" in2="SourceAlpha" operator="in" result="g2" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="g2" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
