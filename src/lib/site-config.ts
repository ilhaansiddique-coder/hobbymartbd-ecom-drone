// Client-safe site config: types + constants with NO server imports (no Prisma),
// so client components can import these without pulling server code into the bundle.

export type SiteSettings = {
  id: string;
  companyName: string;
  logoUrl: string | null;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  whatsappText: string;
  primaryColor: string;
  fontFamily: string;
  footerTagline: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
};

// Map a font-family choice to a real CSS font stack (no extra fonts to load).
export const FONT_STACKS: Record<string, string> = {
  sans: "var(--font-sans), system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
  system: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

export const FONT_OPTIONS = [
  { value: "sans", label: "Sans (Inter — default)" },
  { value: "serif", label: "Serif (Georgia)" },
  { value: "system", label: "System UI" },
  { value: "mono", label: "Monospace" },
];

// Darken a hex color by a factor (for button hover states).
export function darken(hex: string, factor = 0.85): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const [r, g, b] = [m[1], m[2], m[3]].map((c) => Math.round(parseInt(c, 16) * factor));
  return `#${[r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("")}`;
}
