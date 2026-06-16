import { cache } from "react";
import { prisma } from "./prisma";
import type { SiteSettings } from "./site-config";

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
};

// Loads the single site-settings row (read fresh so admin changes show up right
// away). `cache` dedupes the query within a request. Falls back to defaults if
// the DB is unreachable so it never breaks a render. (The row is created by the
// seed / the admin settings API.)
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    return settings ?? DEFAULTS;
  } catch {
    return DEFAULTS;
  }
});
