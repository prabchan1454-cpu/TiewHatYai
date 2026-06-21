import { useId } from "react";

// ── Signature element: ผ้าทอเกาะยอ (Koh Yo handwoven cotton stripe) ──
// A warp-stripe band drawn from เกาะยอ's famous handwoven fabric. Used as a
// section divider and across the Home hero — a real, hyper-local Songkhla craft
// that anchors the app's identity. Decorative only (aria-hidden).
//
// Stripe sequence over a 64-unit tile: gulf-green base with warm gold/boat
// pinstripes + a sage block, mirroring the multi-colour warp of real Ko Yo cloth.
const STRIPES = [
  { x: 22, w: 2, c: "#F4F0E9" }, // plaster gap
  { x: 24, w: 4, c: "#C9962F" }, // gold
  { x: 28, w: 2, c: "#D14B3D" }, // boat red
  { x: 30, w: 4, c: "#C9962F" }, // gold
  { x: 34, w: 2, c: "#F4F0E9" }, // plaster gap
  { x: 36, w: 18, c: "#6F8F7A" }, // sage block
  { x: 54, w: 2, c: "#1B332E" }, // ink
  { x: 56, w: 4, c: "#D14B3D" }, // boat red
  { x: 60, w: 2, c: "#C9962F" }, // gold
  { x: 62, w: 2, c: "#1B332E" }, // ink
];

export default function WovenBand({ className = "h-2", rounded = false }) {
  const id = useId().replace(/:/g, ""); // unique, id-safe pattern name per instance
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`w-full overflow-hidden ${rounded ? "rounded-full" : ""} ${className}`}
    >
      <svg width="100%" height="100%" viewBox="0 0 64 16" preserveAspectRatio="none">
        <defs>
          <pattern id={`koyo-${id}`} width="64" height="16" patternUnits="userSpaceOnUse">
            <rect width="64" height="16" fill="#2C7A74" />
            {STRIPES.map((s, i) => (
              <rect key={i} x={s.x} y="0" width={s.w} height="16" fill={s.c} />
            ))}
            {/* faint horizontal weft lines for a woven texture */}
            <rect x="0" y="4.5" width="64" height="0.75" fill="#F4F0E9" opacity="0.10" />
            <rect x="0" y="10.5" width="64" height="0.75" fill="#1B332E" opacity="0.10" />
          </pattern>
        </defs>
        <rect width="64" height="16" fill={`url(#koyo-${id})`} />
      </svg>
    </div>
  );
}
