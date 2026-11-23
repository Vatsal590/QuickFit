import { MASCOT } from "@/config/mascot";

/** Simple SVG character. Colors come from src/config/mascot.ts. */
export default function MascotAvatar({ size = 40, happy = true }: { size?: number; happy?: boolean }) {
  const c = MASCOT.colors;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="24" ry="22" fill={c.body} />
      <ellipse cx="32" cy="42" rx="14" ry="11" fill={c.belly} />
      <circle cx="12" cy="18" r="6" fill={c.body} />
      <circle cx="52" cy="18" r="6" fill={c.body} />
      <rect x="18" y="12" width="28" height="5" rx="2.5" fill={c.accent} />
      <circle cx="24" cy="30" r="4" fill={c.belly} />
      <circle cx="40" cy="30" r="4" fill={c.belly} />
      <circle cx="25" cy="31" r="2.2" fill={c.eye} />
      <circle cx="41" cy="31" r="2.2" fill={c.eye} />
      <path d={happy ? "M26 40 Q32 46 38 40" : "M26 43 L38 43"} stroke={c.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
