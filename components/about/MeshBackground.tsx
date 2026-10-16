// One mesh gradient for the whole About page.
//
// It is fixed to the viewport, so LogoSection, VisiSection, the content and the
// footer all sit on the same backdrop and there is no seam between sections.
// Sections must therefore stay transparent (no background of their own).
//
// Colours come from DESIGN.md: brand blue #003089 and brand yellow #FFBA3A over
// the dark navy the page already used. No other hues. Yellow stays faint so white
// text keeps well above WCAG AA contrast everywhere on the mesh.

const NAVY = "#000c23";
const BLUE = "0, 48, 137"; // #003089
const YELLOW = "255, 186, 58"; // #FFBA3A

// Each entry is one soft "blob" of the mesh. Tune `at` (centre), `size`
// (ellipse width / height) and `alpha` (strength) to reshape the whole page.
const BLOBS = [
  { at: "10% 6%", size: "70% 55%", rgb: BLUE, alpha: 1 },
  { at: "92% 26%", size: "60% 50%", rgb: BLUE, alpha: 0.8 },
  { at: "6% 72%", size: "65% 55%", rgb: BLUE, alpha: 0.9 },
  { at: "88% 96%", size: "60% 50%", rgb: BLUE, alpha: 0.7 },
  { at: "78% 4%", size: "38% 32%", rgb: YELLOW, alpha: 0.16 },
  { at: "32% 100%", size: "40% 34%", rgb: YELLOW, alpha: 0.12 },
];

// Every blob fades to the same colour at alpha 0 (not to "transparent"), so the
// edges blend cleanly instead of going grey.
const MESH = [
  ...BLOBS.map(
    ({ at, size, rgb, alpha }) =>
      `radial-gradient(${size} at ${at}, rgba(${rgb}, ${alpha}) 0%, rgba(${rgb}, 0) 100%)`,
  ),
  NAVY,
].join(", ");

export default function MeshBackground() {
  return (
    <div
      aria-hidden
      // lvh = the tallest the viewport gets on mobile (address bar hidden), so
      // the gradient is not re-laid-out every time the browser bars slide away.
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[100lvh] w-full"
      style={{ background: MESH }}
    />
  );
}