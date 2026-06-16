// Client-safe site config: types + constants with NO server imports (no Prisma),
// so client components can import these without pulling server code into the bundle.

export type NavLink = { label: string; href: string };
export type FooterColumn = { title: string; links: NavLink[] };

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
  // Top header bar
  topbarEnabled: boolean;
  topbarText: string;
  topbarShowContact: boolean;
  topbarShowTrackOrder: boolean;
  // Header nav menu
  navLinks: NavLink[];
  // Footer
  footerColumns: FooterColumn[];
  copyrightText: string;
};

// Defaults used when the admin hasn't customised the menu/footer yet. They
// mirror the original hardcoded markup so the site looks identical out of the
// box. The Categories dropdown is rendered separately (DB-driven) right after
// the link whose href is "/products".
export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Useful Links",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Return & Refund Policy", href: "/refund" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "Dashboard", href: "/login" },
      { label: "Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
    ],
  },
];

// Coerce an unknown JSON value into a clean NavLink[] (drops malformed entries).
// Returns `fallback` when the value is missing/invalid/empty.
export function coerceNavLinks(value: unknown, fallback: NavLink[]): NavLink[] {
  if (!Array.isArray(value)) return fallback;
  const links = value
    .filter((l): l is Record<string, unknown> => !!l && typeof l === "object")
    .map((l) => ({ label: String(l.label ?? "").trim(), href: String(l.href ?? "").trim() }))
    .filter((l) => l.label && l.href);
  return links.length ? links : fallback;
}

// Coerce an unknown JSON value into a clean FooterColumn[].
export function coerceFooterColumns(value: unknown, fallback: FooterColumn[]): FooterColumn[] {
  if (!Array.isArray(value)) return fallback;
  const cols = value
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .map((c) => ({
      title: String(c.title ?? "").trim(),
      links: coerceNavLinks(c.links, []),
    }))
    .filter((c) => c.title);
  return cols.length ? cols : fallback;
}

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
