import { cache } from "react";
import { prisma } from "./prisma";
import {
  coerceFooterColumns,
  coerceNavLinks,
  DEFAULT_FOOTER_COLUMNS,
  DEFAULT_NAV_LINKS,
  type SiteSettings,
} from "./site-config";

export type { SiteSettings } from "./site-config";

const DEFAULTS: SiteSettings = {
  id: "singleton",
  companyName: "HobbyMart",
  logoUrl: null,
  email: "",
  phone: "",
  address: "",
  whatsappNumber: "",
  whatsappText: "Hello! I have a question about your products.",
  primaryColor: "#2563eb",
  fontFamily: "sans",
  footerTagline: "",
  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  topbarEnabled: true,
  topbarText: "",
  topbarShowContact: true,
  topbarShowTrackOrder: true,
  navLinks: DEFAULT_NAV_LINKS,
  footerColumns: DEFAULT_FOOTER_COLUMNS,
  copyrightText: "",
};

// Normalize a raw Prisma row into the client-safe SiteSettings shape, coercing
// the JSON columns into typed arrays and falling back to sensible defaults.
function normalize(row: Record<string, unknown>): SiteSettings {
  return {
    ...DEFAULTS,
    ...row,
    navLinks: coerceNavLinks(row.navLinks, DEFAULT_NAV_LINKS),
    footerColumns: coerceFooterColumns(row.footerColumns, DEFAULT_FOOTER_COLUMNS),
  } as SiteSettings;
}

// Loads the single site-settings row (read fresh so admin changes show up right
// away). `cache` dedupes the query within a request. Falls back to defaults if
// the DB is unreachable so it never breaks a render. (The row is created by the
// seed / the admin settings API.)
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    return settings ? normalize(settings as Record<string, unknown>) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
});
