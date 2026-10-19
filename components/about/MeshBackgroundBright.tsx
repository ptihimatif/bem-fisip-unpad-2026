// Brighter, more dimensional mesh variant for the penjelasan (detail) pages.
//
// Richer than MeshBackground: more blobs at varied positions/sizes, a diagonal
// base gradient instead of a flat colour, and a subtle noise texture so the
// backdrop has depth instead of reading as a single flat gradient.

const BLUE = "0, 48, 137"; // #003089
const YELLOW = "255, 186, 58"; // #FFBA3A
const ORANGE = "255, 122, 61"; // warm orange accent
const LIGHT = "30, 64, 130"; // lighter blue for depth

const BLOBS = [
  { at: "8% 4%", size: "60% 50%", rgb: BLUE, alpha: 1 },
  { at: "95% 12%", size: "55% 45%", rgb: BLUE, alpha: 0.95 },
  { at: "3% 40%", size: "50% 60%", rgb: LIGHT, alpha: 0.9 },
  { at: "98% 55%", size: "50% 50%", rgb: BLUE, alpha: 1 },
  { at: "15% 85%", size: "60% 50%", rgb: LIGHT, alpha: 0.85 },
  { at: "85% 90%", size: "55% 45%", rgb: BLUE, alpha: 0.9 },
  { at: "50% 50%", size: "75% 65%", rgb: BLUE, alpha: 0.6 },
  { at: "70% 8%", size: "42% 36%", rgb: YELLOW, alpha: 0.4 },
  { at: "25% 95%", size: "44% 38%", rgb: YELLOW, alpha: 0.35 },
  { at: "88% 40%", size: "38% 34%", rgb: ORANGE, alpha: 0.32 },
  { at: "12% 60%", size: "34% 30%", rgb: ORANGE, alpha: 0.28 },
  { at: "45% 20%", size: "30% 26%", rgb: YELLOW, alpha: 0.3 },
  { at: "60% 78%", size: "32% 28%", rgb: ORANGE, alpha: 0.26 },
];

const MESH = [
  ...BLOBS.map(
    ({ at, size, rgb, alpha }) =>
      `radial-gradient(${size} at ${at}, rgba(${rgb}, ${alpha}) 0%, rgba(${rgb}, 0) 100%)`,
  ),
  "linear-gradient(135deg, #0f2554 0%, #0a1628 45%, #040a18 100%)",
].join(", ");

export default function MeshBackgroundBright() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-10 h-[100lvh] w-full"
        style={{ background: MESH }}
      />
      {/* subtle noise texture for depth */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-10 h-[100lvh] w-full opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}